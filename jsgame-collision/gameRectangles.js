var spriteObject={
	sourceX:0,
	sourceY:0,
	sourceWidth:64,
	sourceHeight:64,

	x:0,
	y:0,
	width:64,
	height:64
}


var sprites=[],message='',score=0,collisionHasOccured=false,speed=5;

//create html5 canvas
var canvas = document.querySelector('canvas');
var drawingSurface = canvas.getContext('2d');
drawingSurface.font='normal 18px Arial';
drawingSurface.fillStyle='#000';

var cat = Object.create(spriteObject);
cat.x = 0;
cat.y = 0;
sprites.push(cat);

var monster = Object.create(spriteObject);

monster.x = canvas.width/2;
monster.y=canvas.height/2;
//monster state
monster.NORMAL = [1,0];
monster.SCARED = [0,1];
monster.state = monster.NORMAL;
monster.update = function(){
	this.sourceX = this.state[0] * this.sourceWidth;
	this.sourceY = this.state[1] * this.sourceHeight;


};
sprites.push(monster);

var outterMeter = Object.create(spriteObject);
outterMeter.sourceY=128;
outterMeter.sourceWidth=128;
outterMeter.sourceHeight=14;
outterMeter.x = monster.x-32;
outterMeter.y = monster.y-32;
outterMeter.width=128;
outterMeter.height=14; 



var innerMeter = Object.create(spriteObject);
innerMeter.sourceY=142;
innerMeter.sourceWidth=128;
innerMeter.sourceHeight=14;
innerMeter.x = outterMeter.x;
innerMeter.y = outterMeter.y;
innerMeter.width=128;
innerMeter.height=14; 

sprites.push(innerMeter);
sprites.push(outterMeter);


var image = new Image();

image.addEventListener('load',loadHandler,false);
image.src='img/collisionTileSheet.png'; //load image

function loadHandler(){
	update();
}

function update(){
	window.requestAnimationFrame(update,canvas);

	if(hitTestRectangle(cat,monster)){//collision
		monster.state = monster.SCARED;
		if(innerMeter.width>0){ //reduce monster health bar value
			innerMeter.width--;
			innerMeter.sourceWidth--;

			if(innerMeter.width<1){
				message = 'Game Over!';

			}
		}

	}else{
		//no collision
		monster.state = monster.NORMAL;
	}

	if(moveLeft && !moveRight){
		//move to left
		cat.x-=speed;
	}else if(moveRight && !moveLeft){
		cat.x+=speed;
	}else if(moveUp&&!moveDown){
		cat.y-=speed;
	}else if(moveDown&&!moveUp){
		cat.y+=speed;
	}

	monster.update();

	render();
}

function render(){
	//clear the canvas before drawing
	drawingSurface.clearRect(0,0,canvas.width,canvas.height);

	if(sprites.length){

		for(var i=0;i<sprites.length;i++){
			var sprite = sprites[i];

			drawingSurface.drawImage(
					image,
					sprite.sourceX,sprite.sourceY,
					sprite.sourceWidth,sprite.sourceHeight,
					Math.floor(sprite.x),Math.floor(sprite.y),
					sprite.width,sprite.height
				);
		}//end of for loop

	}//end of if condition

	drawingSurface.fillText(message,innerMeter.x+10,innerMeter.y-5);

}

//check collision
function hitTestRectangle(cat,monster){
	var hit = false;
	var vx = Math.abs(cat.x - monster.x);
	var vy = Math.abs(cat.y - monster.y)
	var halfWidth = Math.floor(cat.width/2 + monster.width/2);
	var halfHeight = Math.floor(cat.height/2 + monster.height/2);

	if(vx<halfWidth && vy<halfHeight){
		//two objects collapse
		hit = true;
		
	}else{
		hit = false;
	
	}


	return hit;
}

//keyboard movement
window.addEventListener('keydown',keydownHandler,false);
window.addEventListener('keyup',keyupHandler,false);

var arrowLeft=37,arrowUp=38,arrowRight=39,arrowDown=40;
var moveLeft=false,moveUp=false,moveRight=false,moveDown=false;
function keydownHandler(event){
	var keycode = event.keyCode;

	switch(keycode){
		case arrowLeft:
			moveLeft=true;
			break;
		case arrowUp:
			moveUp=true;
			break;
		case arrowRight:
			moveRight=true;
			break;
		case arrowDown:
			moveDown=true;
			break;
	}
}

function keyupHandler(event){
	var keycode = event.keyCode;

	switch(keycode){
		case arrowLeft:
			moveLeft=false;
			break;
		case arrowUp:
			moveUp=false;
			break;
		case arrowRight:
			moveRight=false;
			break;
		case arrowDown:
			moveDown=false;
			break;
	}
}