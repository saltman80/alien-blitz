import * as InputManager from './keyStateTracker.js'
import * as DifficultyManager from './gameOverlayManager.js'
import * as PlayerManager from './playerBoundedShooter.js'
import * as AlienManager from './alienGridController.js'
import * as ProjectileManager from './bulletLifecycleManager.js'
import * as CollisionManager from './boundingBoxOverlapDetector.js'
import * as ScoreManager from './gameOverlayManager.js'
import * as Renderer from './canvasRenderManager.js'

let lastTime = 0
let running = false
let rafId = null

function gameLoop(timestamp) {
  const dt = Math.min((timestamp - lastTime) / 1000, 0.1)
  lastTime = timestamp

  try {
    InputManager.update()
    DifficultyManager.update(dt)
    PlayerManager.update(dt)
    AlienManager.update(dt)
    ProjectileManager.update(dt)
    CollisionManager.detect()
    ScoreManager.update(dt)
    Renderer.render()
  } catch (error) {
    console.error('Error in game loop:', error)
    running = false
    return
  }

  if (running) {
    rafId = requestAnimationFrame(gameLoop)
  }
}

export function startGameLoop() {
  if (running) return
  running = true
  lastTime = performance.now()
  rafId = requestAnimationFrame(gameLoop)
}

export function stopGameLoop() {
  running = false
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
}