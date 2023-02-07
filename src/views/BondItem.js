import { Button } from "../components/Button";
import { ValueAndKey } from "../components/ValueAndKey";
import { Modal } from "../components/Modal";
import { appConfig } from "../configs/appConfig";
import { appController } from "../libs/appController";
import { globalUtils } from "../libs/globalUtils";
import { locale } from "../libs/locale";
import "./BondItem.css";
import { BuyBondsModal } from "./BuyBondsModal";
import { BondTitle } from "./BondTitle";

export const BondItem = ({
	bond = null,
	asInvestment = false
}) => {
	const t = locale.translate;

	const handleClickItem = _ => {
		window.location.href = "/bond/" + bond.title;
	};

	const handleBuy = _ => {
		appController.showModal(<Modal>
			<BuyBondsModal data={bond} />
		</Modal>);
	};

	return <div className="bondItemLayout">
		<div
			className="titleBlock"
			onClick={handleClickItem}>
			<BondTitle bond={bond} />
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
				label={t("details")}
				onClick={handleClickItem} />

			{!asInvestment && <Button
				type={appConfig.buttonType.primary}
				label={t("buy")}
				onClick={handleBuy} />}

			{asInvestment && <Button
				type={appConfig.buttonType.default}
				label={t("redeem")} />}

			{asInvestment && <Button
				type={appConfig.buttonType.primary}
				label={t("buyMore")}
				onClick={handleBuy} />}
		</div>
	</div>
};