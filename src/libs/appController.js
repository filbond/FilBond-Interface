import { appConfig } from "../configs/appConfig";
import { globalUtils } from "./globalUtils";

export const appController = {
	_data: null,
	_accountData: null,
	_updateTime: 0,

	init: async function () {
		await this._loadMockData();

		return { data: this._data }
	},

	getDataWithAccount: async function (account, callback) {
		if (!this._accountData || (new Date()) - this._updateTime > appConfig.updateInterval) {
			await this._loadMockAccountData();
			this._updateTime = new Date();
		}

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