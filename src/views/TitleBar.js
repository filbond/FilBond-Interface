import { LabelWithBackground } from "../components/LabelWithBackground";
import { MainMenu } from "../views/MainMenu";
import { Selector } from "../components/Selector";
import "./TitleBar.css";

export const TitleBar = () => {
	return <div className="titleBarLayout">
		<img src="/images/logo.png" height="32px" alt="Logo"/>

		<MainMenu />

		<div className="rightSideBlock">
			<LabelWithBackground text="0xf1..87g3" />
			<Selector />
		</div>
	</div>
};