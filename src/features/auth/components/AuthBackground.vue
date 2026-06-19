<script setup lang="ts">
import { computed } from 'vue'

type Dot = {
  x: number
  y: number
  size: number
  delay: number
}

const dots: Dot[] = [
  { x: 10, y: 15, size: 6, delay: 0 },
  { x: 80, y: 10, size: 8, delay: 0.6 },
  { x: 20, y: 70, size: 10, delay: 1.2 },
  { x: 70, y: 75, size: 6, delay: 1.8 },
  { x: 45, y: 40, size: 8, delay: 2.4 },
  { x: 90, y: 55, size: 10, delay: 3.0 },
  { x: 5, y: 50, size: 6, delay: 3.6 },
  { x: 60, y: 20, size: 8, delay: 4.2 },
  { x: 30, y: 90, size: 10, delay: 4.8 },
  { x: 88, y: 85, size: 6, delay: 5.4 },
]

// pairs of indices into `dots` defining the connecting lines between them
const connections: [number, number][] = [
  [0, 4],
  [4, 1],
  [2, 4],
  [4, 3],
  [5, 3],
  [6, 2],
  [7, 5],
  [8, 2],
  [9, 5],
]

const lines = computed(() =>
  connections.map(([fromIndex, toIndex]) => {
    const from = dots[fromIndex]!
    const to = dots[toIndex]!
    const dx = to.x - from.x
    const dy = to.y - from.y
    const length = Math.sqrt(dx * dx + dy * dy)
    const angle = Math.atan2(dy, dx) * (180 / Math.PI)

    return {
      left: `${from.x}%`,
      top: `${from.y}%`,
      width: `${length}%`,
      transform: `rotate(${angle}deg)`,
    }
  }),
)
</script>

<template>
  <div class="auth-background pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
    <div class="aurora-blob aurora-blob--1" />
    <div class="aurora-blob aurora-blob--2" />
    <div class="aurora-blob aurora-blob--3" />

    <div
      v-for="(line, index) in lines"
      :key="`line-${index}`"
      class="constellation-line"
      :style="{ left: line.left, top: line.top, width: line.width, transform: line.transform }"
    />

    <div
      v-for="(dot, index) in dots"
      :key="`dot-${index}`"
      class="constellation-dot"
      :style="{
        left: `${dot.x}%`,
        top: `${dot.y}%`,
        width: `${dot.size}px`,
        height: `${dot.size}px`,
        animationDelay: `${dot.delay}s`,
      }"
    />
  </div>
</template>

<style scoped>
.aurora-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  animation: aurora-drift 26s ease-in-out infinite alternate;
}

.aurora-blob--1 {
  top: -15%;
  left: -10%;
  width: 38vw;
  height: 38vw;
  background: var(--color-gradientFrom);
  opacity: 0.28;
}

.aurora-blob--2 {
  right: -10%;
  bottom: -15%;
  width: 32vw;
  height: 32vw;
  background: var(--color-gradientTo);
  opacity: 0.22;
  animation-duration: 32s;
}

.aurora-blob--3 {
  top: 45%;
  right: 8%;
  width: 24vw;
  height: 24vw;
  background: var(--color-themeSwitchBorder);
  opacity: 0.25;
  animation-duration: 38s;
}

.dark .aurora-blob {
  display: none;
}

.constellation-dot {
  position: absolute;
  border-radius: 50%;
  background: var(--color-primary);
  box-shadow: 0 0 8px var(--color-primary);
  opacity: 0.6;
  animation: dot-float 5s ease-in-out infinite;
}

.constellation-line {
  position: absolute;
  height: 1px;
  background: var(--color-primary);
  opacity: 0.15;
  transform-origin: left center;
}

@keyframes aurora-drift {
  0% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(4%, -3%) scale(1.08);
  }
  100% {
    transform: translate(-3%, 2%) scale(0.96);
  }
}

@keyframes dot-float {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(6px, -22px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .aurora-blob,
  .constellation-dot {
    animation: none;
  }
}
</style>
