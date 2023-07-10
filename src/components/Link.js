import "./Link.css";

export const Link = ({
	children = null,
	url = "",
	openNewWindow = false,
	bigger = false,
	primary = false
}) => {
	return <a
		href={url}
		className={"linkStyle" + (primary ? " linkStylePrimary" : "")}
		target={openNewWindow ? "_blank" : "_self"}
		style={{
			fontSize: bigger ? "16px" : "auto"
		}}
		rel="noreferrer">{children}</a>
};