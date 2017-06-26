var spriteObject={
	sourceX:0,sourceY:0,sourceWidth:64,sourceHeight:64,
	x:0,y:0,width:64,height:64,

	centerX:function(){
		return this.x+this.width/2;
	},
	centerY:function(){
		return this.y+this.height/2;
	},
};

var canvas = document.querySelector('canvas');
var drawingSurface = canvas.getContext('2d');
var sprites = [];
var message='No collision...';
drawingSurface.font='normal 16px Arial';
drawingSurface.fillStyle='#f00';
drawingSurface.textAlign='center';

var image = new Image();

image.addEventListener('load',loadHandler,false);
image.src='img/circles.png';

function loadHandler(){
	
	update();
}

function moveCircle(moveSprite){
	if(moveLeft && !moveRight){
				moveSprite.x-=speed;
			}
			if(moveRight && !moveLeft){
				moveSprite.x+=speed;
			}

			if(moveUp && !moveDown){
				moveSprite.y-=speed;
			}

			if(moveDown && !moveUp){
				moveSprite.y+=speed;
			}
}
function update(){
	window.requestAnimationFrame(update,canvas);
	moveCircle(redCircle);
	render();	
}

var redCircle = Object.create(spriteObject);

sprites.push(redCircle);

var blueCircle = Object.create(spriteObject);
blueCircle.sourceX=64;
blueCircle.x=128;
sprites.push(blueCircle);

var vx=0,vy=0,magnitude=0,totalRadius=0,speed=5,moveLeft=false,moveRight=false,moveUp=false,moveDown=false,arrowLeft=37,arrowUp=38,arrowRight=39,arrowDown=40;

function hitTestCircle(circleOne, circleTwo){
	vx = Math.abs(circleOne.centerX()-circleTwo.centerX());
	vy = Math.abs(circleOne.centerY()-circleTwo.centerY());

	magnitude = Math.sqrt(vx*vx+vy*vy);
	totalRadius = circleOne.width/2+circleTwo.width/2;

	var hit = magnitude < totalRadius;

	return hit;
}

window.addEventListener('keydown',keydownHandler,false);

function keydownHandler(event){
	var action = event.keyCode;
	switch(action){
		case arrowLeft:
			moveLeft=true;
			break;
		case arrowRight:
			moveRight=true;
			break;
		case arrowUp:
			moveUp=true;
			break;
		case arrowDown:
			moveDown=true;
			break;
	}
}

window.addEventListener('keyup',keyupHandler,false);

function keyupHandler(event){
	var action = event.keyCode;
	switch(action){
		case arrowLeft:
			moveLeft=false;
			break;
		case arrowRight:
			moveRight=false;
			break;
		case arrowUp:
			moveUp=false;
			break;
		case arrowDown:
			moveDown=false;
			break;
	}
}

function render(){

	//clear canvas before drawing
	drawingSurface.clearRect(0,0,canvas.width,canvas.height);

	if(sprites.length){
		for(var i=0;i<sprites.length;i++){
			var sprite = sprites[i];

			drawingSurface.drawImage(
				image,
				sprite.sourceX,sprite.sourceY,sprite.sourceWidth,sprite.sourceHeight,
				Math.floor(sprite.x),Math.floor(sprite.y),
				sprite.width,sprite.height);

		}
	}
	if(hitTestCircle(blueCircle,redCircle)){
		message = 'Collision!';
		blockOverLapping(redCircle,blueCircle);
	}else{
		message = 'No collision...';
	}
	drawingSurface.fillText(message,canvas.width/2,canvas.height/2);

}

function blockOverLapping(c1,c2){
		var vx = Math.abs(c1.x-c2.x);
		var vy = Math.abs(c1.y-c2.y);

		var magnitude = Math.sqrt(vx*vx+vy*vy);
		var totalRadius = c1.width/2+c2.width/2;

		if(magnitude>totalRadius){
			//no collision
		}else{
			//collision
			var overlapSpacing = totalRadius - magnitude;
			
			//Reposition the vetcor
			dx = vx/magnitude;
			dy = vy/magnitude;

			//move circle1 out of collision
			c1.x+=overlapSpacing*dx;
			c1.y+=overlapSpacing*dy;
		}

	}