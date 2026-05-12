/* ========== 障碍物系统 ========== */

import { CANVAS_W, GROUND_Y, OBSTACLE_TYPES } from './config.js';
import { ctx } from './canvas.js';
import gameState, { getObstacleSpeed } from './state.js';

const obstacles = [];

export function getObstacles() {
  return obstacles;
}

export function spawnObstacle() {
  const rand = Math.random();
  let type;
  if (rand < 0.35) type = "low";
  else if (rand < 0.58) type = "high";
  else if (rand < 0.73) type = "wide";
  else if (rand < 0.86) type = "spike";
  else type = "double";

  if (type === "double") {
    const def = OBSTACLE_TYPES.low;
    const x1 = CANVAS_W + 20;
    obstacles.push({ x: x1, w: def.w, h: def.h, color: def.color, topColor: def.topColor, type: "low" });
    obstacles.push({ x: x1 + def.w + 70, w: def.w, h: def.h, color: def.color, topColor: def.topColor, type: "low" });
  } else {
    const def = OBSTACLE_TYPES[type];
    obstacles.push({ x: CANVAS_W + 20, w: def.w, h: def.h, color: def.color, topColor: def.topColor, type });
  }
}

export function updateObstacles() {
  const obSpeed = getObstacleSpeed();
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].x -= obSpeed;
    if (obstacles[i].x + obstacles[i].w < -10) {
      obstacles.splice(i, 1);
    }
  }

  const now = Date.now();
  if (now - gameState.lastSpawnTime >= gameState.spawnInterval) {
    spawnObstacle();
    gameState.lastSpawnTime = now;
    gameState.spawnInterval = 1200 + Math.random() * 800;
  }
}

export function drawObstacles() {
  const groundY = GROUND_Y;
  for (const ob of obstacles) {
    const ox = ob.x, oy = groundY - ob.h, ow = ob.w, oh = ob.h;

    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 2;

    if (ob.type === "spike") {
      const grad = ctx.createLinearGradient(ox, oy, ox + ow, oy);
      grad.addColorStop(0, "#ff6622");
      grad.addColorStop(1, "#aa2200");
      ctx.fillStyle = grad;
      ctx.fillRect(ox, oy + 12, ow, oh - 12);
      ctx.beginPath();
      ctx.moveTo(ox, oy + 12);
      ctx.lineTo(ox + ow / 2, oy);
      ctx.lineTo(ox + ow, oy + 12);
      ctx.closePath();
      ctx.fill();
    } else if (ob.type === "wide") {
      const grad = ctx.createLinearGradient(ox, oy, ox, groundY);
      grad.addColorStop(0, "#4aab4a");
      grad.addColorStop(1, "#1a6b1a");
      ctx.fillStyle = grad;
      ctx.fillRect(ox, oy, ow, oh);
      ctx.strokeStyle = "rgba(0,0,0,0.2)";
      ctx.lineWidth = 1;
      for (let brickY = oy + 10; brickY < groundY; brickY += 10) {
        ctx.beginPath(); ctx.moveTo(ox, brickY); ctx.lineTo(ox + ow, brickY); ctx.stroke();
      }
      ctx.beginPath(); ctx.moveTo(ox + ow / 2, oy); ctx.lineTo(ox + ow / 2, groundY); ctx.stroke();
      ctx.fillStyle = ob.topColor;
      ctx.fillRect(ox - 3, oy - 4, ow + 6, 6);
    } else {
      const isHigh = ob.type === "high";
      const grad = ctx.createLinearGradient(ox, oy, ox + ow, oy);
      grad.addColorStop(0, isHigh ? "#6080ee" : "#b06030");
      grad.addColorStop(1, ob.color);
      ctx.fillStyle = grad;
      ctx.fillRect(ox, oy, ow, oh);
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(ox + ow * 0.3, oy); ctx.lineTo(ox + ow * 0.3, groundY); ctx.stroke();
      ctx.fillStyle = ob.topColor;
      ctx.fillRect(ox - 5, oy - 4, ow + 10, 6);
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.fillRect(ox - 5, oy - 4, ow + 10, 2);
    }
    ctx.restore();
  }
}

export function checkDifficulty() {
  const score = Math.floor(gameState.score);
  const threshold = Math.floor(score / 200);
  const prevThreshold = Math.floor(gameState.lastSpeedUpScore / 200);
  if (threshold > prevThreshold && score > 0) {
    gameState.gameSpeed = Math.min(gameState.gameSpeed + 0.5, 14);
    gameState.spawnInterval = Math.max(gameState.spawnInterval - 80, 700);
    gameState.speedUpNotice = 90;
    gameState.lastSpeedUpScore = score;
  }
}

export function resetObstacles() {
  obstacles.length = 0;
  gameState.gameSpeed = 5;
  gameState.spawnInterval = 1500;
  gameState.lastSpawnTime = Date.now();
  gameState.speedUpNotice = 0;
  gameState.lastSpeedUpScore = 0;
}
