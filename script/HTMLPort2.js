import { getDPI } from "https://nearage.github.io/script/common.js";

export class HTMLPort {
    constructor(settings = { height: 11.69, width: 8.27, padding: 0.5 }) {
        this.settings = settings;
    }

    run() {
        const reports = document.querySelectorAll(".report");

        reports.forEach(report => {
            this.parts = this.#getParts(report);

            let page = new Page(report, this.settings);

            page.useHeaders(this.parts.headers);
            page.useFooters(this.parts.footers);

            this.parts.statics.forEach(statik => {
                if (!page.fits(statik)) {
                    page.useSeparators();
                    page = new Page(report, this.settings);
                    page.useHeaders(this.parts.headers);
                    page.useFooters(this.parts.footers);
                }

                page.main.insertBefore(statik, page.main.firstChild);
            });

            this.parts.records.forEach(record => {
                if (!page.fits(record)) {
                    page.useSeparators();
                    page = new Page(report, this.settings);
                    page.useHeaders(this.parts.headers);
                    page.useFooters(this.parts.footers);
                }

                page.body.appendChild(record);
            });

            this.parts.bottoms.forEach(bottom => {
                if (!page.fits(bottom)) {
                    page.useSeparators();
                    page = new Page(report, this.settings);
                    page.useHeaders(this.parts.headers);
                    page.useFooters(this.parts.footers);
                }

                page.body.insertAdjacentElement("beforeend", bottom);
            });

            this.parts.endings.forEach(ending => {
                if (!page.fits(ending)) {
                    page.useSeparators();
                    page = new Page(report, this.settings);
                    page.useHeaders(this.parts.headers);
                    page.useFooters(this.parts.footers);
                }

                page.main.appendChild(ending);                
            });

            page.useSeparators();
        });
    }

    #getParts(report) {
        return {
            statics: report.querySelectorAll(".static"),
            headers: report.querySelectorAll(".header"),
            records: report.querySelectorAll(".record"),
            bottoms: report.querySelectorAll(".bottom"),
            footers: report.querySelectorAll(".footer"),
            endings: report.querySelectorAll(".ending")
        }
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
}