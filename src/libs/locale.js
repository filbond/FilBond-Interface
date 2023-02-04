import { appConfig } from "../configs/appConfig";
import { globalUtils } from "./globalUtils";

export const locale = {
	_strings: null,
	_language: globalUtils.lauguages.en.key,

	init: async function (lan) {
		if (lan && Object.keys(globalUtils.lauguages).includes(lan)) {
			this._language = lan;
			appConfig.defaultRegion = globalUtils.lauguages[this._language].region;
		}

		await this._loadStrings();

		return true;
	},

	translate: function (key) {
		return (locale._strings && key) ? locale._strings[key] : "";
	},

	_loadStrings: async function () {
		this._strings = await (await fetch("/locale/" + this._language + ".json")).json();
	}
};