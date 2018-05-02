module.exports = {
    preload: function () {
        this.game.load.image('win_bg', "assets/mc_game/Winner.png")

    },
    create: function () {
        this.game.plugins.removeAll();
        //uncomment this once I olve the state issue
        // this.game.add.tileSprite(0, 0, (data.assets.tilemap.width / data.assets.tilemap.height) * window.innerHeight * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, data.assets.background.key).alpha = 0.6;

        //var winLabel = this.add.text(100, 100, "You Won! Platforme Rulezzz", { font: "50px Arial", fill: "#ffffff" });
    }
}