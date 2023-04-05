import { RatingLabel } from "../components/RatingLabel";
import { ValueAndKey } from "../components/ValueAndKey";
import { appConfig } from "../configs/appConfig";
import { appController } from "../libs/appController";
import { globalUtils } from "../libs/globalUtils";
import { locale } from "../libs/locale";
import "./NodeItem.css";

export const NodeItem = ({ node = null }) => {
	const t = locale.translate;

	return <div className="noteItemLayout">
		<div className="titleBar">
			<div>
				<span>{node?.title}</span>
				<span>&nbsp;&nbsp;<img src="/images/link.png" width="8px" alt="link" /></span>
			</div>

			<RatingLabel label={appController.getRatingLabelWithValue(node?.rating)} />
		</div>

		<div className="content">
			<ValueAndKey
				value={(node?.qualityAdjPower ? (node?.qualityAdjPower / Math.pow(globalUtils.constants.BYTE_SCALE, 4)).toFixed(2) : "0") + " " + appConfig.powerUnit}
				keyStr={t("adjPower")} />

			<ValueAndKey
				value={(node?.successRate ? (node?.successRate * 100).toFixed(2) : "0") + "%"}
				keyStr={t("successRate")} />

			<ValueAndKey
				value={node?.earned}
				keyStr={t("earned")} />
		</div>
	</div>
};