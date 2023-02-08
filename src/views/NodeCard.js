import { RatingLabel } from "../components/RatingLabel";
import { appController } from "../libs/appController";
import { MessageLabel } from "../components/MessageLabel";
import "./NodeCard.css";
import { globalUtils } from "../libs/globalUtils";
import { ValueAndKey } from "../components/ValueAndKey";
import { appConfig } from "../configs/appConfig";
import { locale } from "../libs/locale";
import { Button } from "../components/Button";

export const NodeCard = ({ node = null }) => {
	const t = locale.translate;

	return <div className="nodeCardLayout">
		<div className="titalBar">
			<div className="leftSide">
				<div className="title">{node?.title}&nbsp;</div>
				<RatingLabel label={appController.getRatingLabelWithValue(node?.rating)} />
			</div>

			{node?.status === 0 && <MessageLabel>
				{Object.keys(globalUtils.nodeStatus)[node?.status]}
			</MessageLabel>}
		</div>

		<div className="values">
			<ValueAndKey
				value={globalUtils.formatBigNumber(node?.availableFunds, appConfig.currency.decimals) + " " + appConfig.currency.symbol}
				keyStr={t("availableFunds")} />

			<ValueAndKey
				value={globalUtils.formatBigNumber(node?.bondsIssued, appConfig.currency.decimals) + " " + appConfig.currency.symbol}
				keyStr={t("bondsIssued")} />

			<ValueAndKey
				value={globalUtils.formatBigNumber(node?.bondsIssuable, appConfig.currency.decimals) + " " + appConfig.currency.symbol}
				keyStr={t("bondsIssuable")} />
		</div>

		{node?.bonds.length > 0 && <Button
			type={appConfig.buttonType.primary}
			label={t("connectToBondPool")}
			fullWidth />}

		<p />

		<Button
			type={appConfig.buttonType.default}
			label={t("manage")}
			fullWidth />
	</div>
};