/**
 * Trunca la cantidad de caracteres que se muestran en un parrafo
 * @param {Object} selector 
 * @param {Number} maxLength 
 */
function truncateText(selector, maxLength) {
    var element = document.querySelector(selector),
        truncated = element.innerText;

    if (truncated.length > maxLength) {
        truncated = truncated.substr(0, maxLength) + '...';
    }
    return truncated;
}
document.querySelector('p').innerText = truncateText('p', 350);