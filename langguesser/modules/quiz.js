import languages from "./DB.js";

const keys = Object.keys(languages);
let tenQuestions = [];
let questionNumber = 0;
let correctAnswer = "";
const optionsList = document.querySelector("#quiz-options_list");
const flag = document.querySelector("#flag-img");
const langName = document.querySelector("#lang-name");
const soundButton = document.querySelectorAll(".play-sound-button");
const sound = document.querySelector(".play-sound");
const correct = document.querySelector("#correct");
const incorrect = document.querySelector("#incorrect");
const score = document.querySelector("#score");
const qBarDiv = document.querySelector("#questions-bar");
const descriptionFlag = document.querySelector(".description_flag-img");
const langTranslated = document.querySelector(".lang-name-translated");
const langOriginal = document.querySelector(".lang-name-original");
const langDescription = document.querySelector(".lang-description");
const langFacts = document.querySelector(".language-facts");
const descriptionClose = document.querySelector(".description_close");

const player = document.querySelector("#player_controls");
let audio;

let scoreCount = 0;
Object.keys(soundButton).map(x => soundButton[x].addEventListener("click", () => {
  sound.play();
  soundButton.style = "background: url('./assets/icons/pause.svg')" // doesn't work
  })
);

// Randomly picks a language out of DB
function pickRandom () {
  return keys[Math.floor(Math.random() * keys.length)]
}

// Checks whether the picked language has already been picked
function isPicked (lang, arr) {
  return arr.includes(lang);
}

// Congratulates when finished
function gratz() {
  localStorage.setItem("langguesserResults", scoreCount);
  window.location = "results.html";
}

// Randomly picking 10 languages for 10 questions
function random() {
  let picked = pickRandom();
  while (tenQuestions.length < 10){
    if (!isPicked(picked, tenQuestions)) {
      tenQuestions.push(picked);
    } else {
      random()
    }
  }
}
random();

const nextQ = document.querySelector(".next-question");
nextQ.addEventListener("click", () => {
  questionNumber < 10 ? render(questionNumber) : gratz();
});

