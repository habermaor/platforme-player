
module.exports =
    {

        assets: {
            background: { key: "sky", url: "assets/sky.png" },
            ground: { key: "ground", url: "assets/platform.png" },
            object: { key: "star", url: "assets/me.png", amount: 20 },
            bullet: {
                key: "bullet", url: "assets/lips.png", audio: {
                    firing: { key: "bullet_firing", url: "assets/muah.m4a" },
                    hit: { key: "bullet_hit", url: "assets/huhu.m4a" }
                }
            },
            enemy: {
                key: "enemy", url: "assets/snap_spritesheet.png", frameWidth: 64, frameHeight: 64, amount: 15

            },
            hero: {
                key: "hero", url: "assets/girl_sprite.png", frameWidth: 436, frameHeight: 454, animations: { walk: { from: 47, to: 66 }, jump: { from: 16, to: 46 }, idle: { from: 1, to: 15 } }
            },
            endStage: { key: "endStage", url: "assets/checkered-flag.png", x: 1800, y: 300 },
            tilemap: { key: "tilemap", url: "assets/simple.json", width: 128, height: 32/*TODO - put all the tilemap data here, instead of external file*/ },
            tileImages: [{ key: "tiles-1", url: "assets/tiles-1.png" }]
        },

    }

