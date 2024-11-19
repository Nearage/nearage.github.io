import { getDPI, createElement } from "./common.js";
import { PageImpl } from "./PageImpl.js";

export class Page {
    constructor(parent, settings) {
        this.parent = parent;
        this.settings = settings;

        this.root = createElement("div", "root");
        this.main = createElement("div", "main");
        this.body = createElement("div", "body");

        this.root.style.padding = `${getDPI(this.settings.padding)}px`;
        this.root.style.width = `${getDPI(this.settings.width)}px`;
        this.root.style.height = `${getDPI(this.settings.height)}px`;

        this.main.style.height = "100%";

        this.main.append(this.body);
        this.root.append(this.main);
        this.parent.append(this.root);
    }

    fits = (...records) => PageImpl.fits(this, ...records);
    getHeight = () => PageImpl.getHeight(this);
    getPageNo = () => PageImpl.getPageNo(this);
    setPageNo = () => PageImpl.setPageNo(this);
    setNumPages = () => PageImpl.setNumPages(this.parent, this);
    useHeaders = (...headers) => PageImpl.useHeaders(this, ...headers);
    useFooters = (...footers) => PageImpl.useFooters(this, ...footers);
    fillPage = () => PageImpl.fillPage(this);
}