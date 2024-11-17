import { getDPI, replaceAll } from "https://nearage.github.io/script/common.js";

export class HTMLPort {
    constructor(settings = { height: 11.69, width: 8.27, padding: 0.5 }) {
        this.settings = settings;
    }

    run() {
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

            let page = new Page(report, this.settings);

            const startNewPage = () => {
                page.useSeparators();
                page.updatePageNo();
                page = new Page(report, this.settings);
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
            appendTo(this.parts.bottoms, appendToBody);
            appendTo(this.parts.endings, appendToMain);

            page.useSeparators();
            page.updatePageNo();
        });
    }
}

export class Page {
    constructor(parent, settings) {
        this.parent = parent;
        this.settings = settings;

        this.root = Object.assign(document.createElement("div"), { className: "root" });
        this.main = Object.assign(document.createElement("div"), { className: "main" });
        this.body = Object.assign(document.createElement("div"), { className: "body" });

        this.root.style.padding = `${this.settings.padding * getDPI()}px`;
        this.main.style.width = `${(this.settings.width - 2 * this.settings.padding) * getDPI()}px`;
        this.main.style.height = `${(this.settings.height - 2 * this.settings.padding) * getDPI()}px`;

        this.main.append(this.body);
        this.root.append(this.main);
        this.parent.append(this.root);
    }

    getHeight() {
        return Array.from(this.main.children)
            .reduce((height, child) => height += child.offsetHeight, 0);
    }

    fits(record) {
        return this.getHeight() + record.offsetHeight <= this.main.offsetHeight;
    }

    useHeaders(headers) {
        Array.from(headers).map(header => header.parentElement?.removeChild(header));

        headers.forEach(header => this.main.insertBefore(header.cloneNode(true), this.body));
    }

    useFooters(footers) {
        Array.from(footers).map(footer => footer.parentElement?.removeChild(footer));

        footers.forEach(footer => this.main.insertAdjacentElement("beforeend", footer.cloneNode(true)));
    }

    useSeparators() {
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

    getPageNo() {
        return Array.from(this.root.parentElement.querySelectorAll(".main"))
            .indexOf(this.main) + 1;
    }

    updatePageNo() {
        this.main.querySelectorAll("*")
            .forEach(node => replaceAll(node, "%page%", this.getPageNo()));
    }
}