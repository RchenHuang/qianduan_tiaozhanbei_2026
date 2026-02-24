<template>
  <div id="app">
    <!-- Background gradient overlay -->
    <div class="gradient-bg"></div>
    
    <el-container class="main-container">
      <!-- 头部 -->
      <el-header class="header">
        <div class="header-content">
          <h1><el-icon><Monitor /></el-icon> 老年人健康监测系统</h1>
          <div class="user-info">
            <el-tag type="success">在线监测</el-tag>
          </div>
        </div>
      </el-header>

      <!-- 主体内容 -->
      <el-main class="main-content">
        <div class="dashboard">
          <!-- 概览卡片 -->
          <div class="overview-cards">
            <el-card class="card heartbeat-card glass-panel">
              <template #header>
                <div class="card-header">
                  <span>心率监测</span>
                  <el-icon><Heart /></el-icon>
                </div>
              </template>
              <div class="card-content">
                <div class="current-value">{{ healthData.heartbeat.current }} bpm</div>
                <div class="status" :class="getHeartRateStatus(healthData.heartbeat.current)">
                  {{ getHeartRateStatusText(healthData.heartbeat.current) }}
                </div>
              </div>
            </el-card>

            <el-card class="card blood-pressure-card glass-panel">
              <template #header>
                <div class="card-header">
                  <span>血压监测</span>
                  <el-icon><TrendCharts /></el-icon>
                </div>
              </template>
              <div class="card-content">
                <div class="bp-values">
                  <div class="bp-item">
                    <span class="label">收缩压</span>
                    <span class="value">{{ healthData.bloodPressure.systolic }} mmHg</span>
                  </div>
                  <div class="bp-item">
                    <span class="label">舒张压</span>
                    <span class="value">{{ healthData.bloodPressure.diastolic }} mmHg</span>
                  </div>
                </div>
                <div class="status" :class="getBloodPressureStatus(healthData.bloodPressure)">
                  {{ getBloodPressureStatusText(healthData.bloodPressure) }}
                </div>
              </div>
            </el-card>

            <el-card class="card glucose-card glass-panel">
              <template #header>
                <div class="card-header">
                  <span>血糖监测</span>
                  <el-icon><Sugar /></el-icon>
                </div>
              </template>
              <div class="card-content">
                <div class="current-value">{{ healthData.glucose.current }} mmol/L</div>
                <div class="status" :class="getGlucoseStatus(healthData.glucose.current)">
                  {{ getGlucoseStatusText(healthData.glucose.current) }}
                </div>
              </div>
            </el-card>
          </div>

          <!-- 图表区域 -->
          <div class="charts-container">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-card class="chart-card glass-panel">
                  <template #header>
                    <div class="card-header">
                      <span>心率趋势图</span>
                      <el-select 
                        v-model="selectedTimeRange" 
                        @change="handleTimeRangeChange"
                        size="small"
                        style="width: 120px;"
                      >
                        <el-option
                          v-for="option in timeRangeOptions"
                          :key="option.value"
                          :label="option.label"
                          :value="option.value"
                        />
                      </el-select>
                    </div>
                  </template>
                  <v-chart class="chart" :option="heartbeatChartOption" />
                </el-card>
              </el-col>
              <el-col :span="12">
                <el-card class="chart-card glass-panel">
                  <template #header>
                    <div class="card-header">
                      <span>血压变化图</span>
                      <el-select 
                        v-model="selectedBpTimeRange" 
                        @change="handleBpTimeRangeChange"
                        size="small"
                        style="width: 120px;"
                      >
                        <el-option
                          v-for="option in timeRangeOptions"
                          :key="option.value"
                          :label="option.label"
                          :value="option.value"
                        />
                      </el-select>
                    </div>
                  </template>
                  <v-chart class="chart" :option="bloodPressureChartOption" />
                </el-card>
              </el-col>
            </el-row>

            <el-row :gutter="20" style="margin-top: 20px;">
              <el-col :span="12">
                <el-card class="chart-card glass-panel">
                  <template #header>
                    <div class="card-header">
                      <span>血糖趋势图</span>
                      <el-select 
                        v-model="selectedGlucoseTimeRange" 
                        @change="handleGlucoseTimeRangeChange"
                        size="small"
                        style="width: 120px;"
                      >
                        <el-option
                          v-for="option in timeRangeOptions"
                          :key="option.value"
                          :label="option.label"
                          :value="option.value"
                        />
                      </el-select>
                    </div>
                  </template>
                  <v-chart class="chart" :option="glucoseChartOption" />
                </el-card>
              </el-col>
              <el-col :span="12">
                <el-card class="chart-card glass-panel">
                  <template #header>
                    <div class="card-header">
                      <span>综合健康评分</span>
                    </div>
                  </template>
                  <v-chart class="chart" :option="healthScoreChartOption" />
                </el-card>
              </el-col>
            </el-row>
            
            <!-- 新增情绪监控卡片 -->
            <el-row :gutter="20" style="margin-top: 20px;">
              <el-col :span="24">
                <el-card class="chart-card glass-panel emotion-card">
                  <template #header>
                    <div class="card-header">
                      <span>情绪监控</span>
                      <el-select 
                        v-model="selectedEmotionTimeRange" 
                        @change="handleEmotionTimeRangeChange"
                        size="small"
                        style="width: 120px;"
                      >
                        <el-option
                          v-for="option in timeRangeOptions"
                          :key="option.value"
                          :label="option.label"
                          :value="option.value"
                        />
                      </el-select>
                    </div>
                  </template>
                  <div class="emotion-content">
                    <div class="emotion-left">
                      <v-chart class="chart" :option="emotionChartOption" />
                    </div>
                    <div class="emotion-right">
                      <div class="current-emotion">
                        <h3>当前情绪</h3>
                        <div class="emotion-item">
                          <img :src="getCurrentEmotionIcon()" alt="Current Emotion" class="emotion-icon" />
                          <div class="emotion-info">
                            <div class="emotion-name">{{ currentEmotion.name }}</div>
                            <div class="emotion-strength">{{ currentEmotion.strength }}%</div>
                          </div>
                        </div>
                      </div>
                      <div class="negative-emotion">
                        <h3>最近负面情绪</h3>
                        <div class="emotion-item">
                          <img :src="getLastNegativeEmotionIcon()" alt="Last Negative Emotion" class="emotion-icon" />
                          <div class="emotion-info">
                            <div class="emotion-name">{{ lastNegativeEmotion.name }}</div>
                            <div class="emotion-time">{{ lastNegativeEmotion.time }}</div>
                            <div class="emotion-strength">{{ lastNegativeEmotion.strength }}%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, PieChart, BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { Monitor, TrendCharts, Sugar } from '@element-plus/icons-vue'

