import Phaser from "phaser"

export default class GameOver extends Phaser.Scene {
    constructor() {
        super('game-over')
    }

    create(data: { title: string }) {

        const { width, height } = this.scale

        this.add.text(0.5, 0.5, data.title, {
            fontSize: '48px',
            color: '#fff',
            padding: { left: 150, right: 10, top: 300, bottom: 10 }
            
        })
        
        // input to restart after game over
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('game')
        })
    }
}