import "./ValueAndKey.css";

export const ValueAndKey = ({
	keyStr = null,
	hightlightKey = false,
	value = "",
	alignRight = false,
	alignLeft = false,
	hightlightValue = false,
	lowlightValue = false,
	reversed = false,
	rowDirection = false,
	fullWidth = false,
	icon = "",
	children = null
}) => {
	return <div
		className="valueAndKeyLayout"
		style={{
			width: fullWidth ? "100%" : "fit-content"
		}}>
		{icon && <img
			src={icon}
			width="24px"
			alt={icon} />}

		<div style={{
			display: "flex",
			gap: "8px",
			flexDirection: rowDirection ? (reversed ? "row-reverse" : "row") : (reversed ? "column-reverse" : "column"),
			justifyContent: rowDirection ? "space-between" : "center",
			alignItems: alignRight ? "flex-end" : (alignLeft ? "flex-start" : "center"),
			width: fullWidth ? "100%" : "fit-content"
		}}>
			<div
				className="value"
				style={{ color: hightlightValue ? "#0CB373" : (lowlightValue ? "#A5A0BB" : "#F8FAFF") }}>{value || children}</div>

			<div
				className="key"
				style={{
					color: hightlightKey ? "white" : "none",
					fontWeight: hightlightKey ? 500 : 400
				}}>{keyStr}</div>
		</div>
	</div>
}