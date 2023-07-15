import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { ValueAndKey } from "../components/ValueAndKey";
import { appConfig } from "../configs/appConfig";
import { appController } from "../libs/appController";
import { locale } from "../libs/locale";
import "./Invest.css";
import { DepositModal } from "./DepositModal";
import { WithdrawtModal } from "./WithdrawModal";
import { globalUtils } from "../libs/globalUtils";
import { lendingPoolCaller } from "../libs/lendingPoolCaller";

const Invest = ({
	data = null,
	chainId = 0,
	currencyBalance = globalUtils.constants.BIGNUMBER_ZERO,
	onChange = () => { }
}) => {
	const t = locale.translate;
	const [apr, setApr] = useState(globalUtils.constants.BIGNUMBER_ZERO);
	const [earnings, setEarnings] = useState(globalUtils.constants.BIGNUMBER_ZERO);
	const lendingPool = data?.lendingPool;
	const currency = appConfig.currency;

	useEffect(() => {
		if (!data || chainId === 0) return;

		setApr(lendingPoolCaller.computeAPR(lendingPool, chainId));
		setEarnings(lendingPoolCaller.computeEarnings(lendingPool));
	}, [data, chainId, lendingPool]);

	const handleDeposit = () => {
		appController.showModal(<Modal>
			<DepositModal
				chainId={chainId}
				max={currencyBalance.multipliedBy(appConfig.maxMargin).shiftedBy(-currency.decimals).toNumber()}
				lendingPool={lendingPool}
				onDone={onChange} />
		</Modal>);
	};

	const handleWithdraw = () => {
		appController.showModal(<Modal>
			<WithdrawtModal
				lendingPool={lendingPool}
				onDone={onChange} />
		</Modal>);
	};

	return <div className="investLayout">
		<div className="titleBar">
			<h1>{t("invest")}</h1>

			<div className="labels">
				<ValueAndKey
					keyStr="Current Interest (APR)"
					value={globalUtils.formatBigNumber(apr, currency.decimals) + " " + currency.symbol} />

				<ValueAndKey
					keyStr="Earnings"
					value={globalUtils.formatBigNumber(earnings, currency.decimals) + " " + currency.symbol}
					hightlightValue={true} />
			</div>
		</div>

		<div>
			<Button
				type={appConfig.buttonType.primary}
				onClick={handleDeposit}
				fullWidth>
				{t("depositFIL")}
			</Button>

			<div className="description">{t("walletBalance")}: {globalUtils.formatBigNumber(currencyBalance, currency.decimals) + " " + currency.symbol}</div>
		</div>

		<div className="titleBar">
			<div className="labels">
				<ValueAndKey
					keyStr="deposited"
					value={globalUtils.formatBigNumber(lendingPool?.balanceOfUnderlying, currency.decimals) + " " + currency.symbol}
					alignLeft={true}
					reversed={true} />

				<Button
					type={appConfig.buttonType.secondary}
					onClick={handleWithdraw}>{t("withdrawFIL")}</Button>
			</div>

			<ValueAndKey
				keyStr={t("fTokenMinted", { fToken: lendingPool?.symbol })}
				value={globalUtils.formatBigNumber(lendingPool?.balanceOf, lendingPool?.decimals) + " " + lendingPool?.symbol}
				alignLeft={true}
				alignRight />
		</div>

		<div style={{
			display: "flex",
			gap: "10px",
			flexDirection: "column",
			justifyContent: "flex-start",
			alignItems: "flex-start",
		}}>
			<h2>
				<span>{t("fundPoolDetails")}&nbsp;</span>

				<img
					src="/images/header.png"
					height="18px"
					alt="header" />
			</h2>

			<ValueAndKey
				keyStr={t("loanRequests") + " / " + t("deposits") + " " + t("ratio")}
				value={globalUtils.formatBigNumber(lendingPool?.totalBorrowsCurrent.dividedBy(lendingPool?.totalSupply), 0)}
				rowDirection={true}
				fullWidth={true}
				reversed={true} />

			<ValueAndKey
				keyStr={t("deposits")}
				value={globalUtils.formatBigNumber(lendingPool?.balanceOfUnderlying, currency.decimals) + " " + currency.symbol}
				rowDirection={true}
				fullWidth={true}
				reversed={true} />

			<ValueAndKey
				keyStr={t("loanRequests")}
				value={globalUtils.formatBigNumber(lendingPool?.totalBorrowsCurrent, currency.decimals) + " " + currency.symbol}
				rowDirection={true}
				fullWidth={true}
				reversed={true} />

			<ValueAndKey
				keyStr={t("redeemable") + "(" + t("fundPoolBalance") + ")"}
				value={globalUtils.formatBigNumber(lendingPool?.balanceOfUnderlying, currency.decimals) + " " + currency.symbol}
				rowDirection={true}
				fullWidth={true}
				reversed={true} />

			{/* <ValueAndKey
				keyStr="Total Nodes Registered"
				value="0"
				rowDirection={true}
				fullWidth={true}
				reversed={true} /> */}

			<ValueAndKey
				keyStr={t("onlineFor")}
				value={((globalUtils.constants.NOW - lendingPool?.createTime) / (globalUtils.constants.SECONDS_DAY * 1000)).toFixed(0) + " " + t("days")}
				rowDirection={true}
				fullWidth={true}
				reversed={true} />
		</div>
	</div>
};

export default Invest;