import Phaser from 'phaser'
// animations for pac-man
const createHeroAnims = (anims: Phaser.Animations.AnimationManager) => {
	anims.create({
		key: 'hero-move',
		frameRate: 10,
		frames: anims.generateFrameNames('game-atlas', { prefix: 'hero-', suffix: '.png', start: 1, end: 2 }),
		repeat: -1
	})

	anims.create({
		key: 'hero-idle',
		frames: [{ key: 'game-atlas', frame: 'hero-2.png' }]
	})

	anims.create({ 
		key: 'hero-spin', 
		frames: anims.generateFrameNames('hero', { prefix: 'hero-s', end: 6, zeroPad: 4 }), repeat: -1 })
}

export default createHeroAnims

export {
	createHeroAnims
}
