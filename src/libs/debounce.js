import { appConfig } from "../configs/appConfig";

export const debounce = {
	_timer: null,

	run: function (func, timpGap) {
		this._cleanTime();

		this._timer = setTimeout(() => {
			func();
			return this._cleanTime();
		}, timpGap || appConfig.defaultTimeGap);
	},

	_cleanTime: function () {
		if (debounce._timer) {
			window.clearTimeout(debounce._timer);
			debounce._timer = null;
		}
	}
};