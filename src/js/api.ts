
const API_ADDRESS:string = import.meta.env.VITE_API_ADRESS
 
/**
 * @function getPodcasts
 * @description Fetches podcast data from the SR API.
 * @returns {Promise<Array>} A promise resolving to an array of podcast objects.
 */

export async function getPodcasts() {
    return await fetch(API_ADDRESS)
        .then((data) => data.json())
        .then((json) => json)
        .catch((error) => {
            console.error('nått blev fel:', error)
            return null
        })
}
