import "./Link.css";

export const Link = ({
	children = null,
	url = "",
	openNewWindow = false,
	asText = false
}) => {
	return <a
		href={url}
		className={"linkStyle" + (asText ? " linkStyleWithoutBackground" : "")}
		target={openNewWindow ? "_blank" : "_self"}>{children}</a>
};