import { locale } from "../libs/locale";
import "./TxSending.css";

export const TxSending = () => {
	const t = locale.translate;

	return <div className="txSendingLayout">
		<img
			className="loadingAnime"
			src="/images/loading.png"
			width="48px"
			alt="loading" />

		<h5>{t("waitingForWalletConfirmation")}</h5>
		
		<h6>{t("waitingForWalletConfirmation")}</h6>
	</div>
};