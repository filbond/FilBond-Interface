import { appController } from "../libs/appController";
import "./Modal.css";

export const Modal = ({
	children = null,
	onClose = () => { }
}) => {
	const handleClose = _ => {
		appController.clearModal();
		onClose();
	};

	return <div
		id="modalContents"
		className="modalContainerLayout">
		<div className="modalView">
			<img
				className="closeButton"
				src="/images/close.png"
				width="13px"
				alt="close"
				onClick={handleClose} />

			{children}
		</div>
	</div>
};