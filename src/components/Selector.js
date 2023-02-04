import "./Selector.css";

export const Selector = ({ title = "" }) => {
	return <div className="selectorLayout">
		{title && <h6>{title}</h6>}

		<div className="selectorButton">≡</div>
	</div>
};