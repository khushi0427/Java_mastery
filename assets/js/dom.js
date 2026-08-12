/**
 * dom.js — a minimal element builder.
 *
 * Phase 2 rendered every view from static markup. Phase 3 renders 43 modules,
 * a dashboard, and search results from data, which needs element construction.
 *
 * This exists so that construction stays declarative WITHOUT reaching for
 * `innerHTML`. Text always goes through `textContent`, so no data value can
 * ever be parsed as markup — the property the project keeps (docs/ARCHITECTURE
 * .md §2) regardless of how trusted the current data source happens to be.
 */

/**
 * Create an element.
 *
 *   el('a', { class: 'nav-link', href: '#/x', text: 'X' })
 *   el('ul', { class: 'list' }, [el('li', { text: 'one' })])
 *
 * Supported props:
 *   text      → textContent
 *   class     → className
 *   dataset   → object of data-* values
 *   on        → object of event listeners, e.g. { click: fn }
 *   anything else → setAttribute, skipped when null/undefined/false
 *
 * @param {string} tag
 * @param {Record<string, unknown>} [props]
 * @param {Array<Node|string>} [children]
 * @returns {HTMLElement}
 */
export function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);

  for (const [key, value] of Object.entries(props)) {
    if (value === null || value === undefined || value === false) continue;

    if (key === 'text') {
      node.textContent = String(value);
    } else if (key === 'class') {
      node.className = String(value);
    } else if (key === 'dataset') {
      Object.assign(node.dataset, value);
    } else if (key === 'on') {
      for (const [event, handler] of Object.entries(value)) {
        node.addEventListener(event, handler);
      }
    } else {
      node.setAttribute(key, value === true ? '' : String(value));
    }
  }

  for (const child of [].concat(children)) {
    if (child === null || child === undefined || child === false) continue;
    node.append(child);
  }

  return node;
}

const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * Create an SVG element. Same shape as `el`, but namespaced — `createElement`
 * produces an inert HTML element for SVG tag names, which renders nothing.
 *
 * @param {string} tag
 * @param {Record<string, unknown>} [props]
 * @param {Array<Node>} [children]
 * @returns {SVGElement}
 */
export function svg(tag, props = {}, children = []) {
  const node = document.createElementNS(SVG_NS, tag);

  for (const [key, value] of Object.entries(props)) {
    if (value === null || value === undefined || value === false) continue;
    if (key === 'class') node.setAttribute('class', String(value));
    else node.setAttribute(key, value === true ? '' : String(value));
  }

  for (const child of [].concat(children)) {
    if (child) node.append(child);
  }

  return node;
}

/**
 * Replace an element's children in one step.
 * @param {HTMLElement} parent
 * @param {Array<Node|string>} children
 */
export function replaceChildren(parent, children) {
  parent.replaceChildren(...[].concat(children).filter(Boolean));
}
