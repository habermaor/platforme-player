﻿var data = require('./dataMC');
var winState = require('./win');
var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update });
game.state.add('win', winState);

function preload() {


    data.assets.objects.forEach(function (object) {
        game.load.image(object.key, object.url);
    });
    game.load.image(data.assets.bullet.key, data.assets.bullet.url);
    game.load.image(data.assets.endStage.key, data.assets.endStage.url);
    game.load.spritesheet(data.assets.hero.key, data.assets.hero.url, data.assets.hero.frameWidth, data.assets.hero.frameHeight);
    data.assets.enemies.forEach(function (enemy) {
        game.load.spritesheet(enemy.key, enemy.url, enemy.frameWidth, enemy.frameHeight);
    });
    game.load.spritesheet(data.assets.enemies[0].key, data.assets.enemies[0].url);
    game.load.audio(data.assets.bullet.audio.firing.key, data.assets.bullet.audio.firing.url);
    game.load.audio(data.assets.bullet.audio.hit.key, data.assets.bullet.audio.hit.url);
 //   game.load.audio(data.assets.soundtrack.key, data.assets.soundtrack.url);
    game.load.audio(data.assets.objects[0].audio.collect.key, data.assets.objects[0].audio.collect.url);


    game.load.crossOrigin = 'anonymous';

    game.load.image(data.assets.background.key, data.assets.background.url)
    game.load.tilemap(data.assets.tilemap.key, data.assets.tilemap.url, null, Phaser.Tilemap.TILED_JSON);
    game.load.image(data.assets.tileImages[0].key, data.assets.tileImages[0].url);

    game.load.atlas('dpad', 'assets/dpad.png', 'assets/dpad.json');


}
var firing_sound;
var hitting_sound;
var soundtrack;
var collecting_sound;
var player;
var bullets;
var enemies;
var spaceBar;
var bulletXSpeed = 450;
var direction = 1;
var stars;
var layer;
var score = 0;
var scoreText;
var endPoint;
var leftKey;
var rightKey;
this.pad;

this.stick;

this.buttonA;
this.buttonB;


function create() {
    game.scale.forceOrientation(true);
    game.scale.pageAlignHorizontally = true;
    game.physics.startSystem(Phaser.Physics.ARCADE);
  //  soundtrack = game.add.audio(data.assets.soundtrack.key);
  //  soundtrack.loopFull(0.2);


    // game.add.tileSprite(0, 0, (data.assets.tilemap.width / data.assets.tilemap.height) * window.innerHeight * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, data.assets.background.key).alpha = 0.6;
    game.add.tileSprite(0, 0, 1664, 1664, data.assets.background.key).alpha = 0.6;

    map = game.add.tilemap(data.assets.tilemap.key);
    game.world.setBounds(0, 0, (data.assets.tilemap.width / data.assets.tilemap.height) * window.innerHeight * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio);
    endPoint = game.add.sprite(data.assets.endStage.x, data.assets.endStage.y, data.assets.endStage.key);
    endPoint.scale.setTo(0.5);
    endPoint.enableBody = true;



    map.addTilesetImage(data.assets.tileImages[0].key);

    map.setCollisionByExclusion([]);
    //joystick
    this.pad = this.game.plugins.add(Phaser.VirtualJoystick);

    this.stick = this.pad.addDPad(0, 0, 200, 'dpad');
    this.stick.alignBottomLeft(0);
    spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceBar.onDown.add(jump, this);

    sKey = game.input.keyboard.addKey(Phaser.KeyCode.S);
    sKey.onDown.add(shootBullet, this);


    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

   


    this.buttonA = this.pad.addButton(window.innerWidth - 100, window.innerHeight - 100, 'dpad', 'button1-up', 'button1-down');
    this.buttonA.onDown.add(shootBullet, this);


    this.buttonB = this.pad.addButton(window.innerWidth - 250, window.innerHeight - 100, 'dpad', 'button2-up', 'button2-down');
    this.buttonB.onDown.add(jump, this);








    layer = map.createLayer('office_tile');//this is the layer name from Tiled. todo - make this dynamic?
    layer.resizeWorld();

    player = game.add.sprite(data.assets.hero.x, data.assets.hero.y, data.assets.hero.key);

    player.anchor.setTo(.5, .5);
    player.scale.setTo(0.3, 0.3);
    game.physics.arcade.enable(player);



    game.camera.follow(player);
    game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);



    player.body.bounce.y = 0;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;


    player.animations.add('walk', getFramesArray(data.assets.hero.animations.walk.from, data.assets.hero.animations.walk.to), 30);
    player.animations.add('idle', getFramesArray(data.assets.hero.animations.idle.from, data.assets.hero.animations.idle.to), 30);
    player.animations.add('jump', getFramesArray(data.assets.hero.animations.jump.from, data.assets.hero.animations.jump.to), 30);

    stars = game.add.group();
    stars.enableBody = true;

    data.assets.objects.forEach(function (object) {
        object.positions.forEach(function (position) {
            var star = stars.create(position.x, position.y, object.key);
            star.anchor.set(0.5, 0);
            var tween = game.add.tween(star.scale).to({ x: -1 }, 1000, "Linear", true, 0, -1, true);
            tween.onLoop.add(function () {
                star.frameName = (star.frameName === 'front') ? 'back' : 'front';
            }, this);
        });
    });
    enemies = game.add.group();
    enemies.enableBody = true;

    data.assets.enemies.forEach(function (bad) {
        bad.positions.forEach(function (position) {
            var enemy = new Enemy(game, position.x, position.y, bad.key);
            enemies.add(enemy);
        });
    });
    game.time.events.loop(Phaser.Timer.SECOND * 2, turnRandomEnemy, this);
    bullets = game.add.group();
    bullets.enableBody = true;


    //  scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    firing_sound = game.add.audio(data.assets.bullet.audio.firing.key);
    hitting_sound = game.add.audio(data.assets.bullet.audio.hit.key);
    collecting_sound = game.add.audio(data.assets.objects[0].audio.collect.key);

}