document.querySelector(".description_flag").style = "filter: invert(0%) hue-rotate(0deg);"
function render(q) {
  // Reset
  optionsList.innerHTML = "";
  langName.innerText = "???";
  flag.style = "display: none"
  nextQ.setAttribute("disabled", true);
  nextQ.classList.remove("activated");
  let scoreBase = 5;
  langDescription.style = "display: none";

  document.querySelector(`#b${questionNumber}`).classList.add("current");

  if (q < 10 ) {
    correctAnswer = languages[tenQuestions[questionNumber]]["language"];
    console.log(correctAnswer);
    flag.setAttribute("src", `assets/images/${languages[tenQuestions[questionNumber]]["id"]}.png`);
    sound.setAttribute("src", `${languages[tenQuestions[questionNumber]]["sound"]}`);

    sound.addEventListener("loadeddata", () => {
      document.querySelector(".duration_all").innerText = `0 : 0${Math.floor(sound.duration)}`;
    });

    const timeline = document.querySelector(".length");
    const currentTime = document.querySelector(".duration_current");
    const audioProgress = document.querySelector(".length_progress");
    timeline.addEventListener("click", (e) => {
      const timelineWidth = window.getComputedStyle(timeline).width;
      const timeToSeek = e.offsetX / parseInt(timelineWidth) * sound.duration;
      sound.currentTime = timeToSeek;
      audioProgress.style.width = (timeToSeek * 100) / sound.duration + '%'
    });

    setInterval(() => {
      if (!sound.paused) {
        currentTime.innerText = `0 : 0${Math.floor(sound.currentTime)}`;
        audioProgress.style.width = (sound.currentTime * 100) / sound.duration + '%';
      } else {
        //soundButton.style.background = `url("./assets/icons/listen.svg")`
        return
      }
    }, 10);
    
    questionNumber++
  } else {
    return
  }

  // Pushing the correct answer to the set of options 
  let randomOptions = [];
  randomOptions.push(tenQuestions[q]);
  
  // Iterating thourgh DB and picking random 5 languages for options
  while (randomOptions.length !== 6) {
    let picked = pickRandom();
    if (!isPicked(picked, randomOptions)) {
      randomOptions.push(picked);
    }
  }

  // Shuffling options
  let shuffled = randomOptions.sort((a,b) => Math.random() - 0.5);
  let isAnswered = false
  
  // Creating list of options
  for (let i = 0; i < shuffled.length; i++) {
    const option = document.createElement("li");
    option.classList.add("option");

    const optionNumber = document.createElement("div");
    optionNumber.classList.add("option-number");
    optionNumber.innerText = `option ${i+1}`;
    option.append(optionNumber);

    const optionLabel = document.createElement("label");
    optionLabel.classList.add("option-content");
    optionLabel.innerText = languages[shuffled[i]]["language"];

    const optionInput = document.createElement("input");
    optionInput.setAttribute("type", "radio");
    optionInput.setAttribute("name", "options");

    descriptionClose.addEventListener("click", () => {
      langDescription.style = "display: none";
    });
    
    
    optionInput.addEventListener("click", () => {

      langDescription.style = "display: flex";
      langFacts.innerHTML = languages[shuffled[i]]["description"];
      descriptionFlag.setAttribute("src", `assets/images/${languages[shuffled[i]]["id"]}.png`);
      langTranslated.innerHTML = languages[shuffled[i]]["language"];
      langOriginal.innerHTML = languages[shuffled[i]]["language-original"];

      let dAudio = document.querySelector(".description-audio");
      dAudio.setAttribute("src", `${languages[shuffled[i]]["sound"]}`);

      dAudio.addEventListener("loadeddata", () => {
        document.querySelector(".description-duration_all").innerText = `0 : 0${Math.floor(dAudio.duration)}`;
      });

      const descriptionTimeline = document.querySelector(".description-length");
      const descriptionCurrentTime = document.querySelector(".description-duration_current");
      const descriptionAudioProgress = document.querySelector(".description-length_progress");
      descriptionTimeline.addEventListener("click", (e) => {
        const timelineWidth = window.getComputedStyle(descriptionTimeline).width;
        const timeToSeek = e.offsetX / parseInt(timelineWidth) * dAudio.duration;
        dAudio.currentTime = timeToSeek;
        descriptionAudioProgress.style.width = (timeToSeek * 100) / dAudio.duration + '%'
      });

    setInterval(() => {
      if (!dAudio.paused) {
        descriptionCurrentTime.innerText = `0 : 0${Math.floor(dAudio.currentTime)}`;
        descriptionAudioProgress.style.width = (dAudio.currentTime * 100) / dAudio.duration + '%';
      } else {
        //soundButton.style.background = `url("./assets/icons/listen.svg")`
        return
      }
    }, 10)

      document.querySelector(".description-play-sound-button").addEventListener("click", () => {
        
        dAudio.play();
      })

      

      if (optionLabel.innerText === correctAnswer) {
        isAnswered === false ? scoreCount += scoreBase : scoreCount = scoreCount;
        isAnswered = true
        sound.pause();
        sound.currentTime = 0;
        optionLabel.classList.add("right-answer");
        nextQ.removeAttribute("disabled");
        nextQ.classList.add("activated");
        langName.innerText = `${shuffled[i]}`;
        flag.style = "display: block";
        correct.play();
        
        score.innerText = scoreCount;

        // The description appears
      } 
      if (isAnswered === true){
        optionLabel.style = "pointer-events: auto"
        scoreBase = scoreBase;
      } else {
        scoreBase--;
        optionLabel.classList.add("wrong-answer");
        incorrect.play();
      }
    });
    optionLabel.append(optionInput);
    option.append(optionLabel);
    optionsList.append(option);
  }
}

// Rendering the progress bar
for (let i = 0; i < 10; i++) {
  const bar = document.createElement("div");
  bar.classList.add("bar");
  bar.setAttribute("id", `b${i}`);
  qBarDiv.appendChild(bar);
}

render(questionNumber);