import BigNumber from "bignumber.js";
import { appConfig } from "../configs/appConfig";

export const globalUtils = {
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

	loadJson: async function (url) {
		return await (await fetch(url)).json();
	},

	formatBigNumber: function (bn, decimals, fractionDigits) {
		let n = bn;
		if ((typeof bn) === "string") {
			n = BigNumber(bn);
		}

		return n.shiftedBy(-decimals).toNumber().toLocaleString(
			appConfig.defaultRegion,
			{ maximumFractionDigits: fractionDigits ?? appConfig.defaultFractionDigits }
		);
	},

	truncateString: function (str, head, tail) {
		if (str.length <= head + tail) {
			return str;
		}

		return str.substr(0, head) + "..." + str.substr(str.length - tail);
	}
}