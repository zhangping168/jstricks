var mapLocations = [
	'stone keep',
	'well',
	'sunny glade',
	'sleeping dragon',
	'path',
	'acient gate',
	'river\'s edge',
	'wooden bench',
	'cottage'
];

var images=[
	'keep.png',
	'well.png',
	'glade.png',
	'dragon.png',
	'path.png',
	'gate.png',
	'river.png',
	'bench.png',
	'cottage.png'
];

var directions=[
	'north',
	'east',
	'south',
	'west'
	];

var blockedPathMessages=[
	'It\'s too dangerous to move that way.',	
	'A mysterious force holds you back.',
	'A tangle of thorns blocks your way.',
	'You can\'t step over the dragon.',
	'',
	'The gate locks shut.',
	'The river is too deep to cross.',
	'The trees are too thick to pass.',
	'You\'re too scared to go that way'
];

var items=['flute','stone','sword'];
var itemsIKnow=['flute','stone','sword'];
var itemLocations=[1,6,8];


var output = document.querySelector('#output'),
	input = document.querySelector('#input'),
	enterBtn = document.querySelector('#enterBtn'),
	image = document.querySelector('img'),
	mapLocation=4,
	userInput='',
	outputMessage='',
	gameMessage='',
	itemMessage='',
	actionMessage='',
	backpackMessage='',
	backpack=[],
	action='',
	item='';

enterBtn.addEventListener('click',clickHandler, false);

function clickHandler(event){
	playgame();
}


function playgame(){

	userInput = input.value.toLowerCase();
	console.log('userInput',userInput);
	action = userInput;
	for(var i=0;i<directions.length;i++){
		if(userInput.indexOf(directions[i])!==-1){
			action=directions[i];
		}
	}
	for(i=0;i<itemsIKnow.length;i++){
		if(userInput.indexOf(itemsIKnow[i]) !==-1){
			item=itemsIKnow[i];
			console.log('Player\'s item: '+item);
		}
	}
	
	console.log('action',action);
		//if user input is valid
		switch(action){
			case 'north':
				if(mapLocation >=3){//locations at second row at least
					mapLocation -= 3;
				}else{
					gameMessage=blockedPathMessages[mapLocation];
				}
				
				break;
			case 'east':
				if(mapLocation % 3 !=2){
					mapLocation += 1;
				}else{
					gameMessage=blockedPathMessages[mapLocation];
				}
				
				break;
			case 'south':
				if(mapLocation <6){
					mapLocation += 3;
				}else{
					gameMessage=blockedPathMessages[mapLocation];
				}
				
				break;
			case 'west':
				if(mapLocation % 3 !=0){
					mapLocation -= 1;
				}else{
					gameMessage=blockedPathMessages[mapLocation];
				}
				
				break;
			case 'take':
			console.log('take case');
				takeItem();
				break;
			case 'drop':
				dropItem();
				break;
			case 'use':
				useItem();
				break;

			default:
				outputMessage='I don\'t understand';
		}
	

	render();
}

function takeItem(){
	console.log('take Item func');
	//Find the index numner of the item in the items array
	var itemIndex = items.indexOf(item);
	//Does the item exists in the game workd and is it at the player's current location?

	if(itemIndex!==-1 && itemLocations[itemIndex] === mapLocation){
		actionMessage  = '<br/>You take the '+item+'.';
		backpack.push(item);//add the item to the player's backpack

		//remove the item from the game world
		items.splice(itemIndex,1);
		itemLocations.splice(itemIndex,1);

	}else{
		//Message if the player tries to take an item that is nott in the current location
		actionMessage ='Item not found at your location';
	}
}

function dropItem(){

}

function useItem(){

}

function checkBackpack(){
	if(backpack.length>1){

		backpackMessage = '<br/>You are carying ' + backpack.join(', ');
	}
}
function render(){
	image.src='./img/'+images[mapLocation];

	//Display an item if there is one in this locaiton;
	//1. Loop through all the game items
	for(var i=0;i<items.length;i++){
		//find out if there is an item at this location
		if(mapLocation === itemLocations[i]){
			//Display this item
			itemMessage='<br>You see a <strong>'+items[i]+'</strong> here.';
		}
	}
	checkBackpack();
	output.innerHTML = 'You entered the area of <b>['+mapLocations[mapLocation]+']</b><br><b>'+gameMessage+'</b>'+itemMessage+ actionMessage + backpackMessage;
}
