import "./ValueUpdate.css";

export const ValueUpdate = ({
	oldValue = "",
	newValue = "",
	positive = true
}) => {
	return <div className="valueUpdateLayout">
		<div>{oldValue}</div>

		<img
			src={positive ? "/images/right_arrow_green.png" : "/images/right_arrow_red.png"}
			alt="arrow"
			height="8px" />

		<div>{newValue}</div>
	</div>
};