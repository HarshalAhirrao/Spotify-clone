async function getsong(folder) {
    let a = await fetch(`/${folder}`);
    currFolder = folder;
    let response = await a.text();
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
    ulsong.innerHTML = "";
    for (const song of songs) {
        ulsong.innerHTML = ulsong.innerHTML + ` <li>${song} <img src="image/play.svg" alt=""></li>`;
    }

    Array.from(document.querySelectorAll(".song-list li")).forEach((e, index) => {
        e.addEventListener("click", () => {
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
        });
    });
    return songs;
}

async function getLinks(folder) {
    let a = await fetch(`/${folder}`);
    currFolder = folder;
    let response = await a.text();
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
    let a = await fetch(`/songs`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let array = Array.from(as);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").slice(-2)[0];
            let a = await fetch(`/songs/${folder}/info.json`);
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
