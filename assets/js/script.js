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

//elements shown from the first page
var main = document.querySelector("main");
var mainInfo = document.querySelector("main > div");
var headerInfo = document.querySelector("#header")
var startQuizButton = document.querySelector("#intro-info > button");
var timer = document.querySelector("#timer");

//hidden elements to appear later
var form = document.querySelector("#high-score-form");
var goBackButton = document.querySelector("#go-back");
var clearScoresButton = document.querySelector("#clear-scores");

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

//listens for answers to the questions
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

//listener for the start quiz button
var startQuiz = function(event){
    //start first question
    addQuestion();

    //set timer to 75 seconds
    timerCount = 200;
    timer.textContent = "Time: " + timerCount;

    //start the timer to go down once every second until 0
    countDown = setInterval(timerCountdown, 1000);
}

//creates the game over screen
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
    //debugger;
    var currentScore = 
    {
        name: document.querySelector("input").value,
        score: timerCount
    };

    if(highScores === null){
        highScores = [currentScore];
    }
    else {
        highScores.push(currentScore);
    }
    loadHighScore();

}

//function to create the high score page/recieve score data
var loadHighScore = function(){
    //sort highScores from largest to smallest by score if there are any highscores
    if(highScores !== null){
        for(var i = 0; i < highScores.length -1; i++){
            if(highScores[i].score < highScores[i + 1].score){
                var temp = highScores[i];
                highScores[i] = highScores[i + 1];
                highScores[i + 1] = temp;
                i = -1;
            }
        }
    }
    
    //Add current scores to the local storage
    localStorage.setItem("highScores", JSON.stringify(highScores));

    //delete previous content (including header)
    deleteEverything();
    headerInfo.remove();
    
    //creating elements for the page
    var overall = document.createElement("div");
    overall.className = "scores";

    var title = document.createElement("h1");
    title.textContent = "High Scores";

    var list = document.createElement("ol");
    list.id = "scores-list";


    //randomly load answers
    if(highScores !== null){
        for(var i = 0; i < highScores.length; i++){
            var listItem = document.createElement("li");
            listItem.className = "score";
            listItem.textContent = highScores[i].name + " - " + highScores[i].score;
            list.appendChild(listItem);
        }
    }
    

    overall.append(title, list);
    
    //move hidden buttons into the current pages div content and show them
    var buttonBack = document.querySelector("#go-back");
    var buttonScores = document.querySelector("#clear-scores");
    buttonBack.className = "btn";
    buttonBack.textContent = "Go Back";
    buttonScores.className = "btn";
    buttonScores.textContent = "Clear High Scores";

    overall.append(buttonBack, buttonScores);
    main.appendChild(overall);

}

var loadScores = function(){
    //grabs info from local storage if its not empty
    var savedScores = localStorage.getItem("highScores");
    if(savedScores === "undefined"){
        return false;
    }
    //parses info and loads it into current highScores array
    savedScores = JSON.parse(savedScores);
    highScores = savedScores;
}

//makes the little footer with wrong or correct
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

//function for the ongoing countdown during the quiz
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


var clearScores = function(){
    //debugger;
    localStorage.setItem("highScores", undefined);
    //parses info and loads it into current highScores array
    highScores = null;
    
    var buttonBack = document.querySelector("#go-back");
    var buttonScores = document.querySelector("#clear-scores");
    buttonBack.textContent = "";
    buttonBack.className = "btn none";
    buttonScores.textContent = "";
    buttonScores.className = "btn none";


    main.append(buttonBack, buttonScores);

    //reset mainInfo to current page
    mainInfo = document.querySelector("main > div");

    loadHighScore();
}

var goBack = function(){
    location.reload();
}

loadScores();
startQuizButton.addEventListener("click", startQuiz);

main.addEventListener("click", nextQuestion);

form.addEventListener("submit", enterHighScore);

goBackButton.addEventListener("click", goBack);
clearScoresButton.addEventListener("click", clearScores);