import { globalUtils } from "../libs/globalUtils";

export const appConfig = {
	rating: [
		{
			name: "AAA",
			value: 0
		},
		{
			name: "AA",
			value: 1
		},
		{
			name: "A",
			value: 2
		}
	],

	sortBy: [
		{
			label: "Interest",
			order: globalUtils.order.DESC,
			value: 0
		},
		{
			label: "Interest",
			order: globalUtils.order.ASCE,
			value: 1
		}
	],

	sortInvestmentsBy: [
		{
			label: "earned",
			order: globalUtils.order.DESC,
			value: 0
		},
		{
			label: "earned",
			order: globalUtils.order.ASCE,
			value: 1
		}
	],

	sortNodesBy: [
		{
			label: "Interest Earned",
			order: globalUtils.order.DESC,
			value: 0
		},
		{
			label: "Interest Earned",
			order: globalUtils.order.ASCE,
			value: 1
		}
	],

	buttonType: {
		default: 0,
		primary: 1,
		small: 2,
		important: 3,
		noBackground: 4
	},

	currency: {
		name: "FIL",
		symbol: "FIL",
		decimals: 18,
		logo: "/images/bond_logos/fil.png"
	},

	defaultFractionDigits: 2,

	defaultRegion: "en-US",

	updateInterval: 180000 // ms
}