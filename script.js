let currFolder;
let currentSong = new Audio();

// getting all the songs from the server
async function getsong(folder) {
    let a = await fetch(`http://127.0.0.1:3000/${folder}`);
    currFolder = folder;
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`${folder}/`)[1].replaceAll("%20", " ").replaceAll(".mp3", ""));
        }
    }
    let ulsong = document.querySelector(".song-list ul");
    ulsong.innerHTML = ""; // Clear the list before adding new songs
    // let right = document.querySelector(".songs");
    // i = 0;
    for (const song of songs) {
        ulsong.innerHTML = ulsong.innerHTML + ` <li>${song} <img src="image/play.svg" alt=""></li>`;

        // right.innerHTML =
        //     right.innerHTML +
        //     ` <div class="card ">
        //                    <img src="show.jpeg" alt="">
        //                    <h2>${song}</h2>
        //                    <p>${artists[i]}</p>
        //                     </div>`;
        // i++;
    }
    //list of the songs on left side
    Array.from(document.querySelectorAll(".song-list li")).forEach((e, index) => {
        e.addEventListener("click", () => {
            //    let audio = new Audio();
            //    audio.play();
            currentSong.src = `${currFolder}/${e.innerText.replaceAll(" ", "%20")}.mp3`;
            currentSong.play();
            document.querySelector(".play").style.display = "flex";
            document.querySelector(".footer").style.display = "none";
            let info = document.querySelector(".info");
            info.innerHTML = `<img src="show.jpeg" alt="">
                <div class="details">
                    <h2>${e.innerText}</h2>
                    </div>`;
            document.querySelector(".songs").style.marginBottom = "165px";
            //    console.log(e.innerText);
        });
    });
    return songs;
}

