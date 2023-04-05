import { Button } from "../components/Button";
import { appConfig } from "../configs/appConfig";
import { locale } from "../libs/locale";
import "./TxSending.css";

export const TxError = ({
	label = "",
	text = "",
	onCancel = () => { }
}) => {
	const t = locale.translate;

	return <div className="txSendingLayout">
		<p />

		<h3 style={{ textAlign: "center" }}>
			{label || t("txError")}
		</h3>

		{text && <div
			className="modalText"
			style={{ textAlign: "center" }}>
			{text}
		</div>}

		<Button
			type={appConfig.buttonType.primary}
			fullWidth
			label={t("cancel")}
			onClick={onCancel} />
	</div>
};