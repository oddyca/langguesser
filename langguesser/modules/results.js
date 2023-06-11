const congrats = document.querySelector(".congratulations");
const result = localStorage.getItem("langguesserResults");

parseInt(result) === 50
  ? congrats.innerHTML = `<h1 class = "gratz">Congrats!<br>Your score is <span class = "score-result">${result}</span> out of <span class = "score-result">50</span><br> Want to try again?</h1>`
  : congrats.innerHTML = `<h1 class = "gratz">Not bad!<br>Your score is <span class = "score-result">${result}</span> out of <span class = "score-result">50</span><br> Want to try again?</h1>`;

localStorage.getItem("langguesserDarkmode") === "false" 
  ? document.getElementsByTagName("body")[0].classList.add("dark-mode") 
  : document.getElementsByTagName("body")[0].classList.remove("dark-mode");