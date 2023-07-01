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

		<h3 style={{ textAlign: "center" }}>
			{label || t("pleaseWait")}
		</h3>

		<div
			className="modalText"
			style={{ textAlign: "center" }}>
			{text || t("waitingForNodesConfirmation")}
		</div>
	</div>
};