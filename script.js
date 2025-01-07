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
// abhi ye ek promise return karega to is code ko ek function me dalo
async function main() {
  // get the list of all the songs
  let songs = await getSongs();
  console.log(songs);

  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li>
                <img class="invert" src="music.svg" alt="" />
                <div class="info">
                  <div>${song
                    .replaceAll("%20", "_")
                    .replaceAll("_", " ")
                    .replaceAll(".mp3", " ")}</div>
                  <div>Anas</div>
                </div>
                <div class="playnow">
                  <span>Play Now</span>
                  <img class="invert" src="play.svg" alt="" />
                </div>
        </li>`;
  }

  // play the first song
  var audio = new Audio(songs[6]);
  audio.play();
  // adding eventlistneron song
  audio.addEventListener("loadeddata", () => {
    let duration = audio.duration;
    console.log(audio.duration, audio.currentSrc, audio.currentTime);
  });
}
main();
