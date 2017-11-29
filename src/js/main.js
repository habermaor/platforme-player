var data = require('./data');
var game = new Phaser.Game(data.gameConfiguration.gameWidth, data.gameConfiguration.gameHeight, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

function preload() {


    game.load.image(data.assets.ground.key, data.assets.ground.url);
    game.load.image(data.assets.object.key, data.assets.object.url);
    game.load.image(data.assets.bullet.key, data.assets.bullet.url);
    game.load.spritesheet(data.assets.hero.key, data.assets.hero.url, data.assets.hero.frameWidth, data.assets.hero.frameHeight);
    game.load.spritesheet(data.assets.enemy.key, data.assets.enemy.url, data.assets.enemy.frameWidth, data.assets.enemy.frameHeight);
    game.load.audio(data.assets.bullet.audio.firing.key, data.assets.bullet.audio.firing.url);
    game.load.audio(data.assets.bullet.audio.hit.key, data.assets.bullet.audio.hit.url);


    game.load.crossOrigin = 'anonymous';

    game.load.image(data.assets.background.key, data.assets.background.url)
    game.load.tilemap('level1', 'assets/levelExample.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles-1', 'assets/tiles-1.png');


}
var firing_sound;
var hitting_sound;

var player;
var cursors;
var bullets;
var enemies;
var spaceBar;
var bulletXSpeed = 300;
var direction = 1;
var stars;
var layer;
var score = 0;
var scoreText;

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.tileSprite(0, 0, game.width, game.height, data.assets.background.key)
    map = game.add.tilemap('level1');
    map.addTilesetImage('tiles-1');
    map.setCollisionByExclusion([13, 14, 15, 16, 46, 47, 48, 49, 50, 51]);

  

    layer = map.createLayer('Tile Layer 1');
    //  Un-comment this on to see the collision tiles
    //layer.debug = true;
    layer.resizeWorld();
   

    player = game.add.sprite(32, 0, data.assets.hero.key);
    game.physics.arcade.enable(player);
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
    //player.animations.add('left', [0, 1, 2, 3], 10, true);
    //player.animations.add('right', [5, 6, 7, 8], 10, true);
    player.animations.add('left', [1]);
    player.animations.add('right', [2]);
  
    stars = game.add.group();
    stars.enableBody = true;
    for (var i = 0; i < 12; i++)
    {
        var star = stars.create(i * 70, 0, data.assets.object.key);
        star.body.gravity.y = 300;
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }
    enemies = game.add.group();
    enemies.enableBody = true;
    for (var i = 0; i < 12; i++) {
       
        var enemy = new Enemy(game, i * 70, 0, 0);
        enemies.add(enemy);
     
    }

    bullets = game.add.group();
    bullets.enableBody = true;
    spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceBar.onDown.add(shootBullet, this);

    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    firing_sound = game.add.audio(data.assets.bullet.audio.firing.key);
    hitting_sound = game.add.audio(data.assets.bullet.audio.hit.key);


    cursors = game.input.keyboard.createCursorKeys();
    spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function update() {

    game.physics.arcade.collide(player, layer);
    game.physics.arcade.collide(stars, layer);
    game.physics.arcade.collide(enemies, layer);
    game.physics.arcade.overlap(player, stars, collectStar, null, this);

    var testTile = map.getTileWorldXY(0, 0);
    if(testTile){console.log(testTile ,player, map, layer )}
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;
        player.animations.play('left');
        direction = -1;
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;
        player.animations.play('right');
        direction = 1;
    }
    else
    {
        player.animations.stop();
        player.frame = 4;
    }
    
    if (cursors.up.isDown  && player.body.onFloor())
    {
        player.body.velocity.y = -350;
    }

  



}

function collectStar (player, star) {
    star.kill();
    score += 10;
    scoreText.text = 'Score: ' + score;
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

    game.physics.arcade.overlap(this, stars, function (bullet, star) {
        bullet.destroy();
        star.destroy();
        hitting_sound.play();
        score += 1;
        scoreText.text = 'Score: ' + score;
    });

    game.physics.arcade.overlap(this, layer, function (bullet) {
        bullet.destroy();
    });

    this.body.velocity.y = 0;
    this.body.velocity.x = this.xSpeed;
    if (this.x < 0 || this.x > 680) {
        this.destroy();
    }

};

Enemy = function (game, x, y, destination) {
    Phaser.Sprite.call(this, game, x, y, data.assets.enemy.key, 64, 64);
    this.scale.setTo(0.5, 0.5);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.collideWorldBounds = true;
    this.enableBody = true;
    this.animations.add('right', [2]);
    this.animations.add('left', [1]);
    this.body.gravity.y = 800;
    this.body.bounce.y = 0;// 0.7 + Math.random() * 0.2;
    this.body.bounce.x = 1;
    this.body.collideWorldBounds = true;
    this.body.velocity.x = 80;
};
Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;
Enemy.prototype.update = function () {

    game.physics.arcade.collide(this, layer, function (enemy, layer) {
        // if enemy is moving to the right, 
        // check if its position greater than the width of the platform minus its width
        // if enemy is moving to the left, 
        // check if its position exceeds the left-most point of the platform

       // console.log(map.getTileWorldXY(enemy.body.x, enemy.body.y));


      //  console.log(layer,enemy);
        if (enemy.body.velocity.x > 0 && enemy.position.x > layer.x + (layer.width - enemy.width) ||
                enemy.body.velocity.x < 0 && enemy.x < layer.x) {
            enemy.body.velocity.x *= -1;
        }
        if (enemy.body.velocity.x > 0) {
            enemy.animations.play('right');
        } else {
            enemy.animations.play('left');
        }
    });

    game.physics.arcade.collide(this, enemies, function (enemy, enemies) {
        enemy.body.velocity.x *= -1.0001;
    });

};
