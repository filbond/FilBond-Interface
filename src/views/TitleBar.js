import { LabelWithBackground } from "../components/LabelWithBackground";
import { MainMenu } from "../views/MainMenu";
import { Selector } from "../components/Selector";
import "./TitleBar.css";
import { Button } from "../components/Button";
import { appController } from "../libs/appController";
import { locale } from "../libs/locale";
import { appConfig } from "../configs/appConfig";

export const TitleBar = ({
	account = "",
	onConnect = () => { }
}) => {
	const t = locale.translate;

	const handleConnectWallet = async () => {
		const bingo = await appController.connectWallet();
		if (bingo) {
			onConnect();
		} else {
			appController.switchNetwork(appConfig.defaultNetwork);
		}
	};

	return <div className="titleBarLayout">
		<img src="/images/logo.png" height="32px" alt="Logo" />

		<MainMenu />

		<div className="rightSideBlock">
			{!account && <Button
				type={appConfig.buttonType.primary}
				onClick={handleConnectWallet}
				padding="12px"
				smallText={true}>
				{t("connectWallet")}
			</Button>}

			{account && <Button onClick={handleConnectWallet}>
				<img src="/images/wallet.png"
					width="19px"
					alt="wallet" />
			</Button>}

			<Button>
				<img src="/images/setting.png"
					width="19px"
					alt="setting" />
			</Button>

			{/* <LabelWithBackground text="0xf1..87g3" /> */}

			<Selector />
		</div>
	</div>
};