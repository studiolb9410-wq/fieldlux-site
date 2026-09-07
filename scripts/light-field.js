(() => {
  'use strict';

  const STAGE_SELECTOR = '[data-light-stage]';
  const CANVAS_SELECTOR = 'canvas[data-light-field]';
  const MOTION_EVENT = 'fieldlux:motionchange';
  const MOBILE_QUERY = '(max-width: 767px)';
  const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';
  const MAX_DPR = 1.5;
  const DESKTOP_PARTICLES = 1500;
  const MOBILE_PARTICLES = 680;
  const SEED = 0x464c5558;

  const PALETTES = [
    { rgb: '31, 54, 65', glow: '31, 89, 110', white: false },
    { rgb: '0, 166, 204', glow: '0, 190, 226', white: false },
    { rgb: '224, 39, 124', glow: '255, 73, 157', white: false },
    { rgb: '231, 123, 12', glow: '255, 151, 28', white: false },
    { rgb: '255, 255, 255', glow: '17, 125, 156', white: true },
  ];

  // Four overlapping image areas: each projector owns a quadrant and shares
  // a generous feather band through the middle, like a 2 × 2 blend canvas.
  const COVERAGE = [
    { u0: 0, u1: 0.61, v0: 0, v1: 0.61 },
    { u0: 0.39, u1: 1, v0: 0, v1: 0.61 },
    { u0: 0, u1: 0.61, v0: 0.39, v1: 1 },
    { u0: 0.39, u1: 1, v0: 0.39, v1: 1 },
  ];

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const lerp = (from, to, amount) => from + (to - from) * amount;
  const fract = (value) => value - Math.floor(value);
  const smoothstep = (edge0, edge1, value) => {
    const amount = clamp((value - edge0) / Math.max(0.0001, edge1 - edge0), 0, 1);
    return amount * amount * (3 - 2 * amount);
  };

  function createRandom(seed) {
    let state = seed >>> 0;
    return () => {
      state += 0x6d2b79f5;
      let value = state;
      value = Math.imul(value ^ (value >>> 15), value | 1);
      value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
  }

  function addMediaListener(query, listener) {
    if (query.addEventListener) query.addEventListener('change', listener);
    else if (query.addListener) query.addListener(listener);
  }

  function removeMediaListener(query, listener) {
    if (query.removeEventListener) query.removeEventListener('change', listener);
    else if (query.removeListener) query.removeListener(listener);
  }

  function reducedMotion(query) {
    const preference = document.documentElement.dataset.motion;
    if (preference === 'reduced') return true;
    if (preference === 'full') return false;
    return query.matches;
  }

  function layout(width, height) {
    const compact = width < 768;
    const planeWidth = Math.min(width * (compact ? 0.7 : 0.58), 980);
    const planeHeight = Math.min(height * (compact ? 0.32 : 0.42), planeWidth * 0.48);
    const centerX = width * 0.5;
    const centerY = height * (compact ? 0.55 : 0.56);
    const top = centerY - planeHeight * 0.5;
    const bottom = centerY + planeHeight * 0.5;
    const left = centerX - planeWidth * 0.5;
    const right = centerX + planeWidth * 0.5;
    const inset = planeWidth * 0.1;

    const corners = [
      { x: left + inset, y: top },
      { x: right - inset, y: top },
      { x: left, y: bottom },
      { x: right, y: bottom },
    ];
    const nodes = compact
      ? [
        { x: width * 0.04, y: height * 0.29 },
        { x: width * 0.96, y: height * 0.29 },
        { x: width * 0.03, y: height * 0.81 },
        { x: width * 0.97, y: height * 0.81 },
      ]
      : [
        { x: width * 0.08, y: height * 0.31 },
        { x: width * 0.92, y: height * 0.31 },
        { x: width * 0.055, y: height * 0.83 },
        { x: width * 0.945, y: height * 0.83 },
      ];

    return {
      width,
      height,
      compact,
      planeWidth,
      planeHeight,
      centerX,
      centerY,
      top,
      bottom,
      topLeft: left + inset,
      topRight: right - inset,
      bottomLeft: left,
      bottomRight: right,
      corners,
      nodes,
    };
  }

  function planePoint(geometry, u, v) {
    const left = lerp(geometry.topLeft, geometry.bottomLeft, v);
    const right = lerp(geometry.topRight, geometry.bottomRight, v);
    return { x: lerp(left, right, u), y: lerp(geometry.top, geometry.bottom, v) };
  }

  function coveragePoint(geometry, emitter, u, v) {
    const coverage = COVERAGE[emitter];
    return planePoint(
      geometry,
      lerp(coverage.u0, coverage.u1, u),
      lerp(coverage.v0, coverage.v1, v),
    );
  }

  function coverageCorners(geometry, emitter) {
    const coverage = COVERAGE[emitter];
    return [
      planePoint(geometry, coverage.u0, coverage.v0),
      planePoint(geometry, coverage.u1, coverage.v0),
      planePoint(geometry, coverage.u1, coverage.v1),
      planePoint(geometry, coverage.u0, coverage.v1),
    ];
  }

  class LightField {
    constructor(stage) {
      this.stage = stage;
      this.canvas = stage.querySelector(CANVAS_SELECTOR);
      this.replay = stage.querySelector('[data-light-replay]');
      this.context = this.canvas?.getContext('2d', { alpha: true, desynchronized: true });
      this.mobileQuery = window.matchMedia(MOBILE_QUERY);
      this.motionQuery = window.matchMedia(REDUCED_QUERY);
      this.reduced = reducedMotion(this.motionQuery);
      this.width = 0;
      this.height = 0;
      this.dpr = 1;
      this.progress = 0;
      this.renderProgress = 0;
      this.particles = [];
      this.frameId = 0;
      this.inViewport = false;
      this.pageVisible = !document.hidden;
      this.destroyed = false;

      if (!this.canvas || !this.context) return;

      this.onScroll = this.onScroll.bind(this);
      this.onResize = this.onResize.bind(this);
      this.onVisibility = this.onVisibility.bind(this);
      this.onMotionChange = this.onMotionChange.bind(this);
      this.onMobileChange = this.onMobileChange.bind(this);
      this.onReplay = this.onReplay.bind(this);
      this.tick = this.tick.bind(this);

      this.resizeObserver = typeof ResizeObserver === 'function'
        ? new ResizeObserver(this.onResize)
        : null;
      this.intersectionObserver = typeof IntersectionObserver === 'function'
        ? new IntersectionObserver((entries) => {
          const entry = entries[entries.length - 1];
          this.inViewport = Boolean(entry?.isIntersecting);
          if (this.inViewport) this.start();
          else this.stop();
        }, { rootMargin: '12% 0px', threshold: 0 })
        : null;

      window.addEventListener('scroll', this.onScroll, { passive: true });
      window.addEventListener('resize', this.onResize, { passive: true });
      window.addEventListener(MOTION_EVENT, this.onMotionChange);
      document.addEventListener('visibilitychange', this.onVisibility);
      addMediaListener(this.motionQuery, this.onMotionChange);
      addMediaListener(this.mobileQuery, this.onMobileChange);
      this.replay?.addEventListener('click', this.onReplay);

      this.resizeObserver?.observe(this.canvas);
      this.intersectionObserver?.observe(this.stage);
      this.inViewport = this.isVisible();
      this.resize(true);
      this.buildParticles();
      this.updateProgress(true);
      this.render(0);
      this.stage.classList.add('is-light-ready');
      this.start();
    }

    isVisible() {
      const rect = this.stage.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight;
    }

    readProgress() {
      const rect = this.stage.getBoundingClientRect();
      const distance = Math.max(1, rect.height - window.innerHeight);
      return clamp(-rect.top / distance, 0, 1);
    }

    updateProgress(immediate = false) {
      this.progress = this.reduced ? 0 : this.readProgress();
      if (immediate || this.reduced) this.renderProgress = this.progress;
      this.stage.style.setProperty('--light-progress', this.progress.toFixed(4));
    }

    resize(force = false) {
      const rect = this.canvas.getBoundingClientRect();
      const nextWidth = Math.max(1, Math.round(rect.width || this.stage.clientWidth));
      const nextHeight = Math.max(1, Math.round(rect.height || window.innerHeight));
      const nextDpr = Math.min(Math.max(window.devicePixelRatio || 1, 1), MAX_DPR);
      if (!force && nextWidth === this.width && nextHeight === this.height && nextDpr === this.dpr) return;

      this.width = nextWidth;
      this.height = nextHeight;
      this.dpr = nextDpr;
      this.canvas.width = Math.round(this.width * this.dpr);
      this.canvas.height = Math.round(this.height * this.dpr);
      this.context.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }

    buildParticles() {
      const count = this.mobileQuery.matches ? MOBILE_PARTICLES : DESKTOP_PARTICLES;
      const random = createRandom(SEED + count);
      const particles = [];

      for (let index = 0; index < count; index += 1) {
        const pick = random();
        const kind = pick < 0.56 ? 'beam' : pick < 0.94 ? 'plane' : 'orbit';
        const emitter = Math.floor(random() * 4);
        const u = fract(0.5 + index * 0.754877666 + (random() - 0.5) * 0.012);
        const v = fract(0.5 + index * 0.569840296 + (random() - 0.5) * 0.012);
        let paletteIndex = emitter;
        if (kind === 'plane') {
          paletteIndex = v < 0.5 ? (u < 0.5 ? 0 : 1) : (u < 0.5 ? 2 : 3);
          const inBlend = Math.abs(u - 0.5) < 0.115 || Math.abs(v - 0.5) < 0.115;
          if (inBlend && random() < 0.24) paletteIndex = 4;
        }
        if (kind === 'orbit' && random() < 0.28) paletteIndex = 4;

        particles.push({
          kind,
          emitter,
          palette: PALETTES[paletteIndex],
          t: Math.pow(random(), 0.88),
          u,
          v,
          jitter: (random() - 0.5) * 2,
          orbitAngle: random() * Math.PI * 2,
          orbitRadius: 8 + random() * 38,
          scatterAngle: random() * Math.PI * 2,
          scatterRadius: 0.42 + random() * 0.54,
          scatterBias: random() < 0.72 ? 1 : 0.58,
          curl: (random() < 0.5 ? -1 : 1) * (0.45 + random() * 0.8),
          delay: random() * 0.14,
          size: 0.8 + Math.pow(random(), 1.65) * 2.8,
          alpha: 0.5 + random() * 0.46,
          phase: random() * Math.PI * 2,
          sparkle: random() < 0.1,
          trail: random() < 0.21,
        });
      }

      this.particles = particles;
    }

    homePoint(particle, geometry) {
      if (particle.kind === 'plane') {
        let { u, v } = particle;
        if (particle.sparkle) {
          if (particle.emitter % 2 === 0) v = Math.round(v * 7) / 7;
          else u = Math.round(u * 10) / 10;
        }
        return planePoint(geometry, u, v);
      }

      const node = geometry.nodes[particle.emitter];
      if (particle.kind === 'orbit') {
        return {
          x: node.x + Math.cos(particle.orbitAngle) * particle.orbitRadius,
          y: node.y + Math.sin(particle.orbitAngle) * particle.orbitRadius,
        };
      }

      // A beam particle chooses a point inside its projector's image area.
      // Interpolating from one lens point to that target makes the cloud widen
      // naturally instead of reading as a decorative line to one corner.
      const destination = coveragePoint(geometry, particle.emitter, particle.u, particle.v);
      const dx = destination.x - node.x;
      const dy = destination.y - node.y;
      const length = Math.max(1, Math.hypot(dx, dy));
      const spread = particle.jitter * (1.5 + particle.t * 5.5);
      return {
        x: lerp(node.x, destination.x, particle.t) + (-dy / length) * spread * particle.t,
        y: lerp(node.y, destination.y, particle.t) + (dx / length) * spread * particle.t,
      };
    }

    scatteredPoint(particle, home, geometry, amount) {
      const radialAngle = Math.atan2(home.y - geometry.centerY, home.x - geometry.centerX);
      const angle = radialAngle + particle.jitter * 0.68 + particle.scatterAngle * 0.16;
      const radiusX = geometry.width * particle.scatterRadius * particle.scatterBias;
      const radiusY = geometry.height * particle.scatterRadius * 0.82;
      const targetX = geometry.centerX + Math.cos(angle) * radiusX;
      const targetY = geometry.centerY + Math.sin(angle) * radiusY;
      const curl = Math.sin(amount * Math.PI) * Math.min(geometry.width, geometry.height) * 0.1 * particle.curl;
      return {
        x: lerp(home.x, targetX, amount) + Math.cos(angle + Math.PI * 0.5) * curl,
        y: lerp(home.y, targetY, amount) + Math.sin(angle + Math.PI * 0.5) * curl * 0.68,
        angle,
      };
    }

    tracePlane(geometry) {
      const context = this.context;
      context.beginPath();
      context.moveTo(geometry.topLeft, geometry.top);
      context.lineTo(geometry.topRight, geometry.top);
      context.lineTo(geometry.bottomRight, geometry.bottom);
      context.lineTo(geometry.bottomLeft, geometry.bottom);
      context.closePath();
    }

    traceCoverage(geometry, emitter) {
      const context = this.context;
      const corners = coverageCorners(geometry, emitter);
      context.beginPath();
      context.moveTo(corners[0].x, corners[0].y);
      corners.slice(1).forEach((corner) => context.lineTo(corner.x, corner.y));
      context.closePath();
      return corners;
    }

    drawPlane(geometry, progress) {
      const context = this.context;
      const visibility = 1 - smoothstep(0.08, 0.66, progress);
      if (visibility <= 0.002) return;

      context.save();
      this.tracePlane(geometry);
      context.fillStyle = `rgba(4, 150, 184, ${0.022 * visibility})`;
      context.fill();
      context.strokeStyle = `rgba(26, 69, 82, ${0.36 * visibility})`;
      context.lineWidth = 1;
      context.stroke();
      context.clip();

      geometry.nodes.forEach((_, emitter) => {
        const palette = PALETTES[emitter];
        const center = coveragePoint(geometry, emitter, 0.5, 0.5);
        const wash = context.createRadialGradient(
          center.x,
          center.y,
          0,
          center.x,
          center.y,
          geometry.planeWidth * 0.34,
        );
        wash.addColorStop(0, `rgba(${palette.glow}, ${0.13 * visibility})`);
        wash.addColorStop(0.58, `rgba(${palette.glow}, ${0.062 * visibility})`);
        wash.addColorStop(1, `rgba(${palette.glow}, ${0.012 * visibility})`);
        this.traceCoverage(geometry, emitter);
        context.fillStyle = wash;
        context.fill();
        context.setLineDash([4, 7]);
        context.strokeStyle = `rgba(${palette.glow}, ${0.2 * visibility})`;
        context.lineWidth = 0.7;
        context.stroke();
      });
      context.setLineDash([]);

      for (let row = 1; row < 8; row += 1) {
        const v = row / 8;
        const start = planePoint(geometry, 0, v);
        const end = planePoint(geometry, 1, v);
        context.beginPath();
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
        context.strokeStyle = `rgba(10, 127, 157, ${0.115 * visibility})`;
        context.lineWidth = 0.7;
        context.stroke();
      }

      for (let column = 1; column < 12; column += 1) {
        const u = column / 12;
        const start = planePoint(geometry, u, 0);
        const end = planePoint(geometry, u, 1);
        context.beginPath();
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
        context.strokeStyle = `rgba(20, 73, 88, ${0.075 * visibility})`;
        context.lineWidth = 0.65;
        context.stroke();
      }
      context.restore();
    }

    drawProjectionFans(geometry, progress) {
      const context = this.context;
      const visibility = 1 - smoothstep(0.05, 0.58, progress);
      if (visibility <= 0.002) return;

      geometry.nodes.forEach((node, index) => {
        const palette = PALETTES[index];
        const corners = coverageCorners(geometry, index);
        const center = coveragePoint(geometry, index, 0.5, 0.5);
        const angled = corners
          .map((corner) => ({ corner, angle: Math.atan2(corner.y - node.y, corner.x - node.x) }))
          .sort((a, b) => a.angle - b.angle);
        const edgeA = angled[0].corner;
        const edgeB = angled[angled.length - 1].corner;
        const gradient = context.createLinearGradient(node.x, node.y, center.x, center.y);
        gradient.addColorStop(0, `rgba(${palette.glow}, ${0.2 * visibility})`);
        gradient.addColorStop(0.2, `rgba(${palette.glow}, ${0.11 * visibility})`);
        gradient.addColorStop(0.74, `rgba(${palette.glow}, ${0.043 * visibility})`);
        gradient.addColorStop(1, `rgba(${palette.glow}, ${0.018 * visibility})`);

        context.save();
        context.beginPath();
        context.moveTo(node.x, node.y);
        context.lineTo(edgeA.x, edgeA.y);
        context.lineTo(edgeB.x, edgeB.y);
        context.closePath();
        context.fillStyle = gradient;
        context.fill();

        context.strokeStyle = `rgba(${palette.glow}, ${0.36 * visibility})`;
        context.lineWidth = 1;
        context.lineCap = 'round';
        [edgeA, edgeB].forEach((edge) => {
          context.beginPath();
          context.moveTo(node.x, node.y);
          context.lineTo(edge.x, edge.y);
          context.stroke();
        });

        context.strokeStyle = `rgba(${palette.glow}, ${0.115 * visibility})`;
        context.lineWidth = 0.65;
        corners.forEach((corner) => {
          context.beginPath();
          context.moveTo(node.x, node.y);
          context.lineTo(corner.x, corner.y);
          context.stroke();
        });
        context.strokeStyle = `rgba(${palette.glow}, ${0.24 * visibility})`;
        context.lineWidth = 1.1;
        context.beginPath();
        context.moveTo(node.x, node.y);
        context.lineTo(center.x, center.y);
        context.stroke();
        context.restore();
      });
    }

    drawNodes(geometry, progress, timestamp) {
      const context = this.context;
      const visibility = 1 - smoothstep(0.22, 0.74, progress);
      if (visibility <= 0.002) return;

      geometry.nodes.forEach((node, index) => {
        const palette = PALETTES[index];
        const pulse = 0.9 + Math.sin(timestamp * 0.0025 + index * 1.7) * 0.1;
        const radius = (geometry.compact ? 11 : 15) * pulse;
        const halo = context.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius * 2.9);
        halo.addColorStop(0, `rgba(255, 255, 255, ${0.98 * visibility})`);
        halo.addColorStop(0.13, `rgba(${palette.glow}, ${0.88 * visibility})`);
        halo.addColorStop(0.42, `rgba(${palette.glow}, ${0.24 * visibility})`);
        halo.addColorStop(1, `rgba(${palette.glow}, 0)`);
        context.fillStyle = halo;
        context.beginPath();
        context.arc(node.x, node.y, radius * 2.9, 0, Math.PI * 2);
        context.fill();

        context.strokeStyle = `rgba(${palette.glow}, ${0.45 * visibility})`;
        context.lineWidth = 1;
        context.beginPath();
        context.arc(node.x, node.y, radius * 1.45, 0, Math.PI * 2);
        context.stroke();
        context.fillStyle = `rgba(255, 255, 255, ${visibility})`;
        context.strokeStyle = `rgba(25, 54, 65, ${0.62 * visibility})`;
        context.lineWidth = 1.2;
        context.beginPath();
        context.arc(node.x, node.y, Math.max(2.8, radius * 0.27), 0, Math.PI * 2);
        context.fill();
        context.stroke();
      });
    }

    drawParticles(geometry, progress, timestamp) {
      const context = this.context;
      const finalFade = 1 - smoothstep(0.78, 1, progress);
      const scatterBloom = 1 + Math.sin(smoothstep(0.08, 0.72, progress) * Math.PI) * 0.64;

      this.particles.forEach((particle, index) => {
        const local = smoothstep(particle.delay, Math.min(0.88, particle.delay + 0.58), progress);
        const home = this.homePoint(particle, geometry);
        const point = this.scatteredPoint(particle, home, geometry, local);
        if (point.x < -36 || point.x > this.width + 36 || point.y < -36 || point.y > this.height + 36) return;

        const shimmer = this.reduced ? 1 : 0.78 + Math.sin(timestamp * 0.003 + particle.phase) * 0.22;
        const alpha = particle.alpha * finalFade * shimmer;
        if (alpha <= 0.008) return;
        const size = particle.size * scatterBloom * (0.9 + local * 0.44);

        if (particle.trail && local > 0.06 && local < 0.94) {
          const trailLength = 5 + size * 3.2 + local * 13;
          context.globalAlpha = alpha * 0.24;
          context.strokeStyle = `rgb(${particle.palette.glow})`;
          context.lineWidth = Math.max(0.55, size * 0.42);
          context.beginPath();
          context.moveTo(point.x, point.y);
          context.lineTo(point.x - Math.cos(point.angle) * trailLength, point.y - Math.sin(point.angle) * trailLength);
          context.stroke();
        }

        if (particle.sparkle) {
          context.globalAlpha = alpha * 0.1;
          context.fillStyle = `rgb(${particle.palette.glow})`;
          context.beginPath();
          context.arc(point.x, point.y, size * 4.8, 0, Math.PI * 2);
          context.fill();
          context.globalAlpha = alpha * 0.38;
          context.strokeStyle = `rgb(${particle.palette.glow})`;
          context.lineWidth = 0.7;
          context.beginPath();
          context.arc(point.x, point.y, size * 2.3, 0, Math.PI * 2);
          context.stroke();
        }

        context.globalAlpha = alpha;
        context.fillStyle = `rgb(${particle.palette.rgb})`;
        if (particle.palette.white) {
          context.strokeStyle = `rgba(21, 80, 98, ${Math.min(1, alpha * 0.86)})`;
          context.lineWidth = Math.max(0.75, size * 0.32);
          context.beginPath();
          context.arc(point.x, point.y, Math.max(1.25, size), 0, Math.PI * 2);
          context.fill();
          context.stroke();
        } else if (index % 4 === 0) {
          context.beginPath();
          context.arc(point.x, point.y, Math.max(0.75, size * 0.62), 0, Math.PI * 2);
          context.fill();
        } else {
          const side = Math.max(1, size * 0.72);
          context.fillRect(point.x - side * 0.5, point.y - side * 0.5, side, side);
        }
      });
      context.globalAlpha = 1;
    }

    render(timestamp) {
      if (!this.context || !this.width || !this.height) return;
      this.context.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      this.context.clearRect(0, 0, this.width, this.height);
      const geometry = layout(this.width, this.height);
      this.drawProjectionFans(geometry, this.renderProgress);
      this.drawPlane(geometry, this.renderProgress);
      this.drawParticles(geometry, this.renderProgress, timestamp);
      this.drawNodes(geometry, this.renderProgress, timestamp);
    }

    shouldRun() {
      return !this.destroyed && !this.reduced && this.inViewport && this.pageVisible;
    }

    start() {
      if (!this.shouldRun() || this.frameId) return;
      this.frameId = window.requestAnimationFrame(this.tick);
    }

    stop() {
      if (!this.frameId) return;
      window.cancelAnimationFrame(this.frameId);
      this.frameId = 0;
    }

    tick(timestamp) {
      this.frameId = 0;
      if (!this.shouldRun()) return;
      const delta = this.progress - this.renderProgress;
      this.renderProgress = Math.abs(delta) < 0.0005 ? this.progress : this.renderProgress + delta * 0.115;
      this.render(timestamp);
      this.frameId = window.requestAnimationFrame(this.tick);
    }

    onScroll() {
      this.updateProgress();
      if (this.inViewport) this.start();
    }

    onResize() {
      this.resize();
      this.updateProgress(true);
      this.render(performance.now());
      this.start();
    }

    onVisibility() {
      this.pageVisible = !document.hidden;
      if (this.pageVisible) this.start();
      else this.stop();
    }

    onMotionChange() {
      this.reduced = reducedMotion(this.motionQuery);
      this.updateProgress(true);
      if (this.reduced) {
        this.stop();
        this.render(0);
      } else {
        this.start();
      }
    }

    onMobileChange() {
      this.buildParticles();
      this.resize(true);
      this.render(performance.now());
      this.start();
    }

    onReplay() {
      if (this.reduced) return;
      const top = window.scrollY + this.stage.getBoundingClientRect().top;
      window.scrollTo({ top, behavior: 'smooth' });
    }

    destroy() {
      if (this.destroyed) return;
      this.destroyed = true;
      this.stop();
      window.removeEventListener('scroll', this.onScroll);
      window.removeEventListener('resize', this.onResize);
      window.removeEventListener(MOTION_EVENT, this.onMotionChange);
      document.removeEventListener('visibilitychange', this.onVisibility);
      removeMediaListener(this.motionQuery, this.onMotionChange);
      removeMediaListener(this.mobileQuery, this.onMobileChange);
      this.replay?.removeEventListener('click', this.onReplay);
      this.resizeObserver?.disconnect();
      this.intersectionObserver?.disconnect();
    }
  }

  const fields = [];
  const initialise = () => {
    document.querySelectorAll(STAGE_SELECTOR).forEach((stage) => {
      if (stage.dataset.lightInitialised === 'true') return;
      const field = new LightField(stage);
      if (!field.context) return;
      stage.dataset.lightInitialised = 'true';
      fields.push(field);
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialise, { once: true });
  else initialise();

  window.addEventListener('pagehide', () => fields.forEach((field) => field.destroy()), { once: true });
})();
