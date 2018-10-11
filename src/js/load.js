module.exports = {
    defauldData: require('./dataMC'),
    preload: function () {
        var defauldData = this.defauldData;

        var url = new URL(window.location.href);
        var gameId = url.searchParams.get("id");
        console.log("gameId",gameId);


        let getGame = new Promise((resolve, reject) => {
            this.game.data = defauldData;
            const xhr = new XMLHttpRequest();            
            xhr.open("GET", '/api/item/' + gameId);
            xhr.onload = () => resolve(xhr.responseText);
            xhr.onerror = () => { this.game.data = defauldData; console.log('wtf', this.game.data); this.game.state.start('play'); reject(xhr.statusText); }
            xhr.send();
        })
        getGame.then(
            (json) => {
                this.game.data = JSON.parse(json); 
                this.game.state.start('play');
            })
        .catch(
        (reason) => {
            console.log(reason);
            this.game.data = defauldData;
            console.log('wtf', this.game.data);
            this.game.state.start('play');
           
        })
    },
    create: function () {
        loaderText = this.game.add.text(16, 16, 'Your own game is being loaded.. How Awesome is that?!', { fontSize: '32px', fill: '#fff' });
    }
}