import { replaceAll } from "./common.js"; 

export class PageImpl {
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

    static getNumPages(page) {
        return page.root.parentElement.querySelectorAll(".main").length;
    }

    static setNumPages(parent, page) {
        parent
            .querySelectorAll("*")
            .forEach(node => replaceAll(node, "%pages%", PageImpl.getNumPages(page)));
    }

    static useHeaders(page, headers) {
        headers.forEach(header => page.body.insertAdjacentElement("beforebegin", header.cloneNode(true)));
    }

    static useFooters(page, footers) {
        footers.forEach(footer => page.main.insertAdjacentElement("beforeend", footer.cloneNode(true)));
    }

    static fillPage(page) {
        const height = page.main.offsetHeight - PageImpl.getHeight(page);

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