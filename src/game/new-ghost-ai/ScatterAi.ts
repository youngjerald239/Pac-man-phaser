import { IGhostAI, Direction, getOppositeDirection, getOrderedDirections } from "../ghost-ai/IGhostAI"

import {positionInDirection} from "../ghost-ai/utils/positionInDirection"
import { TileSize } from "../ghost-ai/consts/TileConfig"

import IGhost from "../IGhost"

import determineGhostDirection from "./GhostMovement"

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

        return determineGhostDirection(tx, ty, this.ghost, this.board)
    } 
}

