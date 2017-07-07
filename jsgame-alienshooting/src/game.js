(function(){
	
	//All the game's program code goes here

	//create canvas
	var canvas = document.querySelector('canvas');
	var drawingSurface = canvas.getContext('2d');

	//create game object arrays
	var sprites=[],assetsToLoad=[],assetsLoaded=0;
	var gameLoading=0,gamePlaying=1,gameOver=2,gameState = gameLoading;
	
	//create background object
	var background = Object.create(spriteObject);
	background.sourceY=32;
	background.sourceWidth=480;
	background.sourceHeight=320;
	background.width=480;
	background.height=320;
	sprites.push(background);


	//create cannon object
	var cannon = Object.create(spriteObject);
	cannon.sourceWidth=32;
	cannon.sourceHeight=32;
	cannon.x = canvas.width/2-cannon.width;
	cannon.y = 280;
	sprites.push(cannon);

	//create image assets
	var image = new Image();
	image.addEventListener('load',loadHandler,false);
	image.src='../images/alienArmada.png';
	assetsToLoad.push(image);

	function loadHandler(){
		assetsLoaded++;
		if(assetsLoaded == assetsToLoad.length){
			//finish the game assets loading
			//remove the attached event listenrs
			//start the game

			image.removeEventListener('load',loadHandler,false);
			gameState = gamePlaying;
		}
	}//end of image loadhandler function

	update();

	function update(){
		window.requestAnimationFrame(update,canvas);

		//check game state
		switch(gameState){
			case gameLoading:
				console.log('loading game assets');
				break;

			case gamePlaying:
				playGame();
				break;

			case gameOver:
				gameOver();
				break;
		}

		render();
	}

	function render(){
		//loop through sprites array to display its items on canvas

		//clear canvas before drawing anything

		drawingSurface.clearRect(0,0,canvas.width,canvas.height);
		if(sprites.length){ //start drawing if sprites not empty
			for(var i=0;i<sprites.length;i++){
				var sprite = sprites[i];
				drawingSurface.drawImage(
					image,
					sprite.sourceX,sprite.sourceY,
					sprite.sourceWidth,sprite.sourceHeight,
					Math.floor(sprite.x),Math.floor(sprite.y),
					sprite.width,sprite.height
					);
			}
		}

	}

	//keyboard event for cannon object

	var arrowLeft=37, arrowRight=39, moveLeft=false,moveRight=false;

	window.addEventListener('keydown',keydownHandler,false);
	window.addEventListener('keyup',keyupHandler,false);

	function keydownHandler(event){
		switch(event.keyCode){
			case arrowLeft:
				moveLeft = true;
				
				break;
			case arrowRight:
				moveRight = true;
				
				break;

		}
	}
	function keyupHandler(event){
		switch(event.keyCode){
			case arrowLeft:
				moveLeft = false;
				break;
			case arrowRight:
				moveRight = false;
				break;

		}
	}

	//playGame and gameOver funcitons

	function playGame(){

		if(moveLeft && !moveRight){
			//cannon move to left side
			cannon.vx=-8;
		}

		if(moveRight && !moveLeft){
			//cannon move to right side
			cannon.vx=8;
		}

		if(!moveLeft && !moveRight){
			//cannon stops moving
			cannon.vx=0;
		}

		//update cannon movements

		cannon.x= Math.max(0,Math.min(cannon.x+cannon.vx,canvas.width-cannon.width));

	}

	function gameOver(){
		
	}

}());