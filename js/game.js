/* ========== 游戏逻辑（更新、重置、动作处理） ========== */

import gameState, { switchStatus } from './state.js';
import jumpInput from './input.js';
import horse from './horse.js';
import { updateClouds, updateHills, updateGrass, resetVisualStates } from './background.js';
import { updateRunningDust, updateAfterimages, updateDustParticles, resetParticles } from './particles.js';
import { updateObstacles, checkDifficulty, resetObstacles } from './obstacles.js';
import { checkCollisions } from './collision.js';
import { tryTriggerIdiomEgg, updateIdiomEffects, resetIdiomStates } from './idiom.js';
import { render } from './renderer.js';
import { hintEl } from './canvas.js';

function update() {
  gameState.frame++;
  horse.update();
  updateDustParticles();
  updateClouds();
  updateHills();
  updateGrass();
  updateRunningDust(horse);
  updateAfterimages(horse);

  if (gameState.status === "running" || gameState.status === "jumping") {
    gameState.score = Math.round((gameState.score + 0.1) * 10) / 10;
    updateObstacles();
    checkDifficulty();
    checkCollisions();
    tryTriggerIdiomEgg(Math.floor(gameState.score));
    updateIdiomEffects();
  }
}

export function gameLoop() {
  if (!gameState.paused) {
    if (gameState.status === "running" || gameState.status === "jumping") {
      update();
    } else if (gameState.status === "idle") {
      gameState.frame++;
      horse.update();
      updateClouds();
      updateHills();
    } else if (gameState.status === "dead") {
      gameState.frame++;
      horse.update();
      updateClouds();
      updateDustParticles();
      updateRunningDust(horse);
      updateAfterimages(horse);
    }
  }
  render();
  requestAnimationFrame(gameLoop);
}

export function handleAction() {
  const st = gameState.status;
  if (st === "idle") {
    switchStatus("running");
    gameState.score = 0;
    gameState.speed = 4;
    gameState.paused = false;
    resetObstacles();
    resetIdiomStates();
    resetVisualStates();
    resetParticles();
    hintEl.textContent = "";
  } else if (st === "running") {
    horse.jump();
  } else if (st === "dead" && gameState.shakeTime <= 0) {
    horse.reset();
    gameState.score = 0;
    gameState.speed = 4;
    gameState.frame = 0;
    gameState.paused = false;
    resetObstacles();
    resetIdiomStates();
    resetVisualStates();
    resetParticles();
    switchStatus("running");
  }
}
