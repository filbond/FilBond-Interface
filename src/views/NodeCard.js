import { RatingLabel } from "../components/RatingLabel";
import { appController } from "../libs/appController";
import { MessageLabel } from "../components/MessageLabel";
import "./NodeCard.css";
import { globalUtils } from "../libs/globalUtils";
import { ValueAndKey } from "../components/ValueAndKey";
import { appConfig } from "../configs/appConfig";
import { locale } from "../libs/locale";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { NodeDepositModal } from "./NodeDepositModal";
import { NodeBorrowModal } from "./NodeBorrowModal";
import { RepayModal } from "./RepayModal";
import { useEffect, useState } from "react";

export const NodeCard = ({
	currencyBalance = globalUtils.constants.BIGNUMBER_ZERO,
	node = null,
	chainId = 0,
	lendingPool = null,
}) => {
	const t = locale.translate;
	const [healthLevel, setHealthLevel] = useState(globalUtils.nodeHealthLevel.healthy);

	useEffect(() => {
		if (!node?.health) return;

		if (node.health < appConfig.nodeHealth.normal) {
			return setHealthLevel(globalUtils.nodeHealthLevel.healthy);
		}

		if (node.health > appConfig.nodeHealth.low) {
			return setHealthLevel(globalUtils.nodeHealthLevel.risk);
		}

		setHealthLevel(globalUtils.nodeHealthLevel.low);
	}, [node.health]);

	const handleCloseDepositModal = () => {
		// 
	};

	const handleBorrow = () => {
		appController.showModal(<Modal>
			<NodeBorrowModal
				max={node?.availableBalance.multipliedBy(appConfig.maxMargin).shiftedBy(-appConfig.currency.decimals).toNumber()}
				chainId={chainId}
				currencyBalance={currencyBalance}
				node={node}
				lendingPool={lendingPool} />
		</Modal>);
	};

	const handleRepay = () => {
		appController.showModal(<Modal>
			<RepayModal
				node={node}
				walletBalance={currencyBalance} />
		</Modal>);
	};

	const handleDeposit = () => {
		appController.showModal(<Modal onClose={handleCloseDepositModal}>
			<NodeDepositModal
				max={currencyBalance.multipliedBy(appConfig.maxMargin).shiftedBy(-appConfig.currency.decimals).toNumber()}
				onClose={handleCloseDepositModal}
				chainId={chainId}
				currencyBalance={currencyBalance}
				node={node} />
		</Modal>);
	};

	const handleManageNode = () => {
		window.location.href = "/node/" + node?.id;
	};

	return <div className="nodeCardLayout">
		<div className="titalBar">
			<div className="leftSide">
				<div className="title">{node?.id}</div>
				{/* <RatingLabel label={appController.getRatingLabelWithValue(node?.rating)} /> */}
			</div>

			{/* {node?.status === 0 && <MessageLabel>
				{Object.keys(globalUtils.nodeStatus)[node?.status]}
			</MessageLabel>} */}
			<div className="healthLabel">
				<span>{t("health")}</span>
				<span>{((node.health || 0) * 100).toFixed(appConfig.defaultFractionDigits)}%</span>
			</div>
		</div>

		<div className="values">
			<ValueAndKey
				value={globalUtils.formatBigNumber(node?.vestingFundSum, appConfig.currency.decimals) + " " + appConfig.currency.symbol}
				keyStr={t("availableLoan")}
				alignLeft />

			<ValueAndKey
				value={globalUtils.formatBigNumber(node?.availableBalance, appConfig.currency.decimals) + " " + appConfig.currency.symbol}
				keyStr={t("borrowable")} />

			<ValueAndKey
				value={globalUtils.formatBigNumber(node?.borrowBalance, appConfig.currency.decimals) + " " + appConfig.currency.symbol}
				keyStr={t("debt")}
				alignRight />
		</div>

		<div className="buttons">
			{healthLevel === globalUtils.nodeHealthLevel.healthy ? <>
				<Button
					type={appConfig.buttonType.secondary}
					label={t("manage")}
					fullWidth
					onClick={handleManageNode} />

				<Button
					type={appConfig.buttonType.primary}
					label={t("borrow")}
					fullWidth
					onClick={handleBorrow} />
			</> : <>
				<Button
					type={appConfig.buttonType.secondary}
					label={t("repay")}
					fullWidth
					onClick={handleRepay} />

				<Button
					type={appConfig.buttonType.primary}
					label={t("deposit")}
					fullWidth
					onClick={handleDeposit} />
			</>}
		</div>

		{healthLevel !== globalUtils.nodeHealthLevel.healthy && <Button
			type={appConfig.buttonType.noBackground}
			label={t("manage")}
			onClick={handleManageNode}
			fullWidth />}
	</div>
};