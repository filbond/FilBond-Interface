import { useState } from "react";
import "./CategoryFilter.css";

export const CategoryFilter = ({
	title = "",
	categories = []
}) => {
	const [currentSelected, setCurrentSelected] = useState(0);

	const handleChange = event => {
		setCurrentSelected(parseInt(event.currentTarget.id));
	};

	return <div className="categoryFilterLayout">
		{title && <h6>{title}</h6>}

		<div className="content">
			{categories.map((category, index) => {
				return <div
					key={index}
					id={index}
					onClick={handleChange}
					className={"category" + (currentSelected === index ? " categorySelected" : "")}>{category}</div>;
			})}
		</div>
	</div>
};