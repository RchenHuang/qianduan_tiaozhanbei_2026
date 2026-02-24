<template>
  <div class="stroop-page">
    <header class="page-header">
      <button class="back-button" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>
      <h1 class="page-title">Stroop 训练</h1>
      <button v-if="!isTraining" class="help-button" @click="showGuide = true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" stroke-width="2" />
          <path d="M12 16v-4M12 8h.01" stroke-width="2" stroke-linecap="round" />
        </svg>
        <span>规则</span>
      </button>
      <div v-if="isTraining" class="score">{{ correctCount }}/{{ totalTrials }}</div>
    </header>

    <!-- 游戏说明弹窗 -->
    <GameGuide
      :visible="showGuide"
      title="Stroop 训练"
      :how-to-play="guideContent.howToPlay"
      :benefits="guideContent.benefits"
      :tips="guideContent.tips"
      @close="showGuide = false"
    />

    <main class="page-content">
      <div v-if="!isTraining && !showResult" class="config-screen">
        <div class="config-card">
          <h2>选择难度</h2>
          <div class="difficulty-buttons">
            <button
              :class="['difficulty-btn', { active: difficulty === 'basic' }]"
              @click="difficulty = 'basic'"
            >
              基础模式
              <span>字义与颜色一致</span>
            </button>
            <button
              :class="['difficulty-btn', { active: difficulty === 'advanced' }]"
              @click="difficulty = 'advanced'"
            >
              进阶模式
              <span>字义与颜色冲突</span>
            </button>
          </div>

          <h2 style="margin-top: 24px">选择模式</h2>
          <div class="difficulty-buttons">
            <button
              :class="['difficulty-btn', { active: timeMode === 'standard' }]"
              @click="timeMode = 'standard'"
            >
              标准模式
              <span>测试反应速度，无时间限制</span>
            </button>
            <button
              :class="['difficulty-btn', { active: timeMode === 'timed' }]"
              @click="timeMode = 'timed'"
            >
              限时模式
              <span>每个字{{ timeLimitSeconds }}秒，超时算错</span>
            </button>
          </div>

          <button class="start-button" @click="handleStartTraining">开始训练</button>
        </div>
      </div>

      <div v-else-if="isTraining" class="training-screen">
        <div v-if="timeMode === 'timed'" class="timer-bar">
          <div class="timer-fill" :style="{ width: `${timeRemaining}%` }"></div>
        </div>

        <Transition name="word-fade" mode="out-in">
          <div
            :key="currentTrial"
            class="word-display"
            :style="{ color: currentColor }"
            :class="{ disabled: isGameDisabled }"
          >
            {{ currentWord }}
          </div>
        </Transition>

        <Transition name="buttons-fade" mode="out-in">
          <div :key="currentTrial" class="color-buttons" :class="{ disabled: isGameDisabled }">
            <button
              v-for="color in shuffledColors"
              :key="color.name"
              class="color-button"
              :style="{ backgroundColor: color.value }"
              @click="selectColor(color.name)"
            >
              {{ color.label }}
            </button>
          </div>
        </Transition>

        <div class="progress">
          <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
        </div>
      </div>

      <!-- 结果弹窗 -->
      <GameResult
        :visible="showResult"
        :type="resultType"
        :title="resultTitle"
        :subtitle="resultSubtitle"
        :stats="resultStats"
        :show-retry="true"
        close-text="返回首页"
        @retry="handleRetry"
        @close="handleClose"
      />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { colors, defaultTrials, timeLimitSeconds } from '@/features/stroop/config/stroop.js'
import { useRouter } from 'vue-router'
import { useReactionTime } from '@/shared/composables/useReactionTime'
import GameGuide from '@/shared/components/GameGuide.vue'
import GameResult from '@/shared/components/GameResult.vue'

const router = useRouter()

// 游戏说明
const showGuide = ref(false)
const guideContent = {
  howToPlay: `
    <p>根据<strong>文字的颜色</strong>（而非文字内容）选择对应的颜色按钮。</p>
    <ul>
      <li><strong>基础模式</strong>：文字内容与颜色一致（如红色的"红"）</li>
      <li><strong>进阶模式</strong>：文字内容与颜色冲突（如蓝色的"红"）</li>
      <li><strong>标准模式</strong>：无时间限制，测试反应速度</li>
      <li><strong>限时模式</strong>：每个字3秒，超时算错</li>
    </ul>
  `,
  benefits: `
    <p>Stroop效应训练可以有效提升：</p>
    <ul>
      <li><strong>抗干扰能力</strong> - 抵抗无关信息的干扰</li>
      <li><strong>选择性注意</strong> - 专注于关键信息</li>
      <li><strong>认知灵活性</strong> - 快速切换思维模式</li>
      <li><strong>执行控制</strong> - 抑制自动化反应</li>
    </ul>
  `,
  tips: `
    <p>训练技巧：</p>
    <ul>
      <li>专注于<em>颜色</em>，忽略文字内容</li>
      <li>从基础模式开始适应</li>
      <li>进阶模式需要更强的抗干扰能力</li>
      <li>保持放松，不要过度紧张</li>
    </ul>
  `
}

