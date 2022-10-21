import Phaser from "phaser"
import IGhost from '../IGhost'

import {IGhostAI} from '../ghost-ai/IGhostAI'

export default class NewGhost extends Phaser.GameObjects.Container implements IGhost
{
    private ghostBody: Phaser.GameObjects.Sprite

    get currentDirection()
    {
        return Direction.None
    }
    constructor(scene: Phaser.Scene, x: Number, y: number)
    {
        super(scene, x, y)

        this.ghostBody = scene.add.sprite(16, 16, 'game-atlas')
        this.ghostBody.play('ghost-body-idle')

        const eyes = scene.add.image(16, 12, 'game-atlas', 'ghost-eyes.png')
        const leftPupil = scene.add.image(9, 12, 'game-atlas', 'ghost-pupil.png')
            .setTint(0x000000)

        const rightPupil = scene.add.image(22, 12, 'game-atlas', 'ghost-pupil.png')
            .setTint(0x000000)
        
        this.add(this.ghostBody)
        this.add(eyes)
        this.add(leftPupil)
        this.add(rightPupil)
    }

    setAI(ai: IGhostAI)
    {
        return this
    }
    enableTargetMarker(enable: boolean)
    {
        return this
    }

    makeRed()
    {
        this.ghostBody.setTint(0xFF0400)
        return this
    }
    makeTeal() 
    {
        return this
    }
    makePink()
    {
        return this
    }
    makeOrange()
    {
        return this
    }

    look(direction: Direction)
    {

    }

    preUpdate(t: number, dt: number)
    {

    }
}