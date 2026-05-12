/* ========== 常量配置 ========== */

// 画布尺寸
export const CANVAS_W = 800;
export const CANVAS_H = 300;
export const RENDER_SCALE = 2.4;
export const RENDER_OFFSET_Y = 1080 - CANVAS_H * RENDER_SCALE;

// 视觉
export const BG_COLOR = "#f5f0e8";
export const DEBUG_MODE = false;
export const VISUAL_MODE = true;

// 碰撞
export const HITBOX_SHRINK = 10;

// 死亡效果
export const SHAKE_FRAMES = 10;
export const SHAKE_OFFSET = 4;
export const SETTLE_DELAY = 0.8;

// 存储
export const STORAGE_KEY = "horseRun_bestScore";

// 跳跃物理
export const GRAVITY = 0.6;
export const JUMP_FORCE = -13;
export const LONG_JUMP_BONUS = -3;
export const GROUND_Y = CANVAS_H - 40;
export const LONG_JUMP_THRESHOLD = 150;

// 障碍物类型
export const OBSTACLE_TYPES = {
  low:   { w: 22, h: 42,  color: "#8B4513", topColor: "#6B3410", label: "低栏" },
  high:  { w: 22, h: 72,  color: "#4169E1", topColor: "#2a4faa", label: "高栏" },
  wide:  { w: 48, h: 32,  color: "#2e8b2e", topColor: "#1a6b1a", label: "矮墙" },
  spike: { w: 18, h: 55,  color: "#cc4400", topColor: "#aa2200", label: "尖柱" },
};
