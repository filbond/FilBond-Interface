import { useEffect } from "react";

export const SteppedViews = ({
	views = null,
	keyOfView = ""
}) => {
	return views[keyOfView];
};