// 游戏状态
const difficulty = ref('basic')
const timeMode = ref('standard') // 'standard' 或 'timed'
const gameState = ref('idle') // 'idle' | 'active' | 'completed'
const isTraining = ref(false)
const showResult = ref(false)
const currentWord = ref('')
const currentColor = ref('')
const currentAnswer = ref('')
const correctCount = ref(0)
const wrongCount = ref(0)
const totalTrials = ref(defaultTrials)
const currentTrial = ref(0)
const trialStartTime = ref(0) // 每个字的开始时间
const timeoutCount = ref(0) // 超时次数
const shuffledColors = ref([]) // 打乱后的颜色按钮顺序

// 使用反应时间 Hook
const reaction = useReactionTime()

// 限时模式相关
const timeRemaining = ref(100) // 剩余时间百分比
let timerInterval = null
let timeoutTimer = null
const progress = computed(() => (currentTrial.value / totalTrials.value) * 100)

// 结果统计
const accuracy = computed(() => correctCount.value / totalTrials.value)

const isGameDisabled = computed(() => false)

// 结果弹窗相关
const resultType = computed(() => 'success')

const resultTitle = computed(() => '训练完成')

const resultSubtitle = computed(() => {
  if (accuracy.value >= 0.9) {
    return '出色的表现！'
  } else if (accuracy.value >= 0.7) {
    return '继续努力！'
  }
  return '多加练习，你会做得更好！'
})

const resultStats = computed(() => {
  const totalTime = reaction.timestamps.value.length > 0
    ? reaction.timestamps.value[reaction.timestamps.value.length - 1] - reaction.timestamps.value[0]
    : 0
  
  const stats = [
    { label: '总用时', value: `${(totalTime / 1000).toFixed(1)}秒`, highlight: true },
    { label: '正确率', value: `${(accuracy.value * 100).toFixed(0)}%`, highlight: true },
    { label: '正确数', value: `${correctCount.value}/${totalTrials.value}`, highlight: false },
    { label: '错误数', value: `${wrongCount.value}`, highlight: false },
    { label: '平均反应', value: `${reaction.averageReactionTime.value}ms`, highlight: false }
  ]

  if (timeMode.value === 'standard') {
    stats.push(
      { label: '最快反应', value: `${reaction.fastestReaction.value}ms`, highlight: false },
      { label: '最慢反应', value: `${reaction.slowestReaction.value}ms`, highlight: false }
    )
  } else {
    stats.push(
      { label: '超时次数', value: `${timeoutCount.value}`, highlight: false }
    )
  }

  return stats
})

function handleStartTraining() {
  // 立即进入训练界面
  isTraining.value = true
  showResult.value = false
  correctCount.value = 0
  wrongCount.value = 0
  currentTrial.value = 0
  reaction.reset()
  timeoutCount.value = 0

  // 直接开始游戏
  startGame()
}

function startGame() {
  gameState.value = 'active'
  nextTrial()
}

function nextTrial() {
  if (currentTrial.value >= totalTrials.value) {
    endTraining()
    return
  }

  // 清除之前的计时器
  clearTimers()

  // 生成新的字和颜色
  const colorObj = colors[Math.floor(Math.random() * colors.length)]
  currentColor.value = colorObj.value
  currentAnswer.value = colorObj.name

  if (difficulty.value === 'basic') {
    currentWord.value = colorObj.label
  } else {
    const otherColors = colors.filter(c => c.name !== colorObj.name)
    const randomWord = otherColors[Math.floor(Math.random() * otherColors.length)]
    currentWord.value = randomWord.label
  }

  // 每次都重新打乱颜色按钮顺序
  shuffledColors.value = [...colors].sort(() => Math.random() - 0.5)

  currentTrial.value++
  trialStartTime.value = Date.now() // 记录这个字出现的时间

  // 限时模式：启动倒计时
  if (timeMode.value === 'timed') {
    startTimer()
  }
}

function startTimer() {
  timeRemaining.value = 100
  const startTime = Date.now()
  const duration = timeLimitSeconds * 1000

  // 更新进度条
  timerInterval = setInterval(() => {
    const elapsed = Date.now() - startTime
    timeRemaining.value = Math.max(0, 100 - (elapsed / duration) * 100)
  }, 50)

  // 超时处理
  timeoutTimer = setTimeout(() => {
    handleTimeout()
  }, duration)
}