use([
  CanvasRenderer,
  LineChart,
  PieChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

// 情绪数据初始化
const emotionData = ref({
  history: [],
  emotions: [
    { name: 'happy', displayName: '开心', icon: '/res/happy.svg' },
    { name: 'calm', displayName: '平静', icon: '/res/calm.svg' },
    { name: 'excited', displayName: '兴奋', icon: '/res/excited.svg' },
    { name: 'focused', displayName: '专注', icon: '/res/focused.svg' },
    { name: 'sad', displayName: '悲伤', icon: '/res/sad.svg' },
    { name: 'angry', displayName: '愤怒', icon: '/res/angry.svg' },
    { name: 'anxious', displayName: '焦虑', icon: '/res/anxious.svg' },
    { name: 'afraid', displayName: '恐惧', icon: '/res/afraid.svg' }
  ]
});

// 当前情绪
const currentEmotion = ref({
  name: '平静',
  strength: 70
});

// 最近负面情绪
const lastNegativeEmotion = ref({
  name: '焦虑',
  time: '2026-02-20 14:30',
  strength: 65
});

// 初始化情绪历史数据
const initializeEmotionData = () => {
  const now = new Date();
  const times = [];
  const emotionValues = {};
  
  // 创建过去24个时间点的数据
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60000 * 30); // 每30分钟一个点
    times.push(`${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`);
  }
  
  // 为每种情绪生成历史数据
  emotionData.value.emotions.forEach(emotion => {
    emotionValues[emotion.name] = [];
    for (let i = 0; i < 24; i++) {
      // 生成0-100之间的随机值，但对负面情绪稍微降低权重
      let value;
      if (['sad', 'angry', 'anxious', 'afraid'].includes(emotion.name)) {
        value = Math.floor(Math.random() * 40); // 负面情绪最大值为40
      } else {
        value = Math.floor(Math.random() * 70) + 20; // 正面情绪范围在20-90之间
      }
      emotionValues[emotion.name].push(value);
    }
  });
  
  return {
    times: times,
    values: emotionValues
  };
};

// 模拟情绪数据
const emotionHistory = initializeEmotionData();

// 模拟健康数据
const healthData = ref({
  heartbeat: {
    current: 72,
    history: [
      { time: '08:00', value: 68 },
      { time: '10:00', value: 72 },
      { time: '12:00', value: 75 },
      { time: '14:00', value: 70 },
      { time: '16:00', value: 73 },
      { time: '18:00', value: 71 },
      { time: '20:00', value: 69 }
    ]
  },
  bloodPressure: {
    systolic: 125,
    diastolic: 80,
    history: [
      { time: '08:00', systolic: 120, diastolic: 78 },
      { time: '10:00', systolic: 125, diastolic: 80 },
      { time: '12:00', systolic: 128, diastolic: 82 },
      { time: '14:00', systolic: 123, diastolic: 79 },
      { time: '16:00', systolic: 126, diastolic: 81 },
      { time: '18:00', systolic: 124, diastolic: 80 },
      { time: '20:00', systolic: 122, diastolic: 78 }
    ]
  },
  glucose: {
    current: 5.2,
    history: [
      { time: '08:00', value: 5.1 },
      { time: '10:00', value: 5.3 },
      { time: '12:00', value: 5.8 },
      { time: '14:00', value: 5.4 },
      { time: '16:00', value: 5.2 },
      { time: '18:00', value: 5.0 },
      { time: '20:00', value: 4.9 }
    ]
  }
})

// 心率状态判断
const getHeartRateStatus = (rate) => {
  if (rate < 60) return 'danger'
  if (rate > 100) return 'warning'
  return 'success'
}

const getHeartRateStatusText = (rate) => {
  if (rate < 60) return '偏低'
  if (rate > 100) return '偏高'
  return '正常'
}

