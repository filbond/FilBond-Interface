import { useState } from "react";
import { locale } from "../libs/locale";
import "./LabelFilter.css";

export const LabelFilter = ({
	labels = [],
	showAll = true,
	title = ""
}) => {
	const t = locale.translate;

	const [selected, setSelected] = useState(0);

	const handleSelect = event => {
		setSelected(parseInt(event.target.dataset.itemId));
	};

	return <div className="labelFilterLayout">
		{title && <h6>{title}</h6>}

		<div className="labelFilterContent">
			{showAll && <div
				className={"label" + (selected === 0 ? " active" : "")}
				data-item-id={0}
				onClick={handleSelect}>
				{t("all")}
			</div>}

			{labels.map((label, index) => {
				return <div
					key={label.name}
					className={"label" + (selected === (index + 1) ? " active" : "")}
					data-item-id={index + 1}
					onClick={handleSelect}>
					{label.name}
				</div>
			})}
		</div>
	</div>
};