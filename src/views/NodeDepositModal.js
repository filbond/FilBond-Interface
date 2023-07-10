import { useEffect, useState } from "react";
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
import { Link } from "../components/Link";
import { TxSending } from "./TxSending";
import { TxError } from "./TxError";

const keyOfNodeDepositViews = {
	step1: 0,
	step2: 1,
	done: 2,
	process: 3,
	error: 4
};

export const NodeDepositModal = ({
	max = 0,
	onNodeDeposit = () => { },
	currencyBalance = globalUtils.constants.BIGNUMBER_ZERO,
	node = null
}) => {
	const t = locale.translate;
	const [currentView, setCurrentView] = useState(keyOfNodeDepositViews.step1);
	const [inputValue, setInputValue] = useState(0);
	const [amount, setAmount] = useState(globalUtils.constants.BIGNUMBER_ZERO);
	const [nodeBalance, setNodeBalance] = useState(globalUtils.constants.BIGNUMBER_ZERO);
	// const [txHash, setTxHash] = useState("");
	const [errMessage, setErrMessage] = useState("");

	const init = () => {
		setInputValue(0);
		setAmount(globalUtils.constants.BIGNUMBER_ZERO);
		// setGas(0);
		setNodeBalance(globalUtils.constants.BIGNUMBER_ZERO);
		// setTxHash("");
		setErrMessage("");
	};

	const handleDeposit = _ => {
		setCurrentView(keyOfNodeDepositViews.process);

		appController.nodeDeposit(
			node.owner.hexAddress,
			amount.toFixed(),
			null,
			() => setCurrentView(keyOfNodeDepositViews.done),
			err => {
				setErrMessage(err?.message);
				setCurrentView(keyOfNodeDepositViews.error);
			}
		);
	};

	const handleGoBack = () => {
		setCurrentView(keyOfNodeDepositViews.step1);
	};

	const handleSummary = () => {
		setCurrentView(keyOfNodeDepositViews.step2);
	};

	const handleClose = _ => {
		appController.clearModal();
		onNodeDeposit();
	};

	// const updateGas = async () => {
	// 	const g = await appController.computeTxGas(lendingPoolAddress, lendingPool?.abi, "mint", amount.toFixed());
	// 	if (!isNaN(g)) {
	// 		setGas(g);
	// 	}
	// };

	useEffect(() => {
		if (!node) return;

		const getNodeBalance = async () => {
			const res = await appController.getNodeBalance(node?.owner.hexAddress);
			setNodeBalance(BigNumber(res));
		};

		getNodeBalance();
	}, [node]);

	// useEffect(() => {
	// 	debounce.run(updateGas);
	// }, [amount]);

	const handleChangeAmount = async val => {
		setInputValue(val);

		const amt = BigNumber(val).shiftedBy(appConfig.currency.decimals);
		setAmount(amt);

		// setExpectedFTokenAmount(amt.dividedBy(lendingPool.exchangeRateCurrent).plus(fTokenBalanceShifted));
	};

	const step1View = <>
		<div>
			<div className="steppedViewCount">{t("deposit")}&nbsp;1/2</div>
			<p />
			<h2>{t("howMuch")}?</h2>
		</div>

		<div style={{ height: "24px" }} />

		<ValueAndKey
			keyStr={t("walletBalance")}
			value={globalUtils.formatBigNumber(currencyBalance, appConfig.currency.decimals) + " " + appConfig.currency.symbol}
			rowDirection={true}
			reversed={true}
			hightlightKey
			fullWidth />

		<div style={{ height: "24px" }} />

		<AmountInput
			name={t("depositAmount")}
			max={max}
			symbol={globalUtils.fil.symbol}
			logo={globalUtils.fil.logo}
			onChange={handleChangeAmount} />

		<div style={{ height: "24px" }} />

		<Button
			type={appConfig.buttonType.primary}
			fullWidth
			label={t("summary")}
			onClick={handleSummary}
			disabled={inputValue === 0 || inputValue > max} />

		<p />

		<Button
			type={appConfig.buttonType.noBackground}
			fullWidth
			label={t("close")}
			onClick={handleClose} />
	</>

	const step2View = <>
		<div>
			<div className="steppedViewCount">{t("deposit")}&nbsp;2/2</div>
			<p />
			<h2>{t("checkDetails")}</h2>
		</div>

		<div style={{ height: "24px" }} />

		<div className="values">
			<ValueAndKey
				keyStr={t("deposited")}
				value={globalUtils.formatBigNumber(amount, appConfig.currency.decimals) + " " + appConfig.currency.symbol}
				rowDirection={true}
				reversed={true}
				fullWidth />

			<ValueAndKey
				keyStr={t("nodeBalance")}
				value={<ValueUpdate
					oldValue={globalUtils.formatBigNumber(nodeBalance, appConfig.currency.decimals) + " " + appConfig.currency.symbol}
					newValue={globalUtils.formatBigNumber(nodeBalance.plus(amount), appConfig.currency.decimals) + " " + appConfig.currency.symbol}
					positive={true} />}
				rowDirection={true}
				reversed={true}
				fullWidth />

			{/* <ValueAndKey
				keyStr={t("handlingFees")}
				value="0 FIL"
				rowDirection={true}
				reversed={true}
				fullWidth /> */}

			{/* <ValueAndKey
				keyStr={t("transactionCostestimated")}
				value={String(gas)}
				rowDirection={true}
				reversed={true}
				fullWidth /> */}

			<ValueAndKey
				keyStr={t("nodeId")}
				value={<Link
					url={appController.getNetworkConfig().blockExplorerUrls[0] + appConfig.blockExplorerUrlSegements.address + node?.id}
					openNewWindow
					primary>
					{node?.id}
					<img
						src="/images/link1.png"
						width="18px"
						alt="link1" />
				</Link>}
				rowDirection={true}
				reversed={true}
				fullWidth />
		</div>

		<div style={{ height: "24px" }} />

		<Button
			type={appConfig.buttonType.primary}
			fullWidth
			label={t("depositFIL")}
			onClick={handleDeposit}
			disabled={inputValue === 0 || inputValue > max} />

		<p />

		<Button
			type={appConfig.buttonType.noBackground}
			fullWidth
			label={t("back")}
			onClick={handleGoBack} />
	</>

	const step3View = <>
		<div>
			<div className="steppedViewCount">{t("success")}</div>
			<p />
			<h2>{t("depositSuccessful")}</h2>
		</div>

		<div style={{ height: "24px" }} />

		<div className="values">
			<ValueAndKey
				keyStr={t("deposited")}
				value={globalUtils.formatBigNumber(amount.plus(nodeBalance), appConfig.currency.decimals) + " " + appConfig.currency.symbol}
				rowDirection={true}
				reversed={true}
				fullWidth />

			<ValueAndKey
				keyStr={t("nodeBalance")}
				value={<ValueUpdate
					oldValue={globalUtils.formatBigNumber(nodeBalance, appConfig.currency.decimals) + " " + appConfig.currency.symbol}
					newValue={globalUtils.formatBigNumber(nodeBalance.plus(amount), appConfig.currency.decimals) + " " + appConfig.currency.symbol}
					positive={true} />}
				rowDirection={true}
				reversed={true}
				fullWidth />

			{/* <ValueAndKey
				keyStr={t("handlingFees")}
				value="0 FIL"
				rowDirection={true}
				reversed={true}
				fullWidth /> */}

			{/* <ValueAndKey
				keyStr={t("transactionCostestimated")}
				value={String(gas)}
				rowDirection={true}
				reversed={true}
				fullWidth /> */}

			<ValueAndKey
				keyStr={t("nodeId")}
				value={<Link
					url={appController.getNetworkConfig().blockExplorerUrls[0] + appConfig.blockExplorerUrlSegements.address + node?.id}
					openNewWindow
					primary>
					{node?.id}
					<img
						src="/images/link1.png"
						width="18px"
						alt="link1" />
				</Link>}
				rowDirection={true}
				reversed={true}
				fullWidth />
		</div>

		<div style={{ height: "24px" }} />

		<Button
			type={appConfig.buttonType.primary}
			fullWidth
			label={t("manageNode")}
			onClick={handleClose} />
	</>

	const handleCancel = () => {
		init();
		setCurrentView(keyOfNodeDepositViews.index);
	};

	return <div className="registerNodeModalLayout">
		{currentView === keyOfNodeDepositViews.step1 && step1View}

		{currentView === keyOfNodeDepositViews.step2 && step2View}

		{currentView === keyOfNodeDepositViews.done && step3View}

		{currentView === keyOfNodeDepositViews.process && <TxSending />}

		{currentView === keyOfNodeDepositViews.error && <TxError
			text={errMessage}
			onCancel={handleCancel} />}
	</div>
};