// 血压状态判断
const getBloodPressureStatus = (bp) => {
  if (bp.systolic > 140 || bp.diastolic > 90) return 'warning'
  if (bp.systolic < 90 || bp.diastolic < 60) return 'danger'
  return 'success'
}

const getBloodPressureStatusText = (bp) => {
  if (bp.systolic > 140 || bp.diastolic > 90) return '高血压'
  if (bp.systolic < 90 || bp.diastolic < 60) return '低血压'
  return '正常'
}

// 血糖状态判断
const getGlucoseStatus = (glucose) => {
  if (glucose > 7.0) return 'warning'
  if (glucose < 3.9) return 'danger'
  return 'success'
}

const getGlucoseStatusText = (glucose) => {
  if (glucose > 7.0) return '偏高'
  if (glucose < 3.9) return '偏低'
  return '正常'
}

// 获取当前情绪图标
const getCurrentEmotionIcon = () => {
  const emotion = emotionData.value.emotions.find(e => e.displayName === currentEmotion.value.name);
  return emotion ? emotion.icon : '/res/calm.svg';
};

// 获取最近负面情绪图标
const getLastNegativeEmotionIcon = () => {
  const emotion = emotionData.value.emotions.find(e => e.displayName === lastNegativeEmotion.value.name);
  return emotion ? emotion.icon : '/res/anxious.svg';
};

// 计算健康评分的函数
const calculateHealthScores = () => {
  // 心率评分 (60-100为正常范围)
  const heartRate = healthData.value.heartbeat.current;
  let heartRateScore = 0;
  if (heartRate >= 60 && heartRate <= 100) {
    heartRateScore = 100; // 完美分数
  } else if (heartRate < 60) {
    heartRateScore = Math.max(0, 100 - (60 - heartRate) * 2); // 偏低扣分
  } else {
    heartRateScore = Math.max(0, 100 - (heartRate - 100) * 2); // 偏高扣分
  }

  // 血压评分 (收缩压90-140，舒张压60-90为正常范围)
  const systolic = healthData.value.bloodPressure.systolic;
  const diastolic = healthData.value.bloodPressure.diastolic;
  let bloodPressureScore = 0;
  
  // 收缩压评分
  let systolicScore = 0;
  if (systolic >= 90 && systolic <= 140) {
    systolicScore = 100;
  } else if (systolic < 90) {
    systolicScore = Math.max(0, 100 - (90 - systolic) * 2);
  } else {
    systolicScore = Math.max(0, 100 - (systolic - 140) * 1.5);
  }
  
  // 舒张压评分
  let diastolicScore = 0;
  if (diastolic >= 60 && diastolic <= 90) {
    diastolicScore = 100;
  } else if (diastolic < 60) {
    diastolicScore = Math.max(0, 100 - (60 - diastolic) * 2);
  } else {
    diastolicScore = Math.max(0, 100 - (diastolic - 90) * 2);
  }
  
  // 综合血压评分
  bloodPressureScore = Math.round((systolicScore + diastolicScore) / 2);

  // 血糖评分 (3.9-7.0为正常范围)
  const glucose = healthData.value.glucose.current;
  let glucoseScore = 0;
  if (glucose >= 3.9 && glucose <= 7.0) {
    glucoseScore = 100; // 完美分数
  } else if (glucose < 3.9) {
    glucoseScore = Math.max(0, 100 - (3.9 - glucose) * 15); // 偏低扣分
  } else {
    glucoseScore = Math.max(0, 100 - (glucose - 7.0) * 12); // 偏高扣分
  }

  return {
    heartRateScore: Math.round(heartRateScore),
    bloodPressureScore: Math.round(bloodPressureScore),
    glucoseScore: Math.round(glucoseScore)
  };
};

// 时间范围选择相关
const timeRangeOptions = [
  { label: '1分钟', value: '1min', points: 60 },
  { label: '10分钟', value: '10min', points: 60 },
  { label: '1小时', value: '1hour', points: 60 },
  { label: '1天', value: '1day', points: 24 }
]

const selectedTimeRange = ref('1hour') // 心率时间范围
const selectedBpTimeRange = ref('1hour') // 血压时间范围
const selectedGlucoseTimeRange = ref('1hour') // 血糖时间范围
const selectedEmotionTimeRange = ref('1hour') // 情绪时间范围

// 生成指定时间范围内的模拟数据
const generateHeartbeatData = (timeRange) => {
  const option = timeRangeOptions.find(opt => opt.value === timeRange)
  const points = option.points
  const data = []
  
  // 获取当前时间
  const now = new Date()
  
  for (let i = points - 1; i >= 0; i--) {
    let timePoint
    let value
    
    switch(timeRange) {
      case '1min':
        // 每秒一个数据点
        timePoint = new Date(now.getTime() - i * 1000)
        value = Math.floor(Math.random() * 15) + 65 // 65-80 bpm
        break
      case '10min':
        // 每10秒一个数据点
        timePoint = new Date(now.getTime() - i * 10000)
        value = Math.floor(Math.random() * 20) + 60 // 60-80 bpm
        break
      case '1hour':
        // 每分钟一个数据点
        timePoint = new Date(now.getTime() - i * 60000)
        value = Math.floor(Math.random() * 25) + 60 // 60-85 bpm
        break
      case '1day':
        // 每小时一个数据点
        timePoint = new Date(now.getTime() - i * 3600000)
        value = Math.floor(Math.random() * 30) + 55 // 55-85 bpm
        break
      default:
        timePoint = new Date(now.getTime() - i * 60000)
        value = Math.floor(Math.random() * 25) + 60
    }
    
    // 格式化时间显示
    let timeString
    if (timeRange === '1min' || timeRange === '10min') {
      timeString = `${timePoint.getMinutes().toString().padStart(2, '0')}:${timePoint.getSeconds().toString().padStart(2, '0')}`
    } else if (timeRange === '1hour') {
      timeString = `${timePoint.getHours().toString().padStart(2, '0')}:${timePoint.getMinutes().toString().padStart(2, '0')}`
    } else {
      timeString = `${timePoint.getMonth() + 1}/${timePoint.getDate()} ${timePoint.getHours().toString().padStart(2, '0')}:00`
    }
    
    data.push({
      time: timeString,
      value: value,
      timestamp: timePoint.getTime()
    })
  }
  
  return data
}

