import { locale } from "../libs/locale";
import "./InputPasteble.css";

export const InputPasteble = () => {
	const t = locale.translate;

	return <div className="inputPastebleLayout">
		<input />

		<button className="paste">{t("paste")}</button>
	</div>
};