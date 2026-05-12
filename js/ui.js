/* ========== UI 绘制系统（分数、暂停、结算、速度信息） ========== */

import { CANVAS_W, CANVAS_H, SETTLE_DELAY } from './config.js';
import { ctx } from './canvas.js';
import gameState, { getEffectiveSpeed } from './state.js';

export function drawScore() {
  if (gameState.status !== "running" && gameState.status !== "jumping") return;
  ctx.save();

  const scoreText = `${Math.floor(gameState.score)} 米`;
  ctx.font = "bold 20px 'Microsoft YaHei', sans-serif";
  const sw = ctx.measureText(scoreText).width;
  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.beginPath();
  ctx.roundRect(CANVAS_W - sw - 36, 8, sw + 26, 32, 8);
  ctx.fill();
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.fillStyle = "#fff";
  ctx.fillText(scoreText, CANVAS_W - 15, 15);

  if (gameState.bestScore > 0) {
    const bestText = `最远：${gameState.bestScore} 米`;
    ctx.font = "13px 'Microsoft YaHei', sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.fillText(bestText, CANVAS_W - 15, 44);
  }

  ctx.font = "12px 'Microsoft YaHei', sans-serif";
  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.fillText("P 键暂停", 12, 14);

  ctx.restore();
}

export function drawPaused() {
  if (!gameState.paused) return;
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.52)";
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.font = "bold 42px 'Microsoft YaHei', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff";
  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 10;
  ctx.fillText("⏸ 游戏暂停", CANVAS_W / 2, CANVAS_H / 2 - 22);
  ctx.shadowBlur = 0;
  ctx.font = "20px 'Microsoft YaHei', sans-serif";
  ctx.fillStyle = "#ddd";
  ctx.fillText("按 P 键 / ESC 继续", CANVAS_W / 2, CANVAS_H / 2 + 22);
  ctx.font = "15px 'Microsoft YaHei', sans-serif";
  ctx.fillStyle = "#f0d060";
  ctx.fillText(`当前：${Math.floor(gameState.score)} 米`, CANVAS_W / 2, CANVAS_H / 2 + 55);
  ctx.restore();
}

export function drawDeadSettlement() {
  if (gameState.status !== "dead") return;
  if (gameState.shakeTime > 0) return;
  if (Date.now() - gameState.deadTime < SETTLE_DELAY * 1000) return;

  const cx = CANVAS_W / 2;
  const cy = CANVAS_H / 2;

  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  ctx.fillStyle = "rgba(20,15,10,0.75)";
  ctx.beginPath();
  ctx.roundRect(cx - 200, cy - 80, 400, gameState.triggeredIdioms.length > 0 ? 185 : 155, 14);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,200,60,0.35)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.font = "bold 32px 'Microsoft YaHei', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ff6b6b";
  ctx.shadowColor = "rgba(255,60,60,0.5)";
  ctx.shadowBlur = 12;
  ctx.fillText("💀 马失前蹄！", cx, cy - 48);
  ctx.shadowBlur = 0;

  ctx.strokeStyle = "rgba(255,255,255,0.15)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - 160, cy - 22);
  ctx.lineTo(cx + 160, cy - 22);
  ctx.stroke();

  ctx.font = "bold 24px 'Microsoft YaHei', sans-serif";
  ctx.fillStyle = "#f0d060";
  ctx.fillText(`🏁 本次跑了 ${Math.floor(gameState.score)} 米`, cx, cy + 6);

  const isNewBest = Math.floor(gameState.score) >= gameState.bestScore && gameState.score > 0;
  ctx.font = "16px 'Microsoft YaHei', sans-serif";
  if (isNewBest) {
    ctx.fillStyle = "#FFD700";
    ctx.fillText(`🎉 新纪录！历史最远 ${gameState.bestScore} 米`, cx, cy + 34);
  } else {
    ctx.fillStyle = "#aaa";
    ctx.fillText(`历史最远：${gameState.bestScore} 米`, cx, cy + 34);
  }

  if (gameState.triggeredIdioms.length > 0) {
    ctx.fillStyle = "#FFD700";
    ctx.font = "14px 'Microsoft YaHei', sans-serif";
    ctx.fillText(`本局成语：${gameState.triggeredIdioms.join(" · ")}`, cx, cy + 62);
  }

  const blink = Math.floor(Date.now() / 600) % 2 === 0;
  if (blink) {
    ctx.fillStyle = "#ccc";
    ctx.font = "15px 'Microsoft YaHei', sans-serif";
    const reY = gameState.triggeredIdioms.length > 0 ? cy + 90 : cy + 70;
    ctx.fillText("▶ 按空格 / 点击 重新出发", cx, reY);
  }

  ctx.restore();
}

export function drawSpeedUpNotice() {
  if (gameState.speedUpNotice <= 0) return;
  gameState.speedUpNotice--;
  const alpha = Math.min(gameState.speedUpNotice / 30, 1);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.font = "bold 30px 'Microsoft YaHei', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#e74c3c";
  ctx.fillText("⚡ 提速！", CANVAS_W / 2, CANVAS_H / 2 - 50);
  ctx.restore();
}

export function drawSpeedInfo() {
  if (gameState.status !== "running" && gameState.status !== "jumping") return;
  ctx.save();
  ctx.font = "12px monospace";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillStyle = "#999";
  ctx.fillText(`速度: ${getEffectiveSpeed().toFixed(1)}`, 20, 40);
  ctx.restore();
}
