/* ========== 渲染编排 ========== */

import { RENDER_SCALE, RENDER_OFFSET_Y, SHAKE_OFFSET } from './config.js';
import { canvas, ctx } from './canvas.js';
import gameState from './state.js';
import horse from './horse.js';
import { clearScreen, drawClouds, drawHills, drawGround, drawGrass } from './background.js';
import { drawAfterimages, drawDustParticles, drawRunningDust } from './particles.js';
import { drawObstacles } from './obstacles.js';
import { drawDebugHitboxes } from './collision.js';
import { drawIdiomAnimation, drawSparkleEffect } from './idiom.js';
import { drawScore, drawPaused, drawDeadSettlement, drawSpeedUpNotice, drawSpeedInfo } from './ui.js';

export function render() {
  // 画面抖动
  if (gameState.status === "dead" && gameState.shakeTime > 0) {
    const dir = gameState.shakeTime % 2 === 0 ? 1 : -1;
    canvas.style.transform = `translateX(${dir * SHAKE_OFFSET}px)`;
  } else {
    canvas.style.transform = "";
  }

  // 4K 渲染：扩展天空
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const skyGrad = ctx.createLinearGradient(0, 0, 0, RENDER_OFFSET_Y);
  skyGrad.addColorStop(0, "#6BB3D9");
  skyGrad.addColorStop(1, "#87CEEB");
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, canvas.width, RENDER_OFFSET_Y);

  // 应用 4K 缩放
  ctx.setTransform(RENDER_SCALE, 0, 0, RENDER_SCALE, 0, RENDER_OFFSET_Y);

  clearScreen();
  drawClouds();
  drawHills();
  drawGround();
  drawGrass();
  drawObstacles();
  drawAfterimages(horse);
  drawDustParticles();
  drawRunningDust();
  horse.draw();
  drawSparkleEffect(horse);
  drawDebugHitboxes();
  drawIdiomAnimation();
  drawDeadSettlement();
  drawScore();
  drawPaused();
  drawSpeedInfo();
  drawSpeedUpNotice();
}
