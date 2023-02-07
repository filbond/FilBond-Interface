import BigNumber from "bignumber.js";
import { useState } from "react";
import { locale } from "../libs/locale";
import "./AmountInput.css";

export const AmountInput = ({
	name = "",
	symbol = "",
	logo = "",
	decimals = 18,
	max = "0",
	pushValue = () => { }
}) => {
	const t = locale.translate;
	const [value, setValue] = useState(0);

	const handleChange = event => {
		const val = Number(event.currentTarget.value);

		if (isNaN(val)) {
			return;
		}

		setValue(val);
		pushValue(val);
	};

	const handleMax = _ => {
		const val = BigNumber(max).shiftedBy(-decimals).toNumber();
		setValue(val);
		pushValue(val);
	};

	return <div className="amountInputLayout">
		<img
			className="amountInputLogo"
			src={logo}
			width="32px" />

		<input
			className="amountInputStyle"
			type="number"
			onChange={handleChange}
			value={value} />

		{max && <button
			className="maxButton"
			onClick={handleMax}>{t("max")}</button>}
	</div>
}