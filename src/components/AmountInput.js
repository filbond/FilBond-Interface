import { useState } from "react";
import { locale } from "../libs/locale";
import "./AmountInput.css";
import { debounce } from "../libs/debounce";

export const AmountInput = ({
	name = "",
	symbol = "",
	logo = "",
	max = 0,
	showMax = true,
	onChange = () => { },
	maxTitle = null
}) => {
	const t = locale.translate;
	const [value, setValue] = useState(0);

	const dd = val => {
		if (!isNaN(val)) {
			setValue(val);
			onChange(val);
		}
	};

	const handleChange = event => {
		setValue(event.currentTarget.value);
		debounce.run(dd, null, event.currentTarget.value);
	};

	const handleMax = _ => {
		const val = max;
		setValue(val);
		onChange(val);
	};

	return <div className="amountInputLayout">
		<div className="titleLine">
			<div className="name">{name}</div>

			{max > 0 && showMax && <div className="balance">{maxTitle ?? t("wallet")}:&nbsp;{max}{symbol ? (" " + symbol) : ""}</div>}
		</div>

		<div className="inputBlock">
			{logo && <img
				className="amountInputLogo"
				src={logo}
				width="32px"
				alt="logo" />}

			<input
				className="amountInputStyle"
				// type="number"
				onChange={handleChange}
				value={value} />

			{max > 0 && <div
				className="maxButton"
				onClick={handleMax}>
				{t("max")}
			</div>}
		</div>
	</div>
}