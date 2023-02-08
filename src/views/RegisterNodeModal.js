import { useState, useEffect } from "react";
import { Button } from "../components/Button";
import { InputPasteble } from "../components/InputPasteble";
import { appConfig } from "../configs/appConfig";
import { appController } from "../libs/appController";
import { locale } from "../libs/locale";
import "./RegisterNodeModal.css";
import { TxSending } from "./TxSending";

export const RegisterNodeModal = () => {
	const t = locale.translate;
	const [indexOfSteps, setIndexOfSteps] = useState(0);
	const [steps, setSteps] = useState([]);

	const handleNext = _ => {
		setIndexOfSteps(1);
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
		setSteps([step1View, step2View]);
	}, []);

	return <div className="registerNodeModalLayout">
		{steps[indexOfSteps]}
	</div>
};