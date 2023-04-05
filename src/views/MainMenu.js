import { Link } from "../components/Link";
import { locale } from "../libs/locale";
import "./MainMenu.css"

const mainMenuItemLabels = [
	{
		id: "invest",
		label: "Invest",
		url: "/"
	},
	{
		id: "minersArea",
		label: "Miners Area",
		url: "/nodes"
	},
	{
		id: "stFIL2FIL",
		label: "stFIL to FIL"
	},
	{
		id: "vote",
		label: "Vote",
		url: "/vote"
	}
];

export const MainMenu = () => {
	const t = locale.translate;

	return <div className="mainMenuLayout">
		{mainMenuItemLabels.map(item => {
			return <Link
				key={item.id}
				url={item.url}
				bigger={true}>
				{t(item.id)}
			</Link>
		})}
	</div>
};