// 生成血压数据
const generateBloodPressureData = (timeRange) => {
  const option = timeRangeOptions.find(opt => opt.value === timeRange)
  const points = option.points
  const data = []
  
  const now = new Date()
  
  for (let i = points - 1; i >= 0; i--) {
    let timePoint
    let systolic, diastolic
    
    switch(timeRange) {
      case '1min':
        timePoint = new Date(now.getTime() - i * 1000)
        systolic = Math.floor(Math.random() * 15) + 115
        diastolic = Math.floor(Math.random() * 10) + 75
        break
      case '10min':
        timePoint = new Date(now.getTime() - i * 10000)
        systolic = Math.floor(Math.random() * 20) + 110
        diastolic = Math.floor(Math.random() * 15) + 70
        break
      case '1hour':
        timePoint = new Date(now.getTime() - i * 60000)
        systolic = Math.floor(Math.random() * 25) + 110
        diastolic = Math.floor(Math.random() * 20) + 65
        break
      case '1day':
        timePoint = new Date(now.getTime() - i * 3600000)
        systolic = Math.floor(Math.random() * 30) + 105
        diastolic = Math.floor(Math.random() * 25) + 60
        break
      default:
        timePoint = new Date(now.getTime() - i * 60000)
        systolic = Math.floor(Math.random() * 25) + 110
        diastolic = Math.floor(Math.random() * 20) + 65
    }
    
    let timeString
    if (timeRange === '1min' || timeRange === '10min') {
      timeString = `${timePoint.getMinutes().toString().padStart(2, '0')}:${timePoint.getSeconds().toString().padStart(2, '0')}`
    } else if (timeRange === '1hour') {
      timeString = `${timePoint.getHours().toString().padStart(2, '0')}:${timePoint.getMinutes().toString().padStart(2, '0')}`
    } else {
      timeString = `${timePoint.getMonth() + 1}/${timePoint.getDate()} ${timePoint.getHours().toString().padStart(2, '0')}:00`
    }
    
    data.push({
      time: timeString,
      systolic: systolic,
      diastolic: diastolic,
      timestamp: timePoint.getTime()
    })
  }
  
  return data
}

// 生成血糖数据
const generateGlucoseData = (timeRange) => {
  const option = timeRangeOptions.find(opt => opt.value === timeRange)
  const points = option.points
  const data = []
  
  const now = new Date()
  
  for (let i = points - 1; i >= 0; i--) {
    let timePoint
    let value
    
    switch(timeRange) {
      case '1min':
        timePoint = new Date(now.getTime() - i * 1000)
        value = (Math.random() * 1 + 4.5).toFixed(1)
        break
      case '10min':
        timePoint = new Date(now.getTime() - i * 10000)
        value = (Math.random() * 1.5 + 4.0).toFixed(1)
        break
      case '1hour':
        timePoint = new Date(now.getTime() - i * 60000)
        value = (Math.random() * 2 + 3.5).toFixed(1)
        break
      case '1day':
        timePoint = new Date(now.getTime() - i * 3600000)
        value = (Math.random() * 2.5 + 3.0).toFixed(1)
        break
      default:
        timePoint = new Date(now.getTime() - i * 60000)
        value = (Math.random() * 2 + 3.5).toFixed(1)
    }
    
    let timeString
    if (timeRange === '1min' || timeRange === '10min') {
      timeString = `${timePoint.getMinutes().toString().padStart(2, '0')}:${timePoint.getSeconds().toString().padStart(2, '0')}`
    } else if (timeRange === '1hour') {
      timeString = `${timePoint.getHours().toString().padStart(2, '0')}:${timePoint.getMinutes().toString().padStart(2, '0')}`
    } else {
      timeString = `${timePoint.getMonth() + 1}/${timePoint.getDate()} ${timePoint.getHours().toString().padStart(2, '0')}:00`
    }
    
    data.push({
      time: timeString,
      value: parseFloat(value),
      timestamp: timePoint.getTime()
    })
  }
  
  return data
}

// 更新心率图表数据
const updateHeartbeatChartData = (timeRange) => {
  const newData = generateHeartbeatData(timeRange)
  healthData.value.heartbeat.history = newData
  
  // 更新图表配置
  heartbeatChartOption.value.xAxis.data = newData.map(item => item.time)
  heartbeatChartOption.value.series[0].data = newData.map(item => item.value)
}

