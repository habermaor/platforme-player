
module.exports = class EnemyBullet extends Phaser.Sprite {

    constructor(game, x, y,enemy , direction, speed, key) {
        super(game, x, y, key);
        game.physics.enable(this, Phaser.Physics.ARCADE);
        enemy.attackSound.play();
        this.xSpeed = direction * speed;
    }
    update() {
        var player = this.game.globals.player;
        var game = this.game;
        this.game.physics.arcade.overlap(this, player, function (bullet, player) {
            enemy.bullets.remove(bullet);
            player.isDead = true;
            player.body.velocity.x = 0;
    
         //   player.animations.play('die', 10, false, true).onComplete.add(function () { game.state.start('lose'); });
            enemy.HitSound.play();
            game.state.start('lose');
        });


        this.body.velocity.y = 0;
        this.body.velocity.x = this.xSpeed;
        if (this.x < 0 || this.x > 1664) {
            this.destroy();
        }

    }
   
}
