//Create array of objects for each question with a question, and 3 wrong answers and 1 right answer
var questions = [
    {
        question: "Commonly used data types DO Not Include:",
        answer1: "strings",
        answer2: "booleans",
        answer3: "numbers",
        rightAnswer: "alerts"
    },
    {
        question: "The condition in an if/else statement is enclosed with _____.",
        answer1: "quotes",
        answer2: "curly brackets",
        answer3: "square brackets",
        rightAnswer: "parenthesis"
    },
    {
        question: "Arrays in JavaScript can be used to store ______.",
        answer1: "numbers and strings",
        answer2: "other arrays",
        answer3: "booleans",
        rightAnswer: "all other answers"
    },
    {
        question: "String values must be enclosed within _____ when being assigned to variables.",
        answer1: "commas",
        answer2: "curly brackets",
        answer3: "parenthesis",
        rightAnswer: "quotes"
    },
    {
        question: "A very useful tool used during development and debugging for printing content to the debugger is: ",
        answer1: "JavaScript",
        answer2: "terminal/bash",
        answer3: "for loops",
        rightAnswer: "console.log"
    }
];
var main = document.querySelector("main");
var mainInfo = document.querySelector("main > div");
var headerInfo = document.querySelector("#header")
var startQuizButton = document.querySelector("#intro-info > button");
var timer = document.querySelector("#timer");
var form = document.querySelector("#high-score-form");

//countdown till there are no more questions left
var questionCounter = 0;
//what the timer is currently at
var timerCount = 0;
//variable for the internal timer
var countdown;
//if last answer was wrong or right
var lastAnswerCorrect;
//localStorage highscores
var highScores = [];


//Delete everything in main
var deleteEverything = function(){
    mainInfo.remove();
}

//add question info to the page
var addQuestion = function(event){
    deleteEverything();

    //randomly get a object from the array and take the object off the array
    var randomNumber = Math.floor(Math.random() * questions.length );
    var currentQuestion = questions[randomNumber];
    var newArray = [];
    for (var i = 0; i < questions.length; i++){
        if(i !== randomNumber){
            newArray.push(questions[i]);
        }
    }
    questions = newArray;
    //add div with class .question-info
    var overall = document.createElement("div");
    overall.className = "question-info";
    
    //add h1 with ID #question and add it to overall div
    var question = document.createElement("h1");
    question.id = "question";
    question.textContent = currentQuestion.question;
    overall.appendChild(question);

    //add div with id #question-answers for answers
    var answers = document.createElement("div");
    answers.id = "question-answers";

    //add 4 buttons to the div from the object array, assign a special data class telling if the answer is correct or wrong
    //give the buttons the class of .btn
    //assign an ID of 0 through 3 to each one

    //random placement of right answer
    var random = Math.floor(Math.random() * 4);
    //counts through array of wrong answers
    var counter = 0;
    for(var i = 0; i < 4; i++){
        var wrongAnswers = [currentQuestion.answer1, currentQuestion.answer2, currentQuestion.answer3];
        
        var button = document.createElement("button");
        button.className = "btn answer-btn";
        if(i === random){
            button.textContent = (i + 1) + ". " + currentQuestion.rightAnswer;
            button.setAttribute("correct", "yes");
            
        }
        else {
            button.textContent = (i + 1) + ". " + wrongAnswers[counter];
            button.setAttribute("correct", "no");
            counter++;
        }
        answers.appendChild(button);
    }

    //sets wrong or right footer
    var lastAnswer = footer();

    //add that div to .question-info
    overall.append(answers, lastAnswer);
    main.appendChild(overall);

    //sets main info to to div thats currently loaded into the screen
    mainInfo = document.querySelector("main > div");
}

var nextQuestion = function(event){
    var targetEl = event.target;

    //sets whether to say wrong or right on the next screen
    if(targetEl.getAttribute("correct") === "no"){
        timerCount = Math.max(timerCount -= 15, 0);
        lastAnswerCorrect = "false";
    }
    else if(targetEl.getAttribute("correct") === "yes"){
        lastAnswerCorrect = "true";
    }
    //load another question until you run out of questions, then load the game over screen
    if(questionCounter !== 4 && targetEl.matches(".answer-btn")){
        addQuestion();
        questionCounter++;
    } 
    else if(questionCounter === 4 && targetEl.matches(".answer-btn")){
        allDone();
    }
}

var startQuiz = function(event){
    //start first question
    addQuestion();

    //set timer to 75 seconds
    timerCount = 75;
    timer.textContent = "Time: " + timerCount;

    //start the timer to go down once every second until 0
    countDown = setInterval(timerCountdown, 1000);
}

var allDone = function(){
    deleteEverything();
    //stop timer, update highscore
    clearInterval(countDown);

    //create overall div
    var overall = document.createElement("div");
    overall.className = "end-screen";

    //add title and score count
    var title = document.createElement("h1");
    title.textContent = "All Done!";
    var subtext = document.createElement("p");
    subtext.textContent = "Your final score is " + timerCount;
    overall.append(title, subtext);

    //add input section to a form
    form.innerHTML += "<label for='initials'>Enter Initials: </label><input type='text' placeholder='' name='initials' id='initials'><button class='btn'>Submit</button>";

    //adding wrong or right
    var lastAnswer = footer();
    overall.append(form, lastAnswer);
    main.appendChild(overall);

    //reset mainInfo to current page
    mainInfo = document.querySelector("main > div");
}

var enterHighScore = function(event){
    event.preventDefault();
    var currentScore = 
    {
        name: document.querySelector("input").value,
        score: timerCount
    };
    highScores.push(currentScore);

    deleteEverything();

    
    var overall = document.createElement("div");
    overall.className = "scores";

    var title = document.createElement("h1");
    title.textContent = "High Scores";

    var list = document.createElement("ol");
    list.id = "scores-list";


    overall.append(title, list);
    overall.innerHTML += "<button class='btn' id='go-back'>Go Back</button><button class='btn' id='clear-scores'>Clear high scores</button>";

    main.appendChild(overall);
}

var loadScores = function(){

}

var footer = function(){
    var lastAnswer = document.createElement("h2");
    lastAnswer.id = "last-answer";
    if(lastAnswerCorrect === "true"){
        lastAnswer.textContent = "Correct!";
    }
    else if(lastAnswerCorrect === "false"){
        lastAnswer.textContent = "Wrong!";
    }

    return lastAnswer;
}

var timerCountdown = function(){
    if(timerCount > 0){
        timerCount--;
        timer.textContent = "Time: " + timerCount;
    }
    else if(questionCounter !== 4) {
        allDone();
        clearInterval(countDown);
    }
}

//whenever a button is clicked in #question-answers, run the question and answers function again
//return if the answers was correct or false and deduct time if false, while adding text on bottom saying true or false

//after all the objects are run through, show end screen with a place to enter a name for a high score

//after entered, show high score screen with options to clear high scores and go back

loadScores();
startQuizButton.addEventListener("click", startQuiz);

main.addEventListener("click", nextQuestion);

form.addEventListener("submit", enterHighScore);