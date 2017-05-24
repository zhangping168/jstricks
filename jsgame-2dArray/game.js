var stage = document.querySelector('#stage');
var output = document.querySelector('#output');
var map = [
	[0,2,0,0,0,3],
	[0,0,0,1,0,0],
	[0,1,0,0,0,0],
	[0,0,0,0,2,0],
	[0,2,0,1,0,0],
	[0,0,0,0,0,0]
];

//var gameObjects = JSON.parse(JSON.stringify(map));
var gameObjects = [
	[0,0,0,0,0,0],
	[0,0,0,0,0,0],
	[0,0,0,0,0,0],
	[0,0,0,0,0,0],
	[0,0,0,0,0,0],
	[4,0,0,0,0,0],
];


var water=0,island=1,pirate=2,home=3,ship=4;
var size=64,shipRow=0,shipCol=0;
var rows = map.length,cols= map[0].length,cell={};
var fragment = document.createDocumentFragment();
var left=37,up=38,right=39,down=40;

var gameMessage='Use the arrow keys to find your way home',
	food=10,
	gold=10,
	experience=0;

window.addEventListener('keydown',keydownHandler,false);

function keydownHandler(event){
	
	switch(event.keyCode){
		case left:
			//move ship to the left
			if(shipCol>0){
				gameObjects[shipRow][shipCol]=0;
				shipCol--;
				gameObjects[shipRow][shipCol]=ship;
			}
			
			break;
		case up:
			//move ship to the up
			if(shipRow>0){
				gameObjects[shipRow][shipCol]=0;
				shipRow--;
				gameObjects[shipRow][shipCol]=ship;
			}
			
			break;
		case right:
			//move ship to the right
			if(shipCol < cols-1)
			{
				gameObjects[shipRow][shipCol]=0;
				shipCol++;
				gameObjects[shipRow][shipCol]=ship;
			}
			break;
		case down:
			//move ship to the down
			if(shipRow < rows-1){
				gameObjects[shipRow][shipCol]=0;
				shipRow++;
				gameObjects[shipRow][shipCol]=ship;
			}
			
			break;
	}

	food--;
	if(food <= 0 || gold <= 0){
		endGame();
	}
	
	render();
}
render();

function render(){

	if(stage.hasChildNodes()){
		//if stage div already images tags, remove them first

		while(stage.firstChild){
			stage.removeChild(stage.firstChild);
		}
	}

	for(var i=0;i<rows;i++){
		
		for(var j=0;j<cols;j++){
			cell = document.createElement('img');
			fragment.appendChild(cell);
			cell.setAttribute('class','cell');
			
			//add ship

			if(gameObjects[i][j] === ship){
				shipRow=i;
				shipCol=j;
			}



			switch(map[i][j]){
				case water:
					//variable is 0
					//set img src to water.png
					cell.src='img/water.png';
					break;
				case island:
					//variable is 1
					//set img src to island.png
					cell.src='img/island.png';
					break;
				case pirate:
					//variable is 2
					//set img src to pirate.png
					cell.src='img/pirate.png';
					break;
				case home:
					//variable is 3
					//set img src to home.png
					cell.src='img/home.png';
					break;
				default:
					//other variables
					break;

			}//end of switch

			switch(gameObjects[i][j]){
				case ship:
					//set img src to ship.png
					cell.src='img/ship.png';
					break;

			}

			cell.style.top = i*size+'px';
			cell.style.left=j*size+'px';
		}

	}

	stage.appendChild(fragment);

	switch(map[shipRow][shipCol]){
		case water:
			gameMessage = 'You sail the open sea.';
			break;
		case pirate:
			fightPirate();
			break;
		case island:
			tradeOnIsland();
			break;
		case home:
			endGame();
			break;
	}

	//Display the game message
	output.innerHTML=gameMessage;
	//Display the player's status,gold,food and experiences
	output.innerHTML+='<br>Gold: '+gold+', Food: '+food+' experience: '+experience;
}

function fightPirate(){
	//The ship's strength;
	var shipStrength=Math.ceil((food+gold)/2);

	//A random number between 1 and the ship's strength
	var pirateStrength =Math.ceil(Math.random()*shipStrength*2);

	//Find out if the pirates are stronger than the player's ship

	if(pirateStrength > shipStrength){
		//the pirates ransack the ship, the player will lose some food, gold and experience

		var stolenGold = Math.round(pirateStrength/2);
		gold -= stolenGold;

		//Give the player some experinces for trying
		experience+=1;


		//update the game message
		gameMessage ='You fight and lose '+stolenGold+' gold pieces.' +' Ship\'s strength: '+shipStrength+' Pirate\'s strength: '+pirateStrength;
	}else{
		var pirateGold = Math.round(pirateStrength/2);
		gold+=pirateGold;

		experience+=2;
		gameMessage ='You fight and Win '+pirateGold+' gold pieces.' +' Ship\'s strength: '+shipStrength+' Pirate\'s strength: '+pirateStrength;
	}

}
function tradeOnIsland(){
	//Fingure out how much food the island has and how much it should cost
	var islandFood = experience + gold;
	var cost = Math.ceil(Math.random()*islandFood);

	//Let the player buy food if there is enough gold afford it
	if(gold > cost){
		food += islandFood;
		gold -= cost;
		experience+=2;//each success trade will gain 2 points experience

		gameMessage='You buy '+islandFood+' coconuts for ' + cost+' gold pieces.';

	}else{
		//no enough gold to buy food
		experience+=1;
		gameMessage='You don\'t have enough gold to buy food';
	}
}

function endGame(){
	if(map[shipRow][shipCol] === home){
		//calculate the score
		var score = food + gold + experience;

		gameMessage = 'You made it home ALIVE! '+'Final Score: '+score;
	}else{
		if(gold<=0){console.log('gold out');
			gameMessage+='You\'ve run out of gold1';
		}else if(food<=0){console.log('food out');
			gameMessage+='You\'ve run out of food!';
		}
		gameMessage+='Your crew throws your overboard!';
	}

	//Remove DOM event

	window.removeEventListener('keydown',keydownHandler,false);
}	