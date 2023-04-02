
import Phaser from 'phaser'
import Hero from '../game/Hero'

import { createHeroAnims } from '../game/HeroAnims'
import { createGhostAnims } from '../game/GhostAnims'
import '../game/Hero'
import '../game/Ghost'

// import ScatterAI from '../game/ghost-ai/ScatterAI'
// import ChaseHeroAI from '../game/ghost-ai/ChaseHeroAI'
// import InterceptHeroAI from '../game/ghost-ai/InterceptHeroAI'
// import FlankHeroAI from '../game/ghost-ai/FlankHeroAI'
// import PlayfullyChaseHeroAI from '../game/ghost-ai/PlayfullyChaseHeroAI'
//import HeroAI from '../game/HeroAI'
//import Ghost from '../game/Ghost'
import NewGhost from '../game/ghost-ai/NewGhost'
import ScatterAI from '../game/new-ghost-ai/ScatterAi'
import ChaseHeroAI from '../game/new-ghost-ai/ChaseHeroAI'
import InterceptHeroAI from '../game/new-ghost-ai/InterceptHeroAI'
import FlankHeroAI from '../game/new-ghost-ai/FlankHeroAI'
import PlayfullyChaseHeroAI from '../game/new-ghost-ai/PlayfullyChaseHeroAI'
import NewFlankHeroAI from '../game/new-ghost-ai/NewFlankHeroAI'

export default class Game extends Phaser.Scene
{
	constructor() {
		super()

		this.score = 0
		this.gameOver = false
	}
	
	private hero?: Hero
	private boardLayer?: Phaser.Tilemaps.DynamicTilemapLayer

	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

	init()
	{
		this.cursors = this.input.keyboard.createCursorKeys()
	}

	preload()
    {
		this.load.tilemapTiledJSON('tilemap', 'levels/level-1.json')
    }

    create()
    {
		const map = this.make.tilemap({ key: 'tilemap' })
		const tileset = map.addTilesetImage('basic_tiles', 'tiles')
		
		this.boardLayer = map.createDynamicLayer('Board', tileset)
			.forEachTile((tile: Phaser.Tilemaps.Tile) => {
				tile.tint = 0x3ba3ff
			})
			.setCollisionByProperty({ collides: true })

		const dotsLayer = map.createDynamicLayer('Dots', tileset)
		const dots = dotsLayer.createFromTiles(33, -1, { key: 'tiles', frame: 'white-dot-small.png', origin: 0 })
		dots.forEach(dot => {
			this.physics.add.existing(dot)
			const body = dot.body as Phaser.Physics.Arcade.Body
			body.setCircle(4, 12, 12)
		})

		const powerDots = dotsLayer.createFromTiles(34, -1, { key: 'tiles', frame: 'white-dot.png', origin: 0 })
		powerDots.forEach(dot => {
			this.physics.add.existing(dot)
			const body = dot.body as Phaser.Physics.Arcade.Body
			body.setCircle(8, 8, 8)

			this.tweens.add({
				targets: dot,
				alpha: 0,
				duration: 1000,
				yoyo: true,
				repeat: -1
			})
		})
		// New Ghost setup under new-ghost-ai folder
		createHeroAnims(this.anims)
		createGhostAnims(this.anims)

		this.createFromObjectsLayer(map.getObjectLayer('BoardObjects'))

		const blinky = new NewGhost(this, 288, 256, this.boardLayer)
			.makeRed()
			.enableTargetMarker(true)
		blinky.setAI(new ChaseHeroAI(blinky, this.hero!, this.boardLayer))
		this.add.existing(blinky)

		const pinky = new NewGhost(this, 224, 256, this.boardLayer)
			.makePink()
			.enableTargetMarker(true)
		pinky.setAI(new InterceptHeroAI(pinky, this.hero!, this.boardLayer))
		this.add.existing(pinky)

		const sneaky = new NewGhost(this, 256, 256, this.boardLayer)
			.makeGreen()
			.enableTargetMarker(true)
		sneaky.setAI(new NewFlankHeroAI(sneaky, this.hero!, pinky, this.boardLayer))
		this.add.existing(sneaky)

		const clyde = new NewGhost(this, 320, 256, this.boardLayer)
			.makeOrange()
			.enableTargetMarker(true)
		clyde.setAI(new PlayfullyChaseHeroAI(clyde, new ChaseHeroAI(clyde, this.hero!, this.boardLayer), new ScatterAI(32, this.boardLayer!.height - 32, clyde, this.boardLayer), this.hero!))
		this.add.existing(clyde)

		const ghost = this.add.group()

		ghost.add(pinky)
		ghost.add(blinky)
		ghost.add(clyde)
		ghost.add(sneaky)

		//ghost.setAI(new ScatterAI(0, 0, ghost, this.boardLayer))
		//ghost.setAI(new ChaseHeroAI(ghost, this.hero!, this.boardLayer))
		//ghost.setAI(new InterceptHeroAI(ghost, this.hero!, this.boardLayer))

		// this.createGhosts()

		// Score and GameOver screen
		this.scoreText = this.add.text(16,16, 'score: 0',{fontSize: '32px', fill: 'white'});
		this.gameOverText = this.add.text(220, 320, 'Game Over', { fontSize: '64px', fill: 'white' })
		this.gameOverText.setOrigin(.3)
		this.gameOverText.visible = false
		
		// Enemy collision here?
		if (this.hero) 
		{
			console.log("updating")
			this.physics.add.overlap(this.hero, dots, this.handlePlayerEatDot, this.processPlayerEatDot, this)
			console.log("dot")
			this.physics.add.overlap(this.hero, powerDots, this.handlePlayerEatPowerDot, this.processPlayerEatDot, this)
			console.log("powerDot")
			this.physics.add.overlap(this.hero, ghost, this.handleGhostEatPlayer, null, this);
			console.log("colliding")

			
		}
		
	}
	// States for pellets collision with pac-man
	private handlePlayerEatPowerDot(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject)
	{
		if (!this.hero)
		{
			return
		}
		this.hero.eatPowerDot(obj2 as Phaser.Physics.Arcade.Sprite)
	}