// getting links of the songs from the server
async function getLinks(folder) {
    let a = await fetch(`http://127.0.0.1:3000/${folder}`);
    currFolder = folder;
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let links = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            links.push(element.href);
        }
    }
    return links;
}

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:3000/songs`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let array = Array.from(as);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").slice(-2)[0];
            // get the metadata of the folder
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
            let response = await a.json();

            let right = document.querySelector(".songs");
            right.innerHTML =
                right.innerHTML +
                `   <div data-folder="${folder}" class="card ">
                           <img src="songs/${folder}/cover.jpg" alt="">
                           <h2>${response.title}</h2>
                           <p>${response.artist}</p>
                            </div>`;
        }
    }
}

async function main() {
    let album = await displayAlbums();
    let getsongs = await getsong("songs/romantic");
    let getlinks = await getLinks("songs/romantic");
    function updatePlayPauseIcon() {
        if (currentSong.paused) {
            document.querySelector(".play-btn img").src = "image/play.svg";
        } else {
            document.querySelector(".play-btn img").src = "image/pause.svg";
        }
    }

    currentSong.volume = 0.8;
    document.querySelector(".sound-bar").value = currentSong.volume * 100;

    // getting time updates of songs
    currentSong.addEventListener("timeupdate", () => {
        let currentTime = formatTime(currentSong.currentTime);
        let duration = formatTime(currentSong.duration);

        document.querySelector(".current-time").innerText = currentTime;
        document.querySelector(".total-time").innerText = duration;

        // Update progress bar
        let progress = (currentSong.currentTime / currentSong.duration) * 100;
        document.querySelector(".progress-bar").value = progress;
    });

    // repeat the song
    document.querySelector(".repeat").addEventListener("click", () => {
        currentSong.currentTime = 0;
        currentSong.play();
    });

    //progress bar / seek bar of the song
    document.querySelector(".progress-bar").addEventListener("input", (e) => {
        let seekTime = (e.target.value / 100) * currentSong.duration;
        currentSong.currentTime = seekTime;
    });
    // volume bar of the song
    document.querySelector(".sound-bar").addEventListener("input", (e) => {
        currentSong.volume = e.target.value / 100;
    });
    function formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) return "0:00";
        let mins = Math.floor(seconds / 60);
        let secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    }
    // shuffle the song
    document.querySelector(".shuffle").addEventListener("click", () => {
        let getsongs = document.querySelectorAll(".song-list li"); // Get all songs
        let randomIndex = Math.floor(Math.random() * getsongs.length); // Pick random index

        let randomSongName = getsongs[randomIndex].innerText.replaceAll(" ", "%20"); // Format song name
        currentSong.src = `${currFolder}/${randomSongName}.mp3`; // Set song source
        currentSong.play(); // Play the song
        updatePlayPauseIcon();

        // Update song info in UI
        document.querySelector(".info h2").innerText = getsongs[randomIndex].innerText;
    });

    // console.log(getsongs);

    // play and pause button
    document.querySelector(".play-btn").addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
        } else {
            currentSong.pause();
        }
        updatePlayPauseIcon();
    });

    //cards of the songs on right side

    // document.querySelectorAll(".card").forEach((e, index) => {
    //     e.addEventListener("click", () => {
    //         //    let audio = new Audio(`songs/${e.querySelector("h2").innerText.replaceAll(" ", "%20")}.mp3`);
    //         currentSong.src = `${currFolder}/${e.querySelector("h2").innerText.replaceAll(" ", "%20")}.mp3`;
    //         currentSong.play();
    //         //    console.log(e.innerText);
    //         document.querySelector(".play").style.display = "flex";
    //         document.querySelector(".footer").style.display = "none";

    //         let info = document.querySelector(".info");
    //         info.innerHTML = `<img src="show.jpeg" alt="">
    //             <div class="details">
    //                 <h2>${e.querySelector("h2").innerText}</h2>
    //                 <p>${artists[index]}</p>
    //                 </div>`;
    //         document.querySelector(".songs").style.marginBottom = "165px";
    //     });
    // });

    document.querySelectorAll(".card").forEach((e, index) => {
        e.addEventListener("click", async () => {
            const folder = e.dataset.folder;
            let songsFromFolder = await getsong(`songs/${folder}`);
            // console.log(songsFromFolder);

            document.querySelector(".songs").style.marginBottom = "165px";

            // 🔄 Move this here: after songs are loaded
            let isMenuOpen = false;
            const left = document.querySelector(".left");

            if (isMenuOpen) {
                left.style.transform = "translateX(-200%)";
                left.style.opacity = "0";
                isMenuOpen = false;
            } else {
                left.style.transform = "translateX(0%)";
                left.style.width = "95%";
                left.style.opacity = "1";
                isMenuOpen = true;
            }
        });
    });

    // hamburger menu
    let isMenuOpen = false;

    document.querySelector(".hamburger").addEventListener("click", () => {
        const left = document.querySelector(".left");

        if (isMenuOpen) {
            left.style.transform = "translateX(-200%)";
            left.style.opacity = "0";
            isMenuOpen = false;
        } else {
            left.style.transform = "translateX(0%)";
            left.style.width = "95%";
            left.style.opacity = "1";
            isMenuOpen = true;
        }
    });

    document.querySelectorAll(".card").forEach((e, index) => {
        e.addEventListener("click", () => {
            const left = document.querySelector(".left");

            if (isMenuOpen) {
                left.style.transform = "translateX(-200%)";
                left.style.opacity = "0";
                isMenuOpen = false;
            } else {
                left.style.transform = "translateX(0%)";
                left.style.width = "95%";
                left.style.opacity = "1";
                isMenuOpen = true;
            }
        });
    });

    // swipe logic
    // Assuming isMenuOpen and your hamburger/card logic already exists
    const hammer = new Hammer(document.body);

    // Only enable swipe in portrait mode
    if (window.matchMedia("(orientation: portrait)").matches) {
        hammer.on("swipeleft", () => {
            if (isMenuOpen) {
                document.querySelector(".left").style.transform = "translateX(-200%)";
                document.querySelector(".left").style.opacity = "0";
                isMenuOpen = false;
            }
        });

        hammer.on("swiperight", () => {
            if (!isMenuOpen) {
                const left = document.querySelector(".left");
                left.style.transform = "translateX(0%)";
                left.style.width = "95%";
                left.style.opacity = "1";
                isMenuOpen = true;
            }
        });
    }

    // previous song
    document.querySelector(".previous").addEventListener("click", () => {
        let index = getlinks.indexOf(currentSong.src);
        let prevIndex = (index - 1 + getlinks.length) % getlinks.length;
        currentSong.src = getlinks[prevIndex];
        currentSong.play();
        updatePlayPauseIcon();
        let songName = getsongs[prevIndex];
        document.querySelector(".info").innerHTML = `
        <img src="show.jpeg" alt="">
        <div class="details">
            <h2>${songName}</h2>
            
        </div>`;
    });

    // next song

    document.querySelector(".next").addEventListener("click", () => {
        let index = getlinks.indexOf(currentSong.src);
        let nextIndex = (index + 1) % getlinks.length;
        currentSong.src = getlinks[nextIndex];
        currentSong.play();
        updatePlayPauseIcon();
        let songName = getsongs[nextIndex];
        document.querySelector(".info").innerHTML = `
        <img src="show.jpeg" alt="">
        <div class="details">
            <h2>${songName}</h2>
        </div>`;
    });

    // mute
    // toggle mute/unmute on volume icon click
    document.querySelector(".volume").addEventListener("click", () => {
        if (currentSong.muted) {
            currentSong.muted = false;
            document.querySelector(".volume").src = "image/volume.svg";
            document.querySelector(".sound-bar").value = currentSong.volume * 100;
        } else {
            currentSong.muted = true;
            document.querySelector(".volume").src = "image/mute.svg";
            document.querySelector(".sound-bar").value = 0;
        }
    });
    // play next song when current song is ended

    currentSong.addEventListener("ended", () => {
        let index = getlinks.indexOf(currentSong.src);
        let nextIndex = (index + 1) % getlinks.length;

        currentSong.src = getlinks[nextIndex];
        currentSong.play();
        updatePlayPauseIcon();

        // Update song name in the info section
        let songName = getsongs[nextIndex];
        document.querySelector(".info").innerHTML = `
        <img src="show.jpeg" alt="">
        <div class="details">
            <h2>${songName}</h2>
        </div>`;
    });
}

main();
