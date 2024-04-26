
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Danmu = {}));
})(this, (function (exports) { 'use strict';

  class Danmu {
    constructor(options) {
      const defaultOptions = {
        color: '#fff',
        channelCount: 2,
        // 可以显示几行
        time: 8000,
        // 动画时间为8000ms
        direction: 'rtl' // 方向 rtl: 从右向左 ltr: 从左向右
      };
      this.options = Object.assign(defaultOptions, options);
      this.rootEl = this.options.el;
      this.channelCount = this.options.channelCount;
      this.lastEl = new Map(); // 存储每行最后一个元素
      this.waitForShoot = []; // 数据缓存池
    }

    // 动画结束后的回调函数
    animationEndCallback(element) {
      element.className = 'danmu__bubble-right danmu__bubble-idle';
      element.style = '';
      console.log('动画结束');
      // 动画结束后的操作
    }
    // 开始动画的函数
    /**
     *  sign 1 从左到右，-1 从右到左
     */
    startAnimation(element, fromX = 300, toX = 0) {
      const distance = Math.abs(toX - fromX); // 移动的距离

      let startTime = null; // 动画开始时间

      // 递归函数实现动画
      const animate = time => {
        let requestId = null;
        if (startTime === null) startTime = time; // 记录动画开始时间

        // 计算当前时间已经过去的时间百分比
        const timeElapsed = (time - startTime) / this.options.time; // 假设动画时间为500ms

        // 如果动画完成，停止动画并调用回调函数
        if (timeElapsed >= 1) {
          cancelAnimationFrame(requestId);
          this.animationEndCallback(element);
          return;
        }

        // 计算当前的X坐标
        const sign = this.options.direction === 'rtl' ? -1 : 1;
        const currentX = fromX + distance * timeElapsed * sign;

        // 应用当前的X坐标进行变换
        element.style.transform = `translateX(${currentX}px)`;

        // 使用requestAnimationFrame递归调用自己继续动画
        requestId = requestAnimationFrame(animate);
      };

      // 开始动画
      requestAnimationFrame(animate);
    }
    findAvalibleDom() {
      let idleEl = this.rootEl.querySelector('.danmu__bubble-idle');
      if (!idleEl) {
        idleEl = document.createElement('span');
        idleEl.classList.add('danmu__bubble-right');
      }
      return idleEl;
    }
    getChannel() {
      if (!this.lastEl.size) return 0;

      // 如果当前没有移动中的弹幕
      const busyEls = this.rootEl.getElementsByClassName('danmu__bubble-busy');
      if (!busyEls.length) {
        this.lastEl.clear();
        return 0;
      }
      let maxSpace = 0;
      let maxSpaceChannel = null;
      for (let index = 0; index < this.channelCount; index++) {
        const element = this.lastEl.get(index);
        if (!element) {
          return index;
        }
        const {
          left,
          width
        } = element.getBoundingClientRect();
        const distance = this.rootEl.offsetLeft + this.rootEl.clientWidth - (left + width);
        if (distance) {
          if (maxSpace < distance) {
            maxSpaceChannel = index;
            maxSpace = distance;
          }
        }
      }
      return maxSpaceChannel;
    }
    shootDanmu(data) {
      if (Array.isArray(data)) {
        this.waitForShoot = [...data.reverse(), ...this.waitForShoot];
      } else {
        if (!data.text.trim()) return;
        this.waitForShoot.unshift(data);
      }
      let shootId = null;
      const shoot = async () => {
        const shootText = this.waitForShoot.at(-1);
        if (!shootText) {
          cancelAnimationFrame(shootId);
          return;
        }
        const channelIdx = this.getChannel();
        console.log('[channel]', channelIdx);
        if (channelIdx !== null) {
          this.waitForShoot.pop();
          let idleEl = this.findAvalibleDom();
          idleEl.innerHTML = shootText.icon ? `
          <img src="${shootText.icon}">
          ${shootText.text}
        ` : shootText.text;
          if (shootText.color) {
            idleEl.style.color = shootText.color;
          }
          this.rootEl.appendChild(idleEl);
          this.lastEl.set(channelIdx, idleEl);
          if (channelIdx) {
            idleEl.style.marginTop = `${channelIdx * (idleEl.clientHeight + 10)}px`;
          }
          idleEl.classList.remove('danmu__bubble-idle');
          idleEl.classList.add('danmu__bubble-busy');
          if (this.options.direction === 'rtl') {
            this.startAnimation(idleEl, this.rootEl.clientWidth, -idleEl.clientWidth);
          } else {
            this.startAnimation(idleEl, -idleEl.clientWidth, this.rootEl.clientWidth);
          }
        }
        shootId = requestAnimationFrame(shoot);
      };
      shoot();
    }
    mount() {
      const danmuHtml = this.generateDanmu();
      this.rootEl.innerHTML = danmuHtml;
    }
  }
  function createLibrary(options) {
    const element = options.el instanceof HTMLElement ? options.el : document.querySelector(options.el);
    if (!element) {
      throw new Error('Selector not found.');
    }
    document.documentElement.style.setProperty('--danmu__bubble-width', element.clientWidth + 'px');
    if (options.color) {
      document.documentElement.style.setProperty('--danmu__bubble-color', options.color);
    }
    element.classList.add('danmu__wrapper');
    options.el = element;
    const library = new Danmu(options);
    return library;
  }

  exports.createLibrary = createLibrary;

}));
