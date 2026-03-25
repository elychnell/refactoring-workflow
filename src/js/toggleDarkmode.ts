const toggleLightModeButton = document.querySelector('.toggle-btn')
toggleLightModeButton?.addEventListener('click', toggleLightMode)

/**
 * @function toggleLightMode
 * @description Toggles the 'darkmode' class on the body element and updates the button text accordingly.
 */

export function toggleLightMode() {
    document.body.classList.toggle('darkmode')
    if (toggleLightModeButton) {
        if (document.body.classList.contains('darkmode')) {
            toggleLightModeButton.innerHTML = 'Välj mörkt läge'
        } else {
            toggleLightModeButton.innerHTML = 'Välj ljust läge'
        }
    }
}

export default toggleLightMode
