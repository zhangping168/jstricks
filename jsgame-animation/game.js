var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');
var img = new Image();

var monster = {
	img:'images/monsterTileSheet.png',
	size:128,

	numberOfFrames:7,
	currentFrame:0,

	//Position of the animation cell's X and Y positions on tilesheet
	sourceX:0,
	sourceY:0,

	updateAnimation:function(){
		this.sourceX = (this.currentFrame%3)*this.size;
		this.sourceY = Math.floor(this.currentFrame/3)*this.size;

		console.log('currentFrame:',this.currentFrame);
		console.log('sourceX:',this.sourceX);
		console.log('sourceY:',this.sourceY);
	}
};

var canvas= document.querySelector('canvas');
var drawingContext = canvas.getContext('2d');

var monsterImg = new Image();

monsterImg.src=monster.img;

monsterImg.addEventListener('load',loadHandler,false);

function loadHandler(){
	window.setInterval(timeoutHandler,1000);
	
}

function timeoutHandler(){
	
	if(monster.currentFrame < monster.numberOfFrames){

		monster.updateAnimation();
		monster.currentFrame++;
		render();
	}else{
		window.clearInterval(timeoutHandler);
	}
}

function render(){
	//draw image 
	drawingContext.drawImage(
		monsterImg,
		//source
		monster.sourceX,monster.sourceY,128,128,
		//destination
		0,0,monster.size,monster.size
	);
}


