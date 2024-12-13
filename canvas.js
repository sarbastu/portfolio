'use strict';

window.addEventListener('load', () => {
  const canvasHeightText = 'Hello! My name is Sarbast!';

  class Particle {
    constructor(effect, x, y, color) {
      this.effect = effect;
      this.x = Math.random() * effect.canvasWidth;
      this.y = 0;
      this.color = color;
      this.originX = x;
      this.originY = y;
      this.size = effect.gap - 2;
      this.dx = 0;
      this.dy = 0;
      this.vx = 0;
      this.vy = 0;
      this.force = 0;
      this.angle = 0;
      this.distance = 0;
      this.friction = Math.random() * 0.6 + 0.15;
      this.ease = Math.random() * 0.1 + 0.005;
    }
    draw() {
      this.effect.context.fillStyle = this.color;
      this.effect.context.fillRect(this.x, this.y, this.size, this.size);
    }
    update() {
      this.x += (this.originX - this.x) * this.ease;
      this.y += (this.originY - this.y) * this.ease;
    }
  }

  class Effect {
    constructor(canvasID, text) {
      this.canvas = document.getElementById(canvasID);
      this.context = this.canvas.getContext('2d');
      this.text = text;
      this.canvasWidth;
      this.canvasHeight;
      this.canvasCenterWidth;
      this.canvasCenterHeight;
      this.maxTextWidth;
      this.fontSize = 100;
      this.lineHeight = this.fontSize * 0.8;
      //particle
      this.particles = [];
      this.gap = 3;
      this.mouse = {
        radius: 20000,
        x: 0,
        y: 0,
      };
      this.lastTime = 0;
      this.interval = 1000 / 80;
      this.timer = 0;
      window.addEventListener('mousemove', (e) => {
        this.mouse.x = e.x;
        this.mouse.y = e.y;
      });
      window.addEventListener('resize', () => this.resizeCanvas());
      this.resizeCanvas();
    }

    textToArrayOfWrappedText(text) {
      let [wrappedTextArray, lineIdx, line] = [[], 0, ''];

      text.split(' ').forEach((e, i) => {
        const currentLine = line + e + ' ';
        if (this.context.measureText(currentLine).width > this.maxTextWidth) {
          line = e + ' ';
          lineIdx++;
        } else {
          line = currentLine;
        }
        wrappedTextArray[lineIdx] = line;
      });

      return wrappedTextArray;
    }

    setTextSettings() {
      this.gradient = this.context.createLinearGradient(
        0,
        0,
        this.canvasWidth,
        this.canvasHeight
      );
      this.gradient.addColorStop(0, 'white');
      this.gradient.addColorStop(0.5, 'cyan');
      this.gradient.addColorStop(1, 'blue');
      this.context.fillStyle = this.gradient;
      this.StrokeStyle = this.gradient;

      this.context.lineWidth = 3;
      this.context.textAlign = 'center';
      this.context.textBaseline = 'middle';
      this.context.font = `${this.fontSize}px Arial`;
    }

    wrapText(text) {
      this.setTextSettings();
      let textArray = this.textToArrayOfWrappedText(text);

      textArray.forEach((e, i, a) => {
        const textStart =
          this.canvasCenterHeight - (this.lineHeight * a.length) / 2;
        const textY = textStart + i * this.fontSize;
        this.context.strokeText(e, this.canvasCenterWidth + 80, textY + 20);
        this.context.fillText(e, this.canvasCenterWidth, textY);
      });

      this.convertToParticles();
    }

    createParticles(pixels) {
      this.particles = [];
      this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      for (let y = 0; y < this.canvasHeight; y += this.gap) {
        for (let x = 0; x < this.canvasWidth; x += this.gap) {
          const idx = (y * this.canvasWidth + x) * 4;
          const alpha = pixels[idx + 3];
          if (alpha > 0) {
            const red = pixels[idx];
            const green = pixels[idx + 1];
            const blue = pixels[idx + 2];
            const color = `rgb(${red}, ${green}, ${blue})`;
            this.particles.push(new Particle(this, x, y, color));
          }
        }
      }
    }

    convertToParticles() {
      const pixels = this.context.getImageData(
        0,
        0,
        this.canvasWidth,
        this.canvasHeight
      ).data;

      this.createParticles(pixels);
    }

    resizeCanvas() {
      this.canvasWidth = window.innerWidth;
      this.canvasHeight = window.innerHeight;
      this.canvas.width = this.canvasWidth;
      this.canvas.height = this.canvasHeight;
      this.canvasCenterWidth = this.canvasWidth * 0.5;
      this.canvasCenterHeight = this.canvasHeight * 0.5;
      this.maxTextWidth = this.canvasWidth * 0.8;
      this.wrapText(this.text);
    }
    render() {
      for (const particle of this.particles) {
        particle.update();
        particle.draw();
      }
    }

    animate(timeStamp = 0) {
      const deltaTime = timeStamp - this.lastTime;
      this.lastTime = timeStamp;
      this.timer += deltaTime;
      if (this.timer > this.interval) {
        this.timer -= this.interval;
        effect.context.clearRect(0, 0, effect.canvasWidth, effect.canvasHeight);
        effect.render();
      }
      requestAnimationFrame(this.animate.bind(this));
    }
  }

  const effect = new Effect('canvas', canvasHeightText);
  effect.animate();
});
