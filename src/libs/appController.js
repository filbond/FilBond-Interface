import { appConfig } from "../configs/appConfig";
import { globalUtils } from "./globalUtils";

export const appController = {
	_data: null,
	_accountData: null,

	init: async function () {
		await this._loadMockData();

		return { data: this._data }
	},

	getDataWithAccount: async function (account, callback) {
		console.debug("getDataWithAccount()...");

		await this._loadMockAccountData();
		return callback(this._accountData);
	},

	getRatingLabelWithValue: function (ratingValue) {
		return appConfig.rating.find(item => item.value === ratingValue).name || "";
	},

	_loadMockData: async function () {
		this._data = await globalUtils.loadJson("/mock/bonds.json");
		return this._data;
	},

	_loadMockAccountData: async function () {
		this._accountData = await globalUtils.loadJson("/mock/me.json");
		return this._accountData;
	}
};