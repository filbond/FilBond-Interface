import { useEffect, useMemo, useState } from "react";
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
import { Tabs } from "../components/Tabs";
import { Link } from "../components/Link";

const keyOfRepayViews = {
	index: 0,
	summary: 1
};

export const RepayModal = ({
	lendingPool = null,
	node = null,
	walletBalance = globalUtils.constants.BIGNUMBER_ZERO,
	onClose = () => { },
	onRepay = () => { }
}) => {
	const t = locale.translate;
	const [currentView, setCurrentView] = useState(keyOfRepayViews.index);
	const [indexOfRepayWith, setIndexOfRepayWith] = useState(0);
	const [max, setMax] = useState(0);
	const [repayAmount, setRepayAmount] = useState(globalUtils.constants.BIGNUMBER_ZERO);
	const [cTokenBalance, setCTokenBalance] = useState(globalUtils.constants.BIGNUMBER_ZERO);
	const nodeBorrowBalanceShifted = node?.borrowBalance?.shiftedBy(-appConfig.currency.decimals).toNumber() || 0;
	const cTokenBalanceShifted = cTokenBalance.shiftedBy(-lendingPool?.decimals).toNumber();
	const walletBalanceShifted = walletBalance.multipliedBy(appConfig.maxMargin).shiftedBy(-appConfig.currency.decimals).toNumber();
	const repayWithOptions = useMemo(() => [
		{
			id: "repayTab0",
			label: walletBalanceShifted.toFixed(0) + " " + appConfig.currency.symbol,
			subLabel: t("wallet")
		},
		{
			id: "repayTab1",
			label: nodeBorrowBalanceShifted?.toFixed(0) + " " + appConfig.currency.symbol,
			subLabel: t("nodeBalance")
		},
		{
			id: "repayTab2",
			label: cTokenBalanceShifted?.toFixed(0) + " " + lendingPool?.symbol,
			subLabel: appConfig.currencyCToken.symbol
		}
	], [cTokenBalanceShifted, lendingPool?.symbol, nodeBorrowBalanceShifted, t, walletBalanceShifted]);

	useEffect(() => {
		switch (indexOfRepayWith) {
			case 1:
				setMax(nodeBorrowBalanceShifted);
				break;

			case 2:
				setMax(cTokenBalanceShifted);
				break;

			default:
				setMax(walletBalanceShifted);
				break;
		}
	}, [cTokenBalanceShifted, indexOfRepayWith, nodeBorrowBalanceShifted, walletBalanceShifted]);

	useEffect(() => {
		if (!node) return;

		const getCTokenBalance = async () => {
			const res = await appController.getNodeCTokenBalance(node.owner.hexAddress);
			setCTokenBalance(BigNumber(res));
		};

		getCTokenBalance();
	}, [node]);

	const handleSelectRepayWith = idx => {
		setIndexOfRepayWith(idx);
	};

	const handleChangeAmount = val => {
		setRepayAmount(BigNumber(val).shiftedBy(appConfig.currency.decimals));
	};

	const handledSummary = () => {
		setCurrentView(keyOfRepayViews.summary);
	};

	const handleClose = _ => {
		appController.clearModal();
		onClose();
	};

	const handleRepay = () => {
		let func = null;

		switch (indexOfRepayWith) {
			case 0:
				func = appController.nodeRepayWithDeposit
				break;

			case 1:
				func = appController.nodeRepayBorrow;
				break;

			default:
				break;
		}

		if (!func) return;

		func(
			node.owner.hexAddress,
			tx => {
				handleClose();
			},
			data => {
				if (onRepay) onRepay();
			},
			null,
			repayAmount
		);
	};

	const handleGoBack = () => {
		setCurrentView(keyOfRepayViews.index);
	};

	const step1View = <div style={{ width: "100%" }}>
		<div className="steppedViewCount">{t("repayDebt")}</div>

		<div style={{ height: "8px" }} />

		<h2>{t("howMuch")}?</h2>

		<div style={{ height: "24px" }} />

		<div style={{
			display: "flex",
			flexDirection: "row",
			justifyContent: "space-between",
			marginBottom: "24px"
		}}>
			<ValueAndKey
				keyStr={t("borrowed") + " + " + t("interest")}
				value={t("nodeDebt")}
				alignLeft />

			<ValueAndKey
				keyStr={nodeBorrowBalanceShifted.toFixed() + appConfig.currency.symbol + " + " + node.borrowBalance?.multipliedBy(appController.getFeeRate()).shiftedBy(-appConfig.currency.decimals).toFixed() + appConfig.currency.symbol}
				value={node?.borrowBalance?.multipliedBy(appController.getFeeRate() + 1).shiftedBy(-appConfig.currency.decimals).toFixed() + appConfig.currency.symbol}
				alignRight />
		</div>

		<h6>{t("repayWith")}</h6>

		<p />

		<Tabs
			name="repayRadio"
			tabs={repayWithOptions}
			onSelect={handleSelectRepayWith} />

		<div style={{ height: "24px" }} />

		<AmountInput
			name={t("repayAmount")}
			max={max}
			symbol={globalUtils.fil.symbol}
			logo={globalUtils.fil.logo}
			onChange={handleChangeAmount}
			maxTitle={repayWithOptions[indexOfRepayWith].subLabel} />

		<div style={{ height: "24px" }} />

		<Button
			type={appConfig.buttonType.primary}
			fullWidth
			label={t("summary")}
			onClick={handledSummary}
			disabled={repayAmount.eq(0) || repayAmount.gt(walletBalance)} />

		<p />

		<Button
			type={appConfig.buttonType.noBackground}
			fullWidth
			label={t("close")}
			onClick={handleClose} />
	</div>

	const summaryView = <div style={{ width: "100%" }}>
		<div className="steppedViewCount">{t("repayDebt")}</div>

		<div style={{ height: "8px" }} />

		<h2>{t("summary")}</h2>

		<div style={{ height: "24px" }} />

		<div className="values">
			<ValueAndKey
				keyStr={t("repayWith")}
				value={repayWithOptions[indexOfRepayWith].subLabel}
				rowDirection={true}
				reversed={true}
				fullWidth />

			<ValueAndKey
				keyStr={t("repayAmount")}
				value={globalUtils.formatBigNumber(repayAmount, appConfig.currency.decimals) + appConfig.currency.symbol}
				rowDirection={true}
				reversed={true}
				fullWidth />

			<ValueAndKey
				keyStr={t("handlingFee") + "(" + (appController.getFeeRate() * 100).toFixed(0) + "%)"}
				value={globalUtils.formatBigNumber(node?.borrowBalance, appConfig.currency.decimals) + appConfig.currency.symbol}
				rowDirection={true}
				reversed={true}
				fullWidth />

			<ValueAndKey
				keyStr={t("netRepayAmount")}
				value={globalUtils.formatBigNumber(BigNumber.min(node?.borrowBalance, repayAmount), appConfig.currency.decimals) + appConfig.currency.symbol}
				rowDirection={true}
				reversed={true}
				fullWidth />

			<ValueAndKey
				keyStr={t("totalDebt")}
				value={<ValueUpdate
					oldValue={globalUtils.formatBigNumber(node?.borrowBalance, appConfig.currency.decimals)}
					newValue={globalUtils.formatBigNumber(node?.borrowBalance.minus(BigNumber.min(node?.borrowBalance, repayAmount)), appConfig.currency.decimals) + " " + appConfig.currency.symbol}
					positive />}
				rowDirection={true}
				reversed={true}
				fullWidth />

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
			label={t("repayDebt")}
			onClick={handleRepay}
			disabled={repayAmount.eq(0) || repayAmount.gt(walletBalance)} />

		<p />

		<Button
			type={appConfig.buttonType.noBackground}
			fullWidth
			label={t("back")}
			onClick={handleGoBack} />
	</div>

	return <div className="registerNodeModalLayout">
		{currentView === keyOfRepayViews.index && step1View}
		{currentView === keyOfRepayViews.summary && summaryView}
	</div>
};