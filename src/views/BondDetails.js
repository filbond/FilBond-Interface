import "./BondDetails.css";
import { locale } from "../libs/locale";
import { Button } from "../components/Button";
import { RatingLabel } from "../components/RatingLabel";
import { ValueAndKey } from "../components/ValueAndKey";
import { appConfig } from "../configs/appConfig";
import { redirect, useParams } from "react-router-dom";
import { appController } from "../libs/appController";
import { globalUtils } from "../libs/globalUtils";
import { Link } from "../components/Link";
import { NodeItem } from "./NodeItem";
import BigNumber from "bignumber.js";

export const BondDetails = ({ allData = null }) => {
	const t = locale.translate;
	const { title } = useParams();
	const bond = allData?.find(item => item.title === title);

	const handleGoBack = _ => {
		window.history.back();
	}

	return <div className="bondDetailsLayout">
		<Button
			type={appConfig.buttonType.small}
			onClick={handleGoBack}>❮&nbsp;{t("browseBonds")}</Button>

		{bond && <div className="bondDetailsContent">
			<div className="column">
				<h5>{t("bondDetails")}</h5>

				<div className="titleLine">
					<div className="side">
						<h2>{bond.title}</h2>
						<RatingLabel label={appController.getRatingLabelWithValue(bond.rating)} />
					</div>

					<div className="side">
						<ValueAndKey
							value={(bond.interestRate * 100).toFixed(appConfig.defaultFractionDigits) + "%"}
							keyStr={t("currentInterest")} />

						<ValueAndKey
							value={globalUtils.formatBigNumber(bond.bondsForSale, appConfig.currency.decimals) + " " + appConfig.currency.symbol}
							keyStr={t("bondsForSale")} />
					</div>
				</div>

				<Link url={bond.siteUrl}>
					<span><img src={bond.logo} width="16px" alt="logo" />&nbsp;</span>
					{bond.site}
					<span>&nbsp;&nbsp;<img src="/images/link.png" width="8px" alt="link" /></span>
				</Link>

				<p>&nbsp;</p>

				<Button
					type={appConfig.buttonType.important}
					label={t("buyBonds")}
					fullWidth />

				<p>&nbsp;</p>

				<p />
				<h5>{t("nodes")}</h5>
				<p />

				<div className="nodes">
					{bond.nodes.map(node => {
						return <NodeItem
							key={node.title}
							node={node} />
					})}
				</div>
			</div>

			<div className="column">
				<div>
					<h5>{t("overview")}</h5>

					<div className="chart"></div>

					<div>
						<div className="value">
							<div>
								<span className="orange">◼︎</span>
								<span className="key">&nbsp;{t("bondsIssued")}</span>
							</div>

							<div className="val">
								{globalUtils.formatBigNumber(bond.bondsIssued, appConfig.currency.decimals) + " " + appConfig.currency.symbol}
							</div>
						</div>

						<div className="value">
							<div>
								<span className="violet">◼︎</span>
								<span className="key">&nbsp;{t("bondsSold")}</span>
							</div>

							<div className="val">
								{globalUtils.formatBigNumber(bond.boundsSoldAmount, appConfig.currency.decimals) + " " + appConfig.currency.symbol}
							</div>
						</div>

						<div className="value">
							<div className="key">&nbsp;{t("bondsSoldPercent")}</div>

							<div className="val">
								{(bond.bondsSold * 100).toFixed(appConfig.defaultFractionDigits) + "%"}
							</div>
						</div>

						<div className="value">
							<div>
								<span className="pink">◼︎</span>
								<span className="key">&nbsp;{t("excessDeposits")}</span>
							</div>

							<div className="val">
								{BigNumber(bond.excessDeposits).dividedBy(bond.bondsIssued).multipliedBy(100).toFixed(appConfig.defaultFractionDigits)}%({globalUtils.formatBigNumber(bond.excessDeposits, appConfig.currency.decimals) + " " + appConfig.currency.symbol})
							</div>
						</div>

						<div className="value">
							<div>
								<span className="blue">◼︎</span>
								<span className="key">&nbsp;{t("balance")}</span>
							</div>

							<div className="val">
								{globalUtils.formatBigNumber(bond.balance, appConfig.currency.decimals) + " " + appConfig.currency.symbol}
							</div>
						</div>
					</div>
				</div>

				<p>&nbsp;</p>

				<div>
					<h5>{t("details")}</h5>

					<div className="value">
						<div className="key">&nbsp;{t("owner")}</div>

						<div className="val">{globalUtils.truncateString(bond.owner, 5, 3)}</div>
					</div>

					<div className="value">
						<div className="key">&nbsp;{t("id")}</div>

						<div className="val">{bond.id}</div>
					</div>

					<div className="value">
						<div className="key">&nbsp;{t("address")}</div>

						<div className="val">{globalUtils.truncateString(bond.address, 5, 3)}</div>
					</div>
				</div>
			</div>
		</div>}
	</div>
};