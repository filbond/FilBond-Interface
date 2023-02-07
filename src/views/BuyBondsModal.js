import "./BuyBondsModal.css";
import { useState, useEffect } from "react";
import { locale } from "../libs/locale";
import { BondTitle } from "./BondTitle";
import { globalUtils } from "../libs/globalUtils";
import { appConfig } from "../configs/appConfig";
import { appController } from "../libs/appController";
import { AmountInput } from "../components/AmountInput";
import { Button } from "../components/Button";
import { TxSending } from "./TxSending";
import { RatingLabel } from "../components/RatingLabel";

export const BuyBondsModal = ({ data = null }) => {
	const t = locale.translate;
	const [indexOfSteps, setIndexOfSteps] = useState(0);
	const [steps, setSteps] = useState([]);
	const [bond, setBond] = useState(data);
	const [value, setValue] = useState(0);

	const handleNext = _ => {
		setIndexOfSteps(indexOfSteps + 1);

		// 模拟交易被确认。
		setTimeout(() => {
			setIndexOfSteps(2);
		}, 5000);
	};

	const handleClose = _ => {
		appController.clearModal();
	};

	const handleInputAmount = val => {
		setValue(val);
	};

	const goToYourInvestments = _ => {
		window.location.href = "/investments";
	};

	const goToBrowseBonds = _ => {
		window.location.href = "/";
	};

	const step1View = <div>
		<div className="modalTitle">{t("buyBonds")}&nbsp;{(indexOfSteps + 1) + "/" + steps.length}</div>

		<p />

		<h4>{t("howManyBonds")}</h4>

		<p />

		<BondTitle bond={bond} />

		<p />

		<div>
			<div className="keyAndValue">
				<div className="key">{t("bondPoolBalance")}</div>
				<div className="value">{globalUtils.formatBigNumber(bond.balance, appConfig.currency.decimals) + " " + appConfig.currency.symbol}</div>
			</div>

			{bond.invested && <div className="keyAndValue">
				<div className="key">{t("deposited")}</div>
				<div className="value">{globalUtils.formatBigNumber(bond.deposited, appConfig.currency.decimals) + " " + appConfig.currency.symbol}</div>
			</div>}

			<div className="keyAndValue">
				<div className="key">{t("currentValue")}</div>
				<div className="value">{globalUtils.formatBigNumber(bond.bondsIssued, appConfig.currency.decimals) + " " + appConfig.currency.symbol}</div>
			</div>

			{bond.invested && <div className="keyAndValue">
				<div className="key">{t("earned")}</div>
				<div className="value">{globalUtils.formatBigNumber(bond.earned, appConfig.currency.decimals) + " " + appConfig.currency.symbol}</div>
			</div>}
		</div>

		<p />

		<div className="label">{t("howManyBonds")}</div>

		<p />

		<AmountInput
			logo={appConfig.currency.logo}
			pushValue={handleInputAmount}
			decimals={appConfig.currency.decimals}
			max="9876543210987654321" />

		<p>&nbsp;</p>

		<Button
			type={appConfig.buttonType.primary}
			fullWidth
			label={t("next")}
			onClick={handleNext} />

		<p />

		<Button
			type={appConfig.buttonType.noBackground}
			fullWidth
			label={t("cancel")}
			onClick={handleClose} />
	</div>

	const step2View = <TxSending />

	const step3View = <div>
		<div className="modalTitle">{t("success")}</div>

		<p />

		<h4>{t("bondBoughtSuccessfully")}</h4>

		<p />

		<div className="reviewPanel">
			<div className="keyAndValue">
				<div className="key">{t("buyAmount")}</div>
				<div className="value">{value + " " + appConfig.currency.symbol}</div>
			</div>

			<div className="keyAndValue">
				<div className="key">{t("rating")}</div>
				<RatingLabel label={appController.getRatingLabelWithValue(bond.rating)} />
			</div>

			<div className="keyAndValue">
				<div className="key">{t("interestRate")}</div>
				<div className="value">{(bond.interestRate * 100).toFixed(appConfig.defaultFractionDigits) + "%"}</div>
			</div>

			<div className="keyAndValue">
				<div className="key">{t("miningCompany")}</div>
				<div className="value">{bond.site}</div>
			</div>

			<div className="keyAndValue">
				<div className="key">{t("bondPoolId")}</div>
				<div className="value">{bond.id}</div>
			</div>
		</div>

		<p>&nbsp;</p>

		<Button
			type={appConfig.buttonType.default}
			fullWidth
			label={t("yourInvestments")}
			onClick={goToYourInvestments} />

		<p />

		<Button
			type={appConfig.buttonType.primary}
			fullWidth
			label={t("browseBonds")}
			onClick={goToBrowseBonds} />
	</div>

	const loadAccountData = _ => {
		appController.getDataWithAccount("", result => {
			const theBond = result.investments.find(item => item.bondId === bond.id);
			setBond({
				...data,
				...theBond,
				invested: true
			});
		});
	};

	useEffect(() => {
		loadAccountData();
	}, []);

	useEffect(() => {
		setSteps([step1View, step2View, step3View]);
	}, [bond]);

	return <div className="buyBondModalLayout">
		{steps[indexOfSteps]}
	</div>
};