import { Style } from "./Util.HtmlBuilder";

export namespace VideoTimerStyles {

    export const outline: Style = {
        display: "grid",
        width: "100%",
        height: "100%",
    };

    export const centered: Style = {
        display: "grid",
        alignItems: "center",
        justifyItems: "center",
        justifyContent: "center",
    };

    export const text: Style = {
        textAlign: "center",
        fontFamily: "lato",

        color: "white",
    };

    export const button: Style = {
        ...centered,

        pointerEvents: "all",
        cursor: "pointer",
        userSelect: "none",

        fontSize: 32,

        backgroundColor: "grey",
        borderStyle: "solid",
        borderColor: "white",
        borderRadius: "10px",
        width: "2em",
        height: "2em",
        padding: "0.25em",
    };
}