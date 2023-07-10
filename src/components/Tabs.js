import { useState } from "react";
import "./Tabs.css";

export const Tabs = ({
	name = "",
	tabs = [],
	onSelect = () => { }
}) => {
	const [indexSelected, setIndexSelected] = useState(0);

	const handleSelect = event => {
		const idx = parseInt(event.target.value);
		setIndexSelected(idx);
		onSelect(idx);
	};

	return <div className="tabsLayout">
		{tabs.map((tab, index) => {
			return <div
				className="tab"
				key={tab.id}>
				<input
					type="radio"
					name={name}
					id={tab.id}
					checked={index === indexSelected}
					onChange={handleSelect}
					value={index} />

				<label htmlFor={tab.id}>
					<div>{tab.label}</div>
					<div>{tab.subLabel}</div>
				</label>
			</div>
		})}
	</div>
};