/* ========== 背景渲染系统（天空、云朵、山丘、小草、地面） ========== */

import { CANVAS_W, CANVAS_H, VISUAL_MODE, GROUND_Y, BG_COLOR } from './config.js';
import { ctx } from './canvas.js';
import gameState, { getEffectiveSpeed } from './state.js';

/* ---------- 云朵系统（远景视差 0.2x） ---------- */
const clouds = [
  { x: 100, y: 40, w: 80 },
  { x: 350, y: 25, w: 100 },
  { x: 620, y: 55, w: 70 },
];

export function updateClouds() {
  if (!VISUAL_MODE) return;
  const speed = (gameState.status === "running" || gameState.status === "jumping")
    ? getEffectiveSpeed() * 0.2
    : 0.3;
  for (const c of clouds) {
    c.x -= speed;
    if (c.x + c.w < -20) {
      c.x = CANVAS_W + 20 + Math.random() * 60;
      c.y = 20 + Math.random() * 45;
      c.w = 60 + Math.random() * 60;
    }
  }
}

export function drawClouds() {
  if (!VISUAL_MODE) return;
  ctx.save();
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  for (const c of clouds) {
    const r = c.w * 0.18;
    ctx.beginPath();
    ctx.arc(c.x, c.y, r * 1.1, 0, Math.PI * 2);
    ctx.arc(c.x + r * 0.9, c.y - r * 0.4, r * 0.9, 0, Math.PI * 2);
    ctx.arc(c.x + r * 1.6, c.y, r, 0, Math.PI * 2);
    ctx.arc(c.x - r * 0.5, c.y + r * 0.15, r * 0.7, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/* ---------- 山丘系统（中景视差 0.5x） ---------- */
let hillOffset = 0;
const HILL_SEGMENTS = [
  { cx: 80,  r: 130, h: 45 },
  { cx: 250, r: 100, h: 35 },
  { cx: 420, r: 150, h: 55 },
  { cx: 580, r: 110, h: 40 },
  { cx: 720, r: 130, h: 50 },
];
const HILL_TILE = 800;

export function updateHills() {
  if (!VISUAL_MODE) return;
  const speed = (gameState.status === "running" || gameState.status === "jumping")
    ? getEffectiveSpeed() * 0.5
    : 0;
  hillOffset = (hillOffset + speed) % HILL_TILE;
}

export function drawHills() {
  if (!VISUAL_MODE) return;
  const groundY = GROUND_Y;
  ctx.save();
  ctx.fillStyle = "#a8c99b";
  for (let rep = -1; rep <= 2; rep++) {
    for (const seg of HILL_SEGMENTS) {
      const cx = seg.cx + rep * HILL_TILE - hillOffset;
      if (cx + seg.r < -10 || cx - seg.r > CANVAS_W + 10) continue;
      ctx.beginPath();
      ctx.moveTo(cx - seg.r, groundY);
      ctx.quadraticCurveTo(cx, groundY - seg.h, cx + seg.r, groundY);
      ctx.closePath();
      ctx.fill();
    }
  }
  ctx.restore();
}

/* ---------- 小草系统 ---------- */
let grassOffset = 0;

export function updateGrass() {
  if (!VISUAL_MODE) return;
  const speed = (gameState.status === "running" || gameState.status === "jumping")
    ? getEffectiveSpeed()
    : 0;
  grassOffset += speed;
}

export function drawGrass() {
  if (!VISUAL_MODE) return;
  const groundY = GROUND_Y;
  ctx.save();
  ctx.strokeStyle = "#5a8a3c";
  ctx.lineWidth = 1.5;
  ctx.lineCap = "round";
  const spacing = 28;
  const offset = grassOffset % spacing;
  for (let x = -offset; x <= CANVAS_W + spacing; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, groundY - 1);
    ctx.lineTo(x - 3, groundY - 9);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 8, groundY - 1);
    ctx.lineTo(x + 10, groundY - 7);
    ctx.stroke();
  }
  ctx.restore();
}

/* ---------- 天空与地面 ---------- */
export function clearScreen() {
  if (gameState.darkBgActive) {
    ctx.fillStyle = "#3a3028";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    return;
  }
  if (gameState.goldBgFrames > 0) {
    const t = gameState.goldBgFrames / 90;
    const topR = Math.round(135 + (255 - 135) * t);
    const topG = Math.round(206 + (215 - 206) * t);
    const topB = Math.round(235 + (50 - 235) * t);
    const botR = Math.round(245 + (255 - 245) * t);
    const botG = Math.round(240 + (215 - 240) * t);
    const botB = Math.round(232 + (0 - 232) * t);
    const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
    grad.addColorStop(0, `rgb(${topR},${topG},${topB})`);
    grad.addColorStop(1, `rgb(${botR},${botG},${botB})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    return;
  }
  if (VISUAL_MODE) {
    const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
    grad.addColorStop(0, "#87CEEB");
    grad.addColorStop(1, "#f5f0e8");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  } else {
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  }
}

export function drawGround() {
  const groundY = GROUND_Y;
  ctx.fillStyle = VISUAL_MODE ? "#6b5230" : "#d4bf8a";
  ctx.fillRect(0, groundY, CANVAS_W, CANVAS_H - groundY);
  ctx.strokeStyle = VISUAL_MODE ? "#8B6914" : "#c2a86e";
  ctx.lineWidth = VISUAL_MODE ? 3 : 2;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(CANVAS_W, groundY);
  ctx.stroke();
  ctx.fillStyle = "#d4bf8a";
  for (let i = 0; i < CANVAS_W; i += 30) {
    ctx.fillRect(i, groundY + 6, 12, 2);
  }
}

/* ---------- 重置 ---------- */
export function resetVisualStates() {
  hillOffset = 0;
  grassOffset = 0;
  clouds[0].x = 100; clouds[0].y = 40; clouds[0].w = 80;
  clouds[1].x = 350; clouds[1].y = 25; clouds[1].w = 100;
  clouds[2].x = 620; clouds[2].y = 55; clouds[2].w = 70;
}
