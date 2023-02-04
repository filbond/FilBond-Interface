import { Button } from "../components/Button";
import { ValueAndKey } from "../components/ValueAndKey";
import { RatingLabel } from "../components/RatingLabel";
import { appConfig } from "../configs/appConfig";
import { appController } from "../libs/appController";
import { globalUtils } from "../libs/globalUtils";
import { locale } from "../libs/locale";
import "./BondItem.css";

export const BondItem = ({
	bond = null,
	asInvestment = false
}) => {
	const t = locale.translate;

	const handleClickItem = _ => {
		window.location.href = "/bond/" + bond.title;
	};

	return <div className="bondItemLayout">
		<div
			className="titleBlock"
			onClick={handleClickItem}>
			<img src={bond?.logo} width="24px" />

			<div className="title">
				<div className="title">{bond.title}</div>
				<div className="site">{bond.site}</div>
			</div>

			<RatingLabel label={appController.getRatingLabelWithValue(bond.rating)} />

			<div>❯</div>
		</div>

		{!asInvestment && <ValueAndKey
			value={(bond.bondsSold * 100).toFixed(appConfig.defaultFractionDigits) + "%"}
			keyStr={t("bondsSoldPercent")} />}

		{!asInvestment && <ValueAndKey
			value={globalUtils.formatBigNumber(bond.bondsForSale, appConfig.currency.decimals) + " " + appConfig.currency.symbol}
			keyStr={t("bondsForSale")} />}

		{!asInvestment && <ValueAndKey
			value={bond.nodes.length}
			keyStr={t("nodes")} />}

		<ValueAndKey
			value={(bond.interestRate * 100).toFixed(appConfig.defaultFractionDigits) + "%"}
			keyStr={t("currentInterest")} />

		{asInvestment && <ValueAndKey
			value={globalUtils.formatBigNumber(bond.deposited, appConfig.currency.decimals) + " " + appConfig.currency.symbol}
			keyStr={t("deposited")} />}

		{asInvestment && <ValueAndKey
			value={globalUtils.formatBigNumber(bond.redeemable, appConfig.currency.decimals) + " " + appConfig.currency.symbol}
			keyStr={t("redeemable")} />}

		{asInvestment && <ValueAndKey
			value={globalUtils.formatBigNumber(bond.earned, appConfig.currency.decimals) + " " + appConfig.currency.symbol}
			keyStr={t("earned")}
			hightlightValue />}

		<div className="buttons">
			<Button
				type={appConfig.buttonType.default}
				label={t("details")} />

			{!asInvestment && <Button
				type={appConfig.buttonType.primary}
				label={t("buy")} />}

			{asInvestment && <Button
				type={appConfig.buttonType.default}
				label={t("redeem")} />}

			{asInvestment && <Button
				type={appConfig.buttonType.primary}
				label={t("buyMore")} />}
		</div>
	</div>
};