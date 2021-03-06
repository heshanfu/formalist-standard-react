import uid from "uid";
import { css } from "emotion";
import * as fields from "../field-styles";
import { typography } from "../../ui/styles";

export const base = css`
  ${fields.base};
`;

export const baseInline = css`
  ${fields.baseInline};
`;

export const header = css`
  ${fields.header};
`;

export const display = uid(10); // Empty placeholder class

export const code = css`
  ${typography.mono};
`;
