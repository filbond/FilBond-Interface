import { createRoot } from 'react-dom/client';
import { appConfig } from "../configs/appConfig";
import { globalUtils } from "./globalUtils";

export const appController = {
	_data: null,
	_accountData: null,
	_updateTime: 0,
	_modalContainer: null,

	init: async function () {
		if (!this._modalContainer) {
			this._modalContainer = createRoot(document.getElementById("modalContainer"));
		}

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

	showModal: function (childrenDom) {
		this._modalContainer?.render(childrenDom)
	},

	clearModal: function () {
		this._modalContainer?.render(null);
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