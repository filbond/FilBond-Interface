import "./NodeDetails.css";
import { locale } from "../libs/locale";
import { Button } from "../components/Button";
import { ValueAndKey } from "../components/ValueAndKey";
import { appConfig } from "../configs/appConfig";
import { useParams } from "react-router-dom";
import { appController } from "../libs/appController";
import { useCallback, useEffect, useState } from "react";
import { Tooltip } from "../components/Tooltip";
import { globalUtils } from "../libs/globalUtils";
import { Modal } from "../components/Modal";
import { UnregisterNodeModal } from "./UnregisterNodeModal";
import { NodeBorrowModal } from "./NodeBorrowModal";
import { RepayModal } from "./RepayModal";
import { NodeDepositModal } from "./NodeDepositModal";
import { NodeWithdrawModal } from "./NodeWithdrawModal";
import BigNumber from "bignumber.js";
import { taskManager } from "../libs/taskManager";

const ProgressBar = require('progressbar.js')

let theProgressCircle = null;

export const NodeDetails = ({
	allData = null,
	chainId = 0,
	currencyBalance = globalUtils.constants.BIGNUMBER_ZERO,
	lendingPool = null
}) => {
	const t = locale.translate;
	const { id } = useParams();
	const [node, setNode] = useState(null);
	const [txs, setTxs] = useState([]);
	const roleKeys = Object.keys(globalUtils.nodeRole);

	const init = () => {
		setNode(null);
		setTxs([]);
	};

	const handleGoBack = _ => {
		window.history.back();
	}

	useEffect(() => {
		if (theProgressCircle) {
			theProgressCircle.stop();
			theProgressCircle.destroy();
			document.getElementById("progressCircle").removeChild(theProgressCircle);
			theProgressCircle = null;
		}

		theProgressCircle = new ProgressBar.Circle("#progressCircle", {
			color: "#d7befd",
			strokeWidth: 10,
			trailColor: '#4C4577',
			trailWidth: 10,
			text: {
				style: {
					color: '#F7F6F9',
					position: 'absolute',
					left: '50%',
					top: '50%',
					padding: 0,
					margin: 0,
					transform: {
						prefix: true,
						value: 'translate(-50%, -50%)'
					}
				}
			},
			fill: 'rgba(0, 0, 0, 0)',
			from: { color: '#eee' },
			to: { color: '#000' },
			step: function (state, circle, attachment) {
				circle.path.setAttribute('stroke', state.color);
			},
			warnings: false
		});
	}, []);

	const getNode = useCallback(async () => {
		init();

		const res = await appController.getNodeById(id);
		setNode(res);
	}, [id]);

	const updateNodeRoles = useCallback(async node => {
		if (!node.roles || node.roles?.length === 0) {
			node.roles = [{
				role: globalUtils.nodeRole.owner,
				id: node.owner.idAddress,
				hexAddress: node.owner.hexAddress
			}];
		}

		if (node.roles?.length === 1) {
			const roleRes = await appController.getMinerOwnerWithId(id, true);

			node.roles.push({
				role: globalUtils.nodeRole.worker,
				id: roleRes.worker
			});

			node.roles.push({
				role: globalUtils.nodeRole.beneficiary,
				id: roleRes.beneficiary
			});

			node.sectorSize = roleRes.sectorSize;
		}
	}, [id]);

	const updateAll = async () => {
		await getNode();
	};

	useEffect(() => {
		if (!id || !allData || Boolean(node)) return;

		getNode();
	}, [allData, getNode, id, node]);

	const updateNodeBalance = async nodeArg => {
		const res = await appController.getNodeBalance(nodeArg.owner.hexAddress);
		nodeArg.nodeBalance = BigNumber(res);
	};

	const updateCircleProgress = useCallback(nodeArg => {
		// const val = nodeArg.borrowBalance.dividedBy(nodeArg.availableBalance).toNumber();
		const val = nodeArg.borrowBalance.dividedBy(lendingPool?.getCash).toNumber();
		theProgressCircle.set(val);
		theProgressCircle.setText((val * 100).toFixed(0) + "%");
	}, [lendingPool?.getCash]);

	const updateTxs = async nodeArg => {
		const res = await appController.getTxsWithNode(nodeArg);
		setTxs(res);
	};

	const updateNodeHealth = useCallback(async nodeArg => {
		const res = await appController.getNodeHealth(id);
		nodeArg.health = res?.health;
		nodeArg.qualityAdjPower = res?.qualityAdjPower;
		nodeArg.successRate = res?.successRate;
	}, [id]);

	useEffect(() => {
		if (!node) return;

		updateNodeBalance(node);
		updateCircleProgress(node);
		updateTxs(node);
		updateNodeRoles(node);
		updateNodeHealth(node);
	}, [node, updateCircleProgress, updateNodeHealth, updateNodeRoles]);

	const handleReloadTxs = () => {
		// 
	};

	const handleUnregisterDone = nodeId => {
		appController.removeNode(nodeId);
	};

	const handleUnregisterNode = () => {
		appController.showModal(<Modal>
			<UnregisterNodeModal
				node={node}
				onUnregisterNode={handleUnregisterDone} />
		</Modal>);
	};

	const handleBorrow = () => {
		appController.showModal(<Modal>
			<NodeBorrowModal
				max={node?.availableBalance.multipliedBy(appConfig.maxMargin).shiftedBy(-appConfig.currency.decimals).toNumber()}
				chainId={chainId}
				currencyBalance={currencyBalance}
				node={node}
				lendingPool={lendingPool}
				onBorrow={updateAll} />
		</Modal>);
	};

	const handleRepay = () => {
		appController.showModal(<Modal>
			<RepayModal
				node={node}
				walletBalance={currencyBalance}
				lendingPool={lendingPool}
				chainId={chainId}
				onRepay={updateAll} />
		</Modal>);
	};

	const handleNodeDeposit = () => {
		appController.showModal(<Modal>
			<NodeDepositModal
				max={currencyBalance.multipliedBy(appConfig.maxMargin).shiftedBy(-appConfig.currency.decimals).toNumber()}
				chainId={chainId}
				currencyBalance={currencyBalance}
				node={node}
				onNodeDeposit={updateAll} />
		</Modal>);
	};

	const handleWithdraw = () => {
		appController.showModal(<Modal>
			<NodeWithdrawModal
				node={node}
				onDone={updateAll} />
		</Modal>);
	};

	return <div className="bondDetailsLayout">
		<Button
			type={appConfig.buttonType.small}
			onClick={handleGoBack}>
			<img
				src="/images/back.png"
				width="7px"
				alt="go back" />

			<span>&nbsp;&nbsp;{t("back")}</span>
		</Button>

		<h5>{t("manageNode")}</h5>

		<div style={{
			display: "flex",
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			width: "100%"
		}}>
			<h1>{id}</h1>

			<div style={{
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
				gap: "17px"
			}}>
				<ValueAndKey
					keyStr={t("availableLoan")}
					value={globalUtils.formatBigNumber(node?.vestingFundSum, appConfig.currency.decimals) + " " + appConfig.currency.symbol}
					alignLeft={true}
					icon="/images/debt.png" />

				<ValueAndKey
					keyStr={t("health")}
					value={((node?.health || 0) * 100).toFixed(appConfig.defaultFractionDigits) + "%"}
					icon="/images/loan.png"
					alignRight />
			</div>
		</div>

		<div className="scorePanel">
			<div className="scoreBox">
				<ValueAndKey
					keyStr={<>
						{t("borrowable")}
						<Tooltip />
					</>}
					// value={globalUtils.formatBigNumber(node?.availableBalance, appConfig.currency.decimals) + " " + appConfig.currency.symbol}
					value={globalUtils.formatBigNumber(lendingPool?.getCash, appConfig.currency.decimals) + " " + appConfig.currency.symbol}
					alignLeft={true}
					reversed />

				<Button
					type={appConfig.buttonType.primary}
					onClick={handleBorrow}
					padding="10px 12px"
					fontSize="16px"
					disabled={lendingPool?.getCash.eq(0)}>
					<img
						src="/images/borrow_dark.png"
						width="24px"
						alt="borrow" />

					{t("borrow")}
				</Button>

				<div className="divider" />

				<ValueAndKey
					keyStr={<>
						{t("debt")}
						<Tooltip />
					</>}
					value={globalUtils.formatBigNumber(node?.borrowBalance, appConfig.currency.decimals) + " " + appConfig.currency.symbol}
					alignLeft={true}
					reversed />

				<Button
					type={appConfig.buttonType.default}
					onClick={handleRepay}
					padding="10px 12px"
					disabled={node?.borrowBalance.eq(0)}>
					<img
						src="/images/repay.png"
						width="24px"
						alt="repay" />

					{t("repay")}
				</Button>

				<div className="divider" />

				<div className="veticalScore">
					<div id="progressCircle" />
					<div className="key">{t("borrowed")}</div>
				</div>
			</div>

			<div className="scoreBox">
				<ValueAndKey
					keyStr={t("nodeBalance")}
					// value={globalUtils.formatBigNumber(node?.borrowBalance, appConfig.currency.decimals) + " " + appConfig.currency.symbol}
					value={globalUtils.formatBigNumber(node?.nodeBalance, appConfig.currency.decimals) + " " + appConfig.currency.symbol}
					alignLeft={true}
					reversed />

				<Button
					type={appConfig.buttonType.default}
					onClick={handleNodeDeposit}
					padding="10px 12px"
					disabled={currencyBalance.eq(0)}>
					<img
						src="/images/deposit.png"
						width="24px"
						alt="deposit" />

					{t("deposit")}
				</Button>

				<Button
					type={appConfig.buttonType.default}
					onClick={handleWithdraw}
					padding="10px 12px"
					disabled={node?.nodeBalance.eq(0)}>
					<img
						src="/images/withdraw.png"
						width="24px"
						alt="withdraw" />

					{t("withdraw")}
				</Button>
			</div>
		</div>

		<div className="bondDetailsContent">
			<div className="column">
				{txs.length > 0 && <div className="section">
					<div className="titleLine">
						<h3>
							<span>{t("latestTransactions")}&nbsp;</span>

							<img
								className="elementAsButton"
								src="/images/reload.png"
								height="18px"
								alt="reload"
								onClick={handleReloadTxs} />
						</h3>

						{txs.length > 5 && <Button
							type={appConfig.buttonType.small}
							label={t("viewAll")} />}
					</div>
				</div>}

				<div className="section">
					<div className="titleLine">
						<h3>
							<span>{t("addresses")}&nbsp;</span>

							<img
								src="/images/contacts.png"
								height="18px"
								alt="addresses" />
						</h3>

						<div className="sideBySide">
							{/* <Button
								type={appConfig.buttonType.small}
								label={t("changeWorker")} />

							<Button
								type={appConfig.buttonType.small}
								label={t("changeBeneficiary")} /> */}
						</div>
					</div>

					<div className="addressesContent">
						{node?.roles?.map(role => {
							if (role.hexAddress) {
								taskManager.run(async () => {
									const res = await appController.getCurrencyBalance(role.hexAddress);
									role.balance = BigNumber(res);
								});
							} else {
								taskManager.run(async () => {
									const res = await appController.getBalanceWithId(role.id);
									if (res) {
										role.balance = BigNumber(res);
									}
								});
							}

							return <div
								className="addressesItem"
								key={role.role + role.id}>
								{role.balance && <div className="balanceLabel">{globalUtils.formatBigNumber(role.balance, appConfig.currency.decimals) + " " + appConfig.currency.symbol}</div>}

								<div className="roleLabel">{roleKeys[role.role]}</div>

								<div className="idLabel">{role.id}</div>
							</div>
						})}
					</div>
				</div>

				<div className="section">
					<h3>{t("otherOptions")}</h3>

					<Button
						type={appConfig.buttonType.small}
						label={t("unregisterNode")}
						onClick={handleUnregisterNode} />
				</div>
			</div>

			<div className="column">
				<div className="section">
					<h3>
						<span>{t("nodeDetails")}&nbsp;</span>

						<img
							src="/images/details.png"
							height="18px"
							alt="details" />
					</h3>

					<div className="values">
						{/* <ValueAndKey
							keyStr={t("ranking")}
							value="4"
							rowDirection
							reversed
							fullWidth /> */}

						<ValueAndKey
							keyStr={t("adjustedPower")}
							value={(node?.qualityAdjPower ? (node?.qualityAdjPower / Math.pow(globalUtils.constants.BYTE_SCALE, 4)).toFixed(2) : "0") + " " + appConfig.powerUnit}
							rowDirection
							reversed
							fullWidth />

						<ValueAndKey
							keyStr={t("successRate")}
							value={(node?.successRate ? (node?.successRate * 100).toFixed(2) : "0") + "%"}
							rowDirection
							reversed
							fullWidth />

						<ValueAndKey
							keyStr={t("sectorSize")}
							value={(node?.sectorSize ? (node?.sectorSize / Math.pow(globalUtils.constants.BYTE_SCALE, 3)).toFixed(1) : "0") + " " + appConfig.sectorSizeUnit}
							rowDirection
							reversed
							fullWidth />

						<ValueAndKey
							keyStr={t("lockedRewards")}
							value={globalUtils.formatBigNumber(node?.vestingFundSum, appConfig.currency.decimals) + " " + appConfig.currency.symbol}
							rowDirection
							reversed
							fullWidth />

						{/* <ValueAndKey
							keyStr={t("onlineFor")}
							value="23 GiB"
							rowDirection
							reversed
							fullWidth /> */}

						{/* <ValueAndKey
							keyStr={t("address")}
							value="0xf86...520"
							rowDirection
							reversed
							fullWidth /> */}
					</div>
				</div>
			</div>
		</div>
	</div>
};