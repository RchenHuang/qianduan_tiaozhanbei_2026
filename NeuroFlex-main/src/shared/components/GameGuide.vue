<template>
  <Transition name="guide-modal">
    <div v-if="visible" class="guide-overlay" @click.self="$emit('close')">
      <div class="guide-modal">
        <!-- 关闭按钮 -->
        <button class="close-button" @click="$emit('close')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M18 6L6 18M6 6l12 12" stroke-width="2" stroke-linecap="round" />
          </svg>
        </button>

        <!-- 标题 -->
        <div class="guide-header">
          <div class="guide-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" stroke-width="2" />
              <path d="M12 16v-4M12 8h.01" stroke-width="2" stroke-linecap="round" />
            </svg>
          </div>
          <h2>{{ title }}</h2>
        </div>

        <!-- 内容 -->
        <div class="guide-content">
          <!-- 游戏说明 -->
          <section v-if="howToPlay" class="guide-section">
            <h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 11l3 3L22 4" stroke-width="2" stroke-linecap="round" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke-width="2" />
              </svg>
              游戏玩法
            </h3>
            <div class="guide-text" v-html="howToPlay"></div>
          </section>

          <!-- 训练目标 -->
          <section v-if="benefits" class="guide-section">
            <h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke-width="2" stroke-linecap="round" />
                <path d="M22 4L12 14.01l-3-3" stroke-width="2" stroke-linecap="round" />
              </svg>
              训练目标
            </h3>
            <div class="guide-text" v-html="benefits"></div>
          </section>

          <!-- 提示技巧 -->
          <section v-if="tips" class="guide-section">
            <h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke-width="2" />
              </svg>
              提示技巧
            </h3>
            <div class="guide-text" v-html="tips"></div>
          </section>
        </div>

        <!-- 底部按钮 -->
        <div class="guide-footer">
          <button class="understand-button" @click="$emit('close')">
            我知道了
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    required: true
  },
  howToPlay: {
    type: String,
    default: ''
  },
  benefits: {
    type: String,
    default: ''
  },
  tips: {
    type: String,
    default: ''
  }
})

defineEmits(['close'])
</script>

<style lang="scss" scoped>
.guide-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  @include flex-center;
  z-index: 2000;
  padding: 24px;

  @include mobile {
    padding: 16px;
  }
}

.guide-modal {
  position: relative;
  width: 100%;
  max-width: 500px;
  max-height: 85vh;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 15px rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @include mobile {
    max-width: 90vw;
    max-height: 80vh;
  }
}

.close-button {
  @include button-reset;
  @include click-feedback;
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.6);
  color: white;
  @include flex-center;
  z-index: 1;
  transition: all 0.3s;

  &:hover {
    background: white;
    color: #622A88;
    transform: rotate(90deg);
  }

  @include mobile {
    width: 32px;
    height: 32px;
    top: 12px;
    right: 12px;
  }
}

.guide-header {
  padding: 32px 32px 24px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  flex-shrink: 0;

  @include mobile {
    padding: 24px 24px 20px;
  }

  .guide-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 16px;
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.6);
    @include flex-center;
    color: white;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);

    @include mobile {
      width: 56px;
      height: 56px;
      margin-bottom: 12px;
    }
  }

  h2 {
    font-size: 28px;
    font-weight: 700;
    margin: 0;
    color: white;

    @include mobile {
      font-size: 24px;
    }
  }
}

.guide-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }

  @include mobile {
    padding: 20px;
  }
}

.guide-section {
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }

  h3 {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 20px;
    font-weight: 700;
    color: white;
    margin: 0 0 16px;

    @include mobile {
      font-size: 18px;
      gap: 8px;
      margin-bottom: 12px;
    }

    svg {
      flex-shrink: 0;
    }
  }

  .guide-text {
    font-size: 16px;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.8);

    @include mobile {
      font-size: 14px;
      line-height: 1.5;
    }

    :deep(p) {
      margin: 0 0 12px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    :deep(ul), :deep(ol) {
      margin: 12px 0;
      padding-left: 24px;

      @include mobile {
        padding-left: 20px;
      }
    }

    :deep(li) {
      margin-bottom: 8px;
      
      &:last-child {
        margin-bottom: 0;
      }
    }

    :deep(strong) {
      color: #FF8459;
      font-weight: 700;
    }

    :deep(em) {
      color: #B12F80;
      font-style: normal;
    }
  }
}

.guide-footer {
  padding: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  flex-shrink: 0;

  @include mobile {
    padding: 20px;
  }

  .understand-button {
    @include button-reset;
    @include click-feedback;
    width: 100%;
    padding: 16px;
    border-radius: 9999px;
    background: white;
    color: #622A88;
    font-size: 18px;
    font-weight: 700;
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
    border: 1px solid white;
    transition: all 0.3s;

    @include mobile {
      padding: 14px;
      font-size: 16px;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
    }

    &:active {
      transform: scale(0.95);
      box-shadow: none;
    }
  }
}

// 过渡动画
.guide-modal-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.guide-modal-leave-active {
  transition: all 0.2s ease-in;
}

.guide-modal-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.guide-modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
