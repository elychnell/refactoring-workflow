
const API_ADDRESS = process.env?.['API_ADRESS'] ?? ''
    
/**
 * @function getPodcasts
 * @description Fetches podcast data from the SR API.
 * @returns {Promise<Array>} A promise resolving to an array of podcast objects.
 */

console.log('API_ADRESS:', API_ADDRESS)
export async function getPodcasts() {
    return await fetch(API_ADDRESS)
        .then((data) => data.json())
        .then((json) => json)
        .catch((error) => {
            console.error('nått blev fel:', error)
            return null
        })
}
