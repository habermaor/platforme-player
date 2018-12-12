module.exports = {

    Bullet: require('./bullet'),
    Enemy: require('./enemy'),


    preload: function () {

        var data = this.game && this.game.data;
        var game = this.game;
        var player = this.game.globals.player;

        game.load.onFileComplete.add(fileComplete, this);

        data.assets.objects.forEach(function (object) {
            game.load.image(object.key, object.url);
        });
        data.assets.specialTiles && data.assets.specialTiles.forEach(function (specialTile) {
            game.load.image(specialTile.key, specialTile.url);
        });
        game.load.image(data.assets.bullet.key, data.assets.bullet.url);
        game.load.image(data.assets.endStage.key, data.assets.endStage.url);
        game.load.spritesheet(data.assets.hero.key, data.assets.hero.url, data.assets.hero.frameWidth, data.assets.hero.frameHeight);
        data.assets.enemies.forEach(function (enemy) {
            game.load.spritesheet(enemy.key, enemy.url, enemy.frameWidth, enemy.frameHeight);
            game.load.image(enemy.bullet.key, enemy.bullet.url);

            game.load.audio(enemy.bullet.audio.firing.key, enemy.bullet.audio.firing.url);
            game.load.audio(enemy.bullet.audio.hit.key, enemy.bullet.audio.hit.url);
        });
        game.load.spritesheet(data.assets.enemies[0].key, data.assets.enemies[0].url);
        game.load.audio(data.assets.bullet.audio.firing.key, data.assets.bullet.audio.firing.url);
        game.load.audio(data.assets.bullet.audio.hit.key, data.assets.bullet.audio.hit.url);
        game.load.audio(data.assets.hero.audio.jump.key, data.assets.hero.audio.jump.url);



        game.load.audio(data.assets.soundtrack.key, data.assets.soundtrack.url);
        game.load.audio(data.assets.objects[0].audio.collect.key, data.assets.objects[0].audio.collect.url);


        game.load.crossOrigin = 'anonymous';

        game.load.image(data.assets.background.key, data.assets.background.url)
        game.load.tilemap(data.assets.tilemap.key, data.assets.tilemap.url, null, Phaser.Tilemap.TILED_JSON);
        game.load.image(data.assets.tileImages[0].key, data.assets.tileImages[0].url);

        game.load.atlas('dpad', 'assets/dpad.png', 'assets/dpad.json');
        loaderText = this.game.add.text(16, 16, 'Your own pictures, sounds and creativity are being downloaded! Fantastic!', { fontSize: '32px', fill: '#fff' });
        loaderProgressText = this.game.add.text(16, 100, '', { fontSize: '20px', fill: '#fff' });


        function fileComplete(progress, cacheKey, success, totalLoaded, totalFiles) {
            loaderProgressText.setText("Loading: " + progress + "% - " + totalLoaded + " out of " + totalFiles + " files of awsomness!");
        }



    },
    create: function () {

        loaderText.destroy();
        loaderProgressText.destroy();
        Enemy = this.Enemy;
        var data = this.game && this.game.data;
        var game = this.game;

        game.scale.forceOrientation(true);
        game.scale.pageAlignHorizontally = true;
        game.physics.startSystem(Phaser.Physics.ARCADE);
        if (data.assets.soundtrack.key) {
            soundtrack = game.add.audio(data.assets.soundtrack.key);
            soundtrack.loopFull(0.5);
        }

        // game.add.tileSprite(0, 0, (data.assets.tilemap.width / data.assets.tilemap.height) * window.innerHeight * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, data.assets.background.key).alpha = 0.6;
        game.stage.backgroundColor = "#fff";
        game.add.tileSprite(0, 0, 1664, 1664, data.assets.background.key).alpha = 0.4;

        map = game.add.tilemap(data.assets.tilemap.key);
        game.world.setBounds(0, 0, (data.assets.tilemap.width / data.assets.tilemap.height) * window.innerHeight * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio);
        endPoint = game.add.sprite(data.assets.endStage.x, data.assets.endStage.y, data.assets.endStage.key);
        endPoint.enableBody = true;
        game.physics.arcade.enable(endPoint);



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
        game.globals.player = game.add.sprite(data.assets.hero.x, data.assets.hero.y, data.assets.hero.key);
        var player = game.globals.player;
        player.anchor.setTo(.5, .5);
        player.scale.setTo(data.assets.hero.scale || 1, data.assets.hero.scale || 1);
        game.physics.arcade.enable(player);



        game.camera.follow(player);
        game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);


        player.body.bounce.y = 0;
        player.body.gravity.y = data.assets.hero.gravity || 300;
        player.body.collideWorldBounds = true;

        player.animations.add('die', this.getFramesArray(data.assets.hero.animations.jump.from, data.assets.hero.animations.jump.to), 30);

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
                enemy.attackSound = game.add.audio(bad.bullet.audio.firing.key);
                enemy.HitSound = game.add.audio(bad.bullet.audio.hit.key);
                enemies.add(enemy);
            });
            
          

        });
        game.time.events.loop(Phaser.Timer.SECOND * 2, this.turnRandomEnemy, this);
        game.time.events.loop(Phaser.Timer.SECOND * 3, this.randomEnemyAttack, this);

        
        bullets = game.add.group();
        bullets.enableBody = true;


        //  scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
        firing_sound = game.add.audio(data.assets.bullet.audio.firing.key);
        hitting_sound = game.add.audio(data.assets.bullet.audio.hit.key);
        collecting_sound = game.add.audio(data.assets.objects[0].audio.collect.key);
        jump_sound = game.add.audio(data.assets.hero.audio.jump.key);



        speciel_tiles = game.add.group();
        speciel_tiles.enableBody = true;

        data.assets.specialTiles && data.assets.specialTiles.forEach(function (specialTile) {
            specialTile.positions.forEach(function (position) {
                var tile = speciel_tiles.create(position.x, position.y, specialTile.key);
                tile.collideData = specialTile.collide;
            });
        });

    },
    update: function () {
        var data = this.game && this.game.data;
        var game = this.game;
        var player = this.game.globals.player;

        game.physics.arcade.collide(player, layer);
        game.physics.arcade.overlap(player, endPoint, this.win, null, this);
        game.physics.arcade.collide(stars, layer);
        game.physics.arcade.collide(enemies, layer);
        game.physics.arcade.overlap(player, speciel_tiles, this.collideWithSpecialTile, null, this);
        game.physics.arcade.overlap(player, stars, this.collectStar, null, this);
        if (player && player.body) player.body.velocity.x = 0;
        if (player && player.body && !player.isDead && (this.stick.isDown || leftKey.isDown || rightKey.isDown)) {

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


    win: function () {
        var data = this.game && this.game.data;
        var game = this.game;
        game.state.start('win');
    },
    lose: function () {
        var data = this.game && this.game.data;
        var game = this.game;

        console.log("TODO - lose stuff, cool animation and lose stage");
        // game.state.start('lose');
    },
    jump: function () {
        var player = this.game.globals.player;

        if (player && player.body && player.body.onFloor()) {
            player.body.velocity.y = -350;
            jump_sound.play();
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
    randomEnemyAttack: function () {
        var data = this.game && this.game.data;
        var game = this.game;
        enemy = enemies.children[Math.floor(Math.random() * enemies.children.length)]
        if (enemy) {
            enemy.attack();
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
        var player = this.game.globals.player;

        var data = this.game && this.game.data;
        var game = this.game;
        if (bullets.length < 5) {
            var bullet = new Bullet(game, player.x + 10, player.y + 10, direction, data.assets.bullet.speed, data.assets.bullet.key);
            bullets.add(bullet);
            firing_sound.play();
        }
    },

    collideWithSpecialTile: function (player, tile) {
        _self = this;
        if (tile.collideData.with == "hero" || tile.collideData.with == "all") {
            switch (tile.collideData.effect.property) {
                case "jetpack":
                    if (player.body.gravity.y != tile.collideData.effect.value.gravity) {
                        let originalGravity = player.body.gravity.y;
                        player.body.gravity.y = tile.collideData.effect.value.gravity;
                        this.game.time.events.add(tile.collideData.effect.value.time, function () { player.body.gravity.y = originalGravity }, this).autoDestroy = true;
                    }
                    break;
                case "portal":
                    player.body.x = tile.collideData.effect.value.x;
                    player.body.y = tile.collideData.effect.value.y;
                    break;
                case "jumper":
                    player.body.velocity.setTo(tile.collideData.effect.value.x, tile.collideData.effect.value.y)
                    break;
                case "sizer":
                    player.scale.setTo(tile.collideData.effect.value.width, tile.collideData.effect.value.height)
                    break;
                case "killer":
                    if (!player.isDead) {
                        player.isDead = true;
                        player.body.velocity.x = 0;
                        // enemy.animations.play('die', 10, false, true).onComplete.add(function () { enemies.remove(enemy); });

                        player.animations.play(tile.collideData.effect.value.customAnimation ? tile.collideData.effect.value.customAnimation : 'idle', 30, false, true).onComplete.add(function () { _self.lose() });
                        //  player.destroy();
                        hitting_sound.play();

                    }
                    break;
                case "speeder":
                    player.body.velocity.x = 1000;
                    player.body.moveTo(1000, 1000, 360)
                    break;

                default:
                    break;

            }
        }
    },






    getFramesArray: function (start, end) {
        return Array(end - start + 1).fill().map((item, index) => start + index);
    }


}