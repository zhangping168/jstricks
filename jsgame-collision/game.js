var spriteObject = {
	sourceX:0,
	sourceY:0,
	sourceWidth:64,
	sourceHeight:64,

	x:0,
	y:0,
	width:64,
	height:64,

	left: function(){
		return this.x;
	},
	right:function(){
		return this.x+this.width;
	},
	top:function(){
		return this.y;
	},
	bottom:function(){
		return this.y+this.height;
	}

}



var canvas = document.querySelector('canvas');
var drawingSurface = canvas.getContext('2d');
drawingSurface.font='normal bold 18px Helvetica';
drawingSurface.fillStyle='#000';
drawingSurface.textBaseline='top';

var image = new Image();

image.addEventListener('load',loadHandler, false);
image.src='img/squares.png';
function loadHandler(){
	update();
}

var sprites=[];

var square = Object.create(spriteObject);
//center square on canvas
square.x = canvas.width/2-square.width/2;
square.y = canvas.height/2-square.height/2;

sprites.push(square);

var mouseX,mouseY=0;
var message = 'No collision...';


canvas.addEventListener('mousemove',mousemoveHandler,false);

function mousemoveHandler(event){
	mouseX = event.pageX - canvas.offsetLeft;
	mouseY = event.pageY - canvas.offsetTop;

}

function update(){
	window.requestAnimationFrame(update,canvas);

	if(hitTestPoint(mouseX, mouseY, square)){
			
		message = 'Collision!';
	}else{
		message = 'No collision...';
		
	}

	render();
}
function hitTestPoint(pointX,pointY,sprite){
	var hit 
    = pointX > sprite.left() && pointX < sprite.right()
    && pointY > sprite.top() && pointY < sprite.bottom();
    
  return hit;

}
function render(){
	//clear canvas first before drawing

	drawingSurface.clearRect(0,0,canvas.width,canvas.height);

	if(sprites.length){
		for(var i=0;i<sprites.length;i++){
			var sprite = sprites[i];
			drawingSurface.drawImage(image,
		sprite.sourceX,sprite.sourceY,sprite.sourceWidth,sprite.sourceHeight,
		Math.floor(sprite.x),Math.floor(sprite.y),
		sprite.width,sprite.height);
		}
	}
	
	
	drawingSurface.fillText(message,square.x,square.y-45);
}