<template>
  <div id="app" class="app-container">
    <router-view v-slot="{ Component, route }">
      <transition :name="transitionName" mode="out-in">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { isPC } from '@/shared/utils/device'

const router = useRouter()
const route = useRoute()
const transitionName = ref('none')

// 监听路由变化，根据depth判断动画方向
watch(
  () => route.path,
  (newPath, oldPath) => {
    // PC端不使用滑动动画
    if (isPC()) {
      transitionName.value = 'fade'
      return
    }

    // 如果是首次加载（没有oldPath），不使用动画
    if (!oldPath || oldPath === '/') {
      transitionName.value = 'none'
      return
    }

    // 淡入淡出
    transitionName.value = 'fade'
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.app-container {
  @include min-viewport-height(dynamic);
  width: 100%;
  max-width: 100vw;
  background-color: var(--bg-primary);
  position: relative;
  overflow-x: hidden;

  // 移动端优化
  @include mobile {
    // 确保在移动端使用动态视口高度
    @include min-viewport-height(small);
  }
}

// 淡入淡出
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// 无动画（首次加载）
.none-enter-active,
.none-leave-active {
  transition: none;
}
</style>
