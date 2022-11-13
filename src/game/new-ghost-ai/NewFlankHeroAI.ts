import { IGhostAI } from "../ghost-ai/IGhostAI"
import determineGhostDirection from "./GhostMovement"
import IGhost from "../IGhost"
import Hero from "../Hero"
import { TileSize } from "../ghost-ai/consts/TileConfig"

export default class FlankHeroAI implements IGhostAI {
    private ghost: IGhost
    private chasingGhost: IGhost
    private hero: Hero
    private board: Phaser.Tilemaps.DynamicTilemapLayer

    get speed() {
        return 60
    }

    get targetPosition() {
        let { x, y } = this.hero.body.position

        const vec = this.hero.facingVector.normalize()

        x = x + vec.x * (TileSize)
        y = y + vec.y * (TileSize)

        const { x: px, y: py } = this.chasingGhost.physicsBody.position

        const dx = x - px
        const dy = y - py

        x = x + dx
        y = y + dy

        return { x, y }
    }

    constructor(ghost: IGhost, hero: Hero, chasingGhost: IGhost, board: Phaser.Tilemaps.DynamicTilemapLayer) {
        this.ghost = ghost
        this.chasingGhost = chasingGhost
        this.hero = hero
        this.board = board
    }

    pickDirection() {
        const { x, y } = this.targetPosition
        return determineGhostDirection(x, y, this.ghost, this.board)
    }
}