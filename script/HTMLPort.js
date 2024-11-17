import { PageHandler } from "https://nearage.github.io/script/PageHandler.js";
import { getDPI, appendChilds } from "https://nearage.github.io/script/common.js";

function createPage(parent, headers, footers, clone = false) {
    const root = Object.assign(document.createElement("div"), { className: "root", style: `padding: ${settings.padding * getDPI()}px` });
    const layout = Object.assign(document.createElement("div"), { className: "page" });

    layout.style.width = `${(settings.width - 2 * settings.padding) * getDPI()}px`;
    layout.style.height = `${(settings.height - 2 * settings.padding) * getDPI()}px`;

    const body = Object.assign(document.createElement("div"), { className: "body" });

    appendChilds(layout, headers, clone);
    appendChilds(layout, [body]);
    appendChilds(layout, footers, clone);
    appendChilds(root, [layout]);
    appendChilds(parent, [root]);

    return new PageHandler(root, layout, body);
}

export const settings = {
    height: 11.69,
    width: 8.27,
    padding: 0.5
}

export function Run() {
    const reports = document.querySelectorAll(".report");

    reports.forEach(report => {
        const statiks = report.querySelectorAll(".static");
        const headers = report.querySelectorAll(".header");
        const records = report.querySelectorAll(".record");
        const footers = report.querySelectorAll(".footer");
        const bottoms = report.querySelectorAll(".bottom");
        const endings = report.querySelectorAll(".ending");

        headers.forEach(header => report.removeChild(header));
        footers.forEach(footer => report.removeChild(footer));

        let page = createPage(report, headers, footers, true);

        statiks.forEach(statik => {
            if (!page.fits(statik)) {
                page.createSeparator();
                page = createPage(report, headers, footers, true);
            }

            page.appendFirst(statik);
        });

        records.forEach(record => {
            if (!page.fits(record)) {
                page.createSeparator();
                page = createPage(report, headers, footers, true);
            }

            page.appendNodes(record);
        });

        bottoms.forEach(bottom => {
            if (!page.fits(bottom)) {
                page.createSeparator();
                page = createPage(report, headers, footers, true);
            }

            page.appendNodes(bottom);
        });

        endings.forEach(ending => {
            if (!page.fits(ending)) {
                page.createSeparator();
                page = createPage(report, headers, footers, true);
            }

            page.appendLast(ending);
        });

        page.createSeparator();
    });
}