	private processPlayerEatDot(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject)
	{
		console.log("processed")
		if (!this.hero)
		{
			return false
		}
		return this.hero.canEatDot(obj2 as Phaser.Physics.Arcade.Sprite)
	}

	private handlePlayerEatDot(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject)
	{
		console.log("dot eaten")
		obj2.destroy(true)
	}

	private handleGhostEatPlayer(ghost, player)
	{
		hitghost = this.ghost
		if (this.hero.isPowered)
		{
			//Delete ghost and increase score
			console.log("Pacman eats ghost")
			
			
		} else {
			// Delete pac-man and end game
			console.log("ghost eats pacman")
			 
			hitghost(player, ghost); {
				this.physics.pause();
				player.setTint(0xff0000);
				player.anims.play('turn');
				this.gameOver = true;
			}
		}
		console.log("ghost hit")
	}
	
	update(t: number, dt: number)
	{
		
		
		if (this.hero && this.boardLayer)
		{
			this.hero.handleMovement(dt, this.cursors, this.boardLayer)
		}
		
	}
	// Old ghost setup
	private createGhosts() {
	// 	const blinky = this.add.ghost(256, 256)
	// 		.makeRed()
	// 		.enableTargetMarker(true)
	// 	blinky.setAI(new ChaseHeroAI(this.hero!, blinky, this.boardLayer!))

	// 	const pinky = this.add.ghost(224, 256)
	// 		.makePink()
	// 		.enableTargetMarker(true)
	// 	pinky.setAI(new InterceptHeroAI(this.hero!, pinky, this.boardLayer!, true))

	// 	const inky = this.add.ghost(288, 256)
	// 		.makeTeal()
	// 		.enableTargetMarker(true)
	// 	inky.setAI(new FlankHeroAI(this.hero!, inky, blinky, this.boardLayer!, true))

	// 	const clyde = this.add.ghost(320, 256)
	// 		.makeOrange()
	// 		.enableTargetMarker(true)

	// 	clyde.setAI(new PlayfullyChaseHeroAI(
	// 		this.hero!,
	// 		clyde,
	// 		this.boardLayer!,
	// 		new ScatterAI(16, this.boardLayer!.height - 16, clyde, this.boardLayer!)
	// 	))
	}


	private createFromObjectsLayer(layer: Phaser.Tilemaps.ObjectLayer)
	{
		for (let i = 0; i < layer.objects.length; ++i)
		{
			const obj = layer.objects[i]
			switch (obj.name)
			{
				case 'spawn':
				{
					const x = Math.round(obj.x! / 32) * 32
					const y = Math.round(obj.y! / 32) * 32
					this.hero = this.add.hero(x + 16, y + 16, 'game-atlas')
					// this.hero.setAI(new HeroAI())
					this.setupHero(this.boardLayer!)
					break
				}
			}
		}
	}

	private setupHero(board: Phaser.Tilemaps.DynamicTilemapLayer)
	{
		if (!this.hero)
		{
			return
		}

		this.physics.add.collider(this.hero, board)
		this.cameras.main.startFollow(this.hero, true)
		this.cameras.main.useBounds = true
		this.cameras.main.setBounds(0, 0, board.width, board.height)

		this.physics.world.setBounds(0, 0, board.width, board.height)
	}
}