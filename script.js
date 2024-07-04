let currentsong = new Audio()
let count = 0
let playlistCreated;
let alreadyAdded = {

}
// change duration format 
function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    // Calculate minutes and seconds
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);

    // Format minutes and seconds with leading zeros if necessary
    var formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    var formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    // Return formatted time as a string
    return formattedMinutes + ':' + formattedSeconds;
}
// getting songs into an array named "songs" 
async function getsongs() {
    let a = await fetch("/songs/")
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }

    }

    return songs
}
// get images of songs from dir 
async function getsongimages() {
    let a = await fetch("/songs/")
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    let song_images = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".jpg") || element.href.endsWith(".png")) {
            song_images.push(element.href)

        }

    }
    return song_images
}
function getPlaylist(playlistName, tagLine, playlistimg,) {
    let playlistbox = document.createElement("div")
    playlistbox.className = "playlist-box " + playlistName
    document.querySelector(".playlist-container").append(playlistbox)

    let song_img = document.createElement("div")
    song_img.className = "song-img"
    playlistbox.append(song_img)

    let playbutton = document.createElement("button")
    playbutton.className = "playbtn"
    song_img.append(playbutton)

    let buttonimg = document.createElement("img")
    buttonimg.setAttribute("src", "svgs/play.svg")
    playbutton.append(buttonimg)

    let songimg = document.createElement("img")
    songimg.setAttribute("src", playlistimg)
    song_img.append(songimg)

    let songtext = document.createElement("div")
    songtext.className = "song-text"
    playlistbox.append(songtext)

    let songtitle = document.createElement("h1")
    songtitle.innerText = playlistName
    songtext.append(songtitle)

    let songartist = document.createElement("p")
    songartist.innerText = tagLine
    songtext.append(songartist)
}

async function AddingSongtoPlaylist(song) {
    song = song.split("/songs/")[1]
    console.log(song);
    let songImgIndex;
    let song_images = await getsongimages()
    let songslist = await getsongs()
    let playlistsList = document.querySelectorAll(".playlist-list")
    let songName = song.replaceAll("%20", " ").split(".mp3")[0].split("-")[0]
    let songPath = song.replaceAll("%20", " ")
    let artistName = song.replaceAll("%20", " ").split(".mp3")[0].split("-")[1]
    for (let index = 0; index < songslist.length; index++) {
        const e = songslist[index];
        if (e === song) {
            songImgIndex = index
            console.log(index);
        }

    }
    let song_image_path = song_images[songImgIndex].replaceAll("%20", " ")
    // console.log(song_image_path);
    for (let index = 0; index < playlistsList.length; index++) {
        const element = playlistsList[index];
        const playlistKey = "customContainer" + (index + 1);
        element.addEventListener("click", () => {
            if (!alreadyAdded[playlistKey].includes(songName)) {
                console.log("added to " + playlistKey);
                getsongdetails(song_image_path, songName, artistName, songPath, playlistKey);
                alreadyAdded[playlistKey].push(songName);
                let songCount = document.querySelector("." + playlistKey).children[0].children[2].children[1]
                songCount.innerText = alreadyAdded[playlistKey].length + " songs"
                let songCountAtList = document.querySelectorAll(".playlist-list")
                songCountAtList[index].children[1].children[1].innerText = alreadyAdded[playlistKey].length + " songs"


                console.log(alreadyAdded[playlistKey].length);

            }
            else {
                console.log("Song already added to " + playlistKey);
            }
        });


    }

}
// playing song 
const playMusic = (track, pause = false) => {
    currentsong.src = "/songs/" + track
    if (!pause) {
        currentsong.play()
    }


}

