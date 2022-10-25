let countspan = document.querySelector(".quiz-info .count span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let bullets = document.querySelector(".bullets");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

let current = 0;
let rightAnswers = 0;
function GetQuestions() {
  let MyRequest = new XMLHttpRequest();
  MyRequest.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
      let QuestionsObject = JSON.parse(this.responseText);
      let QuestionsCount = QuestionsObject.length;
      createBullets(QuestionsCount);
      addData(QuestionsObject[current], QuestionsCount);
      countdown(10, QuestionsCount);
      submitButton.onclick = () => {
     
        let theRightanswer = QuestionsObject[current].right_answer;
        current++;
        checkanswer(theRightanswer, countdownElement);
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";
        addData(QuestionsObject[current], QuestionsCount);

        handleBullets();
        clearInterval(countdownInterval)
   countdown(10, QuestionsCount);
        showresults(QuestionsCount);
      };
    }
  };
  MyRequest.open("GET", "questions.json", "true");
  MyRequest.send();

  //   -------------------
}
GetQuestions();
function createBullets(num) {
  countspan.innerHTML = num;
  for (let i = 0; i < num; i++) {
    let bullet = document.createElement("span");
    if (i === 0) {
      bullet.className = "on";
    }
    bulletsSpanContainer.appendChild(bullet);
  }
}

function addData(obj, count) {
  if (current < count) {
    let questionTitle = document.createElement("h2");

    // Create Question Text
    let questionText = document.createTextNode(obj["title"]);

    // Append Text To H2
    questionTitle.appendChild(questionText);

    // Append The H2 To The Quiz Area
    quizArea.appendChild(questionTitle);

    for (let i = 1; i <= 4; i++) {
      let mainDiv = document.createElement("div");
      mainDiv.className = "answer";

      let radioInput = document.createElement("input");
      if (i === 1) {
        radioInput.checked = true;
      }
      // Add Type + Name + Id + Data-Attribute
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];
      // Create Label
      let theLabel = document.createElement("label");

      // Add For Attribute
      theLabel.htmlFor = `answer_${i}`;

      // Create Label Text
      let theLabelText = document.createTextNode(obj[`answer_${i}`]);

      // Add The Text To Label
      theLabel.appendChild(theLabelText);

      // Add Input + Label To Main Div
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);

      // Append All Divs To Answers Area
      answersArea.appendChild(mainDiv);
    }
  }
}
function checkanswer(ranswer, count) {
  let answers = document.getElementsByName("question");
  let theChoosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
    if (ranswer === theChoosenAnswer) {
      rightAnswers++;
    }
  }
}

function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    if (current === index) {
      span.className = "on";
    }
  });
}

function showresults(count) {
  let theResults;
  if (current === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count}`;
    } else if (rightAnswers === count) {
      theResults = `<span class="perfect">Perfect</span>, All Answers Is Good`;
    } else {
      theResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${count}`;
    }
    resultsContainer.innerHTML = theResults;
    resultsContainer.style.padding = "78px";
    resultsContainer.style.backgroundColor = "white";
    resultsContainer.style.marginTop = "10px";
    resultsContainer.style.height = "200px";
    
  }
}
function countdown(duration, count) {
  if (current < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
