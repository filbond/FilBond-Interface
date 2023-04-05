import { useState, useEffect } from "react";
import { Button } from "../components/Button";
import { ValueUpdate } from "../components/ValueUpdate";
import { appConfig } from "../configs/appConfig";
import { appController } from "../libs/appController";
import { locale } from "../libs/locale";
import "./RegisterNodeModal.css";
import { AmountInput } from "../components/AmountInput";
import { globalUtils } from "../libs/globalUtils";
import { ValueAndKey } from "../components/ValueAndKey";
import BigNumber from "bignumber.js";
import { debounce } from "../libs/debounce";

const keyOfWithdrawViews = {
	index: 0,
	summary: 1
};

export const WithdrawtModal = ({
	lendingPool = null,
	onClose = () => { }
}) => {
	const t = locale.translate;
	const [views, setViews] = useState([]);
	const [currentView, setCurrentView] = useState(keyOfWithdrawViews.index);
	const totalDeposited = lendingPool?.balanceOfUnderlying.plus(lendingPool?.earnings);
	const max = totalDeposited.shiftedBy(-appConfig.currency.decimals).toNumber();
	const [inputValue, setInputValue] = useState(0);
	const [inputAmount, setInputAmount] = useState(globalUtils.constants.BIGNUMBER_ZERO);
	const [gas, setGas] = useState(0);

	const handleSummary = _ => {
		setCurrentView(keyOfWithdrawViews.summary);
	};

	const handleClose = _ => {
		appController.clearModal();
		onClose();
	};

	const handleWithdraw = () => {
		appController.withdraw(
			lendingPool.address,
			handleClose,
			null,
			null,
			inputAmount.toFixed()
		);
	};

	const updateGas = async () => {
		const g = await appController.computeTxGas(
			lendingPool?.address,
			lendingPool?.abi,
			"redeemUnderlying",
			null,
			inputAmount.toFixed()
		);
		setGas(g);
	};

	const handleChangeAmountInput = val => {
		setInputValue(val);
		setInputAmount(BigNumber(val).shiftedBy(appConfig.currency.decimals));

		debounce.run(updateGas);
	};

	const step1View = <>
		<div className="steppedViewCount">{t("withdraw")}</div>

		<div style={{ height: "8px" }} />

		<h2>{t("howMuch")}?</h2>

		<div style={{ height: "24px" }} />

		<ValueAndKey
			keyStr={t("poolBalance")}
			value={globalUtils.formatBigNumber(lendingPool?.totalSupply, lendingPool?.decimals) + " " + lendingPool?.symbol}
			rowDirection={true}
			reversed={true}
			fullWidth
			hightlightKey />

		<div style={{ height: "16px" }} />

		<ValueAndKey
			keyStr={t("deposited")}
			value={globalUtils.formatBigNumber(totalDeposited, appConfig.currency.decimals) + " " + appConfig.currency.symbol}
			rowDirection={true}
			reversed={true}
			fullWidth
			hightlightKey />

		<ValueAndKey
			keyStr={t("originalDepositEarnings")}
			value={globalUtils.formatBigNumber(lendingPool?.balanceOfUnderlying, appConfig.currency.decimals) + " " + appConfig.currency.symbol + " + " + globalUtils.formatBigNumber(lendingPool?.earnings, lendingPool?.decimals) + " " + lendingPool?.symbol}
			rowDirection={true}
			reversed={true}
			fullWidth
			lowlightValue />

		<div style={{ height: "24px" }} />

		<AmountInput
			name={t("withdrawAmount")}
			max={max}
			symbol={globalUtils.fil.symbol}
			logo={globalUtils.fil.logo}
			showMax={true}
			onChange={handleChangeAmountInput} />

		<div style={{ height: "24px" }} />

		<Button
			type={appConfig.buttonType.primary}
			fullWidth
			label={t("summary")}
			onClick={handleSummary}
			disabled={inputAmount.eq(0)} />

		<p />

		<Button
			type={appConfig.buttonType.noBackground}
			fullWidth
			label={t("close")}
			onClick={handleClose} />
	</>

	const summaryView = <>
		<div className="steppedViewCount">{t("withdraw")}</div>

		<div style={{ height: "8px" }} />

		<h2>{t("summary")}</h2>

		<div style={{ height: "24px" }} />

		<div className="modalText">{t("withdrawSummary")}</div>

		<div style={{ height: "24px" }} />

		<div className="values">
			<ValueAndKey
				keyStr={t("withdrawAmount")}
				value={globalUtils.formatBigNumber(inputAmount, appConfig.currency.decimals) + " " + appConfig.currency.symbol}
				rowDirection={true}
				reversed={true}
				fullWidth />

			<ValueAndKey
				keyStr={t("deposited")}
				value={<ValueUpdate
					oldValue={globalUtils.formatBigNumber(totalDeposited, appConfig.currency.decimals) + " " + appConfig.currency.symbol}
					newValue={globalUtils.formatBigNumber(totalDeposited.minus(inputAmount), appConfig.currency.decimals) + " " + appConfig.currency.symbol}
					positive={false} />}
				rowDirection={true}
				reversed={true}
				fullWidth />

			<ValueAndKey
				keyStr={t("stFILMinted")}
				value={<ValueUpdate
					oldValue={globalUtils.formatBigNumber(lendingPool?.balanceOf, lendingPool?.decimals) + " " + lendingPool?.symbol}
					newValue={globalUtils.formatBigNumber(lendingPool?.balanceOf.minus(inputAmount.dividedBy(lendingPool?.exchangeRateCurrent).shiftedBy(lendingPool?.decimals)), lendingPool?.decimals) + " " + lendingPool?.symbol}
					positive={false} />}
				rowDirection={true}
				reversed={true}
				fullWidth />

			<ValueAndKey
				keyStr={t("handlingFees")}
				value="0 FIL"
				rowDirection={true}
				reversed={true}
				fullWidth />

			<ValueAndKey
				keyStr={t("transactionCostestimated")}
				value={gas}
				rowDirection={true}
				reversed={true}
				fullWidth />
		</div>

		<div style={{ height: "24px" }} />

		<Button
			type={appConfig.buttonType.primary}
			fullWidth
			label={t("withdraw")}
			onClick={handleWithdraw} />

		<p />

		<Button
			type={appConfig.buttonType.noBackground}
			fullWidth
			label={t("close")}
			onClick={handleClose} />
	</>

	useEffect(() => {
		const map = [];
		map[keyOfWithdrawViews.index] = step1View;
		map[keyOfWithdrawViews.summary] = summaryView;
		setViews(map);
	}, []);

	return <div className="registerNodeModalLayout">
		{currentView === keyOfWithdrawViews.index && step1View}
		{currentView === keyOfWithdrawViews.summary && summaryView}
	</div>
};