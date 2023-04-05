import { Button } from "./Button";
import "./Selector.css";

export const Selector = ({ title = "" }) => {
	return <div className="selectorLayout">
		{title && <h6>{title}</h6>}

		<Button>
			<img src="/images/dots.png"
				width="19px"
				alt="..." />
		</Button>
	</div>
};