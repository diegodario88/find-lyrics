const form = document.getElementById('form')
const searchField = document.getElementById('search')
const songsContainer = document.getElementById('songs-container')
const prevAndNextContainer = document.getElementById('prev-and-next-container')
const apiURL = 'https://api.lyrics.ovh'

const getMoreSongs = async url => {
    const response = await fetch(url)
    const songsInfo = await response.json()
    
    handleSongsIntoPage(songsInfo)
}

const handleSongsIntoPage = songsInfo => {
    
    songsContainer.innerHTML = songsInfo.data.map(song => `
            <li class="song">
                <span class="song-artist"><strong>${song.artist.name}</strong>
                 - ${song.title}
                </span>
                 <button class="btn" data-artist="${song.artist.name}" data-song-title="${song.title}">
                   🎵 Letra
                 </button>
            </li>
        `).join('')

        if (songsInfo.prev || songsInfo.next) {
            prevAndNextContainer.innerHTML = `
                ${songsInfo.prev ? `<button class="btn" onClick=getMoreSongs('${songsInfo.prev}')>⏮ Anteriores</button>` : ''}
                ${songsInfo.next ? `<button class="btn" onClick=getMoreSongs('${songsInfo.next}')>Próximas ⏭</button>` : ''}
            `
            return
        }

        prevAndNextContainer.innerHTML = ''
    
}

const fetchSongs = async term => {
    const response = await fetch(`${apiURL}/suggest/${term}`)
    const songsInfo = await response.json()
    
    handleSongsIntoPage(songsInfo)
}

form.addEventListener('submit', event => {
    event.preventDefault()
    const songName = searchField.value.trim()

    if (!songName) {
    return songsContainer
        .innerHTML = `<li class='warning-message'>⚠️ Por favor, digite um termo válido.</li>`
}

     fetchSongs(songName)
        
})

