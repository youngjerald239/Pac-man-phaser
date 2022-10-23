import {IGhostAI, Direction, getOppositeDirection, getOrderedDirections} from "../ghost-ai/IGhostAI"
import positionInDirection from "../ghost-ai/utils/positionInDirection"
import Hero from "../Hero"
import IGhost from "../IGhost"
import Ghost from '../Ghost'
import { TileSize } from "../ghost-ai/consts/TileConfig"
import determineGhostDirection from "./GhostMovement"

export default class ChaseHeroAI implements IGhostAI
{
    private ghost: IGhost
    private hero: Hero
    private board: Phaser.Tilemaps.DynamicTilemapLayer

    get speed()
    {
        return 100
    }
    get targetPosition()
    {
        const body = this.hero.body as Phaser.Physics.Arcade.Body
        return {
            x: body.position.x, y: body.position.y
        }
    }

    constructor(ghost: IGhost, hero: Hero, board: Phaser.Tilemaps.DynamicTilemapLayer)
    {
        this.ghost = ghost
        this.hero = hero
        this.board = board
    }

    pickDirection()
    {
        const {x: tx, y: ty} = this.targetPosition

        return determineGhostDirection(tx, ty, this.ghost, this.board)
    }
}