import uid from "uid";
import { css } from "emotion";
import { colours, typography } from "../styles";

export var base = uid(10); // Empty placeholder class

/* Time picker */

export var button = /*#__PURE__*/css(typography.small, ";", typography.sans, ";", colours.greyTintBorder, ";", colours.whiteBackground, ";appearance:none;border-style:solid;border-width:0;border-bottom-width:1px;cursor:pointer;display:block;padding:0.5rem 1rem;width:100%;&:hover{text-decoration:underline;}");

export var buttonActive = /*#__PURE__*/css(colours.highlightLightBackground, ";");

export var item = uid(10); // Empty placeholder class