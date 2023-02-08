import { locale } from "../libs/locale";
import "./TxSending.css";

export const TxSending = ({
	label = "",
	text = ""
}) => {
	const t = locale.translate;

	return <div className="txSendingLayout">
		<img
			className="loadingAnime"
			src="/images/loading.png"
			width="48px"
			alt="loading" />

		<h5 style={{ textAlign: "center" }}>
			{label || t("waitingForWalletConfirmation")}
		</h5>

		<h6 style={{ textAlign: "center" }}>
			{text || t("waitingForWalletConfirmation")}
		</h6>
	</div>
};