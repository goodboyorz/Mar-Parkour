/* ========== 马角色系统 ========== */

import {
  GRAVITY, JUMP_FORCE, LONG_JUMP_BONUS,
  GROUND_Y, LONG_JUMP_THRESHOLD, VISUAL_MODE
} from './config.js';
import { ctx } from './canvas.js';
import gameState, { switchStatus } from './state.js';
import jumpInput from './input.js';
import { spawnDust } from './particles.js';

const horse = {
  x: 120,
  baseY: GROUND_Y,
  y: GROUND_Y,
  vy: 0,
  isOnGround: true,
  fontSize: 48,
  runFrame: 0,
  breathOffset: 0,
  wobbleOffset: 0,

  getEmoji() {
    if (gameState.unicornMode && gameState.status !== "dead") return "🦄";
    switch (gameState.status) {
      case "jumping": return "🏇";
      case "dead":    return "💥";
      default:        return "🐎";
    }
  },

  update() {
    const st = gameState.status;
    if (st === "idle") {
      this.breathOffset = Math.sin(gameState.frame * 0.05) * 4;
      this.y = this.baseY + this.breathOffset;
    } else if (st === "running") {
      this.wobbleOffset = Math.sin(gameState.frame * 0.3) * 3;
      this.y = this.baseY;
    } else if (st === "jumping") {
      // 长按额外力度
      if (jumpInput.pressed && !jumpInput.longJumpApplied) {
        if (Date.now() - jumpInput.pressTime >= LONG_JUMP_THRESHOLD) {
          this.vy += LONG_JUMP_BONUS;
          jumpInput.longJumpApplied = true;
        }
      }
      // 跳跃物理
      this.vy += GRAVITY;
      this.y += this.vy;
      // 落地检测
      if (this.y >= GROUND_Y) {
        this.y = GROUND_Y;
        this.vy = 0;
        this.isOnGround = true;
        spawnDust(this.x, GROUND_Y);
        switchStatus("running");
      }
    } else if (st === "dead") {
      if (gameState.shakeTime > 0) {
        gameState.shakeTime--;
      }
    }
  },

  draw() {
    // 跳跃阴影
    if (gameState.status === "jumping") {
      const heightAboveGround = GROUND_Y - this.y;
      const maxShadowHeight = Math.abs(JUMP_FORCE + LONG_JUMP_BONUS) ** 2 / (2 * GRAVITY);
      const ratio = Math.min(heightAboveGround / maxShadowHeight, 1);
      const shadowRadius = 20 * (1 - ratio * 0.6);
      const shadowAlpha = 0.25 * (1 - ratio * 0.8);
      ctx.save();
      ctx.globalAlpha = shadowAlpha;
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.ellipse(this.x, GROUND_Y + 5, shadowRadius, shadowRadius * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    let drawX = this.x;
    let drawY = this.y;

    if (gameState.status === "running") {
      drawX += this.wobbleOffset;
      this.runFrame++;
      if (this.runFrame % 16 < 8) {
        drawY -= 3;
      }
    }

    // 水平翻转，让马面朝跑酷前方（右）
    ctx.save();
    ctx.font = `${this.fontSize}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.translate(drawX, 0);
    ctx.scale(-1, 1);
    ctx.fillText(this.getEmoji(), 0, drawY);
    ctx.restore();

    // 对话气泡（idle 状态）
    this.drawSpeechBubble();
  },

  drawSpeechBubble() {
    if (!VISUAL_MODE || gameState.status !== "idle") return;
    const text = "来拍我呀～";
    const bx = this.x + 40;
    const by = this.y - this.fontSize - 15;
    ctx.save();
    ctx.font = "14px 'Microsoft YaHei', sans-serif";
    const tw = ctx.measureText(text).width;
    const pw = tw + 18;
    const ph = 26;
    const rx = bx - pw / 2;
    const ry = by - ph;
    const cr = 8;
    // 气泡背景
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.strokeStyle = "#bbb";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(rx + cr, ry);
    ctx.lineTo(rx + pw - cr, ry);
    ctx.quadraticCurveTo(rx + pw, ry, rx + pw, ry + cr);
    ctx.lineTo(rx + pw, ry + ph - cr);
    ctx.quadraticCurveTo(rx + pw, ry + ph, rx + pw - cr, ry + ph);
    // 小三角指向马
    ctx.lineTo(bx + 5, ry + ph);
    ctx.lineTo(bx, by + 6);
    ctx.lineTo(bx - 5, ry + ph);
    ctx.lineTo(rx + cr, ry + ph);
    ctx.quadraticCurveTo(rx, ry + ph, rx, ry + ph - cr);
    ctx.lineTo(rx, ry + cr);
    ctx.quadraticCurveTo(rx, ry, rx + cr, ry);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // 文字
    ctx.fillStyle = "#5a4a2a";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, bx, ry + ph / 2);
    ctx.restore();
  },

  jump() {
    if (!this.isOnGround) return;
    this.vy = JUMP_FORCE;
    this.isOnGround = false;
    switchStatus("jumping");
  },

  reset() {
    this.y = this.baseY;
    this.vy = 0;
    this.isOnGround = true;
    this.runFrame = 0;
    this.breathOffset = 0;
    this.wobbleOffset = 0;
  },
};

export default horse;
