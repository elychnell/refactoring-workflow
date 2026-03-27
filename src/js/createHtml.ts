import { getPodcasts } from './api'

/**
 * @function createInnerArticle
 * @description Creates an article element with the class 'innerArticle' and appends it to the podcast container.
 * @returns {HTMLElement} The created article element.
 */

function createInnerArticle() {
    const podCastContainer = document.querySelector('.podlistPods')
    const innerArticle = document.createElement('article')
    innerArticle.setAttribute('class', 'innerArticle')
    podCastContainer?.appendChild(innerArticle)
    return innerArticle
}

/**
 * @function createImg
 * @param {Object} podCast - The podcast object containing the social image URL of the podcast.
 * @param {HTMLElement} innerArticle - The article element to which the image will be appended.
 * @description Creates an image element with the podcast's social image URL and appends it to the inner article element.
 */

function createImg(podCast:Array<string>, innerArticle: HTMLElement) {
    const imgPlacement = document.createElement('IMG')
    imgPlacement.setAttribute('src', podCast.socialimage)
    imgPlacement.setAttribute('width', '100')
    imgPlacement.setAttribute('height', '100')
    imgPlacement.setAttribute('alt', 'Bild: ' + podCast.name)
    innerArticle.appendChild(imgPlacement)
}

/**
 * @function createTextDiv
 * @param {HTMLElement} innerArticle - The article element to which the text div will be appended.
 * @description Creates a div element with the class 'articleDiv' and appends it to the inner article element.
 * @returns {HTMLElement} The created div element.
 */

function createTextDiv(innerArticle: HTMLElement) {
    const textDiv = document.createElement('div')
    textDiv.setAttribute('class', 'articleDiv')
    innerArticle.appendChild(textDiv)
    return textDiv
}

/**
 * @function createLink
 * @param {Object} podCast - The podcast object containing the URL of the podcast.
 * @param {HTMLElement} textDiv - The div element to which the link will be appended.
 * @description Creates an anchor element with the podcast URL and appends it to the text div element.
 */

function createLink(podCast:string[], textDiv: HTMLElement) {
    const linkPlacement = document.createElement('a')
    const linkText = document.createTextNode('Lyssna här')
    linkPlacement.setAttribute('href', podCast.programurl)
    linkPlacement.setAttribute('target', '_blank')
    linkPlacement.setAttribute('alt', 'Länk till ' + podCast.name)
    linkPlacement.appendChild(linkText)
    textDiv.appendChild(linkPlacement)
}

/**
 * @function createP
 * @param {Object} podCast - The podcast object containing the description of the podcast.
 * @param {HTMLElement} textDiv - The div element to which the paragraph will be appended.
 * @description Creates a paragraph element with the podcast's description and appends it to the text div element.
 */
function createP(podCast:string[], textDiv: HTMLElement) {
    const descPlacement = document.createElement('p')
    const desc = document.createTextNode(podCast.description)
    descPlacement.appendChild(desc)
    textDiv.appendChild(descPlacement)
}

/**
 * @function createHeader
 * @param {Object} podCast - The podcast object containing the name of the podcast.
 * @param {HTMLElement} textDiv - The div element to which the header will be appended.
 * @description Creates a header element with the podcast's name and appends it to the text div element.
 */

function createHeader(podCast:string[], textDiv: HTMLElement) {
    const headerPlacement = document.createElement('h2')
    const programName = document.createTextNode(podCast.name)
    headerPlacement.appendChild(programName)
    textDiv.appendChild(headerPlacement)
}

/**
 * @function createHtml
 * @description Creates HTML elements via the other functions for each podcast and appends them to the page.
 */

export async function createHtml() {
    const podCastList = await getPodcasts()
    podCastList.programs.forEach((podCast: string[]) => {
        const innerArticle = createInnerArticle()
        createImg(podCast, innerArticle)
        const textDiv = createTextDiv(innerArticle)
        createLink(podCast, textDiv)
        createHeader(podCast, textDiv)
        createP(podCast, textDiv)
    }) //forEach END
} // createHtml END
