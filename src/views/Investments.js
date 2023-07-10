import { useEffect, useState } from "react";
import { SortTrigger } from "../components/SortTrigger";
import { appConfig } from "../configs/appConfig";
import { appController } from "../libs/appController";
import { locale } from "../libs/locale";
import { BondItem } from "./BondItem";
import "./Investments.css";

export const Investments = ({ allData = null }) => {
	const t = locale.translate;

	const [data, setData] = useState([]);

	const combineData = (investmentData, bondsData) => {
		const newData = [];

		investmentData.forEach(element => {
			newData.push({
				...bondsData.find(item => item.id === element.bondId),
				...element
			})
		});

		return newData;
	};

	useEffect(() => {
		appController.getDataWithAccount("", result => {
			setData(combineData(result.investments, allData));
		});
	}, []);

	return <div className="investmentsLayout">
		<div className="titleBar">
			<h2>{t("yourInvestments")}</h2>

			<SortTrigger
				title={t("sortBy")}
				options={appConfig.sortInvestmentsBy} />
		</div>

		<div className="content">
			{data.map(bond => {
				return <BondItem
					key={bond.id}
					bond={bond}
					asInvestment={true} />
			})}
		</div>
	</div>
};