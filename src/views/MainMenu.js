import { locale } from "../libs/locale";
import "./MainMenu.css"

const mainMenuItemLabels = ["browseBonds", "yourInvestments", "yourNodes", "yourBondPools"];

export const MainMenu = () => {
	const t = locale.translate;

	const goTo = event => {
		const url = event.currentTarget.id;

		switch (url) {
			case mainMenuItemLabels[0]:
				window.location.href = "/";
				break;

			case mainMenuItemLabels[1]:
				window.location.href = "/investments";
				break;

			default:
				window.location.href = "/";
				break;
		}
	};

	return <div className="mainMenuLayout">
		{mainMenuItemLabels.map(item => {
			return <div
				key={item}
				id={item}
				className="menuitem"
				onClick={goTo}>
				{t(item)}
			</div>
		})}
	</div>
};