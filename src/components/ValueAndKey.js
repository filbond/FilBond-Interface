import "./ValueAndKey.css";

export const ValueAndKey = ({
	keyStr = "",
	value = "",
	alignRight = false,
	alignLeft = false,
	hightlightValue = false
}) => {
	return <div
		className="valueAndKeyLayout"
		style={{ alignItems: alignRight ? "flex-end" : (alignLeft ? "flex-start" : "center") }}>
		<div
			className="value"
			style={{ color: hightlightValue ? "#0CB373" : "#F8FAFF" }}>{value}</div>

		<div className="key">{keyStr}</div>
	</div>
}