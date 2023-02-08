import { Button } from "../components/Button";
import { Link } from "../components/Link";
import { appConfig } from "../configs/appConfig";
import { locale } from "../libs/locale";
import "./Footer.css";

export const Footer = () => {
	const t = locale.translate;

	return <div className="footerLayout">
		<img
			className="logo"
			src="/images/logo.png"
			height="32px"
			alt="Logo" />

		<div className="menu">
			<Link asText>{t("liquidations")}</Link>

			<Link asText>
				<span>FilDA.io&nbsp;</span>
				<img
					src="/images/link.png"
					width="8px"
					alt="link" />
			</Link>

			<Link asText>
				<span>{t("docs")}&nbsp;</span>
				<img
					src="/images/link.png"
					width="8px"
					alt="link" />
			</Link>

			<Link asText>{t("termsAndConditions")}</Link>

			<Button
				type={appConfig.buttonType.default}
				label={t("registerNode")} />
		</div>

		<div className="medias">
			<Link asText>
				<img
					src="/images/ins.png"
					width="32px"
					alt="ins" />
			</Link>

			<Link asText>
				<img
					src="/images/wechat.png"
					width="32px"
					alt="wechat" />
			</Link>

			<Link asText>
				<img
					src="/images/twitter.png"
					width="32px"
					alt="twitter" />
			</Link>

			<Link asText>
				<img
					src="/images/medium.png"
					width="32px"
					alt="medium" />
			</Link>

			<Link asText>
				<img
					src="/images/github.png"
					width="32px"
					alt="github" />
			</Link>
		</div>

		<div className="copyRight">{t("copyRight")}</div>
	</div>
};