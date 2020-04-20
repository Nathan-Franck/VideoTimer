import * as CSS from './Type.CSS';

/**
 *🎼  HTML style attribute description.
 */
export type Style = Readonly<CSS.Properties<number>>;

/**
 * 🎼 HTML style sheet element description.
 */
export type ClassStyle = {
    readonly name: string,
    readonly declaration: Style,
};

/**
 * 🎼 HTML tag description.
 */
export type HTMLTag<T extends keyof ElementTagNameMap> = {
    readonly type: T,
    readonly style?: Style,
    readonly attributes?: Readonly<Partial<ElementTagNameMap[T]>>,
};

/**
 * 🎼 HTML SVG tag description.
 * 🪓 Uses literalAttributes since there's barriers in-place that prevent using typed Element attributes.
 */
export type SVGTag<T extends keyof SVGElementTagNameMap> = {
    readonly type: T,
    readonly style?: Style,
    readonly attributes?: Readonly<Partial<SVGElementTagNameMap[T]>>,
    readonly literalAttributes?: {
        [key: string]: any,
    },
};

export namespace HtmlBuilder {
    /**
     * 📝Generates a string that describes the provided style in a way that
     * can be used in a style attribute OR a style sheet.
     */
    export function generateStyleString(style: Style) {
        return Object.keys(style).reduce<string>((output, declarationKey) => {
            const formattedKey = declarationKey.replace(new RegExp(`([A-Z])`), match => `-${match.toLowerCase()}`);
            const value = style[declarationKey as keyof Style];
            return (
                `${output} ${formattedKey}: ${value};`);
        }, "");
    }

    /**
     * 📝Generates a string that describes the provided series of ClassStyles in a
     * style sheet format that can be inserted into a style tag's innerHtml
     */
    export function generateStyleHTML(styles: ClassStyle[]) {
        return styles.reduce<string>((output, style) =>
            `${output} ${style.name} {${
                Object.keys(style.declaration).reduce<string>((output, declarationKey) => {
                    const formattedKey = declarationKey.replace(new RegExp(`([A-Z])`), match => `-${match.toLowerCase()}`);
                    const value = style.declaration[declarationKey as keyof Style];
                    return (
                        `${output} ${formattedKey}: ${value};`);
                }, "")
            } }`, "");
    }

    /**
     * 🎨 Assign custom attributes and style to an existing element.
     */
    export function assignToElement<T extends keyof HTMLElementTagNameMap>(
        element: HTMLElementTagNameMap[T],
        tag: Partial<HTMLTag<T>>,
    ) {
        if (tag.style != null) {
            Object.assign(element.style, tag.style);
        }
        if (tag.attributes != null) {
            Object.assign(element, tag.attributes);
        }
        return element;
    }

    /**
     * 🎨 Assign custom attributes and style to an existing element.
     */
    export function assignToElementSVG<T extends keyof SVGElementTagNameMap>(
        element: SVGElementTagNameMap[T],
        tag: Partial<SVGTag<T>>,
    ) {
        const { literalAttributes, style, attributes } = tag;
        if (style != null) {
            Object.assign(element.style, style);
        }
        if (attributes != null) {
            Object.assign(element, attributes);
        }
        if (literalAttributes != null) {
            Object.keys(literalAttributes).forEach(attributeKey => element.setAttributeNS(
                null,
                attributeKey,
                literalAttributes[attributeKey]));
        }
        return element;
    }

    /**
     * ✨Create a HTMLElement and add it to the parent element.
     * Assigns mentioned members to this element after creating.
     */
    export function createChild<T extends keyof HTMLElementTagNameMap>(
        parent: HTMLElement,
        tag: HTMLTag<T>,
    ) {
        const child = document.createElement(tag.type);
        assignToElement(child, tag);
        parent.appendChild(child);
        return child;
    }

    /**
     * ✨Create a SVGElement and add it to the parent element.
     * Assigns mentioned members to this element after creating.
     */
    export function createChildSVG<T extends keyof SVGElementTagNameMap>(
        parent: HTMLElement | SVGElement,
        tag: SVGTag<T>,
    ) {
        const child = document.createElementNS("http://www.w3.org/2000/svg", tag.type);
        assignToElementSVG(child, tag);
        parent.appendChild(child);
        return child;
    }

    /**
     * ♻ Re-use existing elements from pool, assigning tag attributes.
     * If nothing is left in the pool, make a new child under the parent.
     */
    export function recycleElement<T extends keyof HTMLElementTagNameMap>(
        parent: HTMLElement,
        pool: HTMLElementTagNameMap[T][],
        tag: HTMLTag<T>,
        onChildCreated?: (child: HTMLElementTagNameMap[T]) => void,
    ) {
        const existingElement = pool.pop();
        if (existingElement != null) {
            assignToElement<T>(existingElement, tag);
            parent.appendChild(existingElement);
            return existingElement;
        } else {
            const child = createChild(parent, tag);
            if (onChildCreated != null)
                onChildCreated(child);
            return child;
        }
    }
}