import { IGhostAI } from "../ghost-ai/IGhostAI"
import IGhost from "../IGhost"
import Hero from "../Hero"
import ChaseHeroAI from "./ChaseHeroAI"
import ScatterAI from "./ScatterAi"
import { TileSize } from "../ghost-ai/consts/TileConfig"

export default class PlayfullyChaseHeroAI implements IGhostAI 
{
    private chaseAI: ChaseHeroAI
    private scatterAI: ScatterAI
    private hero: Hero
    private ghost: IGhost

    private _targetPosition = {x: 0, y: 0}

    get speed()
    {
        return 100
    }

    get targetPosition()
    {
      return this._targetPosition
    }

    constructor(ghost: IGhost, chaseAI: ChaseHeroAI, scatterAI: ScatterAI, hero: Hero) {
        this.chaseAI = chaseAI
        this.scatterAI = scatterAI
        this.hero = hero
        this.ghost = ghost
        
    }

    pickDirection() {
        const { x: hx, y: hy } = this.hero.body.position
        const {x, y} = this.ghost.physicsBody.position

        const distance = Phaser.Math.Distance.Between(hx, hy, x, y)

        const radius = TileSize * 8

        if (distance > radius)
        {
           const dir = this.chaseAI.pickDirection()

           this._targetPosition = this.chaseAI.targetPosition

           return dir
        }

        const dir = this.scatterAI.pickDirection()

        this._targetPosition = this.chaseAI.targetPosition

        return dir
    }
}