function handleTimeout() {
  clearTimers()
  timeoutCount.value++
  // 超时不记录反应时间
  setTimeout(nextTrial, 300)
}

function clearTimers() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
  if (timeoutTimer) {
    clearTimeout(timeoutTimer)
    timeoutTimer = null
  }
}

function selectColor(colorName) {
  reaction.recordClick()

  if (colorName === currentAnswer.value) {
    correctCount.value++
  } else {
    wrongCount.value++
  }

  clearTimers()
  // 快速切换到下一题（配合快速动画）
  setTimeout(nextTrial, 350)
}

function endTraining() {
  isTraining.value = false
  showResult.value = true
  gameState.value = 'completed'
  clearTimers()

  const totalTime = reaction.timestamps.value.length > 0
    ? reaction.timestamps.value[reaction.timestamps.value.length - 1] - reaction.timestamps.value[0]
    : 0

  // 计算新的评分系统分数
  const score = calculateStroopScore()

  // 发送得分给父窗口（index.html）
  if (window.opener) {
    window.opener.postMessage({
      type: 'gameScore',
      gameId: 'stroop',
      score: Math.round(score),
      details: {
        timeMode: timeMode.value,
        totalQuestions: totalTrials.value,
        correctCount: correctCount.value,
        wrongCount: wrongCount.value,
        timeoutCount: timeoutCount.value,
        averageReactionTime: reaction.averageReactionTime.value,
        fastestReaction: reaction.fastestReaction.value,
        slowestReaction: reaction.slowestReaction.value,
        accuracy: accuracy.value,
        duration: totalTime
      }
    }, '*')
  }
}

function calculateStroopScore() {
  // 准确率分数 (70%)
  const accuracyScore = accuracy.value * 100

  // 速度分数 (20%) - 基于研究数据的标准反应时间
  const standardReactionTime = difficulty.value === 'basic' ? 800 : 1000 // ms (基于研究数据)
  const avgReactionTime = reaction.averageReactionTime.value || standardReactionTime
  const speedRatio = standardReactionTime / avgReactionTime
  const speedScore = Math.min(100, speedRatio * 100)

  // 抗干扰分数 (10%) - 基于一致性表现
  // 对于基础模式，抗干扰能力较高；进阶模式根据错误率计算
  let interferenceScore = 100
  if (difficulty.value === 'advanced') {
    const errorRate = wrongCount.value / totalTrials.value
    interferenceScore = Math.max(0, (1 - errorRate * 2) * 100) // 错误率影响抗干扰分数
  }

  // 最终分数
  const finalScore = accuracyScore * 0.7 + speedScore * 0.2 + interferenceScore * 0.1
  return Math.max(0, Math.min(100, finalScore))
}

function resetTraining() {
  showResult.value = false
  isTraining.value = false
  gameState.value = 'idle'
}

function handleRetry() {
  showResult.value = false
  resetTraining()
  handleStartTraining()
}

function handleClose() {
  showResult.value = false
  goBack()
}

function goBack() {
  clearTimers()
  window.close()
}

// 组件卸载时清理计时器
onUnmounted(() => {
  clearTimers()
})
</script>

<style lang="scss" scoped>
.stroop-page {
  min-height: 100vh;
  background-image: linear-gradient(135deg, #4c1d95 0%, #622A88 30%, #B12F80 60%, #FF8459 80%, #F9F871 100%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    position: fixed;
    top: -20%;
    left: -20%;
    width: 70%;
    height: 70%;
    border-radius: 50%;
    background-color: #2e1065;
    filter: blur(120px);
    opacity: 0.8;
    animation: float 10s infinite ease-in-out;
    z-index: -1;
  }

  &::after {
    content: '';
    position: fixed;
    bottom: -20%;
    right: -20%;
    width: 70%;
    height: 70%;
    border-radius: 50%;
    background-color: #FF8459;
    filter: blur(100px);
    opacity: 0.6;
    animation: float 15s infinite ease-in-out reverse;
    z-index: -1;
  }

  @keyframes float {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(30px, 20px); }
  }
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: fixed;
  top: env(safe-area-inset-top, 0px);
  left: 0;
  right: 0;
  z-index: 100;

  .back-button {
    @include button-reset;
    width: 40px;
    height: 40px;
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.6);
    color: white;
    @include flex-center;
    position: absolute;
    left: 24px;
    transition: all 0.3s;

    &:hover {
      background: white;
      color: #622A88;
      transform: scale(1.05);
    }
  }

  .page-title {
    font-size: 24px;
    font-weight: 600;
    margin: 0;
    text-align: center;
    color: white;
  }

  .help-button {
    @include button-reset;
    @include click-feedback;
    height: 40px;
    padding: 0 24px;
    border-radius: 9999px;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.6);
    color: white;
    display: flex;
    align-items: center;
    gap: 4px;
    position: absolute;
    right: 24px;
    transition: all 0.3s;
    font-size: 14px;
    font-weight: 500;

    &:hover {
      background: white;
      color: #622A88;
      border-color: white;
      transform: scale(1.05);
    }

    svg {
      flex-shrink: 0;
    }

    span {
      white-space: nowrap;
    }
  }

  .score {
    font-size: 24px;
    font-weight: 700;
    color: white;
    position: absolute;
    right: 24px;
  }
}

