import "./MinFilter.css";

export const MinFilter = ({
	title = "",
	from = {
		label: "8.88FIL",
		value: 8.88
	}
}) => {
	return <div className="minFilterLayout">
		{title && <h6>{title}</h6>}

		<input
			type="number"
			placeholder={from.label} />
	</div>
};