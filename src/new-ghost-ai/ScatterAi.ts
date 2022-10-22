import { IGhostAI, Direction, getOppositeDirection, getOrderedDirections } from "../ghost-ai/IGhostAI"

import {positionInDirection} from "../ghost-ai/utils/positionInDirection"
import { TileSize } from "../ghost-ai/consts/TileConfig"

import IGhost from "../IGhost"

export default class ScatterAI implements IGhostAI
{
    private ghost: IGhost
    private board: Phaser.Tilemaps.DynamicTilemapLayer

    private _targetPosition = {x: 0, y: 0}

    get speed()
    {
        return 100
    }

    get targetPosition() 
    { 
        return
        {
            this._targetPosition
        }
    }

    constructor(x: number, y: number, ghost: IGhost, board: Phaser.Tilemaps.DynamicTilemapLayer)
    {
        this.ghost = ghost
        this.board = board

        this._targetPosition.x = x
        this._targetPosition.y = y
    }

    pickDirection()
    {
        const {x: tx, y: ty} = this._targetPosition

        const x = this.ghost.physicsBody.position.x
        const y = this.ghost.physicsBody.position.y

        const backwardsDirection = getOppositeDirection(this.ghost.currentDirection)
        const directions = getOrderedDirections(dir => dir !== backwardsDirection)

        let bestDirection = Direction.None
        let bestDirectionDistance = -1

        const gx = Math.floor(x / TileSize) * TileSize
        const gy = Math.floor(y / TileSize) * TileSize

        for (let i = 0; i < directions.length; ++i) {
            const dir = directions[i]
            const pos = positionInDirection(gx, gy, dir)

            if (this.board.getTileAtWorldXY(pos.x, pos.y)) {
                continue
            }
            const distance = Phaser.Math.Distance.Between(tx, ty, pos.x, pos.y)

            if (bestDirection === Direction.None) {
                bestDirection = dir
                bestDirectionDistance = distance
                continue
            }

            if (distance < bestDirectionDistance) {
                bestDirection = dir
                bestDirectionDistance = distance
            }
        }

        return bestDirection
    } 
}

