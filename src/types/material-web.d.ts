// JSX typings for the @material/web custom elements used in the app.
// React 19 forwards unknown props to custom elements as properties/attributes.
import type { DetailedHTMLProps, HTMLAttributes } from "react";

type MdElementProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
    [attribute: string]: unknown;
};

declare module "react" {
    namespace JSX {
        interface IntrinsicElements {
            "md-filled-button": MdElementProps;
            "md-filled-tonal-button": MdElementProps;
            "md-outlined-button": MdElementProps;
            "md-text-button": MdElementProps;
            "md-outlined-text-field": MdElementProps;
            "md-outlined-select": MdElementProps;
            "md-select-option": MdElementProps;
            "md-chip-set": MdElementProps;
            "md-filter-chip": MdElementProps;
            "md-assist-chip": MdElementProps;
            "md-checkbox": MdElementProps;
            "md-icon": MdElementProps;
            "md-divider": MdElementProps;
            "md-elevation": MdElementProps;
        }
    }
}
