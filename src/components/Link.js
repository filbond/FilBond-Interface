import "./Link.css";

export const Link = ({
	children = null,
	url = "",
	openNewWindow = false
}) => {
	return <a
		href={url}
		className="linkStyle"
		target={openNewWindow ? "_blank" : "_self"}>{children}</a>
};