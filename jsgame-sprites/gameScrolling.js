var spriteObject = {
	sourceX:0,
	sourceY:0,
	sourceWidth:64,
	sourceHeight:64,

	x:0,
	y:0,
	width:64,
	height:64,
	vx:0,
	vy:0

};

var sprites=[];
var canvas = document.querySelector('canvas');
var drawingSurface = canvas.getContext('2d');


var background = Object.create(spriteObject);
background.sourceX=0;
background.sourceY=64;
background.sourceWidth=2561;
background.sourceHeight=1922;

background.width=2561;
background.height=1922;

sprites.push(background);

var gameWorld ={
	x:0,
	y:0,
	width:background.width,
	height:background.height
}

var camera = {
	x:0,
	y:0,
	width:canvas.width,
	height:canvas.height
}

camera.x = (gameWorld.x + gameWorld.width/2)-camera.width/2;
camera.y= (gameWorld.y + gameWorld.height/2)-camera.height/2;

var cat = Object.create(spriteObject);
cat.x = (gameWorld.x + gameWorld.width/2)-cat.width/2;
cat.y = (gameWorld.y + gameWorld.height/2)-cat.height/2;
sprites.push(cat);

//load image
var image = new Image();
image.addEventListener('load',loadHandler,false);
image.src='images/phobosTileSheet.png';
function loadHandler(){
	update();
}

function update(){
	window.requestAnimationFrame(update,canvas);

	//move the cat sprite and keep it inside the gameworld boundaries
	cat.x=Math.max(0,Math.min(cat.x+cat.vx,gameWorld.width-cat.width));
	cat.y = Math.max(0,Math.min(cat.y+cat.vy,gameWorld.height-cat.height));

	//center the camera to follow the cat
	camera.x = Math.floor((cat.x+cat.width/2) - camera.width/2);
	camera.y = Math.floor((cat.y+cat.height/2) - camera.height/2);

	//keep the camera inside the gameworld boundaries
	if(camera.x < gameWorld.x){
		camera.x = gameWorld.x;
	}
	if(camera.y < gameWorld.y){
		camera.y = gameWorld.y;
	}
	
	if((camera.x+camera.width)>(gameWorld.x+gameWorld.width) ){
		camera.x = gameWorld.x+gameWorld.width - camera.width;
	}

	if((camera.y+camera.height)>(gameWorld.y+gameWorld.height) ){
		camera.y = gameWorld.y+gameWorld.height - camera.height;
	}

	render();
}

function render(){
	drawingSurface.clearRect(0,0,canvas.width,canvas.height);
	drawingSurface.save();

	//move the drawing surface so that it is positioned relative to the camera
	drawingSurface.translate(-camera.x,-camera.y);

	//loop through all the sprites and display them
	if(sprites.length){
		for(var i=0;i<sprites.length;i++){
			var sprite = sprites[i];

			drawingSurface.drawImage(
				image,
				sprite.sourceX,sprite.sourceY,
				sprite.sourceWidth,sprite.sourceHeight,
				Math.floor(sprite.x),Math.floor(sprite.y),
				sprite.width,sprite.height
			);//end of drawingSurface
		}
	}

	drawingSurface.restore();
}