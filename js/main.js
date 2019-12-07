(function() {
	var spider = {pos: [0, 0], sprite: new Sprite('img/sprites.png', [0, 0], [120, 80], 3, [0, 1])};
	var flyes = [];
	var bullets = [];
	var explosions = [];

	var lastTime;
	var pauseOn = true;
	var lastFire = Date.now();
	var gameTime = 0;
	var isGameOver;
	var pattern;

	var score = 0;
	var bonusScore = 2000;
	var scoreHolder = document.getElementById('score');
	var playAgainBtn = document.getElementById('playAgain');
	var pauseBtn = document.getElementById('pause');

	var spiderSpeed = 200;
	var bulletSpeed = 500;
	var flySpeed = 100;

	var frequency = 1;

	var soundOn = true;
	var soundBtn = document.getElementById('sound');
	var sound = document.getElementById('track');

	var health = document.getElementsByClassName('health');
	var life = 4;
	var heart = [];

	var crashSound = new Audio('audio/crash.mp3');

	var result = document.getElementById('result');
	var addResult = true;
	
	var recordArr = [];
	var recordForShow;


	
	
	// Создание игрового поля
	var canvas = document.createElement("canvas");
	var context = canvas.getContext("2d");
	canvas.width = 800;
	canvas.height = 600;
	document.getElementById('gameHolder').appendChild(canvas);
	
	
	

 
	window.onhashchange = switchToStateFromURLHash;

    function switchToStateFromURLHash() {
		var URLHash = window.location.hash;
	 
		if (URLHash === "") {
			URLHash = '#Main';
		} 

		switch (URLHash) {
			case '#Main':
				pauseOn = false;
				soundOn = false;
				document.getElementById('main').style.display = 'block';
				document.getElementById('gameHolder').style.display = 'none';
				document.getElementById('recordHolder').style.display = 'none';
				document.body.style.backgroundImage = 'none';
				if (canvas) {
					canvas.style.display = 'none';
				}
				break;
		  
			case '#Game':
				pauseOn = true;
				soundOn = false;
				document.getElementById('main').style.display = 'none';
				document.getElementById('gameHolder').style.display = 'block';
				document.getElementById('recordHolder').style.display = 'none';
				start();
				break;
				
			case '#Record':
				pauseOn = false;
				soundOn = false;
				document.getElementById('main').style.display = 'none';
				document.getElementById('gameHolder').style.display = 'none';
				document.getElementById('recordHolder').style.display = 'block';
				recordForShow = localStorage.recordArr ? JSON.parse(localStorage.recordArr) : false;
				if (recordForShow) {
					document.getElementById('record').innerHTML = '';
					for (var b = 0; b < recordForShow.length; b++) {
						document.getElementById('record').innerHTML += '<p>' + (b + 1) + '. ' + recordForShow[b] + '</p>';
					}
				} else {
					document.getElementById('record').innerText = 'Вы можете быть первым!';
				}
				break;
		}
	}

  
	function switchToState(newState) {
		window.location.hash = newState;
	}

 
	switchToStateFromURLHash();


	
	
	//Таблица рекордов
	var recordBtn = document.getElementById('recordBtn');
	recordBtn.addEventListener('click', function clickRecordBtn() {
		switchToState('#Record');
	});
	
	
	

	//Запуск по кнопке Старт
	var startBtn = document.getElementById('startBtn');
	startBtn.addEventListener('click', function clickStartBtn() {
		switchToState('#Game');
	});
		
	function start() {
		document.getElementById('main').style.display = 'none';
		document.getElementById('header').style.display = 'block';
		canvas.style.display = 'block';
		document.body.style.background = 'url(img/fon.jpg) repeat black';
				

		loadImg.load(['img/sprites.png', 'img/pattern.png', 'img/fon.jpg', 'img/health.png']);
		loadImg.onReady(init);
	}




	function init() {
		pattern = context.createPattern(loadImg.get('img/pattern.png'), 'repeat');
			
		pauseBtn.addEventListener('click', function clickPauseBtn() {
			pauseOn = !pauseOn;
			if (pauseOn) {
				pauseBtn.style.backgroundPosition = '-84px -208px';
				setTimeout(function() {pauseBtn.style.backgroundPosition = '-167px -208px';}, 100);
			} else {
				pauseBtn.style.backgroundPosition = '-250px -208px';
				setTimeout(function() {pauseBtn.style.backgroundPosition = '0px -208px';}, 100);
			}
			pauseBtn.blur();
			return pauseOn;
		});
		
		soundBtn.addEventListener('click', function clickSoundBtn() {
			soundOn = !soundOn;
			if (soundOn) {
				soundBtn.style.backgroundPosition = '-76px -299px';
				setTimeout(function() {soundBtn.style.backgroundPosition = '-152px -299px';}, 100);
			} else {
				soundBtn.style.backgroundPosition = '-228px -299px';
				setTimeout(function() {soundBtn.style.backgroundPosition = '0px -299px';}, 100);
			}
			soundBtn.blur();
			return soundOn;
		});
			
		playAgainBtn.addEventListener('click', function() {
			playAgainBtn.style.backgroundPosition = '-226px -384px';
			setTimeout(reset, 100);
		});
		
			
		reset();
		lastTime = Date.now();
		main();
	}




	//Основной цикл
	function main() {
		var now = Date.now();
		var deltaTime = (now - lastTime) / 1000.0;

		if (pauseOn) {
			update(deltaTime);
			draw();
		}
		
		if (soundOn) {
			sound.volume = 0.5;
			sound.play();
		} else {
			sound.volume = 1;
			sound.pause();
		}

		lastTime = now;
		requestAnimationFrame(main);
	};




	function update(deltaTime) {
		gameTime += deltaTime;

		spiderMove(deltaTime);
		updateElements(deltaTime);
		


		if(Math.random() < 1 - Math.pow(0.993, gameTime)) {

			frequency++;
			if (frequency % 7) {
				flyes.push({
					pos: [canvas.width, Math.random() * (canvas.height - 57)],
					sprite: new Sprite('img/sprites.png', [0, 85], [90, 57], 10, [0, 1, 2, 3, 2, 1]),
					type: 'fly'
				});
			} else if (frequency % 15) {
				flyes.push({
					pos: [canvas.width, Math.random() * (canvas.height - 62)],
					sprite: new Sprite('img/sprites.png', [0, 200], [122, 62], 10, [0, 1, 2, 1]),
					type: 'bee'
				});
			}

			if (score >= bonusScore) {
				bonusScore *= 2;
				heart.push({
					pos: [Math.random() * (canvas.width - 38), Math.random() * (canvas.height - 29)],
					sprite: new Sprite('img/sprites.png', [0, 500], [38, 29], 3, [0, 1]),
					time: Date.now()
				});
			}
		}

		checkCollisions();

		scoreHolder.innerHTML = score;
	};





	//Определение движений паука по действию пользователя
	function spiderMove(deltaTime) {
		if(input.isDown('DOWN')) {
			spider.pos[1] += spiderSpeed * deltaTime;
		}

		if(input.isDown('UP')) {
			spider.pos[1] -= spiderSpeed * deltaTime;
		}

		if(input.isDown('LEFT')) {
			spider.pos[0] -= spiderSpeed * deltaTime;
		}

		if(input.isDown('RIGHT')) {
			spider.pos[0] += spiderSpeed * deltaTime;
		}

		if(input.isDown('SPACE') && !isGameOver && Date.now() - lastFire > 100) {
			var x = spider.pos[0] + spider.sprite.size[0] / 2;
			var y = spider.pos[1] + spider.sprite.size[1] / 2;

			bullets.push({ pos: [x, y],
						   dir: 'forward',
						   sprite: new Sprite('img/sprites.png', [0, 168], [25, 12]) });
			bullets.push({ pos: [x, y],
						   dir: 'up',
						   sprite: new Sprite('img/sprites.png', [38, 150], [16, 20]) });
			bullets.push({ pos: [x, y],
						   dir: 'down',
						   sprite: new Sprite('img/sprites.png', [38, 176], [16, 20]) });

			lastFire = Date.now();
		}
	}




	//Определение позиций автоматических движений элементов
	function updateElements(deltaTime) {
		spider.sprite.update(deltaTime);
		
		
		for(var i = 0; i < heart.length; i++) {
			heart[i].sprite.update(deltaTime);
		}
	   
		for(var i = 0; i < bullets.length; i++) {
			var bullet = bullets[i];
			switch(bullet.dir) {
			case 'up': bullet.pos[1] -= bulletSpeed * deltaTime; break;
			case 'down': bullet.pos[1] += bulletSpeed * deltaTime; break;
			default:
				bullet.pos[0] += bulletSpeed * deltaTime;
			}
			
			if(bullet.pos[1] < 0 || bullet.pos[1] > canvas.height || bullet.pos[0] > canvas.width) {
				bullets.splice(i, 1);
				i--;
			}
		}
	 
	 
		for(var i = 0; i < flyes.length; i++) {
			var type = flyes[i].type;
			
			if (type == 'bee' && !isGameOver) {
				var xFly = flyes[i].pos[0];
				var yFly = flyes[i].pos[1];
				var xSpider = spider.pos[0];
				var ySpider = spider.pos[1];
				var c = 1.5 * spiderSpeed * deltaTime;
				var l = Math.sqrt((xSpider - xFly) * (xSpider - xFly) + (ySpider - yFly) * (ySpider - yFly));
				
				flyes[i].pos[0] += (xSpider - xFly) * c / l;
				flyes[i].pos[1] += (ySpider - yFly) * c / l;
			} else {
				flyes[i].pos[0] -= flySpeed * deltaTime;
				flyes[i].sprite.update(deltaTime);
			}
		   
			if(flyes[i].pos[0] + flyes[i].sprite.size[0] < 0) {
				flyes.splice(i, 1);
				i--;
			}
		}
	 
	   
		for(var i = 0; i < explosions.length; i++) {
			explosions[i].sprite.update(deltaTime);
			
			if(explosions[i].sprite.done) {
				explosions.splice(i, 1);
				i--;
			}
		}
	}




	//Условия для определения столкновения и типа мух
	function collides(x, y, width, height, x2, y2, width2, height2) {
		return !(width <= x2 || x > width2 || height <= y2 || y > height2);
	}

	function boxCollides(pos, size, pos2, size2) {
		return collides(pos[0], pos[1], pos[0] + size[0], pos[1] + size[1],
						pos2[0], pos2[1], pos2[0] + size2[0], pos2[1] + size2[1]);
	}

	function getTypeOfFlyes(i, pos, size) {
		var type = flyes[i].type;
		flyes.splice(i, 1);
		i--;
				  
		if (type == 'fly') {
			explosions.push({
			pos: pos,
			sprite: new Sprite('img/sprites.png', [375, 70], [110, 94], 16, [0, 1, 2, 3, 4 ,5], null, true)
			});
			score += 50;
		} else if (type == 'bee') {
			explosions.push({
			pos: pos,
			sprite: new Sprite('img/sprites.png', [375, 204], [125, 100], 16, [0, 1, 2, 3, 4], null, true)
			});
			score += 100;
		}
	}




	function checkCollisions() {
		checkSpiderMove();
		
		
		for (var i = 0; i < flyes.length; i++) {
			var pos = flyes[i].pos;
			var size = flyes[i].sprite.size;

			for (var j = 0; j < bullets.length; j++) {
				var pos2 = bullets[j].pos;
				var size2 = bullets[j].sprite.size;
	 
				if (boxCollides(pos, size, pos2, size2)) {
					getTypeOfFlyes(i, pos, size); 
					
					bullets.splice(j, 1);
					break;
				}
			}

			if (boxCollides(pos, size, spider.pos, spider.sprite.size)) {
				if (life > 0) {
					health[life].style.display = 'none';
					life--;
					if (soundOn) {
						crashSound.currentTime = 0;
						crashSound.play();
					}
					getTypeOfFlyes(i, pos, size);  
				   
					break;
				} 
				health[life].style.display = 'none';
				
				gameOver();
				
			}
		}
		
		for (var k = 0; k < heart.length; k++) {
			if (Date.now() - heart[k].time >= 20000) {
				heart.splice(k, 1);
				k--;
			} else if (boxCollides(heart[k].pos, heart[k].sprite.size, spider.pos, spider.sprite.size)) {
				heart.splice(k, 1);
				k--;
				if (life < 4) {
					life++;
					health[life].style.display = 'inline';
				}
			}
		}
	}




	function checkSpiderMove() {
		
		if(spider.pos[0] < 0) {
			spider.pos[0] = 0;
		}
		else if(spider.pos[0] > canvas.width - spider.sprite.size[0]) {
			spider.pos[0] = canvas.width - spider.sprite.size[0];
		}

		if(spider.pos[1] < 0) {
			spider.pos[1] = 0;
		}
		else if(spider.pos[1] > canvas.height - spider.sprite.size[1]) {
			spider.pos[1] = canvas.height - spider.sprite.size[1];
		}
	}




	function draw() {
		context.fillStyle = pattern;
		context.fillRect(0, 0, canvas.width, canvas.height);

		if(!isGameOver) {
			drawElement(spider);
			drawElements(bullets);
		}

		
		drawElements(heart);
		drawElements(flyes);
		drawElements(explosions);
	};

	function drawElements(targets) {
		for(var i=0; i<targets.length; i++) {
			drawElement(targets[i]);
		}    
	}

	function drawElement(target) {
		context.save();
		context.translate(target.pos[0], target.pos[1]);
		target.sprite.draw(context);
		context.restore();
	}




	function showBestResult() {
		var bestResult = window.localStorage.getItem('bestResult');
		if (!bestResult || score > bestResult) {
			window.localStorage.setItem('bestResult', score);
		} 
		
		result.innerText = 'Вы набрали: ' + score + ', а лучший результат: ' + window.localStorage.getItem('bestResult');
	
		recordArr = localStorage.recordArr ? JSON.parse(localStorage.recordArr) : [];
		recordArr.push(score);
		recordArr.sort(function(a, b) {
			return b - a;
		});
		if (recordArr.length > 8) {
			recordArr.pop();
		} 
		localStorage.recordArr = JSON.stringify(recordArr);
	}
				
				


	function gameOver() {
		if (bullets.length == 0) {
			document.getElementById('gameOver').style.display = 'block';
			document.getElementById('gameOverMask').style.display = 'block';}
		isGameOver = true;
		if (addResult && bullets.length == 0) {
					showBestResult();
					addResult = !addResult;
				}
	}




	function reset() {
		document.getElementById('gameOver').style.display = 'none';
		document.getElementById('gameOverMask').style.display = 'none';
		playAgainBtn.style.backgroundPosition = '0px -384px';
		result.innerText = '';
		isGameOver = false;
		addResult = true;
		gameTime = 0;
		score = 0;
		bonusScore = 2000;
		life = 4;
		
		for (var k = 0; k < 5; k++) {
			health[k].style.display = 'inline';
		};

		flyes = [];
		heart = [];
		bullets = [];

		spider.pos = [0, canvas.height / 2];
	};
})();