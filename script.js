// let play = document.querySelector(".play");

let currentSong = new Audio();
let songs;

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
async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  //   console.log(response);
  //   inserting HTML
  let div = document.createElement("div");
  div.innerHTML = response;
  // Select all links within the list of files
  let fileLinks = div.querySelectorAll(" li a");
  // Loop through each link and extract the song name

  let songs = [];
  // finging and storing songs .href url in an ampty songs-array
  for (let index = 0; index < fileLinks.length; index++) {
    const element = fileLinks[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}

// creating function named playMusic
const playMusic = (track, pause = false) => {
  currentSong.src = "/songs/" + track;
  if (!pause) {
    currentSong.play();
    play.src = "./svgs/pause.svg";
  }
  //   filling songInfo(title of song) and songtime(duration)
  document.querySelector(".songInfo").innerHTML = decodeURI(track);
  document.querySelector(".songTime").innerHTML = "00:00  / 00:00";
};

// creating function named main
async function main() {
  // get the list of all the songs
  songs = await getSongs();
  playMusic(songs[0], true);
  //  show all the songs in the playlist
  let songsUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
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
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
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
    // console.log(currentSong.currentTime + " : " + currentSong.duration);
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
    console.log("prev");
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });
  // Add ana event listner for next song
  next.addEventListener("click", (e) => {
    currentSong.pause();
    console.log("next");
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
      console.log("Setting volume to " + e.target.value+"/100");
      currentSong.volume = parseInt(e.target.value) / 100;
    });
    // Add eventlister to toggle volume to mute or mute to volume
}
main();

// 3:36:10
