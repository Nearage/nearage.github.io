import { appendChilds } from "https://nearage.github.io/script/common.js";
import { createSeparator, getHeight, getPageNo, updatePageNo } from "https://nearage.github.io/script/PageHandlerImp.js";

export class PageHandler {
    constructor(root, layout, body) {
        this.appendChilds = nodes => {appendChilds(body, nodes); updatePageNo(root, layout)};
        this.createSeparator = () => {createSeparator(layout, body); updatePageNo(root, layout)};
        this.fits = record => getHeight(layout) + record.offsetHeight <= layout.offsetHeight;
        this.getPageNo = () => getPageNo(root, layout);
        this.layout = layout;
    }
}