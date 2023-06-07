import Phaser from "phaser"

export default class PauseGame extends Phaser.Scene {
    constructor() {
        super('pauseGame')
    }

    create() {

        const { width, height } = this.scale

        this.add.text(0.5, 0.5, data.title, {
            fontSize: '48px',
            color: '#fff',
            padding: { left: 150, right: 10, top: 300, bottom: 10 }

        })

        // input to resume Game
        this.input.keyboard.once('keydown-TAB', () => {
            
            this.scene.resume('game')
            this.scene.stop('pauseGame')
        })
        console.log('pause')
    }
}