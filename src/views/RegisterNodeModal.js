import { useState, useEffect } from "react";
import { Button } from "../components/Button";
import { InputPasteble } from "../components/InputPasteble";
import { SteppedViews } from "../components/SteppedViews";
import { appConfig } from "../configs/appConfig";
import { appController } from "../libs/appController";
import { locale } from "../libs/locale";
import "./RegisterNodeModal.css";
import { TxSending } from "./TxSending";

const keyOfRegisteringNodeViews = {
	index: 0,
	process: 1
};

export const RegisterNodeModal = () => {
	const t = locale.translate;
	const [views, setViews] = useState([]);
	const [currentView, setCurrentView] = useState(keyOfRegisteringNodeViews.index);

	const handleNext = _ => {
		setCurrentView(keyOfRegisteringNodeViews.process);
	};

	const handleClose = _ => {
		appController.clearModal();
	};

	const step1View = <div>
		<div className="modalTitle">{t("registerNode")}&nbsp;1/3</div>

		<p />

		<h4>{t("enterNodeId")}</h4>

		<p className="text">{t("registerNodeText1")}</p>
		<p className="text">{t("registerNodeText2")}</p>

		<div className="label">{t("enterNodeId")}</div>

		<p />

		<InputPasteble />

		<p>&nbsp;</p>

		<Button
			type={appConfig.buttonType.primary}
			fullWidth
			label={t("generateSmartContract")}
			onClick={handleNext} />

		<p />

		<Button
			type={appConfig.buttonType.noBackground}
			fullWidth
			label={t("cancel")}
			onClick={handleClose} />
	</div>

	const step2View = <TxSending
		label={t("generateSmartContract") + "..."}
		text={t("generateSmartContractText")} />

	useEffect(() => {
		const map = [];
		map[keyOfRegisteringNodeViews.index] = step1View;
		map[keyOfRegisteringNodeViews.process] = step2View;
		setViews(map);
	}, []);

	return <div className="registerNodeModalLayout">
		{/* {steps[indexOfSteps]} */}
		<SteppedViews
			views={views}
			keyOfView={currentView} />
	</div>
};