/**
 *
 * Convert this file using browserify
 * and publish it to the dist folder
 *
 */
const processor = require('postcss');
const customMedia = require('postcss-custom-media');
const mediaMinMax = require('postcss-media-minmax');

(async function () {
    const stylesFile = requirejs.toUrl('css/styles.css');
    const response = await fetch(stylesFile);
    let styles = await response.text();
    const imports = await retrieveImports(styles);
    styles = removeImports(styles);
    styles = imports.join('\n') + styles;
    styles = runPostCss(styles);
    inlineStyle(styles);
})();

function runPostCss(styles) {
    return processor([
        customMedia,
        mediaMinMax
    ]).process(styles).css;
}

function inlineStyle(styles) {
    const head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');
    head.appendChild(style);
    style.appendChild(document.createTextNode(styles));
}

async function retrieveImports(styles) {
    const matches = styles.matchAll(/@import\s+['|"](.+\.css)['|"]/g);
    const imports = Array.from(matches).map(match => {
        return fetchCssFile(requirejs.toUrl('css/') + match[1]);
    });
    return Promise.all(imports);
}

async function fetchCssFile(file) {
    const response = await fetch(file);
    return await response.text();
}

function removeImports(styles) {
    return styles.replace(/@import\s+['|"](.+\.css)['|"];/gm, "");
}
