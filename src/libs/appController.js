import { createRoot } from 'react-dom/client';
import { appConfig } from "../configs/appConfig";
import { globalUtils } from "./globalUtils";
import { web3Controller } from './web3Controller';
import { newDelegatedEthAddress, encode } from "@glif/filecoin-address"
import { nodesCaller } from './nodesCaller';
import { lendingPoolCaller } from "./lendingPoolCaller";
import { taskManager } from "./taskManager";
import { fileSaver } from './fileSaver';

export const appController = {
	_data: null,
	_accountData: null,
	_nodesData: null,
	_lendingPoolData: null,
	_updateTime: 0,
	_modalContainer: null,
	_markets: null,
	_networkConfig: null,
	_updateNodesCallback: null,

	_cids: null,
	get cids() {
		return this._cids;
	},

	_chainId: 0,
	get chainId() {
		return this._chainId;
	},

	_account: "",
	get account() {
		return this._account;
	},

	init: async function (updateWeb3Func) {
		if (!this._modalContainer) {
			this._modalContainer = createRoot(document.getElementById("modalContainer"));
		}

		this._markets = {};
		this._networkConfig = {};
		this._nodesData = [];
		this._lendingPoolData = {};

		let success = false;
		if (updateWeb3Func) {
			window.localStorage.setItem(globalUtils.constants.AUTOCONNECT, 1);

			success = await web3Controller.connect(eventObject => {
				this._getWeb3Context();
				updateWeb3Func(eventObject);
			});
		} else {
			success = web3Controller.connectDefaultNetwork();
		}

		if (success) {
			return this._getWeb3Context();
		}
	},

	connectWallet: async function () {
		const bingo = await web3Controller.connect();
		if (bingo) {
			return this._getWeb3Context();
		} else {
			return false;
		}
	},

	getData: async function () {
		await this.getLatestBlock();
		await this.getLendingPool();
		return {
			lendingPool: {
				...this._getMarketConfig(this._chainId).lendingPool,
				...this._lendingPoolData
			}
		};
	},

	getDataWithAccount: async function (account, callback) {
		if (!this._accountData || (new Date()) - this._updateTime > appConfig.updateInterval) {
			await this._loadMockAccountData();
			this._updateTime = new Date();
		}

		return callback(this._accountData);
	},

	getMulticaller: function () {
		// web3Controller
	},

	getLendingPool: async function (callback) {
		const calls = await lendingPoolCaller.makeLendingPoolCalls(this._chainId, this._account);
		const res = await web3Controller.multicall(calls);
		lendingPoolCaller.parseLendingPoolResults(res, this._lendingPoolData);
		if (callback) callback(this._lendingPoolData);
	},

	getNodesData: async function (callback) {
		if (callback) this._updateNodesCallback = callback;

		this._nodesData = this._loadNodesFromLocalStorage(true);
		await this._getNodesDataFromContracts(this._nodesData);
		return callback(this._nodesData);
	},

	getNodesHealth: async function (allNodes) {
		for (let i = 0; i < allNodes.length; i++) {
			const theNode = allNodes[i];
			if (!theNode.health || theNode.health === 0) {
				const res = await this.getNodeHealth(theNode.id);
				theNode.health = res?.health;
				theNode.qualityAdjPower = res?.qualityAdjPower;
				theNode.successRate = res?.successRate;
			}
		}
	},

	getNodeHealth: async function (nodeId) {
		const res = await globalUtils.postRequest(
			this._getCurrentNetworkConfig(this._chainId).rpcUrls[0],
			"Filecoin.StateMinerPower",
			[nodeId, [this._cids[0]]]
		);

		if (res?.error) {
			return 0;
		} else {
			const rawBytePower = Number(res?.result?.MinerPower?.RawBytePower);
			const qualityAdjPower = Number(res?.result?.MinerPower?.QualityAdjPower);
			// const rawByteTotalPower = Number(res?.result?.TotalPower?.RawBytePower);
			const qualityTotalAdjPower = Number(res?.result?.TotalPower?.QualityAdjPower);

			let health = 0;
			if (!isNaN(rawBytePower) && !isNaN(qualityAdjPower)) {
				health = rawBytePower / qualityAdjPower;
			}

			let successRate = 0
			if (!isNaN(qualityAdjPower) && !isNaN(qualityTotalAdjPower)) {
				successRate = qualityAdjPower / qualityTotalAdjPower;
			}

			try {
				return { health, qualityAdjPower, successRate };
			} catch (error) {
				console.error(error);
				return null;
			}
		}
	},

	getRatingLabelWithValue: function (ratingValue) {
		return appConfig.rating.find(item => item.value === ratingValue).name || "";
	},

	showModal: function (childrenDom) {
		this._modalContainer?.render(childrenDom)
	},

	clearModal: function () {
		this._modalContainer?.render(null);
	},

	switchNetwork: async function (chainName) {
		return await web3Controller.switchNetwork(chainName);
	},

	registerNode: async function (account, hashCallback, doneCallback, cancelCallback) {
		const theContract = this._getMarketConfig(this._chainId).filSmartOwnerFactory;
		const abi = await globalUtils.loadJson(theContract.abi);
		web3Controller.sendContract(
			theContract.address,
			abi,
			"createSmartOwner",
			hashCallback,
			doneCallback,
			cancelCallback,
			null,
			account
		);
	},

	transferMinerOwnership: async function (ownerAddress, hashCallback, doneCallback, cancelCallback, newOwnerFilAddress) {
		const abi = await this._getMinerOwnerABI();
		web3Controller.sendContract(
			ownerAddress,
			abi,
			"transferMinerOwnership",
			hashCallback,
			doneCallback,
			cancelCallback,
			null,
			newOwnerFilAddress
		);
	},

	acceptMinerOwnership: async function (ownerAddress, hashCallback, doneCallback, cancelCallback, nodeId) {
		const abi = await this._getMinerOwnerABI();
		web3Controller.sendContract(
			ownerAddress,
			abi,
			"acceptMinerOwnership",
			hashCallback,
			doneCallback,
			cancelCallback,
			null,
			nodeId
		);
	},

	nodeBorrow: async function (ownerAddress, hashCallback, doneCallback, cancelCallback, amount) {
		const abi = await this._getMinerOwnerABI();
		web3Controller.sendContract(
			ownerAddress,
			abi,
			"borrow",
			hashCallback,
			doneCallback,
			cancelCallback,
			null,
			amount
		);
	},

	hexAddress2Fil: function (hexAddress) {
		if (web3Controller.isEthAddress(hexAddress)) {
			return encode(appConfig.networkPrefix[this._chainId], newDelegatedEthAddress(hexAddress));
		} else {
			return hexAddress;
		}
	},

	getLatestBlock: async function () {
		const res = await globalUtils.postRequest(
			this._getCurrentNetworkConfig(this._chainId).rpcUrls[0],
			"Filecoin.ChainHead",
			[]
		);
		this._cids = res.result.Cids;
	},

	getIDWithAddress: async function (filAddress) {
		const res = await globalUtils.postRequest(
			this._getCurrentNetworkConfig(this._chainId).rpcUrls[0],
			"Filecoin.StateLookupID",
			[filAddress, []]
		);
		return res?.result;
	},

	getMinerOwnerWithId: async function (idAddress, returnsAll = false) {
		let res = null;
		try {
			res = await globalUtils.postRequest(
				this._getCurrentNetworkConfig(this._chainId).rpcUrls[0],
				"Filecoin.StateMinerInfo",
				[idAddress, [this._cids[0]]]
			);
		} catch (error) {
			console.error(error);
		}

		// console.debug("取得MinerInfo", res?.result);

		if (res?.result?.Owner) {
			if (returnsAll) {
				return {
					worker: res.result.Worker,
					beneficiary: res.result.Beneficiary,
					sectorSize: res.result.SectorSize
				};
			} else {
				return this.getFilAddressWithId(res.result.Owner);
			}
		} else {
			console.error(res);
		}
	},

	getFilAddressWithId: async function (idAddress) {
		const res = await globalUtils.postRequest(
			this._getCurrentNetworkConfig(this._chainId).rpcUrls[0],
			"Filecoin.StateAccountKey",
			[idAddress, [this._cids[0]]]
		);

		return res?.result;
	},

	getBalanceWithId: async function (idAddress) {
		const res = await globalUtils.postRequest(
			this._getCurrentNetworkConfig(this._chainId).rpcUrls[0],
			"Filecoin.WalletBalance",
			[idAddress]
		);

		return res?.result;
	},

	getBorrowBalance: async function (ownerAddress) {
		const abi = await globalUtils.loadJson(this._getMarketConfig(this._chainId).minerSmartOwner.abi);
		return await web3Controller.callContract(ownerAddress, abi, "borrowBalance");
	},

	computeTxGas: async function (lendingPoolAddress, abiUrl, methonName, amount, ...args) {
		const abi = await globalUtils.loadJson(abiUrl);
		return (await web3Controller.estimateGas(lendingPoolAddress, abi, methonName, null, amount, ...args)).gas;
	},

	deposit: async function (targetAddress, hashCallback, doneCallback, cancelCallback, amount) {
		const abi = await this._getLendingPoolABI();
		web3Controller.sendContract(
			targetAddress,
			abi,
			"mint",
			hashCallback,
			doneCallback,
			cancelCallback,
			amount
		);
	},

	nodeDeposit: async function (ownerAddress, amount, hashCallback, doneCallback, cancelCallback) {
		return web3Controller.transfer(ownerAddress, amount, hashCallback, doneCallback, cancelCallback);
	},

	withdraw: async function (contractAddress, hashCallback, doneCallback, cancelCallback, amount) {
		const abi = await this._getLendingPoolABI();
		web3Controller.sendContract(
			contractAddress,
			abi,
			"redeemUnderlying",
			hashCallback,
			doneCallback,
			cancelCallback,
			null,
			amount
		);
	},

	nodeWithdraw: async function (ownerAddress, hashCallback, doneCallback, cancelCallback, amount) {
		const abi = await this._getMinerOwnerABI();
		web3Controller.sendContract(
			ownerAddress,
			abi,
			"withdraw",
			hashCallback,
			doneCallback,
			cancelCallback,
			null,
			amount,
			this._account
		);
	},

	repay: async function (targetAddress, hashCallback, doneCallback, cancelCallback, amount) {
		const abi = await this._getLendingPoolABI();
		web3Controller.sendContract(
			targetAddress,
			abi,
			"repayBorrow",
			hashCallback,
			doneCallback,
			cancelCallback,
			amount
		);
	},

	nodeRepayBorrow: async function (ownerAddress, hashCallback, doneCallback, cancelCallback, amount) {
		const abi = await appController._getMinerOwnerABI();
		web3Controller.sendContract(
			ownerAddress,
			abi,
			"repayBorrow",
			hashCallback,
			doneCallback,
			cancelCallback,
			amount
		);
	},

	nodeRepayWithDeposit: async function (ownerAddress, hashCallback, doneCallback, cancelCallback, amount) {
		const abi = await appController._getMinerOwnerABI();
		web3Controller.sendContract(
			ownerAddress,
			abi,
			"repayWithDeposit",
			hashCallback,
			doneCallback,
			cancelCallback,
			null,
			amount
		);
	},

	getNodeBalance: async function (nodeAddress) {
		const abi = await this._getLendingPoolABI();
		return await web3Controller.callContract(
			this._getMarketConfig(this._chainId).lendingPool.address,
			abi,
			"balanceOfUnderlying",
			nodeAddress
		);
	},

	getNodeCTokenBalance: async function (nodeAddress) {
		const abi = await this._getLendingPoolABI();
		return await web3Controller.callContract(
			this._getMarketConfig(this._chainId).lendingPool.address,
			abi,
			"balanceOf",
			nodeAddress
		);
	},

	getCurrencyBalance: async function (addr) {
		return await web3Controller.getBalance(addr);
	},

	getFeeRate: function () {
		return this._getMarketConfig(this._chainId).feeRate;
	},

	getNetworkConfig: function () {
		return this._getCurrentNetworkConfig(this._chainId);
	},

	checkNodeId: function (nodeId) {
		return this._nodesData?.findIndex(node => globalUtils.strEqualIgnoreCase(node.id, nodeId)) > -1;
	},

	saveNode: function (id, owner, filAddressOfOwner, idAddress, oldOwnerIdAddress) {
		const nodesStored = this._loadNodesFromLocalStorage();
		nodesStored.push({
			id,
			owner: {
				hexAddress: owner,
				filAddress: filAddressOfOwner,
				idAddress,
				oldOwner: oldOwnerIdAddress
			},
		});
		window.localStorage.setItem(globalUtils.constants.NODES, JSON.stringify(nodesStored));
	},

	removeNode: function (id) {
		const stored = this._loadNodesFromLocalStorage();
		if (stored) {
			const idx = stored.findIndex(item => item.id === id);

			this._nodesData?.splice(idx, 1);
			stored.splice(idx, 1);
			window.localStorage.setItem(globalUtils.constants.NODES, JSON.stringify(stored));
		}
	},

	removeIdAddressPrefix: function (idAddress) {
		return idAddress.substring(1);
	},

	getBlock: async function (height) {
		return await web3Controller.getBlockWithHeight(height);
	},

	importNodes: function () {
		fileSaver.load(appConfig.nodesArchiveFile, content => {
			let jsn = null;
			try {
				jsn = JSON.parse(content);

				window.localStorage.setItem(globalUtils.constants.NODES, content);
			} catch (error) {
				console.error(error);
			}

			taskManager.run(() => {
				appController.mergeNodes(jsn);
			});
		});
	},

	mergeNodes: async function (nodesFromFile) {
		if (!nodesFromFile) {
			return;
		}

		let updated = false;
		try {
			nodesFromFile.forEach(newNode => {
				if (newNode.id && !appController.checkNodeId(newNode.id) && newNode.owner?.hexAddress && newNode.owner?.filAddress) {
					this._nodesData.push(newNode);
					updated = true;
				}
			});
		} catch (error) {
			console.error(error);
		}

		if (updated && this._updateNodesCallback) {
			await this._getNodesDataFromContracts(this._nodesData);
			this._updateNodesCallback(this._nodesData);
		}
	},

	hasNodesStored: function () {
		return Boolean(window.localStorage[globalUtils.constants.NODES]);
	},

	exportNodes: function () {
		fileSaver.save(appConfig.nodesArchiveFile, window.localStorage.getItem(globalUtils.constants.NODES));
	},

	getNodeById: async function (id) {
		let theNode = this._nodesData?.find(item => item.id === id);

		if (!theNode) {
			theNode = this._checkNodeIdStored(id);
		}

		if (theNode) {
			const calls = await nodesCaller.makeCallsForSingleNode(theNode, this._chainId);
			calls.context = { index: 0 };
			const res = await web3Controller.multicall(calls);
			const tempNodes = [theNode];
			nodesCaller.parseResults(res, tempNodes);

			taskManager.run(async () => {
				await this.getNodesHealth(tempNodes);
			});
		}

		return theNode;
	},

	getTxsWithNode: async function (node) {
		const abi = await globalUtils.loadJson(this._getMarketConfig(this._chainId).minerSmartOwner.abi);
		const evts = await web3Controller.getTxs(node.owner.hexAddress, abi);
		console.debug("evts =", evts, node.owner.hexAddress);
		return evts;
	},

	_getMinerOwnerABI: async function () {
		const theContract = this._getMarketConfig(this._chainId).minerSmartOwner;
		return await globalUtils.loadJson(theContract.abi);
	},

	_getLendingPoolABI: async function () {
		return await globalUtils.loadJson(this._getMarketConfig(this._chainId).lendingPool.abi);
	},

	_checkNodeIdStored: function (id) {
		const stored = this._loadNodesFromLocalStorage();
		return stored.find(item => item.id === id);
	},

	_getCurrentNetworkConfig: function (cid) {
		if (!this._networkConfig[cid]) {
			this._networkConfig[cid] = Object.values(appConfig.networks).find(item => item.chainId === cid);
		}

		return this._networkConfig[cid];
	},

	_getMarketConfig: function (cid) {
		if (!this._markets[cid]) {
			this._markets[cid] = appConfig.markets.networks[cid];
		}

		return this._markets[cid];
	},

	_getWeb3Context: function () {
		this._chainId = web3Controller.chainId;

		if (this._checkChainIdSupported(this._chainId)) {
			console.debug("this._checkChainIdSupported(this._chainId)", this.chainId, web3Controller.account);
			this._account = web3Controller.account;
			web3Controller.makeMulticaller(this._getMarketConfig(this._chainId).multicall.address);

			return true;
		} else {
			return false;
		}
	},

	_checkChainIdSupported: function (cid) {
		return Object.values(appConfig.networks).find(network => {
			return network.chainId === cid;
		});
	},

	_loadMockData: async function () {
		this._data = await globalUtils.loadJson("/mock/bonds.json");
		return this._data;
	},

	_loadMockAccountData: async function () {
		this._accountData = await globalUtils.loadJson("/mock/me.json");
		return this._accountData;
	},

	_loadNodesFromLocalStorage: function () {
		let res = [];
		try {
			const read = window.localStorage.getItem(globalUtils.constants.NODES);
			if (read) {
				res = JSON.parse(read);
			}
		} catch (error) {
			console.error(error);
		}

		return res;
	},

	_getNodesDataFromContracts: async function (nodes) {
		if (!nodes || nodes?.length === 0) {
			return;
		}

		const calls = await nodesCaller.makeCalls(nodes, this._chainId);
		const res = await web3Controller.multicall(calls);
		nodesCaller.parseResults(res, nodes);

		taskManager.run(async () => {
			await this.getNodesHealth(nodes);
		});
	}
};