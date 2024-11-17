/**
 * Appends the given nodes to the parent.
 * @param {HTMLDivElement} parent The parent to append to.
 * @param {NodeListOf<HTMLDivElement>} nodes The nodes to append.
 * @param {boolean} clone Whether to clone the nodes before appending.
 * @returns {void}
 */
export function appendChilds(parent, nodes, clone = false) {    
    clone ? nodes.forEach(node => parent.appendChild(node.cloneNode(true)))
          : nodes.forEach(node => parent.appendChild(node));
}

/**
 * Returns the DPI of the current page.
 * @returns {number} The DPI of the current page.
 */
export function getDPI() {
    const one_inch = Object.assign(document.createElement("div"), { style: "width: 1in" })

    return document.body.appendChild(one_inch)
         | one_inch.offsetWidth
         | document.body.removeChild(one_inch);
}

/**
 * Replaces all occurences of the given search value with the given replace value.
 * @param {HTMLDivElement} node The node to replace.
 * @param {string} searchValue The value to search for.
 * @param {string} replaceValue The value to replace with.
 */
export function replaceAll(node, searchValue, replaceValue) {
    node.innerHTML = node.innerHTML.replaceAll(searchValue, replaceValue);
}