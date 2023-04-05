import { useState, useEffect } from "react";
import { Button } from "../components/Button";
import { ValueAndKey } from "../components/ValueAndKey";
import { appConfig } from "../configs/appConfig";
import { appController } from "../libs/appController";
import { locale } from "../libs/locale";
import "./RegisterNodeModal.css";
import { TxSending } from "./TxSending";
import ClipboardJS from "clipboard";
import { toast } from "react-toastify";
import { Link } from "../components/Link";

const keyOfUnregisteringNodeViews = {
	index: 0,
	process: 1,
	success: 2,
	restore: 3
};

export const UnregisterNodeModal = ({
	node = null,
	onUnregisterNode = () => { }
}) => {
	const t = locale.translate;
	const cli = "lotus-miner actor set-owner --really-do-it " + node?.owner.filAddress + " " + node?.owner.oldOwner;
	const [currentView, setCurrentView] = useState(keyOfUnregisteringNodeViews.index);
	const [loadingTitle, setLoadingTitle] = useState("");
	const [loadingText, setLoadingText] = useState("");

	const handleUnregisterNode = async _ => {
		setCurrentView(keyOfUnregisteringNodeViews.restore);
	};

	const handleRestoreOwnership = () => {
		setLoadingTitle(t("pleaseWait"));
		setLoadingText(t("unregisteringNode"));
		setCurrentView(keyOfUnregisteringNodeViews.process);

		appController.transferMinerOwnership(
			node.owner.hexAddress,
			() => { },
			async rawData => {
				setCurrentView(keyOfUnregisteringNodeViews.success);
				onUnregisterNode(node.id);
			},
			error => {
				console.error(error)
				handleClose();
			},
			node.owner.oldOwner
		);
	};

	const handleClose = _ => {
		appController.clearModal();
	};

	const step2View = <div className="modalContent">
		<div>
			<div className="steppedViewCount">{t("unregisterNode")}&nbsp;2/3</div>
			<p />
			<h2>{t("restoreOwnership")}?</h2>
		</div>

		<div className="modalText">{t("restoreText")}</div>

		<div className="values">
			<ValueAndKey
				keyStr={t("currentOwner")}
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
				rowDirection
				fullWidth
				reversed />

			<ValueAndKey
				keyStr={t("newOwner")}
				value={<Link
					url={appController.getNetworkConfig().blockExplorerUrls[0] + appConfig.blockExplorerUrlSegements.address + node?.owner.idAddress}
					openNewWindow
					primary>
					{node?.owner.idAddress}
					<img
						src="/images/link1.png"
						width="18px"
						alt="link1" />
				</Link>}
				rowDirection
				fullWidth
				reversed />
		</div>

		<Button
			type={appConfig.buttonType.primary}
			fullWidth
			label={t("restoreOwnership")}
			onClick={handleRestoreOwnership}
			disabled={!node?.id} />

		<Button
			type={appConfig.buttonType.noBackground}
			fullWidth
			label={t("close")}
			onClick={handleClose} />
	</div>

	const handleDone = () => {
		onUnregisterNode(node.id);
		handleClose();
	};

	const step3View = <div className="modalContent">
		<div>
			<div className="steppedViewCount">{t("unregisterNode")}&nbsp;3/3</div>
			<p />
			<h2>{t("pasteCodeInCli")}</h2>
		</div>

		<div className="modalText">{t("transferOwnerText1")}</div>

		<div className="modalText">{t("transferOwnerText2")}</div>

		<div
			className="values"
			style={{
				flexDirection: "row",
				gap: "1em"
			}}>
			<div
				className="modalText"
				style={{ wordWrap: "anywhere" }}>{cli}</div>

			<Button
				type={appConfig.buttonType.primary}
				label={t("copy")}
				buttonId="copyCliButton" />
		</div>

		<div style={{ width: "100%" }}>
			<p className="modalText">{t("youShouldSee")}</p>

			<div
				className="values modalText"
				style={{
					textAlign: "left",
					wordWrap: "anywhere"
				}}>Message CID: bafy2bzacebdjlbjqm5654nkmvev7epmjn3ki7z4yveycjkzm7hcypig232x4q message succeeded!</div>
		</div>

		<Button
			type={appConfig.buttonType.primary}
			fullWidth
			label={t("done")}
			onClick={handleDone} />
	</div>

	useEffect(() => {
		const cp = new ClipboardJS("#copyCliButton", {
			text: () => {
				if (cli) {
					toast.info(t("cliCopied"), appConfig.toastConfig);
				}

				return cli;
			}
		});

		return () => {
			cp.destroy();
		};
	}, []);

	const step1View = <div className="modalContent">
		<div>
			<div className="steppedViewCount">{t("unregisterNode")}&nbsp;1/3</div>
			<p />
			<h2>{t("areYouSure")}</h2>
		</div>

		<div className="modalText">{t("unregisterNodeText")}</div>

		<div className="values">
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
				rowDirection
				fullWidth
				reversed />
		</div>

		<Button
			type={appConfig.buttonType.deprecated}
			fullWidth
			label={t("yesUnregisterNode")}
			onClick={handleUnregisterNode}
			disabled={!node?.id} />

		<Button
			type={appConfig.buttonType.noBackground}
			fullWidth
			label={t("notSureCloseModal")}
			onClick={handleClose} />
	</div>

	return <div className="registerNodeModalLayout">
		{currentView === keyOfUnregisteringNodeViews.index && step1View}

		{currentView === keyOfUnregisteringNodeViews.restore && step2View}

		{currentView === keyOfUnregisteringNodeViews.process && <TxSending
			label={loadingTitle}
			text={loadingText} />}

		{currentView === keyOfUnregisteringNodeViews.success && step3View}
	</div>
};