// get songs details from the array "songs" 
(async function main() {
    let songs = await getsongs()
    let song_images = await getsongimages()
    playMusic(songs[0], true)
    document.querySelector(".songatplaybar").firstElementChild.setAttribute("src", song_images[0])
    document.querySelector(".songatplaybartext").firstElementChild.innerText = songs[0].replaceAll("%20", " ").split(".mp3")[0].split("-")[0].split(".")[1]
    document.querySelector(".songatplaybartext").children[1].innerHTML = songs[0].replaceAll("%20", " ").split(".mp3")[0].split("-")[1]
    // making cards 
    for (let index = 0; index < songs.length; index++) {

        let song_image_path = song_images[index].replaceAll("%20", " ")
        let songName = songs[index].replaceAll("%20", " ").split(".mp3")[0].split("-")[0]
        let songPath = songs[index].replaceAll("%20", " ")
        let artistName = songs[index].replaceAll("%20", " ").split(".mp3")[0].split("-")[1]
        getsongdetails(song_image_path, songName, artistName, songPath)
    }
    // adding click event on main logo 
    document.querySelector(".logo").addEventListener("click", e => {
        document.querySelector(".left-bar").style.left = 0
        document.querySelector(".left-bar").style.opacity = "100%"

    })
    // addEventListener on home logo 
    console.log(screen.width);
    if (screen.width <= 644) {
        document.querySelector(".home").addEventListener("click", e => {
            document.querySelector(".left-bar").style.left = "-30%"
            document.querySelector(".left-bar").style.opacity = "0"

        })
        document.querySelector("#search-btn").addEventListener("click", () => {
            document.querySelector(".left-bar").style.left = "-30%"
            document.querySelector(".left-bar").style.opacity = "0"
        })
    }
    // play pause button click 
    document.querySelector("#song_btn").addEventListener("click", element => {

        if (currentsong.paused) {
            currentsong.play()
            document.querySelector("#song_btn").firstElementChild.src = "svgs/pause.svg"


        }
        else if (currentsong.play) {
            document.querySelector("#song_btn").firstElementChild.src = "svgs/play.svg"
            currentsong.pause()
        }
        else {

        }
    })
    console.log(currentsong.src);
    // adding song to custom playlist
    document.querySelector("#slectingPlaylistAdd").addEventListener("click", () => {
        count += 1
        addPlaylist("Playlist#" + count, 0, '/playlist_pics/customplylist.webp', count)
        getPlaylistToAddingList(count)

        AddingSongtoPlaylist(currentsong.src)

    })

    document.querySelector("#addtoplaylistbtn").addEventListener("click", () => {
        document.querySelector(".layer").style.display = "flex"
        document.querySelector(".selectingPlaylistBox").style.display = "block"
        console.log("adding to playlist");
        AddingSongtoPlaylist(currentsong.src)

    })

    // Add click on seekbar 
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%"
        document.querySelector(".seekbar_overlay").style.width = percent + "%"
        currentsong.currentTime = (currentsong.duration * percent) / 100


    })
    // updating song duration 
    currentsong.addEventListener("timeupdate", () => {
        let index = songs.indexOf(currentsong.src.split("/songs/")[1])
        document.querySelector(".seekbar-box").children[0].innerHTML = formatTime(currentsong.currentTime)
        document.querySelector(".seekbar-box").children[2].innerHTML = formatTime(currentsong.duration)
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"
        document.querySelector(".seekbar_overlay").style.width = (currentsong.currentTime / currentsong.duration) * 100 + "%"
        // AUTOPLAY SONGS WHEN CURRENT SONG IS END 
        if (currentsong.currentTime == currentsong.duration) {
            // IF THE CURRENT SONG IS LAST SONG THEN AGAIN PLAY FIRST SONG 
            if (index == (songs.length - 1)) {
                playMusic(songs[0])
                document.querySelector(".songatplaybar").firstElementChild.setAttribute("src", song_images[0])
                document.querySelector(".songatplaybartext").firstElementChild.innerText = songs[0].replaceAll("%20", " ").split(".mp3")[0].split("-")[0]
                document.querySelector(".songatplaybartext").children[1].innerHTML = songs[0].replaceAll("%20", " ").split(".mp3")[0].split("-")[1]

            }
            //  PLAY NEXT SONG
            else {

                playMusic(songs[index + 1])
                document.querySelector(".songatplaybar").firstElementChild.setAttribute("src", song_images[index + 1])
                document.querySelector(".songatplaybartext").firstElementChild.innerText = songs[index + 1].replaceAll("%20", " ").split(".mp3")[0].split("-")[0]
                document.querySelector(".songatplaybartext").children[1].innerHTML = songs[index + 1].replaceAll("%20", " ").split(".mp3")[0].split("-")[1]
            }


        }


    })
    // add click event to previouse 
    document.querySelector(".previose-btn").addEventListener("click", e => {
        let index = songs.indexOf(currentsong.src.split("/songs/")[1])
        if (index > 0) {
            playMusic(songs[index - 1])
            document.querySelector(".songatplaybar").firstElementChild.setAttribute("src", song_images[index - 1])
            document.querySelector(".songatplaybartext").firstElementChild.innerText = songs[index - 1].replaceAll("%20", " ").split(".mp3")[0].split("-")[0]
            document.querySelector(".songatplaybartext").children[1].innerHTML = songs[index - 1].replaceAll("%20", " ").split(".mp3")[0].split("-")[1]
        }
    })
    // add click event to next
    document.querySelector(".next-btn").addEventListener("click", e => {
        let index = songs.indexOf(currentsong.src.split("/songs/")[1])

        if (index < (songs.length - 1)) {
            playMusic(songs[index + 1])
            document.querySelector(".songatplaybar").firstElementChild.setAttribute("src", song_images[index + 1])
            document.querySelector(".songatplaybartext").firstElementChild.innerText = songs[index + 1].replaceAll("%20", " ").split(".mp3")[0].split("-")[0]
            document.querySelector(".songatplaybartext").children[1].innerHTML = songs[index + 1].replaceAll("%20", " ").split(".mp3")[0].split("-")[1]
        }
    })

    // add an event to volume
    document.querySelector(".othertools").getElementsByTagName("input")[0].addEventListener("change", e => {
        console.log(e.target.value / 100);
        currentsong.volume = e.target.value / 100;
    })
})()

