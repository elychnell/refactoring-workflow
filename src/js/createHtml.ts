import { getPodcasts } from './api'

let i = 0

/**
 * @function createHtml
 * @description Creates HTML elements for each podcast and appends them to the page.
 */

export async function createHtml() {
    const podCasts = await getPodcasts()
    podCasts.programs.forEach(() => {
        const innerArticle = createInnerArticle()
        createImg()
        const textDiv = createTextDiv()
        createHeader()
        createP()
        createLink()
        i++

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
         * @function createTextDiv
         * @description Creates a div element with the class 'articleDiv' and appends it to the inner article element.
         * @returns {HTMLElement} The created div element.
         */

        function createTextDiv() {
            const textDiv = document.createElement('div')
            textDiv.setAttribute('class', 'articleDiv')
            innerArticle.appendChild(textDiv)
            return textDiv
        }

        /**
         * @function createLink
         * @description Creates an anchor element with the podcast URL and appends it to the text div element.
         */

        function createLink() {
            const linkPlacement = document.createElement('a')
            const linkText = document.createTextNode('Lyssna här')
            linkPlacement.setAttribute('href', podCasts.programs[i].programurl)
            linkPlacement.setAttribute('target', '_blank')
            linkPlacement.setAttribute(
                'alt',
                'Länk till ' + podCasts.programs[i].name
            )
            linkPlacement.appendChild(linkText)
            textDiv.appendChild(linkPlacement)
        }

        /**
         * @function createImg
         * @description Creates an image element with the podcast's social image URL and appends it to the inner article element.
         */

        function createImg() {
            const imgPlacement = document.createElement('IMG')
            imgPlacement.setAttribute('src', podCasts.programs[i].socialimage)
            imgPlacement.setAttribute('width', '100')
            imgPlacement.setAttribute('height', '100')
            imgPlacement.setAttribute(
                'alt',
                'Bild: ' + podCasts.programs[i].name
            )
            innerArticle.appendChild(imgPlacement)
        }

        /**
         * @function createP
         * @description Creates a paragraph element with the podcast's description and appends it to the text div element.
         */
        function createP() {
            const descPlacement = document.createElement('p')
            const desc = document.createTextNode(
                podCasts.programs[i].description
            )
            descPlacement.appendChild(desc)
            textDiv.appendChild(descPlacement)
        }

        /**
         * @function createHeader
         * @description Creates a header element with the podcast's name and appends it to the text div element.
         */

        function createHeader() {
            const headerPlacement = document.createElement('h2')
            const programName = document.createTextNode(
                podCasts.programs[i].name
            )
            headerPlacement.appendChild(programName)
            textDiv.appendChild(headerPlacement)
        }
    })
}
