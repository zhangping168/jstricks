(function(){
	
	//All the game's program code goes here

	//create canvas
	var canvas = document.querySelector('canvas');
	var drawingSurface = canvas.getContext('2d');

	//create game object arrays
	var sprites=[],missiles=[],aliens=[],assetsToLoad=[],messages=[],assetsLoaded=0;
	var gameLoading=0,gamePlaying=1,gameOver=2,gameState = gameLoading;
	var alienFrequency=100,alienTimer=0;
	var score=0,scoreNeededToWin=6; //scoreNeedToWin can set to 60
	
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

	//Game message object
	var scoreDisplay = Object.create(messageObject);
	scoreDisplay.text='0';
	scoreDisplay.font='normal bold 30px emulogic';
	scoreDisplay.fillStyle='#00ff00';
	scoreDisplay.x=400;
	scoreDisplay.y=10;
	messages.push(scoreDisplay);

	var gameOverMessage = Object.create(messageObject);
	gameOverMessage.font='normal bold 20px emulogic';
	gameOverMessage.fillStyle='#00ff00';
	gameOverMessage.x=70;
	gameOverMessage.y=120;
	gameOverMessage.visible=false;
	messages.push(gameOverMessage);
	

	//create image assets
	var image = new Image();
	image.addEventListener('load',loadHandler,false);
	image.src='../images/alienArmada.png';
	assetsToLoad.push(image);

	//create sound assets
	var music = document.querySelector('#music');
	music.addEventListener('canplaythrough',loadHandler,false);
	music.load();
	assetsToLoad.push(music);

	
	var shootSound =document.querySelector('#shootSound');
	shootSound.addEventListener('canplaythrough',loadHandler,false);
	shootSound.load();
	assetsToLoad.push(shootSound);

	var explosionSound = document.querySelector('#explosionSound');
	explosionSound.addEventListener('canplaythrough',loadHandler,false);
	explosionSound.load();
	assetsToLoad.push(explosionSound);

	function loadHandler(){
		assetsLoaded++;
		if(assetsLoaded == assetsToLoad.length){
			//finish the game assets loading
			//remove the attached event listenrs
			//start the game

			image.removeEventListener('load',loadHandler,false);

			//remove sounds event listener
			music.removeEventListener('canplaythrough',loadHandler,false);
			shootSound.removeEventListener('canplaythrough',loadHandler,false);
			explosionSound.removeEventListener('canplaythrough',loadHandler,false);
			
			music.play();
			music.volume=0.3;
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
				endGame();
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

		//Display game messages
		if(messages.length){
			for(var i=0;i<messages.length;i++){
				var message = messages[i];

				if(message.visible){
					console.log('message:',message.text);
					drawingSurface.font=message.font;
					drawingSurface.fillStyle=message.fillStyle;
					drawingSurface.textBaseline = message.textBaseline;
					drawingSurface.fillText(message.text,message.x,message.y);
				}
			}
		}

	}

	//keyboard event for cannon object

	var arrowLeft=37, arrowRight=39, moveLeft=false,moveRight=false,spaceKey=32,spaceKeyIsDown=false,shoot=false;

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
			case spaceKey:
				if(!spaceKeyIsDown){
					spaceKeyIsDown = true;
					shoot=true;	
				}
				
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
			case spaceKey:
				spaceKeyIsDown=false;
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

		//cannon fire missiles
		if(shoot){
			fireMissile();
			shoot=false;//Prevent more than one shot being fired
		}
		//update cannon movements

		cannon.x= Math.max(0,Math.min(cannon.x+cannon.vx,canvas.width-cannon.width));

		//move the missile
		for(var i=0;i<missiles.length;i++){
			var missile = missiles[i];

			//move missile up the screen
			missile.y += missile.vy;

			//remove missile if out of top screen
			 if(missile.y < 0 - missile.height){
				//remove missile from missiles array
				removeObject(missile,missiles);
				//remove missile from sprites array
				removeObject(missile,sprites);
				i--;//reduce the loop counter by one to compensate for the removed element
			}

		}

		//Add one to the alienTimer
		alienTimer++;

		//make a new alien if alienTimer equals alienFrequency
		if(alienTimer==alienFrequency){
			makeAlien();
			alienTimer=0;//reset alienTimer

			//Reduce the alienFrequency by one to gradually increase the frequency that aliens are created
			//aliens will appear faster by time
			if(alienFrequency>2){
				alienFrequency--;
			}

		}

		//move aliens
		for(var i=0;i<aliens.length;i++){
			var alien=aliens[i];
			if(alien.state=alien.NORMAL){
				//move current alien if its state is normal
				alien.y+=alien.vy;

			}
			//check if the alien has crossed the bottom of the screen
			if(alien.y > canvas.height+alien.height){
				//End game if an alien reached earth
				gameState= gameOver;
			}
		}

		//check if alien has collision with missile
		for(var i=0;i<aliens.length;i++){

			var alien = aliens[i];
			for(var j=0;j<aliens.length;j++){
				var missile = missiles[i];
				if(missile && alien && hitTestRectangle(alien,missile) && alien.state === alien.NORMAL){

					//missile hit alien and destory it
					destoryAlien(alien);
					score++;
					scoreDisplay.text=score;

					//remove missile
					removeObject(missile,missiles);
					removeObject(missile,sprites);

					if(score===scoreNeededToWin){
						gameState = gameOver;
					}


					//Subtract 1 from the loop counter to compensate for the removed missile
					j--;			}
			}
		}


	}

	function endGame(){
		console.log('game over');

		gameOverMessage.visible=true;

		if(score<scoreNeededToWin){
			gameOverMessage.text='EARTH DESTROYED!';
		}else{
			gameOverMessage.x=120;
			gameOverMessage.text='EARTH SAVED!';
		}
	}

	function fireMissile(){
		//create a missile sprite
		var missile = Object.create(spriteObject);
		missile.sourceX=96;
		missile.sourceWidth=16;
		missile.sourceHeight=16;
		missile.width=16;
		missile.height=16;

		//center missile over cannon
		missile.x=cannon.centerX()-missile.halfWidth();
		missile.y=cannon.y-missile.height;

		//set missile speed
		missile.vy=-8;//missile moves from bottom to top

		//put missile into sprites and missiles array
		sprites.push(missile);
		missiles.push(missile);

		shootSound.currentTime=0;
		shootSound.play();

	}

	//remove object function
	function removeObject(elementToRemove,array){
		var i = array.indexOf(elementToRemove);
		if(i!==-1){ //element exists in array
			array.splice(i,1);
		}

		console.log('object removed');
	}

	//make alien function
	function makeAlien(){

		//create the alien
		var alien = Object.create(alienObject);
		alien.sourceX=32;


		//set its Y position above the top screen boundary
		alien.y=0-alien.height;

		//asign the alien random X position
		var randomPosition = Math.floor(Math.random()*15);
		alien.x=randomPosition*alien.width;

		//set its speed
		alien.vy=1;

		//push the alien to sprites and aliens array
		sprites.push(alien);
		aliens.push(alien);
	}

	//destory alien function
	function destoryAlien(alien){
		//change the alien state and update the object



		alien.state = alien.EXPLODED;
		alien.update();

		//remove the alien after one second
		setTimeout(removeAlien,1000);
		//remove alien function
		function removeAlien(){
			removeObject(alien,aliens);
			removeObject(alien,sprites);
		}

		explosionSound.currentTime=0;
		explosionSound.play();
	}


}());