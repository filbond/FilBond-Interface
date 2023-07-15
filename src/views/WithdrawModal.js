import { useState } from "react";
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
import { TxSending } from "./TxSending";
import { TxDone } from "./TxDone";
import { TxError } from "./TxError";

const keyOfWithdrawViews = {
	index: 0,
	summary: 1,
	process: 2,
	done: 3,
	error: 4
};

export const WithdrawtModal = ({
	lendingPool = null,
	onClose = () => { },
	onDone = () => { }
}) => {
	const t = locale.translate;
	const [currentView, setCurrentView] = useState(keyOfWithdrawViews.index);
	const totalDeposited = lendingPool?.balanceOfUnderlying.plus(lendingPool?.earnings);
	const max = totalDeposited.shiftedBy(-appConfig.currency.decimals).toNumber();
	const [inputAmount, setInputAmount] = useState(globalUtils.constants.BIGNUMBER_ZERO);
	const [gas, setGas] = useState(0);
	const [txHash, setTxHash] = useState("");
	const [errMessage, setErrMessage] = useState("");

	const init = () => {
		setGas(0);
		setTxHash("");
		setErrMessage("");
	};

	const handleSummary = _ => {
		setCurrentView(keyOfWithdrawViews.summary);
	};

	const handleClose = _ => {
		appController.clearModal();
		onClose();
	};

	const handleWithdraw = () => {
		setCurrentView(keyOfWithdrawViews.process);

		appController.withdraw(
			lendingPool.address,
			tx => setTxHash(tx),
			() => setCurrentView(keyOfWithdrawViews.done),
			err => {
				setErrMessage(err?.message);
				setCurrentView(keyOfWithdrawViews.error);
			},
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
		setInputAmount(BigNumber(val).shiftedBy(appConfig.currency.decimals));

		debounce.run(updateGas);
	};

	const handleDone = () => {
		appController.clearModal();
		onDone();
	};

	const handleCancel = () => {
		init();
		setCurrentView(keyOfWithdrawViews.index);
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

	return <div className="registerNodeModalLayout">
		{currentView === keyOfWithdrawViews.index && step1View}

		{currentView === keyOfWithdrawViews.summary && summaryView}

		{currentView === keyOfWithdrawViews.process && <TxSending />}

		{currentView === keyOfWithdrawViews.done && <TxDone
			txHash={txHash}
			onDone={handleDone} />}

		{currentView === keyOfWithdrawViews.error && <TxError
			text={errMessage}
			onCancel={handleCancel} />}
	</div>
};