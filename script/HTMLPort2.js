import { getDPI, replaceAll,createElement } from "./common.js";

export class HTMLPort {
    static run(settings = { width: 8.27, height: 11.69, padding: 0.5 }) {
        const reports = document.querySelectorAll(".report");

        reports.forEach(report => {
            this.parts = {
                statics: report.querySelectorAll(".static"),
                headers: report.querySelectorAll(".header"),
                records: report.querySelectorAll(".record"),
                bottoms: report.querySelectorAll(".bottom"),
                footers: report.querySelectorAll(".footer"),
                endings: report.querySelectorAll(".ending")
            };

            Array.from(this.parts.headers).map(header => header.parentElement?.removeChild(header));
            Array.from(this.parts.footers).map(footer => footer.parentElement?.removeChild(footer));    

            let page = new Page(report, settings);

            const startNewPage = () => {
                page.fill();
                page.setPageNo();
                page = new Page(report, settings);
                page.useHeaders(this.parts.headers);
                page.useFooters(this.parts.footers);
            };

            page.useHeaders(this.parts.headers);
            page.useFooters(this.parts.footers);

            const appendToMain = (child, before) => {
                if (!page.fits(child)) startNewPage();

                page.main.insertBefore(child, before);
            };

            const appendToBody = (child, before) => {
                if (!page.fits(child)) startNewPage();

                page.body.insertBefore(child, before);
            };

            const appendTo = (children, callback, before = null) => {
                children.forEach(child => callback(child, before));
            }

            appendTo(this.parts.statics, appendToMain, page.main.firstChild);
            appendTo(this.parts.records, appendToBody);

            if (!page.fits(...this.parts.bottoms)) startNewPage();

            appendTo(this.parts.bottoms, appendToBody);
            appendTo(this.parts.endings, appendToMain);

            page.fill();
            page.setPageNo();
        });
    }
}

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

    fits = (...records) => this.getHeight() + Array.from(records).reduce((height, record) => height += record.offsetHeight, 0) <= this.main.offsetHeight;
    getHeight = () => Array.from(this.main.children).reduce((height, child) => height += child.offsetHeight, 0);
    getPageNo = () => Array.from(this.root.parentElement.querySelectorAll(".main")).indexOf(this.main) + 1;
    setPageNo = () => this.main.querySelectorAll("*").forEach(node => replaceAll(node, "%page%", this.getPageNo()));
    useHeaders = headers => headers.forEach(header => this.main.insertBefore(header.cloneNode(true), this.body));
    useFooters = footers =>footers.forEach(footer => this.main.insertAdjacentElement("beforeend", footer.cloneNode(true)));
    fill() {
        const height = this.main.offsetHeight - this.getHeight();

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

        const static_bottom = this.main.querySelector(".bottom");

        this.body.insertBefore(separator, static_bottom);
    }
}