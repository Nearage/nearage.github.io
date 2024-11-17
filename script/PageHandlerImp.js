import { appendChilds, replaceAll } from "https://nearage.github.io/script/common.js";

export function createSeparator(layout, body) { 
    const height = layout.offsetHeight - getHeight(layout);

    if (height <= 0) return;

    const separator = Object.assign(document.createElement("div"), {
        innerHTML: height,
        style: `align-content: center; 
                background: #224; 
                box-shadow: inset 0 10px 10px #0006; 
                color: #f60; 
                font-weight: bold; 
                height: ${height}px;
                text-align: center;`
    });

    appendChilds(body, [separator]);
}

export function getHeight(layout) {
    return Array.from(layout.children)
                .reduce((height, child) => height += child.offsetHeight, 0);
}

export function getPageNo(root, layout) {
    return Array.from(root.parentElement.querySelectorAll(".page"))
                .indexOf(layout) + 1;
}

export function updatePageNo(root, layout) {
    layout.querySelectorAll("*")
          .forEach(node => replaceAll(node, "%page%", getPageNo(root, layout)));
}