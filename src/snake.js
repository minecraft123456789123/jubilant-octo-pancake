/**
 * Created by wanghx on 4/23/16.
 *
 * snake
 *
 */
'use strict';

const SPEED = 2;

class Base {
  constructor(options) {
    this.ctx = options.ctx;
    this.x = options.x;
    this.y = options.y;
    this.c = options.c || 0;
    this.r = 20;

    this.vx = 0;
    this.vy = 0;
    this.tox = this.x;
    this.toy = this.y;

    // 生成元素图片镜像
    this.createImage();
  }

  /**
   * 生成图片镜像
   */
  createImage() {
    this.img = document.createElement('canvas');
    this.img.width = this.r * 2 + 10;
    this.img.height = this.r * 2 + 10;

    const ctx = this.img.getContext('2d');

    ctx.save();
    ctx.beginPath();
    ctx.arc(this.img.width / 2, this.img.height / 2, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgb(${this.c},${this.c},${this.c})`;
    ctx.strokeStyle = `rgb(255,255,255)`;
    ctx.stroke();
    ctx.fill();
    ctx.restore();

    return ctx;
  }

  /**
   * 给予目标点, 计算速度
   * @param x
   * @param y
   */
  moveTo(x, y) {
    this.tox = x;
    this.toy = y;

    const dis_x = this.tox - this.x;
    const dis_y = this.toy - this.y;
    const dis = Math.sqrt(dis_x * dis_x + dis_y * dis_y);

    this.vy = dis_y * (SPEED / dis);
    this.vx = dis_x * (SPEED / dis);
  }

  /**
   * 渲染镜像图片
   */
  render() {
    this.ctx.drawImage(
      this.img,
      this.x - this.img.width / 2,
      this.y - this.img.height / 2
    )
  }
}

// 蛇的身躯
class Body extends Base {
  constructor(options) {
    super(options);

    this.dis = options.dis;
  }

  update() {
    const dis_x = this.tox - this.x;
    const dis_y = this.toy - this.y;
    const dis = Math.sqrt(dis_x * dis_x + dis_y * dis_y);

    if (dis <= this.dis) return;

    this.x += this.vx;
    this.y += this.vy;
  }
}

// 蛇类
export default class Snake extends Base {
  constructor(options) {
    super(options);

    this.angle = 0;
    this.bodyLength = 20;
    this.bodyDis = this.r * 2 / 3;
    this.bodyColor = ~~(240 / this.bodyLength);
    this.initBody();
  }

  /**
   * 添加画眼睛的功能
   */
  createImage() {
    const ctx = super.createImage();
    const eye_r = this.r / 3;
    let eye_x = this.img.width / 2 + this.r - eye_r;
    let eye_y = this.img.height / 2 - this.r + eye_r;

    // 画左眼
    ctx.beginPath();
    ctx.fillStyle = '#fff';
    ctx.arc(eye_x, eye_y, eye_r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#000';
    ctx.fillRect(eye_x + eye_r / 3, eye_y - 1, 2, 2);

    // 画右眼
    eye_y = this.img.height / 2 + this.r - eye_r;
    ctx.beginPath();
    ctx.fillStyle = '#fff';
    ctx.arc(eye_x, eye_y, eye_r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#000';
    ctx.fillRect(eye_x + eye_r / 3, eye_y - 1, 2, 2);
  }

  initBody() {
    this.bodys = [];
    let x = this.x;
    let c = this.c;

    for (let i = 0; i < this.bodyLength; i++) {
      x -= this.bodyDis;
      c += this.bodyColor;

      this.bodys.push(new Body({
        ctx: this.ctx,
        x,
        y: this.y,
        c,
        dis: this.bodyDis
      }));
    }
  }

  moveTo(x, y) {
    super.moveTo(x, y);

    // 调整头部的方向
    this.angle = Math.atan(this.vy / this.vx);

    if(this.vx < 0) {
      this.angle += Math.PI
    }
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
  }

  render() {
    for (let i = this.bodyLength - 1; i >= 0; i--) {
      let body = this.bodys[i];
      let front = this.bodys[i - 1] || this;

      body.moveTo(front.x, front.y);

      body.update();
      body.render();
    }

    this.update();

    const ctx = this.ctx;

    ctx.save();
    ctx.translate(
      this.x,
      this.y
    );
    ctx.rotate(this.angle);
    ctx.drawImage(this.img, -this.img.width / 2, -this.img.height / 2);
    ctx.restore();
  }
}