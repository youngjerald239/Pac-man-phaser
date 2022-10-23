import { IGhostAI, Direction } from "../ghost-ai/IGhostAI"
import IGhost from "../IGhost"
import Hero from "../Hero"
import { TileSize } from "../ghost-ai/consts/TileConfig"
import determineGhostDirection from "./GhostMovement"

export default class InterceptHeroAI implements IGhostAI
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
        let {x, y} = this.hero.body.position

        const vec = this.hero.facingVector.normalize()

            if (vec.y === -1)
            {
                vec.x === -1
            }

            x = x + vec.x * (4 * TileSize)
            y = y + vec.y * (4 * TileSize)
       
        return {x, y}
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