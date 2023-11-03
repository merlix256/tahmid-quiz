import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://tahmid-quiz-app-default-rtdb.europe-west1.firebasedatabase.app",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const questionsInDB = ref(database, "Questions");

let answerCount = 1;

function addAnswerField() {
  answerCount++;
  const answerContainer = document.getElementById("answer-container");
  const newAnswerInput = document.createElement("div");
  newAnswerInput.innerHTML = `
        <label for="answer${answerCount}">Answer ${answerCount} (Dutch):</label>
        <input type="text" id="answer${answerCount}" name="answer${answerCount}" required>
        <label for="answer${answerCount}-tigrigna">Answer ${answerCount} (Tigrigna):</label>
        <input type="text" id="answer${answerCount}-tigrigna" name="answer${answerCount}-tigrigna" required><br><br>
    `;
  answerContainer.appendChild(newAnswerInput);
}

document
  .getElementById("addAnswerButton")
  .addEventListener("click", addAnswerField);

function addTranslation() {
  const translationContainer = document.getElementById("translation-container");
  const newTranslationInput = document.createElement("div");
  newTranslationInput.innerHTML = `
        <label for="translation">Translation:</label>
        <input type="text" id="translation" name="translation" required><br><br>
    `;
  translationContainer.appendChild(newTranslationInput);
}

function addQuestion() {
  const question = document.getElementById("question").value;
  const questionTigrigna = document.getElementById("question-tigrigna").value;
  const image = document.getElementById("image").value;
  const answers = [];
  const answersTigrigna = [];
  for (let i = 1; i <= answerCount; i++) {
    answers.push(document.getElementById(`answer${i}`).value);
    answersTigrigna.push(document.getElementById(`answer${i}-tigrigna`).value);
  }
  const correct = document.getElementById("correct").value;

  // Push the question data to the database
  const questionData = {
    question: question,
    questionTigrigna: questionTigrigna,
    image: image,
    answers: answers,
    answersTigrigna: answersTigrigna,
    correctAnswer: correct,
  };
  push(questionsInDB, questionData);

  // Display the question in the list
  const questionsList = document.getElementById("questions-list");
  const questionItem = document.createElement("div");
  questionItem.classList.add("question-item");
  questionItem.innerHTML = `
    <div class="question-container">
    <h3 class="question">${question}</h3>
    <p>Translation: ${questionTigrigna}</p>
    <img src="${image}" alt="Question Image" class="question-image">
    <p>Answers:</p>
    <ol class="answer-list">
        ${answers.map((answer, index) => `<li>${answer} - ${answersTigrigna[index]}</li>`).join("")}
    </ol>
    <p>Correct Answer: <span class="correct-answer">${correct}</span></p>
    </div>
    `;
  questionsList.appendChild(questionItem);

  // Clear input fields after adding the question
  clearInputs();
  resetState();
}

function clearInputs() {
  document.getElementById("question").value = "";
  document.getElementById("question-tigrigna").value = "";
  document.getElementById("image").value = "";
  for (let i = 1; i <= answerCount; i++) {
    document.getElementById(`answer${i}`).value = "";
    document.getElementById(`answer${i}-tigrigna`).value = "";
  }
  document.getElementById("correct").value = "";
  document.getElementById("translation").value = "";
}

function resetState() {
  const answerContainer = document.getElementById("answer-container");
  while (answerContainer.children.length > 2) {
    answerContainer.removeChild(answerContainer.lastChild);
  }
  answerCount = 1;
}

// Make addQuestion globally accessible
window.addQuestion = addQuestion;

// Add event listeners to buttons
document
  .getElementById("addQuestionButton")
  .addEventListener("click", addQuestion);

document
  .getElementById("addTranslationButton")
  .addEventListener("click", addTranslation);
