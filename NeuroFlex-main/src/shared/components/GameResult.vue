<template>
  <Transition name="result-modal" @enter="onEnter" @after-enter="onAfterEnter">
    <div v-if="visible" class="result-overlay mobile-modal" @click.self="handleOverlayClick">
      <div class="result-modal mobile-performance" :class="[resultClass, { 'compact-mode': compact }]">
        <!-- 背景装饰 -->
        <div class="result-bg-decoration">
          <div class="decoration-circle circle-1"></div>
          <div class="decoration-circle circle-2"></div>
          <div class="decoration-circle circle-3"></div>
        </div>

        <!-- 状态图标 -->
        <div class="result-icon-wrapper">
          <div class="result-icon" :class="resultClass">
            <!-- 成功图标 -->
            <svg
              v-if="type === 'success'"
              class="icon-svg"
              viewBox="0 0 52 52"
              fill="none"
              stroke="currentColor"
            >
              <circle class="icon-circle" cx="26" cy="26" r="25" />
              <path class="icon-check" d="M14 27l7 7 16-16" />
            </svg>

            <!-- 失败/超时图标 -->
            <svg
              v-else-if="type === 'timeout' || type === 'fail'"
              class="icon-svg"
              viewBox="0 0 52 52"
              fill="none"
              stroke="currentColor"
            >
              <circle class="icon-circle" cx="26" cy="26" r="25" />
              <path class="icon-cross" d="M16 16l20 20M36 16l-20 20" />
            </svg>

            <!-- 警告图标 -->
            <svg
              v-else-if="type === 'warning'"
              class="icon-svg"
              viewBox="0 0 52 52"
              fill="none"
              stroke="currentColor"
            >
              <circle class="icon-circle" cx="26" cy="26" r="25" />
              <path class="icon-warning" d="M26 16v12M26 34v2" />
            </svg>
          </div>
        </div>

        <!-- 标题 -->
        <h2 class="result-title mobile-text-nowrap">{{ title }}</h2>

        <!-- 副标题（可选） -->
        <p v-if="subtitle" class="result-subtitle mobile-text-nowrap">{{ subtitle }}</p>

        <!-- 统计数据 -->
        <div class="result-stats">
          <div
            v-for="(stat, index) in stats"
            :key="index"
            class="stat-item"
            :style="{ animationDelay: `${0.1 + index * 0.05}s` }"
          >
            <span class="stat-label mobile-text-nowrap">{{ stat.label }}</span>
            <span 
              v-if="stat.isHtml" 
              class="stat-value mobile-text-nowrap" 
              :class="stat.highlight ? 'highlight' : ''"
              v-html="stat.value"
            ></span>
            <span 
              v-else
              class="stat-value mobile-text-nowrap" 
              :class="stat.highlight ? 'highlight' : ''"
            >
              {{ stat.value }}
            </span>
          </div>
        </div>

        <!-- 扩展内容区域 (为后续功能预留) -->
        <div v-if="$slots.extra || extraContent" class="result-extra-content">
          <slot name="extra">
            <div v-if="extraContent" v-html="extraContent"></div>
          </slot>
        </div>

        <!-- 操作按钮 -->
        <div class="result-actions mobile-button-group">
          <button
            v-if="showRetry"
            class="action-button secondary button mobile-touch-target"
            :class="{ 'long-text': true }"
            @click="$emit('retry')"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" />
            </svg>
            <span>再试一次</span>
          </button>
          <button 
            class="action-button primary button mobile-touch-target" 
            :class="{ 'long-text': closeText.length > 4 }"
            @click="$emit('close')"
          >
            <span>{{ closeText }}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'
import { modalPopup } from '@/shared/utils/animations'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'success', // 'success' | 'fail' | 'timeout' | 'warning'
    validator: value => ['success', 'fail', 'timeout', 'warning'].includes(value)
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  stats: {
    type: Array,
    default: () => []
    // 格式: [{ label: '用时', value: '5.0s', highlight: false }]
  },
  showRetry: {
    type: Boolean,
    default: true
  },
  closeText: {
    type: String,
    default: '返回首页'
  },
  extraContent: {
    type: String,
    default: ''
  },
  compact: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close', 'retry'])

