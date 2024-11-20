import { Page } from "./Page.js";

export class HTMLPort {
    static run() {
        const reports = document.querySelectorAll(".report");

        reports.forEach(report => {
            const settings = {
                width: 8.27,
                height: 11.69,
                padding: 0.5,
                pagebreak: "auto"
            }

            Object
                .entries(settings)
                .forEach(([key, _]) => settings[key] = report.querySelector(`#${key}`)?.innerText || settings[key]);

            this.parts = {
                fixtops: report.querySelectorAll(".fixtop"),
                headers: report.querySelectorAll(".header"),
                records: report.querySelectorAll(".record"),
                appends: report.querySelectorAll(".append"),
                footers: report.querySelectorAll(".footer"),
                fixbots: report.querySelectorAll(".fixbot")
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

            this.parts.fixtops.forEach(fixtop => appendTo("head", fixtop));
            this.parts.records.forEach(record => appendTo("body", record));

            if (!page.fits(...[...this.parts.appends, ...this.parts.fixbots])) startNewPage();

            this.parts.appends.forEach(append => appendTo("body", append));
            this.parts.fixbots.forEach(fixbot => appendTo("main", fixbot));

            page.fillPage();
            page.setPageNo();
            page.setNumPages();

            report.querySelectorAll(".root").forEach(root => root.style.pageBreakAfter = settings.pagebreak);
        });
    }
}