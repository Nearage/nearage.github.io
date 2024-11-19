import { Page } from "./Page.js";

export class HTMLPort {
    static run(settings = { width: 8.27, height: 11.69, padding: 0.5 }) {
        const reports = document.querySelectorAll(".report");

        reports.forEach(report => {
            this.parts = {
                statics: report.querySelectorAll(".fixtop"),
                headers: report.querySelectorAll(".header"),
                records: report.querySelectorAll(".record"),
                bottoms: report.querySelectorAll(".append"),
                footers: report.querySelectorAll(".footer"),
                endings: report.querySelectorAll(".fixbot")
            };

            Array.from(this.parts.headers).map(header => header.parentElement.removeChild(header));
            Array.from(this.parts.footers).map(footer => footer.parentElement.removeChild(footer));

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

            const appendTo = ((to, child, before = null) => {
                if (!page.fits(child)) startNewPage();

                switch (to) {
                    case "head":
                        page.main.insertBefore(child, page.main.firstChild);
                        break;
                    case "main":
                        page.main.insertBefore(child, before);
                        break;
                    case "body":
                        page.body.insertBefore(child, before);
                        break;
                }
            });

            this.parts.statics.forEach(statics => appendTo("head", statics));
            this.parts.records.forEach(records => appendTo("body", records));

            if (!page.fits(...this.parts.bottoms)) startNewPage();

            this.parts.bottoms.forEach(bottoms => appendTo("body", bottoms));
            this.parts.endings.forEach(endings => appendTo("main", endings));

            page.fillPage();
            page.setPageNo();
            page.setNumPages();
        });
    }
}