// let play = document.querySelector(".play");

let currentSong = new Audio();
let songs;
let currentfolder;

// function to change seconds into minutes:seconds format
function secondsToMinute(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  // Ensure the input is a non-negative integer
  seconds = Math.max(0, Math.floor(seconds));

  // Calculate minutes and remaining seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Format with leading zeros if necessary
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  // Return the formatted time string
  return `${formattedMinutes}:${formattedSeconds}`;
}
// function for get songs
async function getSongs(folder) {
  currentfolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;

  // Select all links within the list of files
  let fileLinks = div.querySelectorAll(" li a");
  // Loop through each link and extract the song name

  songs = [];
  // finging and storing songs .href url in an ampty songs-array
  for (let index = 0; index < fileLinks.length; index++) {
    const element = fileLinks[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`${folder}`)[1]);
    }
  }

  //  show all the songs in the playlist
  let songsUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];

  songsUL.innerHTML = "";

  for (const song of songs) {
    songsUL.innerHTML =
      songsUL.innerHTML +
      `<li><img class="invert" src="./svgs/music.svg" alt="" />
            <div class="info">
                <div>${song.replaceAll("%20", " ")}</div>
                <div>Anas</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="./svgs/play.svg" alt="" />
            </div>
        </li>`;
  }
  // Attach an event listner to each song

  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
  return songs;
}

const playMusic = (track, pause = false) => {
  currentSong.src = `${currentfolder}` + track;
  if (!pause) {
    currentSong.play();
    play.src = "./svgs/pause.svg";
  }
  //   filling songInfo(title of song) and songtime(duration)
  document.querySelector(".songInfo").innerHTML = decodeURI(track);
  // If playlist is not selected then display a custom text in songinfo --> "Select Playlist First"
  if (document.querySelector(".songInfo").innerText == "Undefined") {
    document.querySelector(".songInfo").innerText = "Select Playlist First";
  }
  document.querySelector(".songTime").innerHTML = "00:00  / 00:00";
};

async function displayAlbums() {
  let a = await fetch(`http://127.0.0.1:5500/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");
  let array = Array.from(anchors);
  for (let i = 0; i < array.length; i++) {
    const e = array[i];

    if (e.href.includes("/songs/")) {
      let folder = e.href.split("/").slice(-1)[0];
      // get the metadata of the folder
      let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
      let response = await a.json();
      cardContainer.innerHTML =
        cardContainer.innerHTML +
        `<div data-folder="${folder}" class="card">
            <div class="play">
              <div class="circlex">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 20 20" >
                  <path fill="#000" d="M15.544 9.59a1 1 0 0 1-.053 1.728L6.476 16.2A1 1 0 0 1 5 15.321V4.804a1 1 0 0 1 1.53-.848l9.014 5.634Z" />
                </svg>
              </div>
            </div>
              <div class="image">
               <img src="/songs/${folder}/cover.jpg" alt="" />
              </div>
            <h2>${response.title}</h2>
            <p>${response.description}</p>
         </div>`;
    }
  }

  // Load the playlist whenever the ard is clicked!
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      songs = await getSongs(`/songs/${item.currentTarget.dataset.folder}/`);
      // autoplay first song of a playlist
      playMusic(songs[0]);
    });
  });
}

async function main() {
  // get the list of all the songs
  await getSongs("/songs/");
  playMusic(songs[0], true);

  // Display all the albums on the page
  displayAlbums();

  // Attach an event listner to play, next and previous
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "./svgs/pause.svg";
    } else {
      currentSong.pause();
      play.src = "./svgs/play.svg";
    }
  });
  // Listen for timeupdate event
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songTime").innerHTML = `${secondsToMinute(
      currentSong.currentTime
    )} / ${secondsToMinute(currentSong.duration)}`;
    // mooving seekbar functionality
    document.querySelector(".circle").style.left = `${
      (currentSong.currentTime / currentSong.duration) * 100
    }%`;
    // add an eventListner to seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
      let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
      document.querySelector(".circle").style.left = `${percent}%`;
      currentSong.currentTime = (currentSong.duration * percent) / 100;
    });

    // Add an eventlistner for hamburger
  });
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  // Add ana event listner for previous song
  previous.addEventListener("click", (e) => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });
  // Add ana event listner for next song
  next.addEventListener("click", (e) => {
    currentSong.pause();
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });
  // Add an EventListner to volume
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currentSong.volume = parseInt(e.target.value) / 100;
    });
  // Add event listener to toggle volume to mute or mute to volume
  document.querySelector(".volume > img").addEventListener("click", (e) => {
    if (e.target.src.includes("volume.svg") || e.target.alt == "volume") {
      e.target.src = e.target.src.replace("volume.svg", "mute.svg");
      e.target.alt = "mute";
      currentSong.volume = 0;
      document.querySelector(".range > input").value = 0;
    } else {
      e.target.src = e.target.src.replace("mute.svg", "volume.svg");
      e.target.alt = "volume";
      currentSong.volume = 1;
      document.querySelector(".range > input").value = 100;
    }
  });
}
main();
