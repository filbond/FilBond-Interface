import { useCallback, useEffect, useState } from "react";
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

const keyOfDepositViews = {
	index: 0,
	process: 1,
	done: 2,
	error: 3
};

export const DepositModal = ({
	max = 0,
	lendingPool = null,
	onClose = () => { },
	chainId = 0,
	onDone = () => { }
}) => {
	const t = locale.translate;
	const [currentView, setCurrentView] = useState(keyOfDepositViews.index);
	const [inputValue, setInputValue] = useState(0);
	const [amount, setAmount] = useState(globalUtils.constants.BIGNUMBER_ZERO);
	const [gas, setGas] = useState(0);
	const fToken = lendingPool;
	const fTokenBalanceShifted = lendingPool.balanceOf.shiftedBy(-fToken.decimals);
	const lendingPoolAddress = appConfig.markets.networks[chainId].lendingPool.address;
	const [expectedFTokenAmount, setExpectedFTokenAmount] = useState(fTokenBalanceShifted);
	const [txHash, setTxHash] = useState("");
	const [errMessage, setErrMessage] = useState("");

	const init = () => {
		setInputValue(0);
		setAmount(globalUtils.constants.BIGNUMBER_ZERO);
		setGas(0);
		setTxHash("");
		setErrMessage("");
	}

	const handledDeposit = _ => {
		setCurrentView(keyOfDepositViews.process);

		appController.deposit(
			lendingPoolAddress,
			tx => setTxHash(tx),
			() => setCurrentView(keyOfDepositViews.done),
			err => {
				setErrMessage(err?.message);
				setCurrentView(keyOfDepositViews.error);
			},
			amount.toFixed()
		);
	};

	const handleClose = _ => {
		appController.clearModal();
		onClose();
	};

	const handleDone = () => {
		appController.clearModal();
		onDone();
	};

	const handleCancel = () => {
		init();
		setCurrentView(keyOfDepositViews.index);
	};

	const updateGas = useCallback(async () => {
		const g = await appController.computeTxGas(lendingPoolAddress, lendingPool?.abi, "mint", amount.toFixed());
		if (!isNaN(g)) {
			setGas(g);
		}
	}, [amount, lendingPool?.abi, lendingPoolAddress]);

	useEffect(() => {
		debounce.run(updateGas);
	}, [amount, updateGas]);

	const handleChangeAmount = async val => {
		setInputValue(val);

		const amt = BigNumber(val).shiftedBy(appConfig.currency.decimals);
		setAmount(amt);

		setExpectedFTokenAmount(amt.dividedBy(lendingPool.exchangeRateCurrent).plus(fTokenBalanceShifted));
	};

	const step1View = <>
		<div className="steppedViewCount">{t("deposit")}</div>

		<div style={{ height: "8px" }} />

		<h2>{t("howMuch")}?</h2>

		<div style={{ height: "24px" }} />

		<AmountInput
			name={t("depositAmount")}
			max={max}
			symbol={globalUtils.fil.symbol}
			logo={globalUtils.fil.logo}
			onChange={handleChangeAmount} />

		<div style={{ height: "24px" }} />

		<div className="values">
			<ValueAndKey
				keyStr={t("deposited")}
				rowDirection={true}
				reversed={true}
				fullWidth>
				<ValueUpdate
					oldValue={globalUtils.formatBigNumber(lendingPool.balanceOfUnderlying, appConfig.currency.decimals) + " " + appConfig.currency.symbol}
					newValue={globalUtils.formatBigNumber(lendingPool.balanceOfUnderlying.plus(amount), appConfig.currency.decimals) + " " + appConfig.currency.symbol}
					positive={true} />
			</ValueAndKey>

			<ValueAndKey
				keyStr={t("stFILMinted")}
				value={<ValueUpdate
					oldValue={globalUtils.formatBigNumber(lendingPool.balanceOf, fToken.decimals) + " " + fToken.symbol}
					newValue={globalUtils.formatBigNumber(expectedFTokenAmount, 0) + " " + fToken.symbol}
					positive={true} />}
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
				value={String(gas)}
				rowDirection={true}
				reversed={true}
				fullWidth />
		</div>

		<div style={{ height: "24px" }} />

		<Button
			type={appConfig.buttonType.primary}
			fullWidth
			label={t("deposit")}
			onClick={handledDeposit}
			disabled={inputValue === 0 || inputValue > max} />

		<p />

		<Button
			type={appConfig.buttonType.noBackground}
			fullWidth
			label={t("close")}
			onClick={handleClose} />
	</>

	return <div className="registerNodeModalLayout">
		{currentView === keyOfDepositViews.index && step1View}

		{currentView === keyOfDepositViews.process && <TxSending />}

		{currentView === keyOfDepositViews.done && <TxDone
			txHash={txHash}
			onDone={handleDone} />}

		{currentView === keyOfDepositViews.error && <TxError
			text={errMessage}
			onCancel={handleCancel} />}
	</div>
};