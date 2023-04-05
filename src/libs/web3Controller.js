import Web3 from "web3";
import { appConfig } from "../configs/appConfig";
import { globalUtils } from "../libs/globalUtils";
import { Multicall } from "ethereum-multicall";
import BigNumber from "bignumber.js";

export const web3Controller = {
	_web3: null,
	_contracts: {},
	_updateWeb3Func: () => { },
	_multicaller: null,

	account: "",
	chainId: 0,

	connectDefaultNetwork: function () {
		const theDefaultNetwork = appConfig.networks[appConfig.defaultNetwork];
		this._web3 = new Web3(theDefaultNetwork.rpcUrls[0]);
		this.chainId = theDefaultNetwork.chainId;
		console.debug("connectDefaultNetwork() window.ethereum =", window.ethereum, this.chainId, this._web3);
		return true;
	},

	connect: async function (updateWeb3Func) {
		console.debug("connect() window.ethereum =", window.ethereum);

		this._updateWeb3Func = updateWeb3Func;

		if (window.ethereum) {
			window.ethereum.on("chainChanged", this._onChainChanged);
			window.ethereum.on("accountsChanged", this._onAccountsChanges);

			this._web3 = new Web3(window.ethereum);

			const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
			console.debug("accounts =", accounts);
			this.account = accounts[0];

			this.chainId = parseInt(this._web3.currentProvider.chainId, 16);

			return true;
		} else {
			return false;
		}
	},

	switchNetwork: async function (chainName) {
		const theChainConfig = appConfig.networks[chainName];
		const cid = "0x" + theChainConfig.chainId.toString(16);

		try {
			await this._web3.currentProvider.request({
				method: globalUtils.constants.WALLET_SWITCH_ETHEREUM_CHAIN,
				params: [{ chainId: cid }],
			});
		} catch (switchError) {
			console.debug("切换错误", switchError.code);

			if (switchError.code === 4902) {
				try {
					await this._web3.currentProvider.request({
						method: globalUtils.constants.WALLET_ADD_ETHEREUM_CHAIN,
						params: [{
							chainName: theChainConfig.chainName,
							rpcUrls: theChainConfig.rpcUrls,
							nativeCurrency: theChainConfig.nativeCurrency,
							blockExplorerUrls: theChainConfig.blockExplorerUrls,
							iconUrls: theChainConfig.iconUrls,
							chainId: cid
						},
						],
					});
				} catch (addError) {
					console.error(addError);
				}
			} else {
				console.error(switchError);
			}
		}
	},

	getBalance: async function (addr) {
		try {
			const res = await this._web3.eth.getBalance(addr || this.account);
			return res
		} catch (error) {
			console.error(error);
			return "0";
		}
	},

	callContract: async function (address, abi, method, ...args) {
		return await this._makeContract(address, abi).methods[method](...args).call();
	},

	estimateGas: async function (address, abi, method, cancelCallback, amount, ...args) {
		const func = this._makeContract(address, abi).methods[method](...args);
		const params = { from: this.account };
		let gas = 0;

		if (amount) {
			params.value = new BigNumber(amount).toString();
		}

		try {
			gas = await func.estimateGas(params);
		} catch (error) {
			console.error(error);

			try {
				const block = await this.getBlockWithHeight();
				gas = block.gasLimit;
			} catch (blockError) {
				console.error(blockError);

				if (cancelCallback) {
					return cancelCallback({ message: "gas required exceeds allowance" });
				}
			}
		}

		return { gas, params, func }
	},

	getBlockWithHeight: async function (height) {
		return await this._web3.eth.getBlock(height || "latest");
	},

	getTxs: async function (address, abi) {
		const ctr = new this._web3.eth.Contract(abi, address);
		const evts = await ctr.getPastEvents("allEvents", { toBlock: 'latest' });
		return evts;
	},

	sendContract: async function (address, abi, method, hashCallback, doneCallback, cancelCallback, amount = null, ...args) {
		const { gas, params, func } = await this.estimateGas(address, abi, method, cancelCallback, amount, ...args);

		params.gas = gas;

		let txHash = "";
		let countOfConfirmation = 0;
		func.send(params).on('transactionHash', function (hash) {
			txHash = hash;
			if (hashCallback) hashCallback(hash);
		}).on('confirmation', function (confirmationNumber, receipt) {
			countOfConfirmation = confirmationNumber;
			// console.debug("确认", confirmationNumber, receipt);
		}).on('receipt', function (receipt) {
			// console.debug("完成全部确认", receipt, doneCallback);
			if (doneCallback) {
				return doneCallback(receipt?.events["0"]?.raw?.data);
			}
		}).on('error', function (error, receipt) {
			// if (txHash && countOfConfirmation > 0 && doneCallback) {
			// 	return doneCallback(receipt?.events["0"]?.raw?.data);
			// }
			if (cancelCallback) {
				return cancelCallback(error);
			};
		});
	},

	isEthAddress: function (str) {
		return this._web3.utils.isAddress(str);
	},

	makeMulticaller: function (multicallAddress) {
		this._multicaller = new Multicall({
			multicallCustomContractAddress: multicallAddress,
			web3Instance: this._web3
		});
	},

	multicall: async function (calls) {
		try {
			return await this._multicaller?.call(calls);
		} catch (error) {
			console.error(error);
			return null;
		}
	},

	transfer: async function (target, amount, hashCallback, doneCallback, cancelCallback) {
		this._web3.eth.sendTransaction({
			from: this.account,
			to: target,
			value: amount
		}).on('transactionHash', function (hash) {
			if (hashCallback) hashCallback(hash);
		}).on('receipt', function (receipt) {
			if (doneCallback) doneCallback(receipt);
		}).on('confirmation', function (confirmationNumber, receipt) {
			// 
		}).on('error', err => {
			console.error(err);

			if (cancelCallback) cancelCallback(err);
		});
	},

	_makeContract: function (address, abi = null) {
		if (!this._contracts[address]) {
			this._contracts[address] = new this._web3.eth.Contract(abi, address);
		}

		return this._contracts[address];
	},

	_onChainChanged: function (chainIdArg) {
		web3Controller.chainId = parseInt(chainIdArg, 16);
		return web3Controller._updateWeb3Func && web3Controller._updateWeb3Func({ chainId: web3Controller.chainId });
	},

	_onAccountsChanges: function (accounts) {
		web3Controller.account = accounts[0];
		return web3Controller._updateWeb3Func && web3Controller._updateWeb3Func({ accounts });
	}
};