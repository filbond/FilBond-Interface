import { Button } from "../components/Button";
import { appConfig } from "../configs/appConfig";
import { locale } from "../libs/locale";

export const ErrorModalView = ({
	title = "",
	text = "",
	onBack = () => { }
}) => {
	const t = locale.translate;

	return <div>
		<h2>{title}</h2>

		<div style={{ height: "24px" }} />

		<div className="modalText">{text}</div>

		<div style={{ height: "24px" }} />

		<Button
			type={appConfig.buttonType.primary}
			fullWidth
			label={t("back")}
			onClick={onBack} />
	</div>
};