export default class GameOver extends Phaser.Scene {
    constructor() {
        super('game-over')
    }

    create() {
        const width = this.scale.width
        const height = this.scale.height

        this.add.text(width * 0.5, height * 0.5, 'Game Over press Spacebar to restart', 'press Space', {
            fontSize: 48
        })
            .setOrigin(0.5)

        // input to restart after game over
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('game')
        })
    }
}