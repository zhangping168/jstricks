

var output = document.querySelector('#output'),
	input = document.querySelector('#input'),
	guessBtn = document.querySelector('button'),
	arrow = document.querySelector('#arrow'),
	answer = Math.floor(Math.random() * 100),
	guessRemaining = 5,
	guessMade = 0,
	gameState= '',
	gameWon=false,
	playerGuess=0;

guessBtn.addEventListener('click',clickHandler,false);

window.addEventListener('keydown',keydownHandler,false);

function render(){
	//Position the arrow, size 300px 3 times of 100
	//Multipy the players guess by 3 to get the
	//correct pixel position on the scale

	arrow.style.left = playerGuess*3 + 'px';
}

function keydownHandler(event){
	if(event.keyCode === 13){
		validateInput();
	}
}
function clickHandler(){
	validateInput();
}

function validateInput(){
	playerGuess = parseInt(input.value);

	if(isNaN(playerGuess)){
		output.innerHTML = 'Please enter a number'; 
	}else{
		playGame();
	}
}

function endGame(){
	if(gameWon){
		//Guess correct number before guess times
		output.innerText = 'Yes, it is number ' + answer+' !'+'<br>'+' It only took you '+guessMade+' guesses.';
		
	}else{
		output.innerText = 'No more guesses left!'+'<br/>'+'The number was: '+answer+'.'; 
		
	}
	
	guessBtn.removeEventListener('click',clickHandler,false);
	guessBtn.disabled = true;

	window.removeEventListener('keydown',keydownHandler,false);
	input.disabled = true;
}
function playGame(){
	
	guessRemaining = guessRemaining -1;
	guessMade = guessMade + 1;
	gameState = 'Guess: '+ guessMade +' , Guess Remaining: ' + guessRemaining;
	
			if(playerGuess > answer){
				
				output.innerText = 'Your number is too high! ' + gameState;
				if(guessRemaining <1 ){
					endGame();
				}
			}else if(playerGuess < answer){
				
				output.innerText = 'Your number is too low! ' + gameState;
				if(guessRemaining <1 ){
					endGame();
				}
			}else{
				gameWon=true;
				endGame();
			}
	render();
}