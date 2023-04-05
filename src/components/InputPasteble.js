import { useState } from "react";
import { locale } from "../libs/locale";
import "./InputPasteble.css";

export const InputPasteble = ({
	title = "",
	placeholder = "",
	onChange = () => { }
}) => {
	const t = locale.translate;
	const [value, setValue] = useState("");

	const handlePaste = event => {
		event.stopPropagation();

		window.navigator?.clipboard?.readText && navigator?.clipboard?.readText().then(clipText => {
			setValue(clipText);
			onChange(clipText);
		})
	};

	const handleChange = event => {
		const val = event.currentTarget.value;
		setValue(val);
		onChange(val);
	};

	return <div className="inputPastebleLayout">
		{title && <div className="title">{title}</div>}

		<div className="inputBlock">
			<input
				placeholder={placeholder}
				value={value}
				onChange={handleChange} />

			{window.navigator?.clipboard?.readText && <div
				className="paste"
				onClick={handlePaste}>{t("paste")}</div>}
		</div>
	</div>
};