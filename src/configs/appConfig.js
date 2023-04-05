import BigNumber from "bignumber.js";
import { globalUtils } from "../libs/globalUtils";

export const appConfig = {
	defaultNetwork: "calibration",

	networks: {
		calibration: {
			chainName: "Filecoin - Calibration testnet",
			chain: "calibration",
			chainId: 314159,
			rpcUrls: ["https://api.calibration.node.glif.io/rpc/v1"],
			nativeCurrency: {
				name: "tFIL",
				symbol: "tFIL",
				decimals: 18
			},
			blockExplorerUrls: ["https://calibration.filfox.info/en", "https://calibration.filscan.io"],
			iconUrls: ["/images/fil.png"]
		}
	},

	blockExplorerUrlSegements: {
		address: "/address/",
		message: "/message/",
	},

	networkPrefix: {
		314159: "t"
	},

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
		secondary: 2,
		small: 3,
		important: 4,
		noBackground: 5,
		deprecated: 6
	},

	currency: {
		name: "FIL",
		symbol: "FIL",
		decimals: 18,
		logo: "/images/bond_logos/fil.png",
		ethMantissa: BigNumber(1).shiftedBy(18)
	},

	currencyCToken: {
		name: "stFIL",
		symbol: "stFIL",
		decimals: 18,
		logo: "/images/bond_logos/fil.png"
	},

	powerUnit: "TiB",

	sectorSizeUnit: "GB",

	defaultFractionDigits: 2,

	defaultTimeGap: 1000, //ms

	defaultRegion: "en-US",

	updateInterval: 180000, // ms

	maxMargin: 0.99,

	errorMessageLimit: 100,

	toastConfig: {
		position: "top-right",
		autoClose: 3000,
		hideProgressBar: true,
		closeOnClick: false,
		pauseOnHover: false,
		draggable: false,
		progress: undefined,
		theme: "light"
	},

	blockDuration: {
		"314159": 30
	},

	nodesArchiveFile: "nodes.json",

	nodeHealth: {
		normal: 0.8,
		low: 0.9
	},

	markets: {
		networks: {
			"314159": {
				feeRate: 0.02,
				filSmartOwnerFactory: {
					address: "0x8E1A7acf29AfB54f9F9519E6b6C2BF0ae211e15D",
					abi: "/abis/FilSmartOwnerFactory.json"
				},
				minerSmartOwner: {
					abi: "/abis/MinerSmartOwner.json"
				},
				multicall: {
					address: "0x9D1eCb749662aE79Ac65f5dcCc3DbA6E7b77D0a8",
				},
				lendingPool: {
					address: "0x10c3e8886FE489fBB15229C3c339224cBA8d762F",
					abi: "/abis/CWrappedNative.json",
					symbol: "aFIL",
					decimals: 18,
					createTime: new Date("2023-03-30 11:35:30")
				},
				comptroller: {
					address: "0xBC14511f9C9Ad1540a184311A515f228E27C10D2"
				}
			}
		}
	}
}