function update() {

    game.physics.arcade.collide(player, layer, collideWithLayer, null, this);
    game.physics.arcade.overlap(player, endPoint, win, null, this);
    game.physics.arcade.collide(stars, layer);
    game.physics.arcade.collide(enemies, layer);
    game.physics.arcade.overlap(player, stars, collectStar, null, this);
    player.body.velocity.x = 0;
    if (this.stick.isDown || leftKey.isDown || rightKey.isDown) {

        if ((this.stick.direction === Phaser.LEFT) || leftKey.isDown)
        {
            player.body.velocity.x = -data.assets.hero.speed;

            player.animations.play('walk');
            player.scale.x = -1 * (Math.abs(player.scale.x));
            direction = -1;
        }
        else if (this.stick.direction === Phaser.RIGHT || rightKey.isDown) {
            player.body.velocity.x = data.assets.hero.speed;
            player.animations.play('walk');
            player.scale.x = Math.abs(player.scale.x);
            direction = 1;
        }

    }
    else {
        if (player.body.onFloor())
            player.animations.play('idle');

    }

}

function collideWithLayer(player, tile) {
    if (tile.x == 124)
        //todo - add an object to overlap with for ending (gate or whatever the user is uploading)
        game.state.start('win');
}
function win() { console.log("win"); game.state.start('win'); }
function jump() {
    if (player.body.onFloor()) {
        player.body.velocity.y = -350;
        player.animations.play('jump');
    }
}
function turnRandomEnemy() {
    enemy = enemies.children[Math.floor(Math.random() * enemies.children.length)]
    if (enemy) {
        // randomise the movement	
        baddieMover = game.rnd.integerInRange(1, 3);	// simple if statement to choose if and which way the baddie moves	

        if (enemy.x < enemy.rangeLeft && baddieMover == 2) {
            baddieMover = 1; // enemy is too far left, so move it right
        }
        else if (enemy.x > enemy.rangeRight && baddieMover == 1) {
            baddieMover = 2; // enemy is too far right, so move it left       
        } if (baddieMover == 1) {
            enemy.body.velocity.x = data.assets.enemies[0].speed;//TODO - refrence to the relevant enemy 
        }
        else if (baddieMover == 2) {
            enemy.body.velocity.x = -data.assets.enemies[0].speed;
        }
        else {
            enemy.body.velocity.x = 0;
        }


    }
}
function collectStar(player, star) {
    star.kill();
    collecting_sound.play();
    score += 10;
    //scoreText.text = 'Score: ' + score;
}

function shootBullet() {
    if (bullets.length < 5) {
        var bullet = new Bullet(game, player.x + 10, player.y + 10, direction, bulletXSpeed);
        bullets.add(bullet);
        firing_sound.play();
    }
}
Bullet = function (game, x, y, direction, speed) {
    Phaser.Sprite.call(this, game, x, y, data.assets.bullet.key);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.xSpeed = direction * speed;
};

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function () {
    game.physics.arcade.overlap(this, enemies, function (bullet, enemy) {
        bullets.remove(bullet);
        enemy.isDead = true;
        enemy.body.velocity.x = 0;

        enemy.animations.play('die', 10, false, true).onComplete.add(function () { enemies.remove(enemy); });
        hitting_sound.play();
        score += 1;
        //  scoreText.text = 'score: ' + score;




    });


    this.body.velocity.y = 0;
    this.body.velocity.x = this.xSpeed;
    if (this.x < 0 || this.x > 1664) {
        this.destroy();
    }

};

Enemy = function (game, x, y, key) {

    Phaser.Sprite.call(this, game, x, y, key, 64, 64);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.anchor.setTo(.5, .5);
    this.scale.setTo(0.3, 0.3);
    this.collideWorldBounds = true;
    this.enableBody = true;
    this.animations.add('die', getFramesArray(0, 9), 10);
    this.animations.add('idle', getFramesArray(10, 19), 10);
    this.animations.add('walk', getFramesArray(20, 29), 10);
    this.animations.currentFrame = 0;

    this.body.gravity.y = 800;
    this.body.bounce.y = 0;
    this.body.bounce.x = 1;
    this.body.collideWorldBounds = true;
    // this.body.velocity.x = 30 + Math.random() * 50;

};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;
Enemy.prototype.update = function () {
    if (this.isDead) {
      //  this.animations.play('die').onComplete.add(function () { enemies.remove(this); });;
    }
    else if (this.body.velocity.x == 0) {
        this.animations.play('idle');
    }
    else if (this.body.velocity.x < 0) {
        this.animations.play('walk');
        this.scale.x = -1 * (Math.abs(this.scale.x));

    }
    else if (this.body.velocity.x > 0) {
        this.animations.play('walk');
        this.scale.x = Math.abs(this.scale.x);
    }


};


function getFramesArray(start, end) {
    return Array(end - start + 1).fill().map((item, index) => start + index);
}



