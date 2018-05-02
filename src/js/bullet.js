
module.exports = class Bullet extends Phaser.Sprite {
    constructor(game, x, y, direction, speed, key) {
        super(game, x, y, key);
        game.physics.enable(this, Phaser.Physics.ARCADE);
        this.xSpeed = direction * speed;
    }
    update() {
        this.game.physics.arcade.overlap(this, enemies, function (bullet, enemy) {
            bullets.remove(bullet);
            enemy.isDead = true;
            enemy.body.velocity.x = 0;

            enemy.animations.play('die', 10, false, true).onComplete.add(function () { enemies.remove(enemy); });
            hitting_sound.play();
            this.score += 1;
            //  scoreText.text = 'score: ' + score;




        });


        this.body.velocity.y = 0;
        this.body.velocity.x = this.xSpeed;
        if (this.x < 0 || this.x > 1664) {
            this.destroy();
        }

    }
   
}
