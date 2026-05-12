/* ========== 全局游戏状态 ========== */

import { STORAGE_KEY } from './config.js';

const gameState = {
  status: "idle",       // idle | running | jumping | dead
  paused: false,
  score: 0,
  speed: 0,
  frame: 0,
  shakeTime: 0,
  deadTime: 0,
  bestScore: parseInt(localStorage.getItem(STORAGE_KEY)) || 0,

  // 障碍物系统
  gameSpeed: 5,
  spawnInterval: 1500,
  lastSpawnTime: 0,
  speedUpNotice: 0,
  lastSpeedUpScore: 0,

  // 成语彩蛋系统
  triggeredIdioms: [],
  invincibleFrames: 0,
  goldBgFrames: 0,
  sparkleFrames: 0,
  slowObstacleFrames: 0,
  darkBgActive: false,
  speedBonus: 0,
  unicornMode: false,
  eggAnim: {
    active: false,
    egg: null,
    startTime: 0,
    duration: 1200,
  },
};

export default gameState;

export function switchStatus(newStatus) {
  const prev = gameState.status;
  gameState.status = newStatus;
  console.log(`[状态切换] ${prev} → ${newStatus}`);
}

export function getEffectiveSpeed() {
  return gameState.gameSpeed + gameState.speedBonus;
}

export function getObstacleSpeed() {
  const base = getEffectiveSpeed();
  return gameState.slowObstacleFrames > 0 ? base * 0.5 : base;
}
