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
import { Link } from "../components/Link";

const keyOfNodeWithdrawViews = {
	step1: 0,
	step2: 1,
	step3: 2
};

export const NodeWithdrawModal = ({
	onClose = () => { },
	node = null
}) => {
	const t = locale.translate;
	const [currentView, setCurrentView] = useState(keyOfNodeWithdrawViews.step1);
	const [inputValue, setInputValue] = useState(0);
	const [amount, setAmount] = useState(globalUtils.constants.BIGNUMBER_ZERO);
	const nodeBalance = node?.nodeBalance || globalUtils.constants.BIGNUMBER_ZERO;
	const max = nodeBalance.shiftedBy(-appConfig.currency.decimals).toNumber();

	const handleWithdraw = () => {
		appController.withdraw(
			node.owner.hexAddress,
			null,
			data => {
				setCurrentView(keyOfNodeWithdrawViews.step3);
			},
			null,
			amount.toFixed()
		);
	};

	const handleGoBack = () => {
		setCurrentView(keyOfNodeWithdrawViews.step1);
	};

	const handleSummary = () => {
		setCurrentView(keyOfNodeWithdrawViews.step2);
	};

	const handleClose = _ => {
		appController.clearModal();
		onClose();
	};

	const handleChangeAmount = async val => {
		setInputValue(val);

		const amt = BigNumber(val).shiftedBy(appConfig.currency.decimals);
		setAmount(amt);

		// setExpectedFTokenAmount(amt.dividedBy(lendingPool.exchangeRateCurrent).plus(fTokenBalanceShifted));
	};

	const step1View = <>
		<div>
			<div className="steppedViewCount">{t("withdraw")}&nbsp;1/2</div>
			<p />
			<h2>{t("howMuch")}?</h2>
		</div>

		<div style={{ height: "24px" }} />

		<ValueAndKey
			keyStr={t("nodeBalance")}
			value={globalUtils.formatBigNumber(nodeBalance, appConfig.currency.decimals) + " " + appConfig.currency.symbol}
			rowDirection={true}
			reversed={true}
			hightlightKey
			fullWidth />

		<div style={{ height: "24px" }} />

		<AmountInput
			name={t("withdrawAmount")}
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
			<div className="steppedViewCount">{t("withdraw")}&nbsp;2/2</div>
			<p />
			<h2>{t("checkDetails")}</h2>
		</div>

		<div style={{ height: "24px" }} />

		<div className="values">
			<ValueAndKey
				keyStr={t("withdrawAmount")}
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
			label={t("withdrawFIL")}
			onClick={handleWithdraw}
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
			<h2>{t("withdrawalSuccessful")}!</h2>
		</div>

		<div style={{ height: "24px" }} />

		<div className="values">
			<ValueAndKey
				keyStr={t("withdrawAmount")}
				value={globalUtils.formatBigNumber(amount, appConfig.currency.decimals) + " " + appConfig.currency.symbol}
				rowDirection={true}
				reversed={true}
				fullWidth />

			<ValueAndKey
				keyStr={t("nodeBalance")}
				value={<ValueUpdate
					oldValue={globalUtils.formatBigNumber(nodeBalance, appConfig.currency.decimals) + " " + appConfig.currency.symbol}
					newValue={globalUtils.formatBigNumber(nodeBalance.minus(amount), appConfig.currency.decimals) + " " + appConfig.currency.symbol}
					positive={true} />}
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
			label={t("manageNode")}
			onClick={handleClose} />
	</>

	return <div className="registerNodeModalLayout">
		{currentView === keyOfNodeWithdrawViews.step1 && step1View}
		{currentView === keyOfNodeWithdrawViews.step2 && step2View}
		{currentView === keyOfNodeWithdrawViews.step3 && step3View}
	</div>
};