const resultClass = computed(() => {
  return `result-${props.type}`
})

function onEnter(el) {
  // 使用GSAP动画
  modalPopup(el)
}

function onAfterEnter() {
  // 动画完成后的回调
}

function handleOverlayClick() {
  // 点击遮罩层关闭（可选）
  // this.$emit('close')
}
</script>

<style lang="scss" scoped>
.result-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  @include flex-center;
  z-index: 2000;
  padding: $spacing-lg;
  
  @include viewport-height(dynamic);
  
  @include mobile {
    @include viewport-height(small);
    padding: $spacing-md;
  }
}

.result-modal {
  position: relative;
  width: 100%;
  max-width: 600px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-radius: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.2);
  padding: $spacing-xl $spacing-lg;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  
  max-height: 90vh;
  max-height: 90dvh;

  @include mobile {
    max-width: 90vw;
    max-height: 88vh;
    max-height: 88svh;
    padding: $spacing-lg $spacing-md;
    
    @media (max-height: 640px) {
      max-height: 85vh;
      max-height: 85svh;
      padding: $spacing-md $spacing-sm;
    }
  }
}

// 紧凑模式样式
.result-modal.compact-mode {
  padding: $spacing-xl $spacing-lg;
  max-height: 75vh;
  max-height: 75dvh;
  
  @include mobile {
    padding: $spacing-lg $spacing-md;
    max-height: 70vh;
    max-height: 70svh;
    
    @media (max-height: 640px) {
      max-height: 65vh;
      max-height: 65svh;
      padding: $spacing-md $spacing-sm;
    }
  }
  
  .result-icon-wrapper {
    margin-bottom: $spacing-sm;
    
    @include mobile {
      margin-bottom: $spacing-xs;
    }
  }
  
  .result-icon {
    width: 64px;
    height: 64px;
    
    @include mobile {
      width: 48px;
      height: 48px;
    }
  }
  
  .result-title {
    font-size: $font-2xl;
    margin-bottom: $spacing-xs;
    
    @include mobile {
      font-size: $font-xl;
      margin-bottom: 4px;
    }
  }
  
  .result-subtitle {
    margin-bottom: $spacing-lg;
    
    @include mobile {
      margin-bottom: $spacing-md;
    }
  }
  
  .result-stats {
    margin-bottom: $spacing-lg;
    gap: $spacing-sm;
    
    @include mobile {
      margin-bottom: $spacing-md;
      gap: $spacing-xs;
    }
    
    .stat-item {
      padding: $spacing-md;
      
      @include mobile {
        padding: $spacing-sm;
      }
    }
  }
  
  .result-extra-content {
    margin-bottom: $spacing-md;
    padding: $spacing-sm;
    
    @include mobile {
      margin-bottom: $spacing-sm;
      padding: $spacing-xs;
    }
  }
}

// 背景装饰
.result-bg-decoration {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  opacity: 0.3;

  .decoration-circle {
    position: absolute;
    border-radius: 50%;
    filter: blur(40px);
    animation: float 6s ease-in-out infinite;

    &.circle-1 {
      width: 200px;
      height: 200px;
      top: -100px;
      right: -100px;
      background: radial-gradient(circle, var(--result-color) 0%, transparent 70%);
      animation-delay: 0s;
    }

    &.circle-2 {
      width: 150px;
      height: 150px;
      bottom: -75px;
      left: -75px;
      background: radial-gradient(circle, var(--result-color) 0%, transparent 70%);
      animation-delay: 2s;
    }

    &.circle-3 {
      width: 100px;
      height: 100px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: radial-gradient(circle, var(--result-color) 0%, transparent 70%);
      animation-delay: 4s;
    }
  }
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(10px, -10px) scale(1.1);
  }
  66% {
    transform: translate(-10px, 10px) scale(0.9);
  }
}

// 图标样式
.result-icon-wrapper {
  @include flex-center;
  margin-bottom: $spacing-md;
  
  @include mobile {
    margin-bottom: $spacing-sm;
  }
}

