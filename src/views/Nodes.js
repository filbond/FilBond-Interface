import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { SortTrigger } from "../components/SortTrigger";
import { PopupMenu } from "../components/PopupMenu";
import { appConfig } from "../configs/appConfig";
import { appController } from "../libs/appController";
import { locale } from "../libs/locale";
import { NodeCard } from "./NodeCard";
import "./Nodes.css";
import { RegisterNodeModal } from "./RegisterNodeModal";
import { ValueAndKey } from "../components/ValueAndKey";
import { Tooltip } from "../components/Tooltip";
import { globalUtils } from "../libs/globalUtils";

export const Nodes = ({
	chainId = 0,
	account = "",
	currencyBalance = globalUtils.constants.BIGNUMBER_ZERO,
	lendingPool = null,
}) => {
	const t = locale.translate;
	const [nodes, setNodes] = useState(null);
	const [registering, setRegistering] = useState(false);
	const [showPopupMenu, setShowPopupMenu] = useState(false);
	const hasNodesSaved = appController.hasNodesStored();
	const modalData = { chainId, account };

	useEffect(() => {
		if (chainId > 0) {
			const saved = appController.loadNodesFromLocalStorage();

			if (saved) {
				setNodes([]);

				appController.getNodesData(res => {
					console.debug("取得了node数据 chainId =", chainId);
					setNodes(res);
				}, saved);
			}
		}
	}, [chainId]);

	const handleCloseRegisterNode = () => {
		setRegistering(false);
	};

	const handleGenerateContract = (nodeId, owner, filAddressOfOwner, idAddress, oldOwnerIdAddress) => {
		appController.saveNode(nodeId, owner, filAddressOfOwner, idAddress, oldOwnerIdAddress);
	};

	const handleRegisterNode = _ => {
		setRegistering(true);

		appController.showModal(<Modal onClose={handleCloseRegisterNode}>
			<RegisterNodeModal
				data={modalData}
				onClose={handleCloseRegisterNode}
				onRegisterNode={handleGenerateContract}
				nodes={nodes} />
		</Modal>);
	};

	const handleimportNodeList = () => {
		handleimportNodeListWithoutTrigger();
		setShowPopupMenu(!showPopupMenu);
	};

	const handleimportNodeListWithoutTrigger = () => {
		appController.importNodes();
	};

	const handleExportNodeList = () => {
		appController.exportNodes();
		setShowPopupMenu(!showPopupMenu);
	};

	return <div className="nodesLayout">
		<div className="titleBar">
			<h2>{t("yourNodes")}&nbsp;{nodes && "(" + nodes?.length + ")"}</h2>

			<div className="sideBySide">
				<Button
					type={appConfig.buttonType.primary}
					onClick={handleRegisterNode}
					padding="8px 12px"
					actived={!registering}
					disabled={!account}>
					<img
						src="/images/add_node.png"
						width="24px"
						alt="add node" />

					{t("registerNode")}
				</Button>

				<PopupMenu trigger={showPopupMenu}>
					<div className="popupMenu nodesMenu">
						<div
							className="popupMenuItem"
							onClick={handleimportNodeList}>
							<img
								src="/images/import.png"
								width="24px"
								height="24px"
								alt="import" />

							{t("importNodeList")}
						</div>

						{hasNodesSaved && <div
							className="popupMenuItem"
							onClick={handleExportNodeList}>
							<img
								src="/images/export.png"
								width="24px"
								height="24px"
								alt="export" />

							{t("exportNodeList")}
						</div>}
					</div>
				</PopupMenu>
			</div>
		</div>

		<div className="filterPanel">
			{/* <CategoryFilter
				title={t("bondPool")}
				categories={categories} /> */}
			<div style={{
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
				gap: "17px"
			}}>
				<ValueAndKey
					keyStr={<>Tot. Borrowable<Tooltip /></>}
					value="8,888.88 FIL"
					alignLeft={true}
					icon="/images/borrow.png" />

				<ValueAndKey
					keyStr={<>Total Debt<Tooltip /></>}
					value="8,888.88 FIL"
					alignLeft={true}
					icon="/images/debt.png" />

				<ValueAndKey
					keyStr={<>Tot. Loan Available<Tooltip /></>}
					value="8,888.88 FIL"
					alignLeft={true}
					icon="/images/loan.png" />
			</div>

			<SortTrigger
				title={t("sortBy")}
				options={appConfig.sortNodesBy} />
		</div>

		{!nodes && <div className="noNodes">
			<div style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				gap: "8px"
			}}>
				<div className="header">{t("noNode")}</div>

				<div className="body">{t("noNodeDescription")}</div>

				<div className="sideBySide">
					<Button
						type={appConfig.buttonType.primary}
						onClick={handleRegisterNode}
						margin="8px 0 0 0"
						disabled={!account}>
						<img
							src="/images/add_node.png"
							width="24px"
							alt="add node" />

						{t("registerNode")}
					</Button>

					<Button
						type={appConfig.buttonType.secondary}
						onClick={handleimportNodeListWithoutTrigger}
						margin="8px 0 0 0">
						<img
							src="/images/import.png"
							width="24px"
							alt="import" />

						{t("importNodeList")}
					</Button>
				</div>
			</div>
		</div>}

		{nodes?.length === 0 && <div></div>}

		{nodes?.length > 0 && <div className="nodesContent">
			{nodes?.map(node => {
				return <NodeCard
					key={node.id}
					node={node}
					currencyBalance={currencyBalance}
					chainId={chainId}
					lendingPool={lendingPool} />
			})}
		</div>}
	</div>
};