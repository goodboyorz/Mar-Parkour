/* ========== 入口：事件绑定 & 启动 ========== */

import gameState from './state.js';
import jumpInput from './input.js';
import { canvas } from './canvas.js';
import { gameLoop, handleAction } from './game.js';

// 键盘事件
document.addEventListener("keydown", (e) => {
  // P / ESC：暂停 & 继续
  if (e.code === "KeyP" || e.code === "Escape") {
    if (gameState.status === "running" || gameState.status === "jumping") {
      gameState.paused = !gameState.paused;
    }
    return;
  }
  if (e.code === "Space") {
    e.preventDefault();
    // 若处于暂停，空格也可以恢复
    if (gameState.paused) {
      gameState.paused = false;
      return;
    }
    if (!e.repeat) {
      jumpInput.pressed = true;
      jumpInput.pressTime = Date.now();
      jumpInput.longJumpApplied = false;
      handleAction();
    }
  }
});

document.addEventListener("keyup", (e) => {
  if (e.code === "Space") {
    jumpInput.pressed = false;
  }
});

// 鼠标/触摸事件
canvas.addEventListener("click", () => {
  if (gameState.status === "running" || gameState.status === "jumping") {
    if (gameState.paused) { gameState.paused = false; return; }
  }
  if (!gameState.paused) handleAction();
});

// 启动游戏
gameLoop();