// make cards from details aurgoments
async function getsongdetails(songimage, songname, artist, songpath, container = "default") {
    if (container === "default") {
        container = document.querySelector(".cont" + songname.split(".")[0])
    }
    else if (container.includes("customContainer")) {
        console.log(container);
        container = document.querySelector("." + container)

    }
    else {
        container = document.querySelector(".search-cont")

    }
    let song = document.createElement("div")
    song.className = "song"
    container.append(song)
    song.addEventListener("click", element => {
        playMusic(songpath.trim())
        document.querySelector(".songatplaybar").firstElementChild.setAttribute("src", songimage)
        document.querySelector(".songatplaybartext").firstElementChild.innerText = songname.split(".")[1]
        document.querySelector(".songatplaybartext").children[1].innerHTML = artist
        document.querySelector("#song_btn").firstElementChild.src = "svgs/pause.svg"



    })

    let song_img = document.createElement("div")
    song_img.className = "song-img"
    song.append(song_img)

    let playbutton = document.createElement("button")
    playbutton.className = "playbtn"
    song_img.append(playbutton)

    let buttonimg = document.createElement("img")
    buttonimg.setAttribute("src", "svgs/play.svg")
    playbutton.append(buttonimg)

    let songimg = document.createElement("img")
    songimg.setAttribute("src", songimage)
    song_img.append(songimg)

    let songtext = document.createElement("div")
    songtext.className = "song-text"
    song.append(songtext)

    let songtitle = document.createElement("h1")
    songtitle.innerText = songname.split(".")[1]
    songtext.append(songtitle)

    let songartist = document.createElement("p")
    songartist.innerText = artist
    songtext.append(songartist)

}

(async function serach() {
    let songs = await getsongs()
    let song_images = await getsongimages()
    let availableSongs = []
    let result = []
    for (let index = 0; index < songs.length; index++) {
        let songName = songs[index].replaceAll("%20", "").split(".mp3")[0].split("-")[0]
        availableSongs.push(songName)
    }
    document.getElementById("search-bar").onkeyup = function () {
        let resultForImg = []
        let input = document.getElementById("search-bar").value
        document.querySelector(".playlist-container").style.display = "none"
        document.querySelector(".search-cont").style.display = "flex"
        if (input.length) {
            result = songs.filter((keyword) => {
                return keyword.toLowerCase().includes(input.toLowerCase())
            })
            resultForImg = song_images.filter((keyword) => {
                return keyword.toLowerCase().includes(input.toLowerCase())
            })
            console.log(result);
            document.querySelector(".search-cont").innerHTML = " "
            for (let index = 0; index < result.length; index++) {
                let song_image_path = resultForImg[index].replaceAll("%20", " ")
                let songName = result[index].replaceAll("%20", " ").split(".mp3")[0].split("-")[0]
                let songPath = result[index].replaceAll("%20", " ")
                let artistName = result[index].replaceAll("%20", " ").split(".mp3")[0].split("-")[1]
                getsongdetails(song_image_path, songName, artistName, songPath, "search-cont")

            }

        }
        else if (input === "") {
            document.querySelector(".search-cont").style.display = "none"
            document.querySelector(".playlist-container").style.display = "flex"

        }


    }


})()