.page-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.config-screen {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: calc(16px + 60px) 24px 16px;
  overflow: hidden;
  min-height: 0;
}

.config-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 32px;
  max-width: 500px;
  width: 100%;
  max-height: 100%;
  overflow-y: auto;
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 15px rgba(255, 255, 255, 0.1);

  @include mobile {
    padding: 24px;
  }

  h2 {
    text-align: center;
    margin-bottom: 32px;
    font-size: 32px;
    font-weight: 700;
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    
    @include mobile {
      font-size: 24px;
      margin-bottom: 24px;
    }
  }
}

.difficulty-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;

  @include mobile {
    gap: 8px;
    margin-bottom: 24px;
  }

  .difficulty-btn {
    @include button-reset;
    padding: 16px;
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(255, 255, 255, 0.1);
    text-align: center;
    transition: all 0.3s;
    position: relative;
    font-size: 16px;
    color: white;
    font-weight: 700;

    @include mobile {
      padding: 12px;
      font-size: 14px;
    }

    span {
      display: block;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
      margin-top: 8px;

      @include mobile {
        font-size: 12px;
        margin-top: 4px;
      }
    }

    &:hover:not(.active) {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.3);
    }

    &.active {
      background: rgba(255, 255, 255, 0.9);
      border-color: rgba(255, 255, 255, 0.9);
      color: #622A88;
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
    }
  }
}

.start-button {
  @include button-reset;
  width: 100%;
  padding: 16px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.9);
  color: #622A88;
  font-size: 18px;
  font-weight: 700;
  transition: all 0.3s;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.9);

  @include mobile {
    padding: 12px;
    font-size: 16px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
  }

  &:active {
    transform: scale(0.95);
    box-shadow: none;
  }
}

.training-screen {
  flex: 1;
  width: 100%;
  max-width: 600px;
  text-align: center;
  padding: calc(24px + 60px) 24px 24px;
  overflow: hidden;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 0;
  gap: 16px;
}

.timer-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
  overflow: hidden;
  flex-shrink: 0;

  .timer-fill {
    height: 100%;
    background: linear-gradient(90deg, #ff3366, #ffaa00, #00ff88);
    transition: width 0.05s linear;
  }
}

.word-display {
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 700;
  flex: 1;
  @include flex-center;
  min-height: 0;
  transition:
    opacity 0.3s ease,
    filter 0.3s ease;
  color: white;

  &.disabled {
    opacity: 0.3;
    filter: blur(8px);
    pointer-events: none;
  }
}

.color-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  flex-shrink: 0;
  transition:
    opacity 0.3s ease,
    filter 0.3s ease;
  margin-bottom: 24px;

  @include mobile {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  &.disabled {
    opacity: 0.3;
    filter: blur(8px);
    pointer-events: none;
  }

  .color-button {
    @include button-reset;
    @include click-feedback;
    padding: clamp(24px, 4vh, 32px);
    border-radius: 9999px;
    font-size: clamp(18px, 3vw, 24px);
    font-weight: 700;
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    min-height: 60px;
    transition: all 0.15s ease;
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 2px solid rgba(255, 255, 255, 0.15);
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      inset 0 -1px 0 rgba(0, 0, 0, 0.2);
    
    @include mobile {
      min-height: 70px;
    }
  }
}

.progress {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
  overflow: hidden;
  flex-shrink: 0;

  .progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #ff3366, #ffaa00, #00ff88);
    transition: width 0.3s;
  }
}

// 文字显示过渡动画 - 快速流畅
.word-fade-enter-active {
  transition: all 0.15s ease-out;
}

.word-fade-leave-active {
  transition: all 0.12s ease-in;
}

.word-fade-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.word-fade-leave-to {
  opacity: 0;
  transform: scale(1.1);
}

// 按钮组过渡动画 - 快速流畅
.buttons-fade-enter-active {
  transition: all 0.15s ease-out;
}

.buttons-fade-leave-active {
  transition: all 0.12s ease-in;
}

.buttons-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.buttons-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
