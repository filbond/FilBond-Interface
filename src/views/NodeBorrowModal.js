import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { appConfig } from "../configs/appConfig";
import { appController } from "../libs/appController";
import { locale } from "../libs/locale";
import "./RegisterNodeModal.css";
import { AmountInput } from "../components/AmountInput";
import { globalUtils } from "../libs/globalUtils";
import { ValueAndKey } from "../components/ValueAndKey";
import BigNumber from "bignumber.js";
import { Link } from "../components/Link";
import { lendingPoolCaller } from "../libs/lendingPoolCaller";

const keyOfNodeBorrowViews = {
	step1: 0,
	step2: 1
};

export const NodeBorrowModal = ({
	max = 0,
	lendingPool = null,
	onClose = () => { },
	// chainId = 0,
	node = null
}) => {
	const t = locale.translate;
	const [currentView, setCurrentView] = useState(keyOfNodeBorrowViews.step1);
	const [inputValue, setInputValue] = useState(0);
	const [amount, setAmount] = useState(globalUtils.constants.BIGNUMBER_ZERO);
	// const lendingPoolAddress = appConfig.markets.networks[chainId].lendingPool.address;
	// const [nodeBalance, setNodeBalance] = useState(globalUtils.constants.BIGNUMBER_ZERO);
	const [borrowInterest, setBorrowInterest] = useState(0);

	const handledBorrow = _ => {
		appController.nodeBorrow(
			node.owner.hexAddress,
			null,
			handleClose,
			null,
			amount.toFixed()
		);

		setInputValue(0);
		setAmount(globalUtils.constants.BIGNUMBER_ZERO);
	};

	const handledSummary = () => {
		setCurrentView(keyOfNodeBorrowViews.step2);
	};

	const handleClose = _ => {
		appController.clearModal();
		onClose();
	};

	// const updateGas = async () => {
	// 	const g = await appController.computeTxGas(lendingPoolAddress, lendingPool?.abi, "mint", amount.toFixed());
	// 	if (!isNaN(g)) {
	// 		setGas(g);
	// 	}
	// };

	// useEffect(() => {
	// 	if (!node) return;

	// 	const getNodeBalance = async () => {
	// 		const res = await appController.getNodeBalance(node?.owner.hexAddress);
	// 		setNodeBalance(BigNumber(res));
	// 	};

	// 	getNodeBalance();
	// }, [node]);

	// useEffect(() => {
	// 	debounce.run(updateGas);
	// }, [amount]);

	useEffect(() => {
		if (!lendingPool) return;

		setBorrowInterest(lendingPoolCaller.computeInterest(lendingPool));
	}, [lendingPool]);

	const handleChangeAmount = async val => {
		setInputValue(val);

		const amt = BigNumber(val).shiftedBy(appConfig.currency.decimals);
		setAmount(amt);

		// setExpectedFTokenAmount(amt.dividedBy(lendingPool.exchangeRateCurrent).plus(fTokenBalanceShifted));
	};

	const step1View = <>
		<div>
			<div className="steppedViewCount">{t("borrow")}</div>
			<p />
			<h2>{t("howMuch")}?</h2>
		</div>

		<div style={{ height: "24px" }} />

		<ValueAndKey
			keyStr={t("borrowable")}
			value={globalUtils.formatBigNumber(node?.availableBalance, appConfig.currency.decimals) + " " + appConfig.currency.symbol}
			rowDirection={true}
			reversed={true}
			fullWidth />

		<div style={{ height: "24px" }} />

		<ValueAndKey
			keyStr={t("initialInterest")}
			value={globalUtils.formatNumber(borrowInterest * 100) + "%"}
			rowDirection={true}
			reversed={true}
			fullWidth />

		<div style={{ height: "24px" }} />

		<ValueAndKey
			keyStr={t("poolAvailability")}
			value={globalUtils.formatBigNumber(node.vestingFundSum, appConfig.currency.decimals) + " " + appConfig.currency.symbol}
			rowDirection={true}
			reversed={true}
			fullWidth />

		<div style={{ height: "24px" }} />

		<AmountInput
			name={t("borrowAmount")}
			max={node.availableBalance.shiftedBy(-appConfig.currency.decimals).toNumber()}
			symbol={globalUtils.fil.symbol}
			logo={globalUtils.fil.logo}
			onChange={handleChangeAmount}
			maxTitle={t("borrowable")} />

		<div style={{ height: "24px" }} />

		<Button
			type={appConfig.buttonType.primary}
			fullWidth
			label={t("summary")}
			onClick={handledSummary}
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
			<div className="steppedViewCount">{t("borrow")}</div>
			<p />
			<h2>{t("summary")}</h2>
		</div>

		<div style={{ height: "24px" }} />

		<div className="values">
			<ValueAndKey
				keyStr={t("borrowAmount")}
				value={globalUtils.formatBigNumber(amount, appConfig.currency.decimals) + " " + appConfig.currency.symbol}
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

			<ValueAndKey
				keyStr={t("initialInterest")}
				value={globalUtils.formatNumber(borrowInterest * 100) + "%"}
				rowDirection={true}
				reversed={true}
				fullWidth />
		</div>

		<div style={{ height: "24px" }} />

		<Button
			type={appConfig.buttonType.primary}
			fullWidth
			label={t("borrow")}
			onClick={handledBorrow}
			disabled={inputValue === 0 || inputValue > max} />

		<p />

		<Button
			type={appConfig.buttonType.noBackground}
			fullWidth
			label={t("close")}
			onClick={handleClose} />
	</>

	return <div className="registerNodeModalLayout">
		{currentView === keyOfNodeBorrowViews.step1 && step1View}
		{currentView === keyOfNodeBorrowViews.step2 && step2View}
	</div>
};