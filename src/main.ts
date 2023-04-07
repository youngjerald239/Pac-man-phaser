import Phaser from 'phaser'

import Preloader from './scenes/Preloader'
import Game from './scenes/Game'

import SceneKeys from './consts/SceneKeys'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 600,
	height: 700,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: true
		}
	},
	scale: {
		mode: Phaser.Scale.ScaleModes.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH
	}
}

const game = new Phaser.Game(config)

game.scene.add(SceneKeys.Preloader, Preloader)
game.scene.add(SceneKeys.Game, Game)

game.scene.start(SceneKeys.Preloader)

export default game