// 更新血压图表数据
const updateBloodPressureChartData = (timeRange) => {
  const newData = generateBloodPressureData(timeRange)
  healthData.value.bloodPressure.history = newData
  
  // 更新图表配置
  bloodPressureChartOption.value.xAxis.data = newData.map(item => item.time)
  bloodPressureChartOption.value.series[0].data = newData.map(item => item.systolic)
  bloodPressureChartOption.value.series[1].data = newData.map(item => item.diastolic)
}

// 更新血糖图表数据
const updateGlucoseChartData = (timeRange) => {
  const newData = generateGlucoseData(timeRange)
  healthData.value.glucose.history = newData
  
  // 更新图表配置
  glucoseChartOption.value.xAxis.data = newData.map(item => item.time)
  glucoseChartOption.value.series[0].data = newData.map(item => item.value)
}

// 时间范围改变时的处理函数
const handleTimeRangeChange = (newRange) => {
  selectedTimeRange.value = newRange
  updateHeartbeatChartData(newRange)
}

const handleBpTimeRangeChange = (newRange) => {
  selectedBpTimeRange.value = newRange
  updateBloodPressureChartData(newRange)
}

const handleGlucoseTimeRangeChange = (newRange) => {
  selectedGlucoseTimeRange.value = newRange
  updateGlucoseChartData(newRange)
}

// 情绪时间范围改变处理函数
const handleEmotionTimeRangeChange = (newRange) => {
  selectedEmotionTimeRange.value = newRange
  updateEmotionChartDataByRange(newRange)
}

// 更新情绪图表数据按时间范围
const updateEmotionChartDataByRange = (timeRange) => {
  const option = timeRangeOptions.find(opt => opt.value === timeRange)
  const points = option.points
  const times = []
  const emotionValues = {}
  
  const now = new Date()
  
  for (let i = points - 1; i >= 0; i--) {
    let timePoint
    let timeString
    
    switch(timeRange) {
      case '1min':
        timePoint = new Date(now.getTime() - i * 1000)
        timeString = `${timePoint.getMinutes().toString().padStart(2, '0')}:${timePoint.getSeconds().toString().padStart(2, '0')}`
        break
      case '10min':
        timePoint = new Date(now.getTime() - i * 10000)
        timeString = `${timePoint.getMinutes().toString().padStart(2, '0')}:${timePoint.getSeconds().toString().padStart(2, '0')}`
        break
      case '1hour':
        timePoint = new Date(now.getTime() - i * 60000)
        timeString = `${timePoint.getHours().toString().padStart(2, '0')}:${timePoint.getMinutes().toString().padStart(2, '0')}`
        break
      case '1day':
        timePoint = new Date(now.getTime() - i * 3600000)
        timeString = `${timePoint.getMonth() + 1}/${timePoint.getDate()} ${timePoint.getHours().toString().padStart(2, '0')}:00`
        break
      default:
        timePoint = new Date(now.getTime() - i * 60000)
        timeString = `${timePoint.getHours().toString().padStart(2, '0')}:${timePoint.getMinutes().toString().padStart(2, '0')}`
    }
    
    times.push(timeString)
    
    // 为每种情绪生成初始数据
    emotionData.value.emotions.forEach(emotion => {
      if (!emotionValues[emotion.name]) {
        emotionValues[emotion.name] = []
      }
      
      let value
      if (['sad', 'angry', 'anxious', 'afraid'].includes(emotion.name)) {
        value = Math.floor(Math.random() * 40) // 负面情绪最大值为40
      } else {
        value = Math.floor(Math.random() * 70) + 20 // 正面情绪范围在20-90之间
      }
      
      emotionValues[emotion.name].push(value)
    })
  }
  
  // 更新图表数据
  emotionChartOption.value.xAxis.data = times
  
  emotionData.value.emotions.forEach((emotion, idx) => {
    emotionChartOption.value.series[idx].data = emotionValues[emotion.name]
  })
}

// 心率图表配置
const heartbeatChartOption = ref({
  tooltip: {
    trigger: 'axis',
    textStyle: {
      color: '#000000'
    },
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    padding: [8, 12],
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowBlur: 10
  },
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  xAxis: {
    type: 'category',
    data: healthData.value.heartbeat.history.map(item => item.time),
    axisLabel: {
      color: '#ffffff',
      fontSize: 12
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.3)'
      }
    },
    axisTick: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.3)'
      }
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.1)'
      }
    }
  },
  yAxis: {
    type: 'value',
    name: 'bpm',
    axisLabel: {
      color: '#ffffff',
      fontSize: 12
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.3)'
      }
    },
    axisTick: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.3)'
      }
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.1)'
      }
    }
  },
  series: [{
    data: healthData.value.heartbeat.history.map(item => item.value),
    type: 'line',
    smooth: true,
    itemStyle: { color: '#409EFF' },
    areaStyle: { opacity: 0.3 },
    lineStyle: {
      color: '#409EFF'
    }
  }]
})

