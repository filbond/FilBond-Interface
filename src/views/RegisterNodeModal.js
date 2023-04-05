import { useState, useEffect } from "react";
import { Button } from "../components/Button";
import { InputPasteble } from "../components/InputPasteble";
import { ValueAndKey } from "../components/ValueAndKey";
import { appConfig } from "../configs/appConfig";
import { appController } from "../libs/appController";
import { locale } from "../libs/locale";
import "./RegisterNodeModal.css";
import { TxSending } from "./TxSending";
import { ErrorModalView } from "./ErrorModalView";
import ClipboardJS from "clipboard";
import { globalUtils } from "../libs/globalUtils";
import { toast } from "react-toastify";
import BigNumber from "bignumber.js";

const keyOfRegisteringNodeViews = {
	index: 0,
	process: 1,
	error: 2,
	retry: 3,
	done: 4,
	cancel: 5,
	confirm: 6,
	success: 7
};

export const RegisterNodeModal = ({
	data = null,
	onClose = () => { },
	onRegisterNode = () => { }
}) => {
	const t = locale.translate;
	const [currentView, setCurrentView] = useState(keyOfRegisteringNodeViews.index);
	const [nodeId, setNodeId] = useState("");
	const [cli, setCli] = useState("");
	const [ownerHexAddress, setOwnerHexAddress] = useState("");
	const [oldOwnerIdAddress, setOldOwnerIdAddress] = useState("");
	const [ownerFilAddress, setOwnerFilAddress] = useState("");
	const [errMessage, setErrMessage] = useState("");
	const [ownerIdAddress, setOwnerIdAddress] = useState("");
	const [loadingTitle, setLoadingTitle] = useState("");
	const [loadingText, setLoadingText] = useState("");
	const [borrowBalance, setBorrowBalance] = useState(globalUtils.constants.BIGNUMBER_ZERO);

	const init = () => {
		setNodeId("");
		setCli("");
		setOwnerHexAddress("");
		setOldOwnerIdAddress("");
		setErrMessage("");
		setOwnerIdAddress("");
		setLoadingTitle("");
		setLoadingText("");
		setBorrowBalance(globalUtils.constants.BIGNUMBER_ZERO);
	};

	const handleGenerateContract = async _ => {
		if (appController.checkNodeId(nodeId)) {
			if (!window.confirm(t("nodeIdExists"))) {
				return;
			}
		}

		setLoadingTitle(t("generateSmartContract") + "...");
		setLoadingText(t("generateSmartContractText"));
		setCurrentView(keyOfRegisteringNodeViews.process);

		const oldOwner = await appController.getMinerOwnerWithId(nodeId);
		if (oldOwner) {
			setOldOwnerIdAddress(oldOwner);
		}

		appController.registerNode(
			data.account,
			null,
			async raw => {
				if (raw?.length > 2) {
					const owner = "0x" + raw.substr(90);
					const filAddress = await appController.hexAddress2Fil(owner);
					console.debug("新地址", owner, filAddress);

					setOwnerHexAddress(owner);
					setOwnerFilAddress(filAddress);

					const idAddressOfOwner = await appController.getIDWithAddress(filAddress);
					if (idAddressOfOwner) {
						setOwnerIdAddress(idAddressOfOwner);
					}

					setCurrentView(keyOfRegisteringNodeViews.done);
				}
			},
			error => {
				setErrMessage(error?.message);
				setCurrentView(keyOfRegisteringNodeViews.error);
			}
		);
	};

	useEffect(() => {
		if (!ownerFilAddress) {
			return;
		}

		setCli("lotus-miner actor set-owner --really-do-it " + ownerFilAddress + " " + oldOwnerIdAddress);
	}, [ownerFilAddress]);

	const handleRegAnother = () => {
		init();
		handleGenerateContract();
	};

	const handleGoToManageNodes = () => {
		window.location.href = "/nodes";
	};

	const handleClose = _ => {
		appController.clearModal();
		onClose();
	};

	const handleChangeNodeId = val => {
		setNodeId(val);
	};

	const retryView = <div className="modalContent">
		<h2>{t("nodeAlreadyRegistered")}</h2>

		<div className="modalText">{t("nodeAlreadyRegisteredDescription")}</div>

		<InputPasteble
			title={t("nodeId")}
			placeholder="es. f012345678"
			onChange={handleChangeNodeId} />

		<Button
			type={appConfig.buttonType.primary}
			fullWidth
			label={t("tryAgain")}
			onClick={handleGenerateContract} />
	</div>

	const handleGoBack = () => {
		setCurrentView(keyOfRegisteringNodeViews.index);
	};

	const handleNext = () => {
		setCurrentView(keyOfRegisteringNodeViews.confirm);
	};

	const handleConfirm = async () => {
		setLoadingTitle(t("pleaseWait"));
		setLoadingText(t("acceptOwnerTips"));
		setCurrentView(keyOfRegisteringNodeViews.process);

		appController.acceptMinerOwnership(
			ownerHexAddress,
			() => { },
			async rawData => {
				console.debug("最终注册完成", rawData);

				const res = await appController.getBorrowBalance(ownerHexAddress);
				setBorrowBalance(BigNumber(res));

				setCurrentView(keyOfRegisteringNodeViews.success);

				onRegisterNode(nodeId, ownerHexAddress, ownerFilAddress, ownerIdAddress, oldOwnerIdAddress);
			},
			error => {
				console.debug("注册出错", error);

				setErrMessage(error?.message.length > appConfig.errorMessageLimit ? t("getErrorAndRevert") : error?.message);
				setCurrentView(keyOfRegisteringNodeViews.error);
			},
			appController.removeIdAddressPrefix(nodeId)
		);
	};

	const handleCancel = () => {
		setCurrentView(keyOfRegisteringNodeViews.cancel);
	};

	const step2View = <div className="modalContent">
		<div>
			<div className="steppedViewCount">{t("registerNode")}&nbsp;2/3</div>
			<p />
			<h2>{t("pasteCodeInCli")}</h2>
		</div>

		<div style={{
			display: "flex",
			flexDirection: "row",
			gap: "12px"
		}}>
			<img
				src="/images/3fils.png"
				height="64px"
				alt="3fils" />

			<div>
				<h6>{t("getFilForNode", { amount: 888.88 })}</h6>

				<div
					className="modalText"
					style={{ color: "#A5A0BB" }}>{t("getFilForNodeDescription")}</div>
			</div>
		</div>

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
			label={t("next")}
			onClick={handleNext} />

		<Button
			type={appConfig.buttonType.noBackground}
			fullWidth
			label={t("cancelRegistration")}
			onClick={handleCancel} />
	</div>

	const handleResume = () => {
		setCurrentView(keyOfRegisteringNodeViews.done);
	};

	const cancelView = <div className="modalContent">
		<h2>{t("cancelRegistration")}?</h2>

		<div className="modalText">{t("cancelRegPrompt")}</div>

		<Button
			type={appConfig.buttonType.primary}
			fullWidth
			label={t("resumeRegistration")}
			onClick={handleResume} />

		<Button
			type={appConfig.buttonType.noBackground}
			fullWidth
			label={t("yesCancelRegistration")}
			onClick={handleClose} />
	</div>

	const step3View = <div className="modalContent">
		<div>
			<div className="steppedViewCount">{t("registerNode")}&nbsp;3/3</div>
			<p />
			<h2>{t("confirmTransfer")}</h2>
		</div>

		<div>
			<div style={{
				display: "flex",
				flexDirection: "row",
				gap: "12px"
			}}>
				<img
					src="/images/fingerprint.png"
					height="19px"
					alt="fingerprint" />

				<h6>{t("restoreAnyTime")}</h6>
			</div>

			<div
				className="modalText"
				style={{
					color: "#A5A0BB",
					marginTop: "13px"
				}}>{t("restoreAnyTimeBody")}</div>
		</div>

		<div>
			<div style={{
				display: "flex",
				flexDirection: "row",
				gap: "12px"
			}}>
				<img
					src="/images/fflower.png"
					height="19px"
					alt="fflower" />

				<h6>{t("operateNode")}</h6>
			</div>

			<div
				className="modalText"
				style={{
					color: "#A5A0BB",
					marginTop: "13px"
				}}>{t("operateNodeBody")}</div>
		</div>

		<div>
			<div style={{
				display: "flex",
				flexDirection: "row",
				gap: "12px"
			}}>
				<img
					src="/images/audit.png"
					height="19px"
					alt="audit" />

				<h6>{t("severalAudits")}</h6>
			</div>

			<div
				className="modalText"
				style={{
					color: "#A5A0BB",
					marginTop: "13px"
				}}>{t("severalAuditsBody")}</div>

		</div>

		<div className="values">
			<ValueAndKey
				keyStr={t("nodeId")}
				value={nodeId}
				rowDirection={true}
				reversed={true}
				fullWidth />

			<ValueAndKey
				keyStr={t("smartContractID")}
				value={ownerIdAddress}
				rowDirection={true}
				reversed={true}
				fullWidth />
		</div>

		<Button
			type={appConfig.buttonType.primary}
			fullWidth
			label={t("confirm")}
			onClick={handleConfirm} />

		<Button
			type={appConfig.buttonType.noBackground}
			fullWidth
			label={t("cancelRegistration")}
			onClick={handleCancel} />
	</div>

	const successView = <div className="modalContent">
		<h2>{t("nodeRegSuccess")}</h2>

		<div className="values">
			<ValueAndKey
				keyStr={t("nodeId")}
				value={nodeId}
				rowDirection={true}
				reversed={true}
				fullWidth />

			<ValueAndKey
				keyStr={t("smartContractID")}
				value={ownerIdAddress}
				rowDirection={true}
				reversed={true}
				fullWidth />
		</div>

		<div style={{
			display: "flex",
			flexDirection: "row",
			gap: "12px"
		}}>
			<img
				src="/images/3fils.png"
				height="64px"
				alt="3fils" />

			<div>
				<h6>{borrowBalance.shiftedBy(-appConfig.currency.decimals).toString(10, appConfig.defaultFractionDigits)} FIL</h6>

				<div
					className="modalText"
					style={{ color: "#A5A0BB" }}>{t("borrowable")}</div>
			</div>
		</div>

		<Button
			type={appConfig.buttonType.primary}
			fullWidth
			label={t("borrow")} />

		<Button
			type={appConfig.buttonType.default}
			fullWidth
			label={t("regAnother")}
			onClick={handleRegAnother} />

		<Button
			type={appConfig.buttonType.noBackground}
			fullWidth
			label={t("manageNode")}
			onClick={handleGoToManageNodes} />
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
			<div className="steppedViewCount">{t("registerNode")}&nbsp;1/3</div>
			<p />
			<h2>{t("enterNodeId")}</h2>
		</div>

		<div className="modalText">{t("registerNodeText1")}</div>

		<div className="modalText">{t("registerNodeText2")}</div>

		<InputPasteble
			title={t("nodeId")}
			placeholder="es. f012345678"
			onChange={handleChangeNodeId} />

		<Button
			type={appConfig.buttonType.primary}
			fullWidth
			label={t("generateSmartContract")}
			onClick={handleGenerateContract}
			disabled={!nodeId} />

		<Button
			type={appConfig.buttonType.noBackground}
			fullWidth
			label={t("close")}
			onClick={onClose} />
	</div>

	return <div className="registerNodeModalLayout">
		{currentView === keyOfRegisteringNodeViews.index && step1View}

		{currentView === keyOfRegisteringNodeViews.process && <TxSending
			label={loadingTitle}
			text={loadingText} />}

		{currentView === keyOfRegisteringNodeViews.error && <ErrorModalView
			title={t("sthWentWrong")}
			text={errMessage ?? t("registerError")}
			onBack={handleGoBack} />}

		{currentView === keyOfRegisteringNodeViews.done && step2View}

		{currentView === keyOfRegisteringNodeViews.confirm && step3View}

		{currentView === keyOfRegisteringNodeViews.cancel && cancelView}

		{currentView === keyOfRegisteringNodeViews.success && successView}

		{currentView === keyOfRegisteringNodeViews.retry && retryView}
	</div>
};