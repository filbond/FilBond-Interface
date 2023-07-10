import { useState } from "react";
import { LabelFilter } from "../components/LabelFilter";
import { MinFilter } from "../components/MinFilter";
import { RangeFilter } from "../components/RangeFilter";
import { SortTrigger } from "../components/SortTrigger";
import { appConfig } from "../configs/appConfig";
import { locale } from "../libs/locale";
import { BondItem } from "./BondItem";
import "./BrowserBonds.css";

export const BrowserBonds = ({
	data = []
}) => {
	const t = locale.translate;

	const [bonds, setBonds] = useState(data);

	return <div className="browserBondsLayout">
		<h2>{t("browseBonds")}</h2>

		<div className="filterPanel">
			<div className="leftBlock">
				<LabelFilter
					labels={appConfig.rating}
					title={t("rating")}
					showAll />

				<RangeFilter title={t("interestRate")} />

				<MinFilter title={t("bondsForSale") + "(" + t("min") + ")"} />
			</div>

			<SortTrigger
				title={t("sortBy")}
				options={appConfig.sortBy} />
		</div>

		<div className="content">
			{bonds.map(bond => {
				return <BondItem
					key={bond.title}
					bond={bond} />
			})}
		</div>
	</div>
};