function addPlaylist(CustomName, songsCount, playlistimg, counter) {
    alreadyAdded["customContainer" + counter] = []
    console.log(alreadyAdded);
    let playlisticon = document.createElement("div")
    playlisticon.className = "playlistIcon playlistIcon" + counter
    document.querySelector(".playlist").append(playlisticon)

    let innerIcon = document.createElement("img")
    innerIcon.src = "/svgs/music.svg"
    innerIcon.className = "invert"
    playlisticon.append(innerIcon)

    let container = document.createElement("div")
    container.className = "custom-container customContainer" + counter
    document.querySelector(".main-box").append(container)
    // Create elements
    const contHeader = document.createElement('div');
    const backDiv = document.createElement('div');
    const playlistImgDiv = document.createElement('div');
    const contTitleDiv = document.createElement('div');
    const gapDiv = document.createElement('div');

    // Set class names
    contHeader.className = 'cont-header';
    backDiv.className = 'back';
    playlistImgDiv.className = 'playlistimg';
    contTitleDiv.className = 'cont-title';
    gapDiv.className = 'gap';

    // Create back SVG
    const backSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    backSvg.setAttribute('viewBox', '10 0 96 96');
    const backPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    backPath.setAttribute('d', 'M39.3756,48.0022l30.47-25.39a6.0035,6.0035,0,0,0-7.6878-9.223L26.1563,43.3906a6.0092,6.0092,0,0,0,0,9.2231L62.1578,82.615a6.0035,6.0035,0,0,0,7.6878-9.2231Z');
    backSvg.appendChild(backPath);

    // Create playlist image
    const playlistImg = document.createElement('img');
    playlistImg.src = playlistimg;
    playlistImg.alt = '';

    // Create title and song count
    const titleH1 = document.createElement('h1');
    titleH1.textContent = CustomName;
    const songsP = document.createElement('p');
    songsP.textContent = songsCount + " songs";

    // Append elements
    backDiv.appendChild(backSvg);
    playlistImgDiv.appendChild(playlistImg);
    contTitleDiv.appendChild(titleH1);
    contTitleDiv.appendChild(songsP);

    contHeader.appendChild(backDiv);
    contHeader.appendChild(playlistImgDiv);
    contHeader.appendChild(contTitleDiv);
    contHeader.appendChild(gapDiv);

    container.appendChild(contHeader);

    let playlistIcons = document.querySelectorAll(".playlistIcon")
    for (let index = 0; index < playlistIcons.length; index++) {
        const element = playlistIcons[index];
        element.addEventListener("click", () => {
            console.log(index);
            emptyContainer()
            document.querySelector(".customContainer" + (index + 1)).style.display = "flex"
            if (screen.width <= 644) {
                document.querySelector(".left-bar").style.left = "-30%"
                document.querySelector(".left-bar").style.opacity = "0"
            }

        })

    }
    let backbtns = document.querySelectorAll(".back")
    for (let index = 0; index < backbtns.length; index++) {
        const e = backbtns[index];
        e.addEventListener("click", () => {
            console.log("back");
            emptyContainer()
            document.querySelector(".playlist-container").style.display = "flex"

        })
    }
}

function emptyContainer() {
    "use strict"
    document.querySelector(".searchbar").style.display = "none"
    document.querySelector(".search-cont").style.display = "none"
    document.querySelector(".playlist-container").style.display = "none"
    document.querySelectorAll(".songs-container").forEach((e) => {
        e.style.display = "none"
    })
    let customCont = document.querySelector(".custom-container")
    if (customCont != null) {
        document.querySelectorAll(".custom-container").forEach((element) => {
            element.style.display = "none"
        })
    }
}

