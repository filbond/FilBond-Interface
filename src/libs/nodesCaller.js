import BigNumber from "bignumber.js";
import { globalUtils } from "./globalUtils";
import { appConfig } from "../configs/appConfig";

export const nodesCaller = {
	makeCalls: async function (nodes, chainId) {
		const calls = [];

		for (let index = 0; index < nodes.length; index++) {
			const call = await this.makeCallsForSingleNode(nodes[index], chainId);
			call.context = { index }
			calls.push(call);
		}

		return calls;
	},
	parseResults: function (multicallResults, nodes) {
		Object.values(multicallResults?.results).forEach(result => {
			const node = nodes[result.originalContractCallContext.context.index];
			const objectsReturned = result.callsReturnContext;
			objectsReturned.forEach(item => {
				let tempResult = null;

				switch (item.reference) {
					case "lendingPool":
						node.lendingPool = item.returnValues[0];
						break;

					case "availableBalance":
						tempResult = item.returnValues;
						node.availableBalance = BigNumber((tempResult[1] ? "-" : "") + BigNumber(tempResult[0]).toFixed());
						break;

					case "vestingFunds":
						tempResult = objectsReturned.find(item => item.reference === "vestingFunds").returnValues[0];
						node.vestingFunds = tempResult;
						node.vestingFundSum = globalUtils.constants.BIGNUMBER_ZERO;
						for (let i = 0; i < tempResult.length; i++) {
							const minerBigInt = tempResult[i][1];
							const tmpValue = BigNumber((minerBigInt[1] ? "-" : "") + BigNumber(minerBigInt[0]).toFixed());
							node.vestingFundSum = node.vestingFundSum.plus(tmpValue);
						}
						break;

					default:
						node[item.reference] = globalUtils.formatMulticallResult(item.returnValues[0]);
						break;
				}
			});
		});
		console.debug("nodes =", nodes);
	},
	makeCallsForSingleNode: async function (node, chainId) {
		const abi = await globalUtils.loadJson(appConfig.markets.networks[chainId].minerSmartOwner.abi);
		const call = {
			reference: 'node_' + node.id,
			contractAddress: node.owner.hexAddress,
			abi: abi,
			calls: [
				{
					reference: 'vestingFunds',
					methodName: 'getVestingFunds'
				},
				{
					reference: 'availableBalance',
					methodName: 'getAvailableBalance'
				},
				{
					reference: 'borrowBalance',
					methodName: 'borrowBalance'
				},
				{
					reference: 'lendingPool',
					methodName: 'lendingPool'
				}
			]
		};

		return call;
	}
};