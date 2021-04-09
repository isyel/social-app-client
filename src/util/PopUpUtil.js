import React from "react";
import { Popup } from "semantic-ui-react";

function PopUpUtil({ content, children }) {
	return <Popup content={content} inverted trigger={children} />;
}

export default PopUpUtil;