function getPlaylistToAddingList(counter) {
    // Create the main div with class 'playlist-list'
    const playlistList = document.createElement('div');
    playlistList.className = 'playlist-list';

    // Create the inner div with class 'playlistIcon'
    const playlistIcon = document.createElement('div');
    playlistIcon.className = 'playlistIcon';

    // Create the img element and set its src and class attributes
    const img = document.createElement('img');
    img.src = '/svgs/music.svg';
    img.className = 'invert';

    // Append the img to the playlistIcon div
    playlistIcon.appendChild(img);

    // Create the inner div with class 'playlist-list-text'
    const playlistListText = document.createElement('div');
    playlistListText.className = 'playlist-list-text';

    // Create the h1 element and set its text content
    const h1 = document.createElement('h1');
    h1.textContent = 'Playlist#' + counter;

    // Create the p element and set its text content
    const p = document.createElement('p');
    p.textContent = '0 songs';


    playlistListText.appendChild(h1);
    playlistListText.appendChild(p);


    playlistList.appendChild(playlistIcon);
    playlistList.appendChild(playlistListText);


    document.querySelector(".playlist-list-box").appendChild(playlistList);


}

//Creating playlists box
getPlaylist("Sleep", "Keep calm and focus with ambient and post-rock music.", "playlist_pics/sleep.png")
getPlaylist("Hip-Hop", "Rap gods of Pakistan. Cover: Talha Anjum", "/playlist_pics/hiphop.png")
getPlaylist("K-POP", "Welcome to the BTS's universe. H appy BTS Festa A.R.M.Y 💜", "/playlist_pics/k-pop.png")
getPlaylist("Desi-POP", "Home to the Desi Pop Bops.", "/playlist_pics/desi-pop.png")


let playlistBoxArray = document.querySelectorAll(".playlist-box")
for (let index = 0; index < playlistBoxArray.length; index++) {
    const element = playlistBoxArray[index];
    element.addEventListener("click", () => {
        emptyContainer()
        console.log("click");
        document.querySelector(".playlist-container").style.display = "none"
        document.querySelector(".cont" + (index + 1)).style.display = "flex"

    })
}
let backbtns = document.querySelectorAll(".back")
for (let index = 0; index < backbtns.length; index++) {
    const e = backbtns[index];
    e.addEventListener("click", () => {
        console.log("back");
        emptyContainer()
        document.querySelector(".playlist-container").style.display = "flex"
        document.querySelector(".cont" + (index + 1)).style.display = "none"

    })
}

document.querySelector("#search-btn").addEventListener("click", () => {
    console.log("search");
    emptyContainer()
    document.getElementById("search-bar").value = ""
    document.querySelector(".searchbar").style.display = "flex"
})

document.querySelector("#searched").addEventListener("click", () => {
    document.querySelector(".searchbar").style.display = "none"
    document.getElementById("search-bar").value = ""

})

document.querySelector(".home").addEventListener("click", () => {
    emptyContainer()
    document.querySelector(".playlist-container").style.display = "flex"

})

document.querySelector("#addplaylist").addEventListener("click", () => {
    count += 1
    addPlaylist("Playlist#" + count, 0, '/playlist_pics/customplylist.webp', count)
    emptyContainer()
    if (count - 1 != 0) {
        document.querySelector(".customContainer" + (count - 1)).style.display = "none"
    }
    document.querySelector(".customContainer" + count).style.display = "flex"
    getPlaylistToAddingList(count)



})

document.querySelector("#slectingPlaylistBack").addEventListener("click", () => {
    document.querySelector(".selectingPlaylistBox").style.display = "none"
    document.querySelector(".layer").style.display = "none"

})

document.querySelector(".volume").addEventListener("click", () => {
    if (screen.width <= 425) {
        if (document.querySelector(".range").style.display == "block") {
            document.querySelector(".range").style.display = "none"
        }
        else {
            document.querySelector(".range").style.display = "block"

        }
    }
})