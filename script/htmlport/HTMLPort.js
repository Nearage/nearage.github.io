import { Page } from "./Page.js";

export class HTMLPort {
    static #getSettings(report) {
        const settings = {
            width: 8.27,
            height: 11.69,
            padding: 0.5,
            pagebreak: "auto"
        }

        Object
            .keys(settings)
            .forEach(key => settings[key] = report.querySelector(`#${key}`)?.innerText ?? settings[key]);

        return settings;
    }

    static #getParts(report) {
        return {
            fixtops: report.querySelectorAll(".fixtop"),
            headers: report.querySelectorAll(".header"),
            records: report.querySelectorAll(".record"),
            appends: report.querySelectorAll(".append"),
            footers: report.querySelectorAll(".footer"),
            fixbots: report.querySelectorAll(".fixbot")
        };
    }

    static #removeUnusedParts(parts) {
        Array.from(parts.headers).map(header => header.parentElement.removeChild(header));
        Array.from(parts.footers).map(footer => footer.parentElement.removeChild(footer));
    }

    static run() {
        const reports = document.querySelectorAll(".report");

        reports.forEach(report => {
            const settings = HTMLPort.#getSettings(report);
            const parts = HTMLPort.#getParts(report);

            HTMLPort.#removeUnusedParts(parts);

            let page = new Page(report, settings);

            const startNewPage = () => {
                page.fillPage();
                page.setPageNo();

                page = new Page(report, settings);

                page.useHeaders(parts.headers);
                page.useFooters(parts.footers);
            };

            page.useHeaders(parts.headers);
            page.useFooters(parts.footers);

            const appendTo = ((to, child) => {
                if (!page.fits(child)) startNewPage();

                if (/head/.test(to)) page.main.insertBefore(child, page.main.querySelector(".header, .body"));
                if (/body/.test(to)) page.body.insertBefore(child, null);
                if (/foot/.test(to)) page.main.insertBefore(child, null);
            });

            parts.fixtops.forEach(fixtop => appendTo("head", fixtop));
            parts.records.forEach(record => appendTo("body", record));

            if (!page.fits(...[...parts.appends, ...parts.fixbots])) startNewPage();

            parts.appends.forEach(append => appendTo("body", append));
            parts.fixbots.forEach(fixbot => appendTo("foot", fixbot));

            page.fillPage();
            page.setPageNo();
            page.setNumPages();

            report
                .querySelectorAll(".root")
                .forEach(root => root.style.pageBreakAfter = settings.pagebreak);
        });
    }
}