// 血压图表配置
const bloodPressureChartOption = ref({
  tooltip: {
    trigger: 'axis',
    textStyle: {
      color: '#000000'
    },
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    padding: [8, 12],
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowBlur: 10
  },
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  legend: {
    data: ['收缩压', '舒张压'],
    textStyle: {
      color: '#ffffff',
      fontSize: 12
    },
    itemWidth: 12,
    itemHeight: 12,
    padding: [8, 0, 8, 0]
  },
  xAxis: {
    type: 'category',
    data: healthData.value.bloodPressure.history.map(item => item.time),
    axisLabel: {
      color: '#ffffff',
      fontSize: 12
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.3)'
      }
    },
    axisTick: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.3)'
      }
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.1)'
      }
    }
  },
  yAxis: {
    type: 'value',
    name: 'mmHg',
    axisLabel: {
      color: '#ffffff',
      fontSize: 12
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.3)'
      }
    },
    axisTick: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.3)'
      }
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.1)'
      }
    }
  },
  series: [
    {
      name: '收缩压',
      data: healthData.value.bloodPressure.history.map(item => item.systolic),
      type: 'line',
      smooth: true,
      itemStyle: { color: '#F56C6C' },
      lineStyle: {
        color: '#F56C6C'
      }
    },
    {
      name: '舒张压',
      data: healthData.value.bloodPressure.history.map(item => item.diastolic),
      type: 'line',
      smooth: true,
      itemStyle: { color: '#E6A23C' },
      lineStyle: {
        color: '#E6A23C'
      }
    }
  ]
})

// 血糖图表配置
const glucoseChartOption = ref({
  tooltip: {
    trigger: 'axis',
    textStyle: {
      color: '#000000'
    },
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    padding: [8, 12],
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowBlur: 10
  },
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  xAxis: {
    type: 'category',
    data: healthData.value.glucose.history.map(item => item.time),
    axisLabel: {
      color: '#ffffff',
      fontSize: 12
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.3)'
      }
    },
    axisTick: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.3)'
      }
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.1)'
      }
    }
  },
  yAxis: {
    type: 'value',
    name: 'mmol/L',
    axisLabel: {
      color: '#ffffff',
      fontSize: 12
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.3)'
      }
    },
    axisTick: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.3)'
      }
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.1)'
      }
    }
  },
  series: [{
    data: healthData.value.glucose.history.map(item => item.value),
    type: 'line',
    smooth: true,
    itemStyle: { color: '#67C23A' },
    areaStyle: { opacity: 0.5 },
    lineStyle: {
      color: '#67C23A'
    }
  }]
})

// 情绪图表配置
const emotionChartOption = ref({
  tooltip: {
    trigger: 'axis',
    textStyle: {
      color: '#000000'
    },
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    padding: [8, 12],
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowBlur: 10
  },
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  legend: {
    data: emotionData.value.emotions.map(e => e.displayName),
    textStyle: {
      color: '#ffffff',
      fontSize: 12
    },
    itemWidth: 12,
    itemHeight: 12,
    padding: [8, 0, 8, 0]
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '10%',
    top: '15%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: emotionHistory.times,
    axisLabel: {
      color: '#ffffff',
      fontSize: 12
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.3)'
      }
    },
    axisTick: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.3)'
      }
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.1)'
      }
    }
  },
  yAxis: {
    type: 'value',
    name: '强度 %',
    axisLabel: {
      color: '#ffffff',
      fontSize: 12
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.3)'
      }
    },
    axisTick: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.3)'
      }
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.1)'
      }
    }
  },
  series: emotionData.value.emotions.map((emotion, idx) => ({
    name: emotion.displayName,
    type: 'line',
    smooth: true,
    lineStyle: {
      width: 2
    },
    emphasis: {
      disabled: idx > 4 // 对于前几个系列启用强调效果，其他的禁用
    },
    data: emotionHistory.values[emotion.name]
  }))
})

// 健康评分图表配置 - 改为横向进度条形式
const healthScoreChartOption = ref({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    textStyle: {
      color: '#000000'
    },
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    padding: [8, 12],
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowBlur: 10
  },
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  grid: {
    left: '15%',
    right: '15%',
    top: '10%',
    bottom: '15%'
  },
  xAxis: {
    type: 'value',
    min: 0,
    max: 100,
    axisLabel: {
      color: '#ffffff',
      fontSize: 12,
      formatter: '{value}分'
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.3)'
      }
    },
    axisTick: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.3)'
      }
    },
    splitLine: {
      show: false
    }
  },
  yAxis: {
    type: 'category',
    data: ['心率健康度', '血压健康度', '血糖健康度'],
    axisLabel: {
      color: '#ffffff',
      fontSize: 12
    },
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    }
  },
  series: [
    {
      name: '健康评分',
      type: 'bar',
      barWidth: '25',
      itemStyle: {
        borderRadius: [0, 10, 10, 0],
        color: function(params) {
          const colors = ['#409EFF', '#F56C6C', '#67C23A'];
          return colors[params.dataIndex];
        }
      },
      label: {
        show: true,
        position: 'right',
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
        formatter: '{c}分'
      },
      data: [85, 78, 92] // 初始数据，会被实时更新覆盖
    }
  ]
})

