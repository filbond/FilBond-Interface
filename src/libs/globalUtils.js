import BigNumber from "bignumber.js";
import { appConfig } from "../configs/appConfig";

export const globalUtils = {
	constants: {
		WALLET_SWITCH_ETHEREUM_CHAIN: "wallet_switchEthereumChain",
		WALLET_ADD_ETHEREUM_CHAIN: "wallet_addEthereumChain",
		BIGNUMBER_ZERO: new BigNumber(0),
		PRICE_DATA_STORED: "priceDataStored",
		PRICE_DATA_UPDATED: "priceDataUpdated",
		HEX_PREFIX: "0x",
		SAT_RATE: 1000,
		SOMETHING_WRONG: "Something Went Wrong!",
		AUTOCONNECT: "autoconnect",
		REVERTED_MESSAGE: "Transaction has been reverted by the EVM",
		MAX_BIGNUMBER_STRING: new BigNumber(2).pow(256).minus(1).toFixed(),
		NODES: "nodes@filbond",
		SECONDS_HOUR: 3600,
		SECONDS_DAY: 86400,
		SECONDS_YEAR: 31536000,
		NOW: new Date(),
		BYTE_SCALE: 1024
	},

	order: {
		DESC: 0,
		ASCE: 1
	},

	lauguages: {
		en: {
			key: "en",
			scope: ["en", "en-AU", "en-BZ", "en-CA", "en-CB", "en-GB", "en-IE", "en-JM", "en-NZ", "en-PH", "en-TT", "en-US", "en-ZA", "en-ZW"],
			region: "en-US"
		}
	},

	nodeStatus: {
		inactive: 0,
		actived: 1
	},

	fil: {
		name: "FIL",
		symbol: "FIL",
		decimals: 18,
		logo: "/images/fil.png"
	},

	nodeHealthLevel: {
		healthy: 0,
		low: 1,
		risk: 2
	},

	nodeRole: {
		owner: 0,
		worker: 1,
		beneficiary: 2
	},

	loadJson: async function (url) {
		return await (await fetch(url)).json();
	},

	postRequest: async function (url, method, params) {
		let res = null;
		try {
			res = await (await fetch(url, {
				method: 'POST',
				mode: 'cors',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					jsonrpc: "2.0",
					id: new Date().getTime(),
					method,
					params
				})
			})).json();
		} catch (error) {
			console.error(error);
		}

		if (!res?.error) {
			return res;
		}
	},

	formatBigNumber: function (bn, decimals, fractionDigits) {
		if (!bn) {
			return "0";
		}

		let n = bn;
		if ((typeof bn) === "string") {
			n = new BigNumber(bn);
		}

		return n.shiftedBy(-decimals).toNumber().toLocaleString(
			appConfig.defaultRegion,
			{ maximumFractionDigits: fractionDigits ?? appConfig.defaultFractionDigits }
		);
	},

	formatNumber: function (num, fractionDigits) {
		if (isNaN(num) || (typeof num) !== "number") {
			return "";
		}

		return num.toLocaleString(
			appConfig.defaultRegion,
			{ maximumFractionDigits: fractionDigits ?? appConfig.defaultFractionDigits }
		);
	},

	truncateString: function (str, head, tail) {
		if (str.length <= head + tail) {
			return str;
		}

		return str.substr(0, head) + "..." + str.substr(str.length - tail);
	},

	strEqualIgnoreCase: function (str1, str2) {
		return str1.toUpperCase() === str2.toUpperCase();
	},

	formatMulticallResult: function ({
		type = 'BigNumber',
		hex = '0x00'
	}) {
		if (type === "BigNumber") {
			return BigNumber(hex);
		}
	}
}