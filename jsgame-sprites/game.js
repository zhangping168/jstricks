var spriteObject = {
	sourceX:0,
	sourceY:0,
	sourceWidth:64,
	sourceHeight:64,

	x:0,
	y:0,
	width:64,
	height:64,

	visible:true,
	rotation:0,
	alpha:1,
	shadow:true

};

//keycode

var LEFT=37,UP=38,RIGHT=39,DOWN=40;
var moveLeft=false,moveUp=false,moveRight=false,moveDown=false;
//The main program

//the canvas and its drawing surface

window.addEventListener('keydown',keydownHandler,false);

function keydownHandler(event){
	switch(event.keyCode){
		case LEFT:
			moveLeft=true;
			break;
		case UP:
			moveUp=true;
			break;
		case RIGHT:
			moveRight=true;
			break;
		case DOWN:
			moveDown=true;
			break;
	}//end of switch condition
}

window.addEventListener('keyup',keyupHandler,false);

function keyupHandler(event){
	switch(event.keyCode){
		case LEFT:
			moveLeft=false;
			break;
		case UP:
			moveUp=false;
			break;
		case RIGHT:
			moveRight=false;
			break;
		case DOWN:
			moveDown=false;
			break;
	}//end of switch condition
}

var canvas = document.querySelector('canvas');
var drawingSurface = canvas.getContext('2d');

//dom button elements

var	buttons = document.querySelector('#buttons');

buttons.addEventListener('click',clickHandler,false);
function clickHandler(event){
	event.preventDefault();
	
	if(event.target.nodeName==='BUTTON'){
		var buttonID = event.target.id;
		switch(buttonID){
			case 'up':
				up();
				render();
				break;
			case 'down':
				down();
				render();
				break;
			case 'left':
				left();
				render();
				break;
			case 'right':
				right();
				render();
				break;
			case 'hide':
				hide();
				render();
				break;
			case 'show':
				show();
				render();
				break;
			case 'smaller':
				smaller();
				render();
				break;
			case 'bigger':
				bigger();
				render();
				break;

			case 'rotateRight':
				rotateRight();
				render();
				break;
			case 'rotateLeft':
				rotateLeft();
				render();
				break;

			case 'moreTransparent':
				moreTransparent();
				render();
				break;
			case 'lessTransparent':
				lessTransparent();
				render();
				break;

			case 'shadowOn':
				shadowOn();
				render();
				break;
			case 'shadowOff':
				shadowOff();
				render();
				break;

		}
	}//end of switch

	function up(){
		console.log('up');
	cat.y--;
}
function down(){
	cat.y++;
}
function left(){
	cat.x--;
}

function right(){
	cat.x++;
}

function hide(){
	cat.visible = false;
}

function show(){
	cat.visible = true;
}
function smaller(){
	cat.width-=2;
	cat.height-=2;
	cat.x++;
	cat.y++;
}
function bigger(){
	cat.width+=2;
	cat.height+=2;
	cat.x--;
	cat.height--;
}

function rotateRight(){
	cat.rotation+=10;
}

function rotateLeft(){
	cat.rotation-=10;
}

function moreTransparent(){

	if(cat.alpha>0.1){
		cat.alpha-=0.1;
	}
}

function lessTransparent(){
	if(cat.alpha<1){
		cat.alpha+=0.1;
	}
}

function shadowOn(){
	cat.shadow=true;
}
function shadowOff(){
	cat.shadow=false;
}
//end of buttons functions
}


//An array to store the game sprites

var sprites=[];

//create the cat sprite.
//center is on the canvas and push it to the sprites array

var background = Object.create(spriteObject);
background.sourceX=0;
background.sourceY=64;
background.sourceWidth=550;
background.sourceHeight=400;
background.width=550;
background.height=400;
sprites.push(background);

var cat = Object.create(spriteObject);
cat.sourceX=0;
cat.sourceY=0;
cat.sourceWidth=64;
cat.sourceHeight=64;
cat.x=200;
cat.y=200;
cat.height=168;
cat.width=64;
cat.height=64;
cat.vx=0;
cat.vy=0;
sprites.push(cat);

var image = new Image();
image.addEventListener('load',loadHandler,false);
image.src='images/tileSheetWithBackground.png';

function loadHandler() {
	update();
}

function update(){
	window.requestAnimationFrame(update,canvas);

	//up key
	if(moveUp && !moveDown){
		cat.vy=-1;
	}

	//down
	if(moveDown && !moveUp){
		cat.vy=1;
	}

	//left
	if(moveLeft && !moveRight){
		cat.vx=-1;
	}

	//right
	if(moveRight && !moveLeft){
		cat.vx=1;
	}

	//stop the sprite if no arrow key pressed

	if(!moveLeft && !moveRight && !moveUp && !moveDown){
		cat.vx=0;
		cat.vy=0;
	}

	cat.x+=cat.vx;
	cat.y+=cat.vy;

	//stop the sprite at the canvas edge
	//Block at canvas edge
	/*
	cat.x=Math.max(0,Math.min(cat.x+cat.vx,canvas.width-cat.width));
	cat.y=Math.max(0,Math.min(cat.y+cat.vx,canvas.height-cat.height));
	*/

	//screen wrapping
	if(cat.x>canvas.width){
		cat.x=0-cat.width;
	}
	if((cat.x+cat.width)<0){
		cat.x=canvas.width;
	}
	if(cat.y>canvas.height){
		cat.y=0-cat.height;
	}
	if((cat.y+cat.height)<0){
		cat.y=canvas.height;
	}
	
	render();
}


function render(){

	//clear the canvas before drawing
	drawingSurface.clearRect(0,0,canvas.width,canvas.height);

	

	if(sprites.length !== 0 ){
		for(var i=0;i<sprites.length;i++){
		var sprite = sprites[i];

		if(sprite.visible){
			//save current canvas state
			drawingSurface.save();
			drawingSurface.globalAlpha=sprite.alpha;
			//move canvas to center of sprite

			drawingSurface.translate(
				Math.floor(sprite.x+sprite.width/2),
				Math.floor(sprite.y+sprite.height/2)
			);



			if(sprite.rotation){
				drawingSurface.rotate(Math.floor(sprite.rotation*Math.PI/180));
			}

			if(sprite.shadow){
				drawingSurface.shadowColor='rgba(100,100,100,0.5)';
				drawingSurface.shadowOffsetX=3;
				drawingSurface.shadowOffsetY=3;
				drawingSurface.shadowBlur=3;
			}
			drawingSurface.drawImage(
			image,
			sprite.sourceX,sprite.sourceY,sprite.sourceWidth,sprite.sourceHeight,
			Math.floor(-sprite.width/2),Math.floor(-sprite.height/2),sprite.width,sprite.height
			);//end of drawing image

			//restore the last canvas state
			drawingSurface.restore();
		}


		}
	}//end of drawing image




}


