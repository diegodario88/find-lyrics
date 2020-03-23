//@ts-check
const form = document.getElementById('form')
const searchField = document.getElementById('search')
const songsContainer = document.getElementById('songs-container')
const prevAndNextContainer = document.getElementById('prev-and-next-container')
const apiURL = 'https://api.lyrics.ovh'


const fetchData = async url => {
    const response = await fetch(url)
    return await response.json()
}

const getMoreSongs = async url => {
    const songsInfo = await fetchData(url)
    return handleSongsIntoPage(songsInfo)
}

const handlePrevAndNextButtons = ({ prev, next }) => {
    return prevAndNextContainer.innerHTML = `
    ${prev ? `<button  onClick=getMoreSongs('${prev}')>⏮ Anteriores</button>` : ''}
    ${next ? `<button  onClick=getMoreSongs('${next}')>Próximas ⏭</button>` : ''}
`
}

const handleSongsIntoPage = ({ data, prev, next }) => {
    songsContainer.innerHTML = data.map(({ artist: { name }, title }) => `
            <li class="song">
                <span class="song-artist"><strong>${name}</strong>
                 - ${title}
                </span>
                 <button class="btn" data-artist="${name}" data-song-title="${title}">
                   🎵 Letra
                 </button>
            </li>
        `).join('')

    if (prev || next) {
        return handlePrevAndNextButtons({ prev, next })
    }
    prevAndNextContainer.innerHTML = ''
}

const fetchSongs = async term => {
    const songsInfo = await fetchData(`${apiURL}/suggest/${term}`)
    handleSongsIntoPage(songsInfo)
}

form.addEventListener('submit', event => {
    event.preventDefault()
    // @ts-ignore
    const songName = searchField.value.trim()

    if (!songName) {
        return songsContainer
            .innerHTML = `<li class='warning-message'>⚠️ Por favor, digite um termo válido.</li>`
    }
    fetchSongs(songName)
})

const handleLyricsIntoPage = (artist, songTitle, lyrics) => {
    songsContainer.innerHTML = `
    <li class="lyrics-container">
        <h2> <strong>${artist}</strong> - ${songTitle}</h2>
        <p class="lyrics">${lyrics}</p>
    </li>
    `
}

const fetchLyrics = async (artist, songTitle) => {
    const data = await fetchData(`${apiURL}/v1/${artist}/${songTitle}`)
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>')
    handleLyricsIntoPage(artist, songTitle, lyrics)
}

songsContainer.addEventListener('click', event => {
    const clickedElement = event.target
    // @ts-ignore
    if (clickedElement.tagName === 'BUTTON') {
        // @ts-ignore
        const artist = clickedElement.getAttribute('data-artist')
        // @ts-ignore
        const songTitle = clickedElement.getAttribute('data-song-title')

        prevAndNextContainer.innerHTML = ''

        fetchLyrics(artist, songTitle)
    }
})