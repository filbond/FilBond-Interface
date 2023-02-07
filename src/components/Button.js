import { appConfig } from "../configs/appConfig";
import "./Button.css";

export const Button = ({
	children = null,
	label = "",
	type = appConfig.buttonType.default,
	fullWidth = false,
	onClick = () => { }
}) => {
	const getStyleWithType = (typ) => {
		let style = "buttonDefault";

		switch (typ) {
			case appConfig.buttonType.primary:
				style = "buttonPrimary";
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

	return <button
		className={getStyleWithType(type)}
		style={{ width: fullWidth ? "100%" : "fit-content" }}
		onClick={onClick}>
		{label || children}
	</button>
};