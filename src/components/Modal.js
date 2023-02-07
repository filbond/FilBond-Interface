import { appController } from "../libs/appController";
import "./Modal.css";

export const Modal = ({ children = null }) => {
	const handleClose = _ => {
		appController.clearModal();
	};

	return <div
		id="modalContents"
		className="modalContainerLayout"
		onDoubleClick={handleClose}>
		<div className="modalView">{children}</div>
	</div>
};