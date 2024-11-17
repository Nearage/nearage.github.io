import { appendChilds } from "https://nearage.github.io/script/common.js";
import { createSeparator, getHeight, getPageNo, updatePageNo } from "https://nearage.github.io/script/PageHandlerImp.js";

export class PageHandler {
    constructor(root, layout, body) {
        this.appendFirst = node => { layout.insertBefore(node, layout.firstChild); updatePageNo(root, layout) };
        this.appendNodes = node => { appendChilds(body, [node]); updatePageNo(root, layout) };
        this.appendLast = node => { layout.appendChild(node); updatePageNo(root, layout) };
        this.createSeparator = () => { createSeparator(layout, body); updatePageNo(root, layout) };
        this.fits = record => getHeight(layout) + record.offsetHeight <= layout.offsetHeight;
        this.getPageNo = () => getPageNo(root, layout);
        this.layout = layout;
    }
}