// 模拟实时数据更新
onMounted(() => {
  // 初始化所有图表数据
  updateHeartbeatChartData(selectedTimeRange.value)
  updateBloodPressureChartData(selectedBpTimeRange.value)
  updateGlucoseChartData(selectedGlucoseTimeRange.value)
  updateEmotionChartDataByRange(selectedEmotionTimeRange.value)
  
  setInterval(() => {
    // 更新心率数据
    const newHeartRate = Math.floor(Math.random() * 25) + 60
    healthData.value.heartbeat.current = newHeartRate
    
    // 更新血压数据
    const newSystolic = Math.floor(Math.random() * 20) + 115
    const newDiastolic = Math.floor(Math.random() * 15) + 75
    healthData.value.bloodPressure.systolic = newSystolic
    healthData.value.bloodPressure.diastolic = newDiastolic
    
    // 更新血糖数据
    const newGlucose = (Math.random() * 2 + 4.5).toFixed(1)
    healthData.value.glucose.current = parseFloat(newGlucose)
    
    // 计算新的健康评分
    const scores = calculateHealthScores();
    
    // 更新健康评分图表数据
    healthScoreChartOption.value.series[0].data = [
      scores.heartRateScore,
      scores.bloodPressureScore,
      scores.glucoseScore
    ];
    
    // 更新心率图表数据（实时添加新数据点）
    updateRealTimeChartData('heartbeat', newHeartRate)
    
    // 更新血压图表数据（实时添加新数据点）
    updateRealTimeChartData('bloodPressure', { systolic: newSystolic, diastolic: newDiastolic })
    
    // 更新血糖图表数据（实时添加新数据点）
    updateRealTimeChartData('glucose', parseFloat(newGlucose))
    
    // 更新情绪图表数据
    updateEmotionChartData()
    
    // 随机更新当前情绪
    updateCurrentEmotion()
    
  }, 5000)
})

