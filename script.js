import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

const appSettings = {
  databaseURL: "https://tahmid-quiz-app-default-rtdb.europe-west1.firebasedatabase.app",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const questionInDB = ref(database, "Questions");

let questions; // Declare the 'questions' variable outside the onValue function

// Variable to track whether translations are currently displayed
let showTranslations = false;

onValue(questionInDB, function(snapshot) {
    let questionsArray = Object.values(snapshot.val());
    let formattedQuestions = [];

    for (let i = 0; i < questionsArray.length; i++) {
        let current_Question = questionsArray[i];
        let answers = [];
        for (let j = 0; j < current_Question.answers.length; j++) {
            answers.push({
                text: current_Question.answers[j],
                textTigrigna: current_Question.answersTigrigna[j], // Add Tigrigna translations for answers
                correct: current_Question.correctAnswer === j.toString()
            });
        }
        let formattedQuestion = {
            question: current_Question.question,
            questionTigrigna: current_Question.questionTigrigna, // Add Tigrigna translation for the question
            image: current_Question.image,
            answers: answers,
        };
        formattedQuestions.push(formattedQuestion);
    }

    questions = formattedQuestions; // Assign formatted questions to the 'questions' variable

    // Start the quiz when the data is fetched
    startQuiz();
});


// Getting necessary elements from the DOM
const questionElement = document.getElementById("question");
const imageElement = document.getElementById("myImage");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

// Initializing necessary variables for the quiz
let currentQuestionIndex = 0;
let score = 0;

// Function to start the quiz and display the first question
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    showQuestion();
}

// Variable to track whether translations are currently displayed

// Function to toggle the display of translations
function toggleTranslations() {
  showTranslations = !showTranslations;
  showQuestion();
}


// Displaying the current question and associated image
function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;
  
    // Check if translation exists for the question
    if (currentQuestion.questionTigrigna && showTranslations) {
      const translationElement = document.createElement("p");
      translationElement.classList.add("translation");
      translationElement.innerHTML = currentQuestion.questionTigrigna;
      questionElement.appendChild(translationElement);
    }
  
    imageElement.src = currentQuestion.image;
  
    currentQuestion.answers.forEach((answer, index) => {
      const button = document.createElement("button");
      button.innerHTML = answer.text;
  
      // Check if translation exists for the answer
      if (answer.textTigrigna && showTranslations) {
        const translationElement = document.createElement("p");
        translationElement.classList.add("translation");
        translationElement.innerHTML = answer.textTigrigna;
        button.appendChild(translationElement);
      }
  
      button.classList.add("btn");
      answerButtons.appendChild(button);
      if (answer.correct) {
        button.dataset.correct = answer.correct;
      }
      button.addEventListener("click", selectAnswer);
    });
  
    // Button to toggle the display of translations
    const translationButton = document.createElement("button");
    translationButton.innerHTML = showTranslations ? "Hide Tig" : "Show Tig";
    translationButton.classList.add("btn");
    translationButton.id = "translation-btn";
    translationButton.addEventListener("click", toggleTranslations);
  
    if (!currentQuestion.questionTigrigna || currentQuestion.questionTigrigna === "" ||
        !currentQuestion.answers.some(answer => answer.textTigrigna)) {
      translationButton.style.display = "none";
    }
  
    answerButtons.appendChild(translationButton);
  }
  
// Resetting the state of the quiz before showing the next question
function resetState() {
  imageElement.style.display = "block";
  nextButton.style.display = "none"; // Hiding the 'Next' button until a new question is displayed
  while (answerButtons.firstChild) {
      answerButtons.removeChild(answerButtons.firstChild); // Removing all the answer buttons from the previous question
  }
  imageElement.innerHTML = ""; // Clearing the image element
  

}

// Handling the selection of an answer by the user
function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if (isCorrect) {
        selectedBtn.classList.add("correct"); // Adding the 'correct' class to the selected button if the answer is correct
        score++; // Incrementing the score if the answer is correct
    } else {
        selectedBtn.classList.add("incorrect"); // Adding the 'incorrect' class to the selected button if the answer is incorrect
    }
    // Disabling all the answer buttons and showing the 'Next' button
    Array.from(answerButtons.children).forEach((button) => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextButton.style.display = "block";
}

// Displaying the final score at the end of the quiz
function showScore() {
    resetState(); // Resetting the quiz state
    questionElement.innerHTML = "Your score is " + score + "/" + questions.length; // Displaying the final score
    nextButton.innerHTML = "Restart Quiz"; // Changing the text of the 'Next' button to 'Restart Quiz'
    nextButton.style.display = "block"; // Displaying the 'Next' button
    imageElement.style.display = "none"; // Hiding the image element
}

// Handling the 'Next' button to proceed to the next question or restart the quiz
function handleNextButton() {
    currentQuestionIndex++; // Incrementing the current question index
    if (currentQuestionIndex < questions.length) {
        showQuestion(); // Displaying the next question if available
    } else {
        showScore(); // Showing the final score if all questions have been answered
    }
}

// Event listener for the 'Next' button click
nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length) {
        handleNextButton(); // Handling the 'Next' button click to proceed to the next question or restart the quiz
    } else {
        startQuiz(); // Restarting the quiz if the user has gone through all the questions
    }
});

// Function to open the modal when the user clicks on the image
window.openModal = function (){
    var modal = document.getElementById("myModal");
    var modalImg = document.getElementById("modalImage");
    var img = document.getElementById("myImage").src;
    modal.style.display = "block";
    modalImg.src = img;
}

// Function to close the modal
window.closeModal = function(){
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
}
