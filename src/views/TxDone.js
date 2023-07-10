import { Button } from "../components/Button";
import { Link } from "../components/Link";
import { ValueAndKey } from "../components/ValueAndKey";
import { appConfig } from "../configs/appConfig";
import { appController } from "../libs/appController";
import { globalUtils } from "../libs/globalUtils";
import { locale } from "../libs/locale";
import "./TxSending.css";

export const TxDone = ({
	label = "",
	text = "",
	txHash = "",
	onDone = () => { }
}) => {
	const t = locale.translate;

	return <div className="txSendingLayout">
		<p />

		<h3 style={{ textAlign: "center" }}>
			{label || t("txSuccessful")}
		</h3>

		{text && <div
			className="modalText"
			style={{ textAlign: "center" }}>
			{text}
		</div>}

		{txHash && <div className="values">
			<ValueAndKey
				keyStr={t("transaction")}
				value={<Link
					url={appController.getNetworkConfig().blockExplorerUrls[0] + appConfig.blockExplorerUrlSegements.message + txHash}
					openNewWindow
					primary>
					{globalUtils.truncateString(txHash, 7, 5)}
					<img
						src="/images/link1.png"
						width="18px"
						alt="link1" />
				</Link>}
				rowDirection={true}
				reversed={true}
				fullWidth />
		</div>}

		<Button
			type={appConfig.buttonType.primary}
			fullWidth
			label={t("done")}
			onClick={onDone} />
	</div>
};