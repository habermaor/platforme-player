module.exports = {
    create: function () {
        this.game.plugins.removeAll();
        var winLabel = this.add.text(100, 100, "You Won! Platforme Rulezzz", { font: "50px Arial", fill: "#ffffff" });
    }
}