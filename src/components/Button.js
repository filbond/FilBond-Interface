import { appConfig } from "../configs/appConfig";
import "./Button.css";

export const Button = ({
	children = null,
	label = "",
	type = appConfig.buttonType.default,
	fullWidth = false,
	onClick = () => { },
	disabled = false,
	actived = true,
	smallText = false,
	padding = "",
	margin = "",
	buttonId = "",
	height = "",
	fontSize = "",
}) => {
	const getStyleWithType = (typ) => {
		let style = "buttonDefault";

		switch (typ) {
			case appConfig.buttonType.primary:
				style = "buttonPrimary";
				break;

			case appConfig.buttonType.deprecated:
				style = "buttonPrimary deprecated";
				break;

			case appConfig.buttonType.secondary:
				style = "buttonSecondary";
				break;

			case appConfig.buttonType.small:
				style += " buttonSmall";
				break;

			case appConfig.buttonType.important:
				style = "buttonImportant";
				break;

			case appConfig.buttonType.noBackground:
				style = "noBackground";
				break;

			default:
				style = "buttonDefault";
				break;
		}

		return style;
	};

	const handleClick = event => {
		onClick(event);
	};

	return <button
		id={buttonId}
		className={getStyleWithType(type)}
		style={{
			width: fullWidth ? "100%" : "fit-content",
			fontSize: smallText ? "16px" : (fontSize || "auto"),
			padding: padding ?? "auto",
			margin: margin ?? "auto",
			height: height ?? "auto"
		}}
		onClick={handleClick}
		disabled={disabled || !actived}>
		{label || children}
	</button>
};