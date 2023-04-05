import { appConfig } from "../configs/appConfig";
import { appController } from "./appController";
import { globalUtils } from "./globalUtils";

export const lendingPoolCaller = {
	makeLendingPoolCalls: async function (chainId, account) {
		const calls = [];
		const cfg = appConfig.markets.networks[chainId].lendingPool;
		const abi = await globalUtils.loadJson(cfg.abi);

		calls.push({
			reference: 'lendingPool',
			contractAddress: cfg.address,
			abi: abi,
			calls: [
				{
					reference: 'balanceOfUnderlying',
					methodName: 'balanceOfUnderlying',
					methodParameters: [account]
				},
				{
					reference: 'balanceOf',
					methodName: 'balanceOf',
					methodParameters: [account]
				},
				{
					reference: 'exchangeRateCurrent',
					methodName: 'exchangeRateCurrent'
				},
				{
					reference: 'borrowRatePerBlock',
					methodName: 'borrowRatePerBlock'
				},
				{
					reference: 'supplyRatePerBlock',
					methodName: 'supplyRatePerBlock'
				},
				{
					reference: 'totalSupply',
					methodName: 'totalSupply'
				},
				{
					reference: 'totalBorrowsCurrent',
					methodName: 'totalBorrowsCurrent'
				},
				{
					reference: 'accrueInterest',
					methodName: 'accrueInterest'
				},
				{
					reference: 'getCash',
					methodName: 'getCash'
				}
			]
		});
		// console.debug("pendingPoolCalls =", calls);

		return calls;
	},
	parseLendingPoolResults: function (multicallResults, lendingPool = {}) {
		// console.debug("parseLendingPoolResults()", multicallResults);

		Object.values(multicallResults?.results).forEach(result => {
			const objectsReturned = result.callsReturnContext;
			objectsReturned.forEach(item => {
				switch (item.reference) {
					default:
						lendingPool[item.reference] = globalUtils.formatMulticallResult(item.returnValues[0]);
						break;
				}
			});
		});
		console.debug("lendingPool =", lendingPool);
	},
	computeAPR: function (lendingPool, chainId) {
		// const supplyApy = (((Math.pow((supplyRatePerBlock / ethMantissa * blocksPerDay) + 1, daysPerYear - 1))) - 1) * 100;
		lendingPool.apr = lendingPool.supplyRatePerBlock.multipliedBy(globalUtils.constants.SECONDS_YEAR / appConfig.blockDuration[chainId]);
		return lendingPool.apr;
	},
	computeEarnings: function (lendingPool) {
		lendingPool.earnings = lendingPool.balanceOf.dividedBy(lendingPool.totalSupply).dividedBy(lendingPool.exchangeRateCurrent);
		return lendingPool.earnings;
	},
	computeInterest: function (lendingPool) {
		console.debug("getCash =", lendingPool.getCash.toFixed());

		const utilRate = lendingPool.totalBorrowsCurrent.dividedBy(lendingPool.totalBorrowsCurrent.plus(lendingPool.getCash));
		return utilRate.multipliedBy(lendingPool.borrowRatePerBlock.dividedBy(appConfig.currency.ethMantissa)).toNumber();
	}
};