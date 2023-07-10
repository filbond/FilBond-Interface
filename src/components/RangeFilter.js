import { locale } from "../libs/locale";
import "./RangeFilter.css";

export const RangeFilter = ({
	title = "",
	from = {
		label: "0.00%",
		value: 0
	},
	to = {
		label: "100.00%",
		value: 1
	}
}) => {
	const t = locale.translate;

	return <div className="rangeFilterLayout">
		{title && <h6>{title}</h6>}

		<div className="rangeFilterContent">
			<span className="label">{t("from")}</span>

			<input
				type="number"
				placeholder={from.label} />

			<span className="label">{t("to")}</span>

			<input
				type="number"
				placeholder={to.label} />
		</div>
	</div>
};