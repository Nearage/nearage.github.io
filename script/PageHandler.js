import { appendChilds } from "./common.js";
import { createSeparator, getHeight, getPageNo, updatePageNo } from "./PageHandlerImp.js";

export class PageHandler {
    constructor(root, layout, body) {
        this.appendChilds = nodes => appendChilds(body, nodes);
        this.createSeparator = () => createSeparator(layout, body);        
        this.fits = record => getHeight(layout) + record.offsetHeight <= layout.offsetHeight;
        this.getPageNo = () => getPageNo(root, layout);
        this.updatePageNo = () => updatePageNo(root, layout);
    }
}
