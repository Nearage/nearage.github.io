import { PageHandler } from "https://nearage.github.io/script/PageHandler.js";
import { getDPI, appendChilds } from "https://nearage.github.io/script/common.js";

function createPage(parent, headers, footers, clone = false) {
    const root = Object.assign(document.createElement("div"), { className: "root", style: `padding: ${settings.padding * getDPI()}px` });
    const page = Object.assign(document.createElement("div"), { className: "page" });

    page.style.width = `${(settings.width - 2 * settings.padding) * getDPI()}px`;
    page.style.height = `${(settings.height - 2 * settings.padding) * getDPI()}px`;

    const body = Object.assign(document.createElement("div"), { className: "body" });

    appendChilds(page, headers, clone);
    appendChilds(page, [body]);
    appendChilds(page, footers, clone);
    appendChilds(root, [page]);
    appendChilds(parent, [root]);

    return new PageHandler(root, page, body);
}

export const settings = {
    height: 11.69,
    width: 8.27,
    padding: 0.5
}

export function Run() {
    const reports = document.querySelectorAll(".report");

    reports.forEach(report => {
        const headers = report.querySelectorAll(".header");
        const records = report.querySelectorAll(".record");
        const footers = report.querySelectorAll(".footer");

        headers.forEach(header => report.removeChild(header));
        footers.forEach(footer => report.removeChild(footer));

        let page = createPage(report, headers, footers, true);

        records.forEach((record, index) => {
            if (!page.fits(record)) {
                page.createSeparator();
                page = createPage(report, headers, footers, true);
            }

            page.appendChilds([record]);

            const is_last_record = index == records.length - 1;

            if (is_last_record) page.createSeparator();
            
            page.updatePageNo();
        });
    });
}