.result-icon {
  width: 70px;
  height: 70px;
  @include flex-center;
  position: relative;

  @include mobile {
    width: 56px;
    height: 56px;
    
    // 超小屏幕进一步缩小
    @media (max-height: 640px) {
      width: 48px;
      height: 48px;
    }
  }

  .icon-svg {
    width: 100%;
    height: 100%;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .icon-circle {
    stroke-dasharray: 166;
    stroke-dashoffset: 166;
    animation: draw-circle 0.6s ease-out forwards;
    animation-delay: 0.2s;
  }

  .icon-check {
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
    animation: draw-check 0.4s ease-out forwards;
    animation-delay: 0.6s;
  }

  .icon-cross {
    stroke-dasharray: 57;
    stroke-dashoffset: 57;
    animation: draw-cross 0.4s ease-out forwards;
    animation-delay: 0.6s;
  }

  .icon-warning {
    stroke-dasharray: 30;
    stroke-dashoffset: 30;
    animation: draw-warning 0.4s ease-out forwards;
    animation-delay: 0.6s;
  }
}

// 成功样式
.result-success {
  --result-color: #{$accent-success};

  .result-icon {
    color: $accent-success;
    filter: drop-shadow(0 0 20px rgba(0, 255, 136, 0.6));
  }
}

// 失败/超时样式
.result-fail,
.result-timeout {
  --result-color: #{$accent-error};

  .result-icon {
    color: $accent-error;
    filter: drop-shadow(0 0 20px rgba(255, 51, 102, 0.6));
  }
}

// 警告样式
.result-warning {
  --result-color: #{$accent-warning};

  .result-icon {
    color: $accent-warning;
    filter: drop-shadow(0 0 20px rgba(255, 170, 0, 0.6));
  }
}

// 动画关键帧
@keyframes draw-circle {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes draw-check {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes draw-cross {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes draw-warning {
  to {
    stroke-dashoffset: 0;
  }
}

// 标题
.result-title {
  text-align: center;
  font-size: $font-2xl;
  font-weight: $font-bold;
  margin: 0 0 $spacing-xs;
  background: linear-gradient(135deg, #FF8459 0%, #B12F80 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: fade-in-up 0.5s ease-out forwards;
  animation-delay: 0.3s;
  opacity: 0;

  @include mobile {
    font-size: $font-xl;
    margin-bottom: 4px;
    
    @media (max-height: 640px) {
      font-size: $font-lg;
    }
  }
}

.result-subtitle {
  text-align: center;
  font-size: $font-sm;
  color: #666;
  margin: 0 0 $spacing-lg;
  animation: fade-in-up 0.5s ease-out forwards;
  animation-delay: 0.4s;
  opacity: 0;

  @include mobile {
    font-size: $font-xs;
    margin-bottom: $spacing-md;
    
    @media (max-height: 640px) {
      font-size: 11px;
      margin-bottom: $spacing-sm;
    }
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 统计数据
.result-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-md;
  margin-bottom: $spacing-lg;
  padding: 0 $spacing-lg; // 增加左右边距，与按钮对齐

  @include mobile {
    grid-template-columns: 1fr;
    gap: $spacing-sm;
    margin-bottom: $spacing-md;
    padding: 0 $spacing-md; // 移动端左右边距
    
    @media (max-height: 640px) {
      margin-bottom: $spacing-sm;
      gap: $spacing-xs;
    }
    
    @media (max-width: 360px) {
      padding: 0 $spacing-sm;
    }
  }

  .stat-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $spacing-md $spacing-lg;
    background: rgba(0, 0, 0, 0.03);
    border-radius: $radius-md;
    border: 1px solid rgba(0, 0, 0, 0.1);
    transition: all $transition-base;
    animation: fade-in-scale 0.4s ease-out forwards;
    opacity: 0;

    @include mobile {
      padding: $spacing-sm $spacing-md;
      
      @media (max-height: 640px) {
        padding: 6px $spacing-sm;
      }
    }

    &:hover {
      background: rgba(0, 0, 0, 0.06);
      border-color: rgba(0, 0, 0, 0.2);
      transform: translateY(-2px);
    }

    .stat-label {
      font-size: $font-sm;
      color: #666;
      font-weight: $font-medium;

      @include mobile {
        font-size: $font-xs;
        
        @media (max-height: 640px) {
          font-size: 11px;
        }
      }
    }

    .stat-value {
      font-size: $font-lg;
      font-weight: $font-bold;
      color: #333;

      @include mobile {
        font-size: $font-base;
        
        @media (max-height: 640px) {
          font-size: $font-sm;
        }
      }

      &.highlight {
        background: linear-gradient(135deg, #FF8459, #B12F80);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }
  }
}

@keyframes fade-in-scale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

// 扩展内容区域
.result-extra-content {
  margin-bottom: $spacing-lg;
  padding: $spacing-md;
  background: rgba(255, 255, 255, 0.03);
  border-radius: $radius-md;
  border: 1px solid rgba(255, 255, 255, 0.08);
  animation: fade-in-up 0.5s ease-out forwards;
  animation-delay: 0.6s;
  opacity: 0;
  
  @include mobile {
    margin-bottom: $spacing-md;
    padding: $spacing-sm;
    
    @media (max-height: 640px) {
      margin-bottom: $spacing-sm;
      padding: $spacing-xs $spacing-sm;
    }
  }
}

// 操作按钮
.result-actions {
  display: flex;
  gap: $spacing-md;
  padding: 0 $spacing-lg; // 增加左右边距
  animation: fade-in-up 0.5s ease-out forwards;
  animation-delay: 0.5s;
  opacity: 0;

  @include mobile {
    gap: $spacing-sm;
    padding: 0 $spacing-md; // 移动端左右边距
    flex-direction: column;
    
    // 超小屏幕横向排列但缩小间距
    @media (max-width: 360px) {
      flex-direction: row;
      gap: $spacing-xs;
      padding: 0 $spacing-sm;
    }
  }

  .action-button {
    @include button-reset;
    @include mobile-button;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-xs;
    padding: $spacing-md $spacing-lg;
    border-radius: 9999px;
    font-size: $font-sm;
    font-weight: 500;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    
    white-space: nowrap;
    text-overflow: ellipsis;

    @include mobile {
      padding: $spacing-sm $spacing-md;
      font-size: $font-xs;
      gap: 4px;
      
      span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      @media (max-width: 360px) {
        padding: $spacing-xs $spacing-sm;
        font-size: 11px;
        min-width: 0;
        
        span {
          font-size: 11px;
        }
        
        svg {
          width: 14px;
          height: 14px;
          flex-shrink: 0;
        }
      }
      
      @media (max-height: 640px) {
        padding: 6px $spacing-sm;
        
        svg {
          width: 14px;
          height: 14px;
        }
      }
    }

    svg {
      transition: transform 0.3s ease;
      flex-shrink: 0;
    }

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover::before {
      opacity: 1;
    }

    &:active {
      transform: scale(0.95);
    }

    &.secondary {
      background: rgba(255, 255, 255, 0.8);
      border: 1px solid rgba(0, 0, 0, 0.2);
      color: #333;

      &:hover {
        background: #ffffff;
        color: #622A88;
        border-color: #622A88;
        box-shadow: 0 0 20px rgba(98, 42, 136, 0.4);
        transform: translateY(-2px);

        svg {
          transform: rotate(-45deg);
        }
      }
      
      @include mobile {
        &:hover {
          transform: none;
          svg {
            transform: none;
          }
        }
        
        &:active {
          background: rgba(255, 255, 255, 0.9);
        }
      }
    }

    &.primary {
      background: #ffffff;
      border: 1px solid #ffffff;
      color: #622A88;
      font-weight: 700;
      box-shadow: 0 0 20px rgba(98, 42, 136, 0.4);

      &:hover {
        box-shadow: 0 0 30px rgba(98, 42, 136, 0.6);
        transform: translateY(-2px);

        svg {
          transform: translateX(4px);
        }
      }
      
      @include mobile {
        box-shadow: 0 0 15px rgba(98, 42, 136, 0.3);
        
        &:hover {
          transform: none;
          box-shadow: 0 0 15px rgba(98, 42, 136, 0.3);
          svg {
            transform: none;
          }
        }
        
        &:active {
          box-shadow: 0 0 10px rgba(98, 42, 136, 0.4);
        }
      }
    }
  }
}

// 过渡动画
.result-modal-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.result-modal-leave-active {
  transition: all 0.3s ease-in;
}

.result-modal-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.result-modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
