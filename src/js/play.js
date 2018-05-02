module.exports = {

    Bullet: require('./bullet'),
    Enemy: require('./enemy'),


    preload: function () {

        var data = this.game && this.game.data;
        var game = this.game;
        var player = this.player;
      
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





    },
    create: function () {
        Enemy = this.Enemy;
        var data = this.game && this.game.data;
        var game = this.game;
     
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
        spaceBar.onDown.add(this.jump, this);

        sKey = game.input.keyboard.addKey(Phaser.KeyCode.S);
        sKey.onDown.add(this.shootBullet, this);


        leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);




        this.buttonA = this.pad.addButton(window.innerWidth - 100, window.innerHeight - 100, 'dpad', 'button1-up', 'button1-down');
        this.buttonA.onDown.add(this.shootBullet, this);


        this.buttonB = this.pad.addButton(window.innerWidth - 250, window.innerHeight - 100, 'dpad', 'button2-up', 'button2-down');
        this.buttonB.onDown.add(this.jump, this);








        layer = map.createLayer('office_tile');//this is the layer name from Tiled. todo - make this dynamic?
        layer.resizeWorld();

        this.player = game.add.sprite(data.assets.hero.x, data.assets.hero.y, data.assets.hero.key);
        var player = this.player;
        player.anchor.setTo(.5, .5);
        player.scale.setTo(0.3, 0.3);
        game.physics.arcade.enable(player);



        game.camera.follow(player);
        game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);



        player.body.bounce.y = 0;
        player.body.gravity.y = 300;
        player.body.collideWorldBounds = true;


        player.animations.add('walk', this.getFramesArray(data.assets.hero.animations.walk.from, data.assets.hero.animations.walk.to), 30);
        player.animations.add('idle', this.getFramesArray(data.assets.hero.animations.idle.from, data.assets.hero.animations.idle.to), 30);
        player.animations.add('jump', this.getFramesArray(data.assets.hero.animations.jump.from, data.assets.hero.animations.jump.to), 30);

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
        game.time.events.loop(Phaser.Timer.SECOND * 2, this.turnRandomEnemy, this);
        bullets = game.add.group();
        bullets.enableBody = true;


        //  scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
        firing_sound = game.add.audio(data.assets.bullet.audio.firing.key);
        hitting_sound = game.add.audio(data.assets.bullet.audio.hit.key);
        collecting_sound = game.add.audio(data.assets.objects[0].audio.collect.key);

    },
    update: function () {
        var data = this.game && this.game.data;
        var game = this.game;
        var player = this.player;
        game.physics.arcade.collide(player, layer, this.collideWithLayer, null, this);
        game.physics.arcade.overlap(player, endPoint, this.win, null, this);
        game.physics.arcade.collide(stars, layer);
        game.physics.arcade.collide(enemies, layer);
        game.physics.arcade.overlap(player, stars, this.collectStar, null, this);
        if (player && player.body) player.body.velocity.x = 0;
        if (this.stick.isDown || leftKey.isDown || rightKey.isDown) {

            if ((this.stick.direction === Phaser.LEFT) || leftKey.isDown) {
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
            if (player && player.body && player.body.onFloor())
                player.animations.play('idle');

        }

    },

    collideWithLayer: function (player, tile) {
        var data = this.game && this.game.data;
        var game = this.game;
        if (tile.x == 124)
            //todo - add an object to overlap with for ending (gate or whatever the user is uploading)
            game.state.start('win');
    },
    win: function () {
        var data = this.game && this.game.data;
        var game = this.game;
        console.log("win");
        game.state.start('win');
    },
    jump: function () {
        var player = this.player;
        if (player && player.body && player.body.onFloor()) {
            player.body.velocity.y = -350;
            player.animations.play('jump');
        }
    },
    turnRandomEnemy: function () {
        var data = this.game && this.game.data;
        var game = this.game;
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
    },
    collectStar: function (player, star) {
        var data = this.game && this.game.data;
        var game = this.game;
        star.kill();
        collecting_sound.play();
        this.score += 10;
        //scoreText.text = 'Score: ' + score;
    },

    shootBullet: function () {
        Bullet = this.Bullet;
        player = this.player;
        var data = this.game && this.game.data;
        var game = this.game;
        if (bullets.length < 5) {
            var bullet = new Bullet(game, player.x + 10, player.y + 10, direction, data.assets.bullet.speed, data.assets.bullet.key);
            bullets.add(bullet);
            firing_sound.play();
        }
    },








    getFramesArray: function (start, end) {
        return Array(end - start + 1).fill().map((item, index) => start + index);
    }


}