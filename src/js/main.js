//var data = require('./dataMC');
var data;
var loadState = require('./load');
var playState = require('./play');
var winState = require('./win');
var loseState = require('./lose');

var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'game');
//var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update });
game.state.add('load', loadState);
game.state.add('play', playState);
game.state.add('win', winState);
game.state.add('lose', loseState);

game.state.start('load');
game.globals = {  player: null };
var firing_sound;
var hitting_sound;
var soundtrack;
var collecting_sound;
var jump_sound;

//var player;
var bullets;

var enemies;
var spaceBar;
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










