/* ========== 粒子特效系统（尘土、残影、跑步尘点） ========== */

import { CANVAS_W, VISUAL_MODE, GROUND_Y } from './config.js';
import { ctx } from './canvas.js';
import gameState, { getEffectiveSpeed } from './state.js';

/* ---------- 跑步尘点系统 ---------- */
let runningDustFrame = 0;
const runningDustDots = [];

export function updateRunningDust(horse) {
  if (!VISUAL_MODE) { runningDustDots.length = 0; return; }
  if (gameState.status === "running") {
    runningDustFrame++;
    if (runningDustFrame % 4 === 0) {
      runningDustDots.push({
        x: horse.x - 8 + Math.random() * 6,
        y: horse.y + 2,
        life: 1.0,
      });
    }
  } else {
    runningDustFrame = 0;
  }
  for (let i = runningDustDots.length - 1; i >= 0; i--) {
    runningDustDots[i].life -= 0.06;
    runningDustDots[i].x -= getEffectiveSpeed() * 0.3;
    if (runningDustDots[i].life <= 0) runningDustDots.splice(i, 1);
  }
}

export function drawRunningDust() {
  if (!VISUAL_MODE) return;
  ctx.save();
  for (const d of runningDustDots) {
    ctx.globalAlpha = d.life * 0.45;
    ctx.fillStyle = "#b8a070";
    ctx.beginPath();
    ctx.arc(d.x, d.y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/* ---------- 跳跃残影系统 ---------- */
const afterimages = [];

export function updateAfterimages(horse) {
  if (!VISUAL_MODE) { afterimages.length = 0; return; }
  if (gameState.status !== "jumping") { afterimages.length = 0; return; }
  if (gameState.frame % 4 === 0) {
    afterimages.push({ x: horse.x + horse.wobbleOffset, y: horse.y, alpha: 0.6 });
    while (afterimages.length > 3) afterimages.shift();
  }
  for (const a of afterimages) { a.alpha -= 0.03; }
  for (let i = afterimages.length - 1; i >= 0; i--) {
    if (afterimages[i].alpha <= 0) afterimages.splice(i, 1);
  }
}

export function drawAfterimages(horse) {
  if (!VISUAL_MODE) return;
  for (const a of afterimages) {
    ctx.save();
    ctx.font = `${horse.fontSize}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.globalAlpha = Math.max(0, a.alpha) * 0.5;
    ctx.fillStyle = gameState.unicornMode ? "#d8b0ff" : "#c8a870";
    ctx.translate(a.x, 0);
    ctx.scale(-1, 1);
    ctx.fillText(horse.getEmoji(), 0, a.y);
    ctx.restore();
  }
}

/* ---------- 尘土粒子系统 ---------- */
const dustParticles = [];

export function spawnDust(x, y) {
  for (let i = 0; i < 5; i++) {
    dustParticles.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 4,
      vy: -Math.random() * 2 - 0.5,
      life: 1.0,
      radius: Math.random() * 3 + 2,
    });
  }
}

export function updateDustParticles() {
  for (let i = dustParticles.length - 1; i >= 0; i--) {
    const p = dustParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.05;
    p.life -= 0.04;
    if (p.life <= 0) dustParticles.splice(i, 1);
  }
}

export function drawDustParticles() {
  for (const p of dustParticles) {
    ctx.save();
    ctx.globalAlpha = p.life * 0.6;
    ctx.fillStyle = "#b8a070";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

/* ---------- 重置 ---------- */
export function resetParticles() {
  runningDustFrame = 0;
  runningDustDots.length = 0;
  afterimages.length = 0;
  dustParticles.length = 0;
}
