module.exports = {
    defauldData: require('./dataMC'),
    preload: function () {
        console.log('load state');
        var defauldData = this.defauldData;
        var p = (window.location.pathname || '').split('/');
        let getGame = new Promise((resolve, reject) => {
            console.log(p, p[1])
            this.game.data = defauldData;
            const xhr = new XMLHttpRequest();            
            xhr.open("GET", 'http://localhost:3000/api/item/' + p[1]);
            xhr.onload = () => resolve(xhr.responseText);
            xhr.onerror = () => { this.game.data = defauldData; console.log('wtf', this.game.data); this.game.state.start('play'); reject(xhr.statusText); }
            xhr.send();
        })
        getGame.then(
            (json) => {
                this.game.data = JSON.parse(json); console.log("horray!");
                this.game.state.start('play');
            })
        .catch(
        (reason) => {
            console.log(reason);
            this.game.state.start('play');
           
        })
    },
    create: function () {
        loaderText = this.game.add.text(16, 16, 'Your own game is loading.. Tinkalot rules!', { fontSize: '32px', fill: '#000' });
    }
}