/* ========== 碰撞检测系统 ========== */

import { HITBOX_SHRINK, DEBUG_MODE, GROUND_Y, SHAKE_FRAMES, STORAGE_KEY } from './config.js';
import { ctx } from './canvas.js';
import gameState, { switchStatus } from './state.js';
import horse from './horse.js';
import { getObstacles } from './obstacles.js';

function getHorseHitbox() {
  const halfSize = horse.fontSize / 2;
  return {
    x: horse.x - halfSize + HITBOX_SHRINK,
    y: horse.y - horse.fontSize + HITBOX_SHRINK,
    w: horse.fontSize - HITBOX_SHRINK * 2,
    h: horse.fontSize - HITBOX_SHRINK * 2,
  };
}

function getObstacleHitbox(ob) {
  return {
    x: ob.x,
    y: GROUND_Y - ob.h,
    w: ob.w,
    h: ob.h,
  };
}

function aabbCollision(a, b) {
  return a.x < b.x + b.w &&
         a.x + a.w > b.x &&
         a.y < b.y + b.h &&
         a.y + a.h > b.y;
}

function triggerDeath() {
  switchStatus("dead");
  gameState.shakeTime = SHAKE_FRAMES;
  gameState.deadTime = Date.now();
  const finalScore = Math.floor(gameState.score);
  if (finalScore > gameState.bestScore) {
    gameState.bestScore = finalScore;
    localStorage.setItem(STORAGE_KEY, gameState.bestScore);
  }
}

export function checkCollisions() {
  if (gameState.invincibleFrames > 0) return;
  const horseBox = getHorseHitbox();
  for (const ob of getObstacles()) {
    const obBox = getObstacleHitbox(ob);
    if (aabbCollision(horseBox, obBox)) {
      triggerDeath();
      return;
    }
  }
}

export function drawDebugHitboxes() {
  if (!DEBUG_MODE) return;
  const horseBox = getHorseHitbox();
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.strokeRect(horseBox.x, horseBox.y, horseBox.w, horseBox.h);
  for (const ob of getObstacles()) {
    const obBox = getObstacleHitbox(ob);
    ctx.strokeRect(obBox.x, obBox.y, obBox.w, obBox.h);
  }
}
