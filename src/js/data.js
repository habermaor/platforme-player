﻿
module.exports =
    {
        gameConfiguration: {
            gameWidth: 2400,
            gameHeight: "100%"
        },
        assets: {
            background: { key: "sky", url: "assets/sky.png" },
            ground: { key: "ground", url: "assets/platform.png" },
            object: { key: "star", url: "assets/me.png" },
            bullet: {
                key: "bullet", url: "assets/lips.png", audio: {
                    firing: { key: "bullet_firing", url: "assets/muah.m4a" },
                    hit: { key: "bullet_hit", url: "assets/huhu.m4a" }
                }
            },
            enemy: {
                key: "enemy", url: "assets/snap_spritesheet.png", frameWidth: 64, frameHeight: 64

            },
            hero: { key: "hero", url: "assets/yuval_spritesheet.png", frameWidth: 64, frameHeight: 64 },
            tilemap: { key: "tilemap", url: "assets/simple.json", width: 128, height: 32/*TODO - put all the tilemap data here, instead of external file*/ },
            tileImages: [{ key: "tiles-1", url: "assets/tiles-1.png" }]
        },

    }

