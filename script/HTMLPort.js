import { getDPI, replaceAll, createElement } from "./common.js";

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
                page.fillPage();
                page.setPageNo();

                page = new Page(report, settings);

                page.useHeaders(this.parts.headers);
                page.useFooters(this.parts.footers);
            };

            page.useHeaders(this.parts.headers);
            page.useFooters(this.parts.footers);

            const appendToMain = (child, before = null) => {
                if (!page.fits(child)) startNewPage();

                page.main.insertBefore(child, before);
            };

            const appendToBody = (child, before = null) => {
                if (!page.fits(child)) startNewPage();

                page.body.insertBefore(child, before);
            };

            this.parts.statics.forEach(statics => appendToMain(statics, page.main.firstChild));
            this.parts.records.forEach(records => appendToBody(records));

            if (!page.fits(...this.parts.bottoms)) startNewPage();

            this.parts.bottoms.forEach(bottoms => appendToBody(bottoms));
            this.parts.endings.forEach(endings => appendToMain(endings));

            page.fillPage();
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

    fits = (...records) => HTMLPortImpl.fits(this, ...records);
    getHeight = () => HTMLPortImpl.getHeight(this);
    getPageNo = () => HTMLPortImpl.getPageNo(this);
    setPageNo = () => HTMLPortImpl.setPageNo(this);
    useHeaders = (...headers) => HTMLPortImpl.useHeaders(this, ...headers);
    useFooters = (...footers) => HTMLPortImpl.useFooters(this, ...footers);
    fillPage = () => HTMLPortImpl.fillPage(this);
}

class HTMLPortImpl {
    static fits(page, ...records) {
        const recordsHeight = Array
            .from(records)
            .reduce((height, record) => height += record.offsetHeight, 0);

        return page.getHeight() + recordsHeight <= page.main.offsetHeight;
    }

    static getHeight(page) {
        return Array
            .from(page.main.children)
            .reduce((height, child) => height += child.offsetHeight, 0);
    }

    static getPageNo(page) {
        return Array
            .from(page.root.parentElement.querySelectorAll(".main"))
            .indexOf(page.main) + 1;
    }

    static setPageNo(page) {
        page.main
            .querySelectorAll("*")
            .forEach(node => replaceAll(node, "%page%", page.getPageNo()));
    }

    static useHeaders(page, headers) {
        headers.forEach(header => page.main.insertBefore(header.cloneNode(true), page.body));
    }

    static useFooters(page, footers) {
        footers.forEach(footer => page.main.insertAdjacentElement("beforeend", footer.cloneNode(true)));
    }

    static fillPage(page) {
        const height = page.main.offsetHeight - HTMLPortImpl.getHeight(page);

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

        const static_bottom = page.main.querySelector(".bottom");

        page.body.insertBefore(separator, static_bottom);
    }
}