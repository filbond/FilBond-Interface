// import { useState } from "react";
import { globalUtils } from "../libs/globalUtils";
import "./SortTrigger.css";

export const SortTrigger = ({
	title = "",
	options = []
}) => {
	// const [indexSelected, setIndexSelected] = useState(0);

	return <div className="sortTriggerLayout">
		{title && <div>{title}</div>}

		<select
		// defaultValue={indexSelected}
		>
			{options.map((option, index) => {
				return <option
					key={option.value}
					value={option.value}>
					{option.label + "(" + Object.keys(globalUtils.order)[option.order] + ")"}
				</option>
			})}
		</select>
	</div>
};