// 更新情绪图表数据的函数
const updateEmotionChartData = () => {
  // 添加新的时间点（当前时间）
  const now = new Date();
  
  // 根据当前时间范围格式化时间字符串
  let timeString;
  switch(selectedEmotionTimeRange.value) {
    case '1min':
      timeString = `${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      break;
    case '10min':
      timeString = `${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      break;
    case '1hour':
      timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      break;
    case '1day':
      timeString = `${now.getMonth() + 1}/${now.getDate()} ${now.getHours().toString().padStart(2, '0')}:00`;
      break;
    default:
      timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  }
  
  // 在x轴上添加新时间点
  emotionChartOption.value.xAxis.data.push(timeString);
  
  // 为每种情绪添加新的强度值
  emotionData.value.emotions.forEach((emotion, idx) => {
    // 生成0-100之间的随机值，但对负面情绪稍微降低权重
    let value;
    if (['sad', 'angry', 'anxious', 'afraid'].includes(emotion.name)) {
      value = Math.floor(Math.random() * 40); // 负面情绪最大值为40
    } else {
      value = Math.floor(Math.random() * 70) + 20; // 正面情绪范围在20-90之间
    }
    
    // 将新值添加到对应情绪序列
    emotionChartOption.value.series[idx].data.push(value);
  });
  
  // 根据当前时间范围确定最大数据点数量
  const maxPoints = timeRangeOptions.find(opt => opt.value === selectedEmotionTimeRange.value).points;
  
  // 保持最多maxPoints个数据点，移除最旧的数据点
  if (emotionChartOption.value.xAxis.data.length > maxPoints) {
    emotionChartOption.value.xAxis.data.shift();
    emotionData.value.emotions.forEach((emotion, idx) => {
      if (emotionChartOption.value.series[idx].data.length > maxPoints) {
        emotionChartOption.value.series[idx].data.shift();
      }
    });
  }
}

// 随机更新当前情绪
const updateCurrentEmotion = () => {
  // 从情绪列表中随机选择一个正面情绪作为当前情绪
  const positiveEmotions = ['开心', '平静', '兴奋', '专注'];
  const negativeEmotions = ['悲伤', '愤怒', '焦虑', '恐惧'];
  
  // 有一定概率更新当前情绪
  if (Math.random() > 0.3) {
    const randomIdx = Math.floor(Math.random() * positiveEmotions.length);
    currentEmotion.value.name = positiveEmotions[randomIdx];
    currentEmotion.value.strength = Math.floor(Math.random() * 30) + 50; // 强度在50-80之间
  }
  
  // 如果有负面情绪出现，则更新最近负面情绪
  if (Math.random() > 0.7) {
    const randomNegIdx = Math.floor(Math.random() * negativeEmotions.length);
    lastNegativeEmotion.value.name = negativeEmotions[randomNegIdx];
    lastNegativeEmotion.value.strength = Math.floor(Math.random() * 40) + 30; // 强度在30-70之间
    
    // 更新时间
    const now = new Date();
    lastNegativeEmotion.value.time = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  }
}

// 实时更新图表数据的通用函数
const updateRealTimeChartData = (chartType, newValue) => {
  const currentTime = new Date()
  let timeString
  
  let selectedRange, option, historyData, seriesConfig
  
  switch(chartType) {
    case 'heartbeat':
      selectedRange = selectedTimeRange.value
      option = timeRangeOptions.find(opt => opt.value === selectedRange)
      historyData = healthData.value.heartbeat.history
      seriesConfig = heartbeatChartOption.value.series[0]
      break
    case 'bloodPressure':
      selectedRange = selectedBpTimeRange.value
      option = timeRangeOptions.find(opt => opt.value === selectedRange)
      historyData = healthData.value.bloodPressure.history
      seriesConfig = bloodPressureChartOption.value
      break
    case 'glucose':
      selectedRange = selectedGlucoseTimeRange.value
      option = timeRangeOptions.find(opt => opt.value === selectedRange)
      historyData = healthData.value.glucose.history
      seriesConfig = glucoseChartOption.value.series[0]
      break
  }
  
  switch(selectedRange) {
    case '1min':
      timeString = `${currentTime.getMinutes().toString().padStart(2, '0')}:${currentTime.getSeconds().toString().padStart(2, '0')}`
      break
    case '10min':
      timeString = `${currentTime.getMinutes().toString().padStart(2, '0')}:${currentTime.getSeconds().toString().padStart(2, '0')}`
      break
    case '1hour':
      timeString = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`
      break
    case '1day':
      timeString = `${currentTime.getMonth() + 1}/${currentTime.getDate()} ${currentTime.getHours().toString().padStart(2, '0')}:00`
      break
    default:
      timeString = currentTime.toLocaleTimeString().slice(0, 5)
  }
  
  // 添加新数据点
  let newPoint
  if (chartType === 'bloodPressure') {
    newPoint = {
      time: timeString,
      systolic: newValue.systolic,
      diastolic: newValue.diastolic
    }
  } else {
    newPoint = {
      time: timeString,
      value: newValue
    }
  }
  
  historyData.push(newPoint)
  
  // 保持数据点数量不超过当前时间范围的最大点数
  if (historyData.length > option.points) {
    historyData.shift()
  }
  
  // 更新图表
  switch(chartType) {
    case 'heartbeat':
      heartbeatChartOption.value.series[0].data = historyData.map(item => item.value)
      heartbeatChartOption.value.xAxis.data = historyData.map(item => item.time)
      break
    case 'bloodPressure':
      bloodPressureChartOption.value.series[0].data = historyData.map(item => item.systolic)
      bloodPressureChartOption.value.series[1].data = historyData.map(item => item.diastolic)
      bloodPressureChartOption.value.xAxis.data = historyData.map(item => item.time)
      break
    case 'glucose':
      glucoseChartOption.value.series[0].data = healthData.value.glucose.history.map(item => item.value)
      glucoseChartOption.value.xAxis.data = healthData.value.glucose.history.map(item => item.time)
      break
  }
}
</script>

<style scoped>
/* Gradient background overlay */
.gradient-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #2f0583ff 0%, #6b08c2ff 50%, #b33a3aff 100%);
  z-index: -1;
  filter: blur(0px);
}

/* Glass-morphism panel class */
.glass-panel {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.glass-panel:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.main-container {
  height: 100vh;
  position: relative;
}

.header {
  background: transparent;
  color: white;
  padding: 0 20px;
  box-shadow: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.header h1 {
  margin: 0;
  font-size: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.main-content {
  background: transparent;
  padding: 20px;
  backdrop-filter: blur(5px);
}

.dashboard {
  max-width: 1400px;
  margin: 0 auto;
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.card {
  border-radius: 20px;
  transition: all 0.3s ease;
  position: relative;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  border-radius: 20px 20px 0 0;
}

.heartbeat-card::before {
  background: linear-gradient(90deg, #409EFF, #667eea);
}

.blood-pressure-card::before {
  background: linear-gradient(90deg, #F56C6C, #FF6B6B);
}

.glucose-card::before {
  background: linear-gradient(90deg, #67C23A, #4CAF50);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 18px;
  padding: 16px 20px;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.card-content {
  text-align: center;
  padding: 20px;
}

.current-value {
  font-size: 36px;
  font-weight: 700;
  margin: 15px 0;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.bp-values {
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
}

.bp-item {
  text-align: center;
}

.bp-item .label {
  display: block;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8px;
  font-weight: 500;
}

.bp-item .value {
  display: block;
  font-size: 28px;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.status {
  padding: 8px 20px;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 600;
  display: inline-block;
  margin-top: 15px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.status.success {
  background: rgba(64, 158, 255, 0.2);
  color: #409EFF;
  border: 1px solid rgba(64, 158, 255, 0.3);
}

.status.warning {
  background: rgba(230, 162, 60, 0.2);
  color: #E6A23C;
  border: 1px solid rgba(230, 162, 60, 0.3);
}

.status.danger {
  background: rgba(245, 108, 108, 0.2);
  color: #F56C6C;
  border: 1px solid rgba(245, 108, 108, 0.3);
}

.charts-container {
  margin-top: 30px;
}

.chart-card {
  border-radius: 20px;
  margin-bottom: 20px;
}

.chart {
  height: 300px;
  width: 100%;
}

.emotion-content {
  display: flex;
  flex-wrap: wrap;
  height: 350px;
}

.emotion-left {
  flex: 1;
  min-width: 70%;
  padding-right: 20px;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
}

.emotion-right {
  flex: 1;
  min-width: 20%;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.emotion-item {
  display: flex;
  align-items: center;
  margin: 15px 0;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.emotion-icon {
  width: 40px;
  height: 40px;
  margin-right: 15px;
}

.emotion-info {
  flex: 1;
}

.emotion-name {
  font-size: 18px;
  font-weight: bold;
  color: white;
  margin-bottom: 5px;
}

.emotion-time {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin-bottom: 5px;
}

.emotion-strength {
  font-size: 16px;
  font-weight: bold;
  color: #409EFF;
  text-align: right;
}

.current-emotion h3,
.negative-emotion h3 {
  color: white;
  margin: 10px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}
</style>