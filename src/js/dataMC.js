
module.exports =
    {

        assets: {
            background: { key: "sky", url: "assets/mc_game/office_opacity.jpg" },
            soundtrack: { key: "soundtrack", url: "assets/mc_game/awesomesauce.mp3" },
            objects: [
                {
                    key: "star1", url: "assets/mc_game/mentor_small.png",
                    audio: {
                        collect: { key: "star1_collect", url: "assets/mc_game/collect_coin.wav" }
                    },
                    positions: [{ x: 400, y: 1200 }]
                },
                {
                    key: "star2", url: "assets/mc_game/advisor_small.png",
                    audio: {
                        collect: { key: "star1_collect", url: "assets/mc_game/collect_coin.wav" }
                    }, positions: [{ x: 300, y: 700 }]
                },
                {
                    key: "star3", url: "assets/mc_game/investor_small.png",
                    audio: {
                        collect: { key: "star1_collect", url: "assets/mc_game/collect_coin.wav" }
                    }, positions: [{ x: 1400, y: 1200 }]
                },
                {
                    key: "star4", url: "assets/mc_game/international_small.png",
                    audio: {
                        collect: { key: "star1_collect", url: "assets/mc_game/collect_coin.wav" }
                    }, positions: [{ x: 1400, y: 200 }]
                }
            ],
            bullet: {
                key: "bullet", url: "assets/lips.png", audio: {
                    firing: { key: "bullet_firing", url: "assets/kiss.wav" },
                    hit: { key: "bullet_hit", url: "assets/oh_no.wav" }
                }
            },
            enemies: [{
                speed: 200,
                key: "enemy", url: "assets/mc_game/maor_horizontal.png", frameWidth: 482, frameHeight: 498
                , positions: [{ x: 800, y: 1400 }, { x: 300, y: 700 }, { x: 1400, y: 1200 }, { x: 1400, y: 200 }]
            }],
            hero: {
                speed: 300,
                x: 32, y: 1450,
                key: "hero", url: "assets/mc_game/snap_2d_sprite.png", frameWidth: 415, frameHeight: 536, animations: { walk: { from: 20, to: 29 }, jump: { from: 10, to: 19 }, idle: { from: 0, to: 9 } }
            },
            endStage: { key: "endStage", url: "assets/mc_game/masschallenge_il.jpg", x: 100, y: 1450 /*x: 1330, y: 250*/ },
            tilemap: { key: "tilemap", url: "assets/mc_game/office2.json", width: 52, height: 52/*TODO - put all the tilemap data here, instead of external file*/ },
            tileImages: [{ key: "b3ad8f", url: "assets/mc_game/b3ad8f.png" }]/*TODO - no need in this. images should be taken from map json*/
        },

    }

