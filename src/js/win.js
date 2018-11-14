module.exports = {
    preload: function () {
        this.game.load.image('win_bg', this.game.data && this.game.data.assets
            && this.game.data.assets.winImage && this.game.data.assets.winImage.url
            || "assets/gameover.png")
    },
    create: function () {
        var data = this.game.data;
        this.game.plugins.removeAll();
        this.game.add.tileSprite(0, 0, (data.assets.tilemap.width / data.assets.tilemap.height) * window.innerHeight * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, 'win_bg');

    }
}