import Phaser from "phaser"
import IGhost from '../IGhost'

import { Direction, getOppositeDirection, getOrderedDirections, IGhostAI } from '../ghost-ai/IGhostAI'
import positionInDirection from '../ghost-ai/utils/positionInDirection'
import { TileSize } from "./consts/TileConfig"

export default class NewGhost extends Phaser.GameObjects.Container implements IGhost
{
    private ghostBody: Phaser.GameObjects.Sprite
    private leftPupil: Phaser.GameObjects.Image
    private rightPupil: Phaser.GameObjects.Image

    private _currentDirection = Direction.None

    private board: Phaser.Tilemaps.DynamicTilemapLayer
    private lastTilePosition = new Phaser.Geom.Point(-1, -1)

    get currentDirection()
    {
        return this._currentDirection
    }
    constructor(scene: Phaser.Scene, x: Number, y: number, board: Phaser.Tilemaps.DynamicTilemapLayer)
    {
        super(scene, x, y)

        this.board = board

        this.ghostBody = scene.add.sprite(16, 16, 'game-atlas')
        this.ghostBody.play('ghost-body-idle')

        const eyes = scene.add.image(16, 12, 'game-atlas', 'ghost-eyes.png')
        this.leftPupil = scene.add.image(9, 12, 'game-atlas', 'ghost-pupil.png')
            .setTint(0x000000)

        this.rightPupil = scene.add.image(22, 12, 'game-atlas', 'ghost-pupil.png')
            .setTint(0x000000)
        
        this.add(this.ghostBody)
        this.add(eyes)
        this.add(this.leftPupil)
        this.add(this.rightPupil)

        scene.physics.add.existing(this)
        const body = this.body as Phaser.Physics.Arcade.Body
        body.setCircle(16)
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
        this.ghostBody.setTint(0x0CF9E3)
        return this
    }
    makePink()
    {
        this.ghostBody.setTint(0xFCB4E3)
        return this
    }
    makeOrange()
    {
        this.ghostBody.setTint(0xFCB72C)
        return this
    }

    look(direction: Direction)
    {
        switch (direction)
        {
            case Direction.None:
                this.leftPupil.setPosition(9, 12)
                this.rightPupil.setPosition(22, 12)
                break

            case Direction.Left:
                this.leftPupil.setPosition(7, 12)
                this.rightPupil.setPosition(20, 12)
                break

            case Direction.Right:
                this.leftPupil.setPosition(11, 12)
                this.rightPupil.setPosition(24, 12)
                break

            case Direction.Up:
                this.leftPupil.setPosition(9, 9)
                this.rightPupil.setPosition(22, 9)
                break

            case Direction.Down:
                this.leftPupil.setPosition(9, 15)
                this.rightPupil.setPosition(20, 15)
                break
        }
    }

    preUpdate(t: number, dt: number)
    {
        if (!this.board)
        {
            return
        }
        const body = this.body as Phaser.Physics.Arcade.Body
        const x = body.position.x
        const y = body.position.y

        const gx = Math.floor(x/TileSize) * TileSize
        const gy = Math.floor(y/TileSize) * TileSize

        if (this.lastTilePosition.x === gx && this.lastTilePosition.y === gy)
        {
            return
        }

        if (Math.abs(x-gx) > 3 || Math.abs(y-gy) > 3)
        {
            return
        }

        const tx = this.board.width
        const ty = this.board.height

        const backwardsDirection = getOppositeDirection(this._currentDirection)
        const directions = getOrderedDirections(dir => dir !== backwardsDirection)

        let bestDirection = Direction.None
        let bestDirectionDistance = -1

        for (let i = 0; i < directions.length; ++i)
        {
            const dir = directions[i]
            const pos = positionInDirection(gx, gy, dir)

            if (this.board.getTileAtWorldXY(pos.x, pos.y))
            {
                continue
            }
            const distance = Phaser.Math.Distance.Between(tx, ty, pos.x, pos.y)

            if (bestDirection === Direction.None)
            {
                bestDirection = dir
                bestDirectionDistance = distance
                continue
            }

            if (distance < bestDirectionDistance)
            {
                bestDirection = dir
                bestDirectionDistance = distance
            }
        }
        const speed = 100
        switch(bestDirection)
        {
            case Direction.Left:
                body.velocity.x = -speed
                body.velocity.y = 0
                break

            case Direction.Right:
                body.velocity.x = speed
                body.velocity.y = 0
                break

            case Direction.Up:
                body.velocity.x = 0
                body.velocity.y = -speed
                break

            case Direction.Down:
                body.velocity.x = 0
                body.velocity.y = speed
                break
        }

        this._currentDirection = bestDirection
        this.lastTilePosition.x = gx
        this.lastTilePosition.y = gy
    }
}