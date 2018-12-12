Bullet = require('./enemyBullet'),

module.exports = class Enemy extends Phaser.Sprite {
    constructor(game, x, y, key) {
        function getFramesArray(start, end) {
            return Array(end - start + 1).fill().map((item, index) => start + index);
        };
      

        super(game, x, y, key, 64, 64);
        var data = this.game && this.game.data;
        var _self = this;
       // Phaser.Sprite.call(this, game, x, y, key, 64, 64);
        game.physics.enable(this, Phaser.Physics.ARCADE);
        this.anchor.setTo(.5, .5);
        this.scale.setTo(data.assets.enemies[0].scale || 1, data.assets.enemies[0].scale || 1);

        this.collideWorldBounds = true;
        this.enableBody = true;
        this.animations.add('die', getFramesArray(data.assets.enemies[0].animations.die.from, data.assets.enemies[0].animations.die.to), 10);
        this.animations.add('idle', getFramesArray(data.assets.enemies[0].animations.idle.from, data.assets.enemies[0].animations.idle.to), 10);
        this.animations.add('walk', getFramesArray(data.assets.enemies[0].animations.walk.from, data.assets.enemies[0].animations.walk.to), 10);
        this.animations.add('jump', getFramesArray(data.assets.enemies[0].animations.jump.from, data.assets.enemies[0].animations.jump.to), 10);

     


     



        this.animations.currentFrame = 0;

        this.body.gravity.y = data.assets.enemies[0].gravity || 800;
        this.body.bounce.y = 0;
        this.body.bounce.x = 1;
        this.body.collideWorldBounds = true;
        this.bullets = game.add.group();
        this.bullets.enableBody = true;
        // this.body.velocity.x = 30 + Math.random() * 50;
    };
   

    attack() {
        let data = this.game && this.game.data;
        let game = this.game;
        let direction;
        this.body.velocity.x > 0 ? direction = 1 : direction = -1;
        var bullet = new Bullet(game, this.x + 10, this.y + 10, this, direction, data.assets.enemies[0].bullet.speed, data.assets.enemies[0].bullet.key);
        this.bullets.add(bullet);
        firing_sound.play();
    }

    update () {
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

    }
}
