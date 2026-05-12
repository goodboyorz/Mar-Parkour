/* ========== 成语彩蛋系统 ========== */

import { CANVAS_W, CANVAS_H } from './config.js';
import { ctx } from './canvas.js';
import gameState from './state.js';

const IDIOM_EGGS = [
  { score: 100,  text: "马到成功！", emoji: "🎊", name: "马到成功" },
  { score: 300,  text: "一马当先！", emoji: "⚡", name: "一马当先" },
  { score: 600,  text: "老马识途！", emoji: "🧭", name: "老马识途" },
  { score: 1000, text: "万马奔腾！", emoji: "🌊", name: "万马奔腾" },
  { score: 2000, text: "天马行空！", emoji: "✨", name: "天马行空" },
];

function applyIdiomEffect(egg) {
  switch (egg.name) {
    case "马到成功":
      gameState.goldBgFrames = 90;
      break;
    case "一马当先":
      gameState.sparkleFrames = 120;
      break;
    case "老马识途":
      gameState.slowObstacleFrames = 120;
      break;
    case "万马奔腾":
      gameState.darkBgActive = true;
      gameState.speedBonus += 2;
      break;
    case "天马行空":
      gameState.unicornMode = true;
      break;
  }
}

export function tryTriggerIdiomEgg(score) {
  for (const egg of IDIOM_EGGS) {
    if (score >= egg.score && !gameState.triggeredIdioms.includes(egg.name)) {
      gameState.triggeredIdioms.push(egg.name);
      gameState.eggAnim.active = true;
      gameState.eggAnim.egg = egg;
      gameState.eggAnim.startTime = Date.now();
      gameState.invincibleFrames = 30;
      applyIdiomEffect(egg);
      return;
    }
  }
}

export function updateIdiomEffects() {
  if (gameState.goldBgFrames > 0) gameState.goldBgFrames--;
  if (gameState.sparkleFrames > 0) gameState.sparkleFrames--;
  if (gameState.slowObstacleFrames > 0) gameState.slowObstacleFrames--;
  if (gameState.invincibleFrames > 0) gameState.invincibleFrames--;
}

export function drawIdiomAnimation() {
  if (!gameState.eggAnim.active) return;
  const elapsed = Date.now() - gameState.eggAnim.startTime;
  if (elapsed >= gameState.eggAnim.duration) {
    gameState.eggAnim.active = false;
    gameState.eggAnim.egg = null;
    return;
  }

  const progress = elapsed / gameState.eggAnim.duration;
  const egg = gameState.eggAnim.egg;

  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  const cx = CANVAS_W / 2;
  const cy = CANVAS_H / 2;

  let scale, alpha;
  if (progress < 0.3) {
    scale = 0.3 + (progress / 0.3) * 1.2;
    alpha = 1;
  } else {
    const sub = (progress - 0.3) / 0.7;
    scale = 1.5 - sub * 0.3;
    alpha = 1 - sub * 0.5;
  }

  ctx.globalAlpha = alpha;
  ctx.font = `bold ${Math.round(40 * scale)}px 'Microsoft YaHei', sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  ctx.fillStyle = "#FFD700";
  ctx.fillText(`${egg.emoji} ${egg.text}`, cx, cy);
  ctx.restore();
}

export function drawSparkleEffect(horse) {
  if (gameState.sparkleFrames <= 0) return;
  const cx = horse.x;
  const cy = horse.y - horse.fontSize / 2;
  ctx.save();
  const count = 6;
  for (let i = 0; i < count; i++) {
    const angle = (gameState.frame * 0.1 + i * Math.PI * 2 / count);
    const radius = 25 + Math.sin(gameState.frame * 0.2 + i) * 8;
    const px = cx + Math.cos(angle) * radius;
    const py = cy + Math.sin(angle) * radius * 0.6;
    const sparkAlpha = (gameState.sparkleFrames > 30) ? 1 : gameState.sparkleFrames / 30;
    ctx.globalAlpha = sparkAlpha * (0.6 + Math.sin(gameState.frame * 0.3 + i) * 0.4);
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

export function resetIdiomStates() {
  gameState.triggeredIdioms = [];
  gameState.invincibleFrames = 0;
  gameState.goldBgFrames = 0;
  gameState.sparkleFrames = 0;
  gameState.slowObstacleFrames = 0;
  gameState.darkBgActive = false;
  gameState.speedBonus = 0;
  gameState.unicornMode = false;
  gameState.eggAnim.active = false;
  gameState.eggAnim.egg = null;
}
