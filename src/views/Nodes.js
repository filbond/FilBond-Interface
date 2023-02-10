import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { CategoryFilter } from "../components/CategoryFilter";
import { Modal } from "../components/Modal";
import { RatingLabel } from "../components/RatingLabel";
import { SortTrigger } from "../components/SortTrigger";
import { appConfig } from "../configs/appConfig";
import { appController } from "../libs/appController";
import { locale } from "../libs/locale";
import { NodeCard } from "./NodeCard";
import "./Nodes.css";
import { RegisterNodeModal } from "./RegisterNodeModal";

export const Nodes = () => {
	const t = locale.translate;
	const [nodes, setNodes] = useState([]);

	const allCategoriesDom = <div
		className="categoryLayout"
		style={{ height: "38px" }}>
		<div className="title">{t("all")}</div>
	</div>

	const [categories, setCategories] = useState([
		allCategoriesDom,
		<div className="categoryLayout">
			<div>
				<div className="title">f01852677</div>
				<div className="annotation">
					<img src="/images/fixed.png" width="16px" alt="fixed" />
					<span>&nbsp;Fixed 3%</span>
				</div>
			</div>
			<RatingLabel label="AAA" />
		</div>,
		<div className="categoryLayout">
			<div>
				<div className="title">f01852677</div>
				<div className="annotation">
					<img src="/images/range.png" width="16px" alt="range" />
					<span>&nbsp;Range 5-8%</span>
				</div>
			</div>
			<RatingLabel label="AAA" />
		</div>,
		<div className="categoryLayout">
			<div>
				<div className="title">f01852677</div>
				<div className="annotation">
					<img src="/images/difficulty.png" width="16px" alt="difficulty" />
					<span>&nbsp;Difficulty +3%</span>
				</div>
			</div>
			<RatingLabel label="AAA" />
		</div>
	]);

	useEffect(() => {
		appController.getNodesData(result => {
			setNodes(result.nodes);
		});
	}, []);

	const handleRegisterNode = _ => {
		appController.showModal(<Modal>
			<RegisterNodeModal />
		</Modal>);
	};

	return <div className="nodesLayout">
		<div className="titleBar">
			<h2>{t("yourNodes")}&nbsp;({nodes.length})</h2>

			<Button
				type={appConfig.buttonType.primary}
				label={t("registerNode")}
				onClick={handleRegisterNode} />
		</div>

		<div className="filterPanel">
			<CategoryFilter
				title={t("bondPool")}
				categories={categories} />

			<SortTrigger
				title={t("sortBy")}
				options={appConfig.sortNodesBy} />
		</div>

		<div className="nodesContent">
			{nodes.map(node => {
				return <NodeCard
					key={node.id}
					node={node} />
			})}
		</div>
	</div>
};