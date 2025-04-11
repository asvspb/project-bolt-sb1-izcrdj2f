<script setup lang="ts">
defineProps<{
  progress: number;
}>();
</script>

<template>
  <div class="progress-container">
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
    </div>
    <div class="progress-text">{{ Math.round(progress) }}%</div>
  </div>
</template>

<style scoped>
.progress-container {
  margin: 1rem 0;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background-color: #333;
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #646cff;
  transition: width 0.3s ease;
}

.progress-text {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #aaa;
}
</style>