
/**
 * @function getPodcasts
 * @description Fetches podcast data from the SR API.
 * @returns {Promise<Array>} A promise resolving to an array of podcast objects.
 */

export async function getPodcasts() {
    return await fetch(
        'https://api.sr.se/api/v2/programs/index?programcategoryid=133&format=json&pagination=false&indent=true&filter=program.archived&filterValue=false'
    )
        .then((data) => data.json())
        .then((json) => json)
        .catch((error) => {
            console.error('nått blev fel:', error)
            return null
        })
}

export default getPodcasts
