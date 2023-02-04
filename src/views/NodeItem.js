import { RatingLabel } from "../components/RatingLabel";
import { ValueAndKey } from "../components/ValueAndKey";
import { appController } from "../libs/appController";
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
				value={node?.adjPower}
				keyStr={t("adjPower")} />

			<ValueAndKey
				value={node?.successRate}
				keyStr={t("successRate")} />

			<ValueAndKey
				value={node?.earned}
				keyStr={t("earned")} />
		</div>
	</div>
};