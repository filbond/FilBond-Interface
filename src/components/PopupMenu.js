import { useEffect, useState } from "react";
import { Button } from "./Button";
import "./PopupMenu.css";

export const PopupMenu = ({
	trigger = false,
	children
}) => {
	const [show, setShow] = useState(false);

	const handleShowMenu = event => {
		setShow(true);
	};

	const handleLostFocus = () => {
		setTimeout(() => {
			setShow(false);
		}, 1000);
	};

	useEffect(() => {
		if (show) {
			setShow(false);
		}
	}, [trigger]);

	return <div
		className="popupMenuLayout"
		onBlur={handleLostFocus}>
		<Button
			padding="10px 17px"
			onClick={handleShowMenu}>
			<img
				src="/images/dots_vertical.png"
				width="5px"
				alt="menu" />
		</Button>

		{show && <div className="popupContent">
			<div className="menuBox">
				{children}
			</div>
		</div>}
	</div>
};