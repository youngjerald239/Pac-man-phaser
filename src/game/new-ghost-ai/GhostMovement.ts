import Phaser from "phaser"
import IGhost from "../IGhost"
import positionInDirection from "../ghost-ai/utils/positionInDirection"
import { getOppositeDirection, getOrderedDirections, Direction } from "../ghost-ai/IGhostAI"
import { TileSize } from "../ghost-ai/consts/TileConfig"

const determineGhostDirection = (tx: Number, ty: number, ghost:IGhost, board: Phaser.Tilemaps.DynamicTilemapLayer) => {

    const backwardsDirection = getOppositeDirection(ghost.currentDirection)
    const directions = getOrderedDirections(dir => dir !== backwardsDirection)

    let bestDirection = Direction.None
    let bestDirectionDistance = -1

    const { x, y } = ghost.physicsBody.position

    const gx = Math.floor(x / TileSize) * TileSize
    const gy = Math.floor(y / TileSize) * TileSize

    for (const dir of directions) {
        const pos = positionInDirection(gx, gy, dir)

        if (board.getTileAtWorldXY(pos.x, pos.y)) {
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

export default determineGhostDirection

export {
    determineGhostDirection
}