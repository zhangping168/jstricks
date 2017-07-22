(function() {

	//the game map
	//The game map
	var map =
		[
			[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
			[3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
			[3, 1, 2, 2, 2, 1, 2, 1, 2, 1, 3],
			[3, 1, 1, 2, 1, 1, 1, 1, 1, 1, 3],
			[3, 1, 1, 1, 1, 2, 1, 1, 2, 1, 3],
			[3, 1, 2, 1, 2, 2, 1, 2, 2, 1, 3],
			[3, 1, 1, 1, 1, 1, 2, 1, 1, 1, 3],
			[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
		];

	//The game objects map
	var gameObjects =
		[
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0],
			[0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0],
			[0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0],
			[0, 0, 0, 0, 5, 0, 0, 5, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		];

	//map code
	var EMPTY = 0,
		FLOOR = 1,
		BOX = 2,
		WALL = 3,
		ALIEN = 4,
		BOMB = 5;
	var SIZE = 64; //the size of each cell

	//the number of rows and columns
	var ROWS = map.length;
	var COLUMNS = map[0].length;

	//the number of columns on tilesheet
	var tilesheetColumns = 5;

	//game state
	var LOADING = 0,
		BUILD_MAP = 1,
		PLAYING = 2,
		OVER = 3,
		gameState = LOADING;
	var assetLoadedCount = 0;
	var sprites = [],
		boxes = [],
		bombs = [],
		messages=[],
		alien = null,
		assetsToLoad = [];

	//other game objects
	var timeDisplay = null,
		gameOverDisplay = null,
		gameOverMessage = null,
		timerMessage = null;

	//load tilesheet image
	var image = new Image();
	image.addEventListener('load', loadHandler, false);
	image.src = '../images/timeBombPanic.png';
	assetsToLoad.push(image);

	//create canvas drawing surface
	var canvas = document.querySelector('canvas');
	var drawingSurface = canvas.getContext('2d');


	function loadHandler() {
		assetLoadedCount++;
		if (assetsToLoad.length) {
			if (assetLoadedCount == assetsToLoad.length) { //all assets were finished load

				//remove event listener
				image.removeEventListener('load', loadHandler, false);

				//set game state to next stage
				gameState = BUILD_MAP;

			}
		}
	} //end of loadHandler function

	function update() {

		switch (gameState) {
			case LOADING:
				console.log('loading assets');
				break;
			case BUILD_MAP:
				buildMap(map);
				buildMap(gameObjects);
				createOtherObjects();
				gameState = PLAYING;
				break;
			case PLAYING:
				playGame();
				break;
			case OVER:
				endGame();
				break;
		} //end of switch conditions
		render();
	} //end of update function

	function render() {

	} //end of render function

	function buildMap(levelMap) {
		for (var row = 0; row < levelMap.length; row++) {
			for (var col = 0; col < levelMap[0].length; col++) {
				var currentTile = levelMap[row][col];
				if (currentTile !== EMPTY) {
					//find the tile's X and Y position on tilesheet
					var tileSheetX = Math.floor((currentTile - 1) % tilesheetColumns) * SIZE;
					var tileSheeY = Math.floor((currentTile - 1) / tilesheetColumns) * SIZE;

					switch (currentTile) {
						case FLOOR:
							var floor = Object.create(spriteObject);
							floor.sourceX = tileSheetX;
							floor.sourceY = tileSheetY;
							floor.x = col * SIZE;
							floor.y = row * SIZE;
							sprites.push(floor);

							break;
						case BOX:
							var box = Object.create(spriteObject);
							box.sourceX = tileSheetX;
							box.sourceY = tileSheetY;
							box.x = col * SIZE;
							box.y = row * SIZE;
							boxes.push(box);
							sprites.push(box);
							break;
						case WALL:
							var wall = Object.create(spriteObject);
							wall.sourceX = tileSheetX;
							wall.sourceY = tileSheetY;
							wall.x = col * SIZE;
							wall.y = row * SIZE;
							sprites.push(wall);
							break;
						case BOMB:
							var bomb = Object.create(spriteObject);
							bomb.sourceX = tileSheetX;
							bomb.sourceY = tileSheetY;
							bomb.sourceWidth = 48;
							bomb.sourceHeight = 36;
							bomb.width = 48;
							bomb.height = 36;
							bomb.x = col * SIZE + 10;
							bomb.y = row * SIZE + 16;
							bombs.push(bomb);
							sprites.push(bomb);
							break;
						case ALIEN:
							alien = Object.create(spriteObject);
							alien.sourceX = tileSheetX;
							alien.sourceY = tileSheetY;
							alien.x = col * SIZE;
							alien.y = row * SIZE;
							sprites.push(alien);
							break;
					}
				}
			}
		}
	} //end of buildMap function

	function createOtherObjects() {
		timeDisplay = Object.create(spriteObject);
		timeDisplay.sourceX=0;
		timeDisplay.sourceY=64,
		timeDisplay.sourceWidth=128;
		timeDisplay.sourceHeight=48;

		timeDisplay.width=128;
		timeDisplay.height=48;
		timeDisplay.x=canvas.width/2-timeDisplay.width/2;
		timeDisplay.y=8;
		sprites.push(timeDisplay);

		gameOverDisplay = Object.create(spriteObject);
		gameOverDisplay.sourceX=0;
		gameOverDisplay.sourceY=129,
		gameOverDisplay.sourceWidth=316;
		gameOverDisplay.sourceHeight=290;

		gameOverDisplay.width=316;
		gameOverDisplay.height=290;
		gameOverDisplay.x=canvas.width/2-gameOverDisplay.width/2;
		gameOverDisplay.y=canvas.height/2-gameOverDisplay.height/2;
		gameOverDisplay.visible=false;
		sprites.push(gameOverDisplay);

		gameOverMessage = Object.create(messageObject);
		gameOverMessage.x=275;
		gameOverMessage.y=270;
		gameOverMessage.font='bold 30px Helvetica';
		gameOverMessage.fillStyle="black";
		gameOverMessage.text='';
		gameOverMessage.visible=false;
		messages.push(gameOverMessage);

		timerMessage = Object.create(messageObject);
		timerMessage.x=330;
		timerMessage.y=10;
		timerMessage.font='bold 40px Helvetica';
		timerMessage.fillStyle="white";
		timerMessage.text='';
		messages.push(timerMessage);



	} //end of createOtherObjects function

	function playGame() {

	} //end of playGame function

	function endGame() {

	} //end of endGame function

}());