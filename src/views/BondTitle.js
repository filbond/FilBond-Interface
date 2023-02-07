import "./BondTitle.css";
import { RatingLabel } from "../components/RatingLabel"
import { appController } from "../libs/appController";

export const BondTitle = ({ bond = null }) => {
	return <div className="bondTitleLayout">
		<img src={bond?.logo} width="24px" />

		<div className="title">
			<div className="title">{bond.title}</div>
			<div className="site">{bond.site}</div>
		</div>

		<RatingLabel label={appController.getRatingLabelWithValue(bond.rating)} />
	</div>
}