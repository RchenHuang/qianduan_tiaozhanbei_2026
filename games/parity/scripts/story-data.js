var embeddedStoryData = [
  {
    "type": "instruction",
    "title": "游戏规则",
    "text": "<p style='font-size: 1.2rem; margin-bottom: 0.8rem; line-height: 1.6; color: rgba(255, 255, 255, 0.9);'>将 3×3 棋盘上的所有数字变成<strong>完全相同</strong>。</p><ul style='margin: 0.8rem 0; padding-left: 1.5rem; text-align: left; font-size: 1.2rem;'><li style='margin-bottom: 0.5rem; line-height: 1.6;'>方向键移动选择器</li><li style='margin-bottom: 0.5rem; line-height: 1.6;'>白色方块<strong>+1</strong>，黑色方块<strong>-1</strong></li><li style='margin-bottom: 0.5rem; line-height: 1.6;'>使所有数字相等过关</li></ul><h3 style='font-size: 1.3rem; font-weight: bold; color: white; margin: 1.5rem 0 0.8rem 0;'>训练目标</h3><ul style='margin: 0.8rem 0; padding-left: 1.5rem; text-align: left; font-size: 1.2rem;'><li style='margin-bottom: 0.5rem; line-height: 1.6;'><strong>逻辑推理</strong> - 分析数字变化</li><li style='margin-bottom: 0.5rem; line-height: 1.6;'><strong>策略思维</strong> - 规划最优路径</li><li style='margin-bottom: 0.5rem; line-height: 1.6;'><strong>空间认知</strong> - 理解棋盘关系</li></ul><h3 style='font-size: 1.3rem; font-weight: bold; color: white; margin: 1.5rem 0 0.8rem 0;'>提示技巧</h3><ul style='margin: 0.8rem 0; padding-left: 1.5rem; text-align: left; font-size: 1.2rem;'><li style='margin-bottom: 0.5rem; line-height: 1.6;'>观察<strong>最大最小值</strong></li><li style='margin-bottom: 0.5rem; line-height: 1.6;'>计算<strong>总差值</strong></li><li style='margin-bottom: 0.5rem; line-height: 1.6;'>利用<strong>增减特性</strong></li></ul>",
    "button": "开始训练"
  },
  {
    "type": "level",
    "number": 1,
    "mode": "vanilla",
    "contents": [ 1,0,0,1,1,0,1,1,0 ],
    "initialSelected": { "x":0, "y":0 }
  },
  {
    "type": "level",
    "number": 2,
    "mode": "vanilla",
    "contents": [ 1,0,1,0,0,0,0,0,0 ],
    "initialSelected": { "x":0, "y":0 }
  },
  {
    "type": "level",
    "number": 3,
    "mode": "vanilla",
    "contents": [ 1,2,2,2,3,2,3,2,2 ],
    "initialSelected": { "x":0, "y":2 }
  },
  {
    "type": "level",
    "number": 4,
    "mode": "vanilla",
    "contents": [ 3,4,3,1,3,2,1,1,2 ],
    "initialSelected": { "x":0, "y":0 }
  },
  {
    "type": "level",
    "number": 5,
    "mode": "vanilla",
    "contents": [ 1,-1,0,0,-1,0,0,1,0 ],
    "initialSelected": { "x":1, "y":2 }
  },
  {
    "type": "level",
    "number": 6,
    "mode": "vanilla",
    "contents": [ -7,-9,-7,-8,-12,-9,-6,-7,-7 ],
    "initialSelected": { "x":1, "y":2 }
  },
  {
    "type": "level",
    "number": 7,
    "mode": "vanilla",
    "contents": [7,6,8,8,7,7,9,8,8],
    "initialSelected": { "x": 2, "y": 0 },
    "solution": [ "l","l","d","d","u","u","r","d","d","r","u","d","u","u","l","r","d","l","d","u","u","l" ]
  },
  {
    "type": "level",
    "number": 8,
    "mode": "vanilla",
    "contents": [-5,-3,0,-4,-1,0,-4,-2,0],
    "initialSelected": { "x": 0, "y": 1 },
    "solution": [ "u","d","u","r","l","r","l","d","r","u","l","d","d","r","l","r","l","u","d" ]
  },
  {
    "type": "level",
    "number": 9,
    "mode": "vanilla",
    "contents": [-2,-1,1,0,2,2,3,3,3],
    "initialSelected": { "x": 0, "y": 2 },
    "solution": [ "u","u","d","u","r","l","d","u","r","r","d","u","l","l","r","d" ]
  },
  {
    "type": "level",
    "number": 10,
    "mode": "vanilla",
    "contents": [-6,-6,-5,-6,-9,-10,-5,-6,-8],
    "initialSelected": { "x": 2, "y": 2 },
    "solution": [ "u","l","u","d","d","r","u","d","u","d","u","l","r","l","l","u" ]
  },
  {
    "type": "level",
    "number": 11,
    "mode": "vanilla",
    "contents": [-1,-4,1,1,0,3,3,3,3],
    "initialSelected": { "x": 2, "y": 1 },
    "solution": [ "l","u","r","l","l","d","u","r","l","r","r","l","d","u","l","d","r","u" ]
  },
  {
    "type": "level",
    "number": 12,
    "mode": "vanilla",
    "contents": [9,9,10,4,7,10,8,10,11],
    "initialSelected": { "x": 0, "y": 2 },
    "solution": [ "u","d","u","d","u","u","d","r","l","d","u","r","d","u","l","r","r","u","l","l","r" ]
  },
  {
    "type": "level",
    "number": 13,
    "mode": "vanilla",
    "contents": [6,5,7,5,2,7,5,4,7],
    "initialSelected": { "x": 1, "y": 0 },
    "solution": [ "d","u","l","r","d","d","l","u","d","r","u","d","u","l","r" ]
  },
  {
    "type": "level",
    "number": 14,
    "mode": "vanilla",
    "contents": [0,-2,0,0,-1,1,-1,-2,-1],
    "initialSelected": { "x": 2, "y": 1 },
    "solution": [ "d","l","r","l","l","r","u","u","d","u","r","l","l","d","d" ]
  },
  {
    "type": "level",
    "number": 15,
    "mode": "vanilla",
    "contents": [11,8,9,10,9,11,11,10,11],
    "initialSelected": { "x": 2, "y": 1 },
    "solution": [ "u","l","r","l","d","l","u","r","d","d","r","l","l","u","d","u","u","r","r","l","d","d","r","u","u","d","l" ]
  },
  {
    "type": "level",
    "number": 16,
    "mode": "vanilla",
    "contents": [-5,-4,-5,-7,-4,-7,-6,-4,-4],
    "initialSelected": { "x": 0, "y": 0 },
    "solution": [ "r","l","d","d","u","u","d","d","u","d","r","u","r","d","u","u","d","u","d" ]
  },
  {
    "type": "level",
    "number": 17,
    "mode": "vanilla",
    "contents": [1,1,2,-3,0,2,-2,0,2],
    "initialSelected": { "x": 2, "y": 2 },
    "solution": [ "l","l","u","r","d","l","u","d","u","d","u","u","r","d","l" ]
  },
  {
    "type": "level",
    "number": 18,
    "mode": "vanilla",
    "contents": [6,6,5,4,4,3,5,5,5],
    "initialSelected": { "x": 1, "y": 2 },
    "solution": [ "r","l","l","u","r","r","l","r","u","d","d","l","l","u","r","r","u","l","l","d" ]
  },
  {
    "type": "level",
    "number": 19,
    "mode": "vanilla",
    "contents": [-2,-4,-3,-1,-2,-4,-1,-1,-1],
    "initialSelected": { "x": 2, "y": 0 },
    "solution": [ "l","r","d","d","l","l","u","u","r","r","l","l","r","d","r","l","r","u","d" ]
  },
  {
    "type": "level",
    "number": 20,
    "mode": "vanilla",
    "contents": [6,7,8,4,6,7,5,7,7],
    "initialSelected": { "x": 1, "y": 0 },
    "solution": [ "l","d","d","u","u","d","d","u","d","r","u","u","d","r","d" ]
  },
  {
    "type": "instruction",
    "title": "黑白模式",
    "text": "接下来的几个谜题会更加复杂...",
    "button": "噢不"
  },
  {
    "type": "instruction",
    "title": "黑白模式",
    "text": "棋盘上包含黑白方块，每种方块都有不同的行为。",
    "button": "继续"
  },
  {
    "type": "instruction",
    "title": "黑白模式",
    "text": "踩到白色方块会使数字增加一...",
    "button": "继续"
  },
  {
    "type": "instruction",
    "title": "黑白模式",
    "text": "...而踩到黑色方块会使数字减少一。",
    "button": "好的，开始吧"
  },
  {
    "type": "level",
    "number": 21,
    "mode": "b&w",
    "contents": [ 0,3,0,3,-2,3,0,2,0 ],
    "colors": ["w","b","w","b","w","b","w","b","w"],
    "initialSelected": { "x":2, "y":2 }
  },
  {
    "type": "level",
    "number": 22,
    "mode": "b&w",
    "contents": [ 7,2,6,3,9,1,7,3,7 ],
    "colors": ["b","w","b","w","b","w","b","w","b"],
    "initialSelected": { "x":1, "y":1 }
  },
  {
    "type": "level",
    "number": 23,
    "mode": "b&w",
    "contents": [ 5,0,2,6,7,4,5,1,2 ],
    "colors": ["b","w","w","b","b","b","b","w","w"],
    "initialSelected": { "x":1, "y":0 }
  },
  {
    "type": "level",
    "number": 24,
    "mode": "b&w",
    "contents": [ 10,11,9,6,5,10,8,6,6 ],
    "colors": ["b","b","b","w","w","b","b","w","w"],
    "initialSelected": { "x":0, "y":2 }
  },
  {
    "type": "level",
    "number": 25,
    "mode": "b&w",
    "contents": [ 7,1,11,4,13,11,4,3,7 ],
    "colors": ["b","w","b","w","b","b","w","w","b"],
    "initialSelected": { "x":2, "y":1 }
  },
  {
    "type": "level",
    "number": 26,
    "mode": "b&w",
    "contents": [ 5,8,6,1,-3,6,4,1,2 ],
    "colors": ["b","b","b","w","w","b","b","w","w"],
    "initialSelected": { "x":1, "y":1 }
  },
  {
    "type": "level",
    "number": 27,
    "mode": "b&w",
    "contents": [ 10,8,11,7,15,7,12,8,11 ],
    "colors": ["b","w","b","w","b","w","b","w","b"],
    "initialSelected": { "x":1, "y":1 }
  },
  {
    "type": "level",
    "number": 28,
    "mode": "b&w",
    "contents": [18,19,11,20,9,11,17,15,14],
    "colors": ["b","b","w","b","w","w","b","b","w"],
    "initialSelected": { "x": 1, "y": 2 },
    "solution": [ "l","u","r","r","u","d","l","u","l","d","d","r","l","u","u","r","l","d","u","d","r","r","l","u","r","l","r","l","d","l" ]
  },
  {
    "type": "level",
    "number": 29,
    "mode": "b&w",
    "contents": [21,15,18,22,14,16,17,17,17],
    "colors": ["b","w","b","b","w","w","b","w","w"],
    "initialSelected": { "x": 2, "y": 1 },
    "solution": [ "l","l","u","r","d","r","u","l","l","d","u","d","r","l","u","d" ]
  },
  {
    "type": "level",
    "number": 30,
    "mode": "b&w",
    "contents": [9,8,6,9,10,5,10,13,13],
    "colors": ["w","w","w","w","b","w","b","b","b"],
    "initialSelected": { "x": 2, "y": 2 },
    "solution": [ "u","u","l","r","d","l","d","r","u","u","d","d","l","l","r","r","l","r" ]
  },
  {
    "type": "level",
    "number": 31,
    "mode": "b&w",
    "contents": [5,7,4,-5,-2,-2,-3,0,0],
    "colors": ["b","b","b","w","w","w","w","b","w"],
    "initialSelected": { "x": 0, "y": 1 },
    "solution": [ "u","r","l","r","r","l","r","l","r","d","l","r","u","l","d","l","u","d","d","u","d","u","d","u","u","r","l","r" ]
  },
  {
    "type": "level",
    "number": 32,
    "mode": "b&w",
    "contents": [-3,0,-6,-4,0,1,-4,-5,-7],
    "colors": ["b","b","w","w","b","b","w","w","w"],
    "initialSelected": { "x": 1, "y": 2 },
    "solution": [ "u","u","d","u","r","l","l","r","r","d","d","u","l","r","d","u","l","d","r","u" ]
  },
  {
    "type": "level",
    "number": 33,
    "mode": "b&w",
    "contents": [5,6,7,11,2,8,3,13,6],
    "colors": ["w","w","w","b","w","b","w","b","w"],
    "initialSelected": { "x": 0, "y": 2 },
    "solution": [ "r","r","l","u","l","u","r","d","l","r","d","l","r","l","r","l","r","u","r","l","l","d","u","u" ]
  },
  {
    "type": "level",
    "number": 34,
    "mode": "b&w",
    "contents": [8,8,7,9,11,6,4,17,12],
    "colors": ["b","b","w","b","b","w","w","b","b"],
    "initialSelected": { "x": 1, "y": 1 },
    "solution": [ "d","r","l","r","l","u","d","u","d","l","u","d","r","u","d","l","r","r","u","u","d","d","l","l" ]
  },
  {
    "type": "level",
    "number": 35,
    "mode": "b&w",
    "contents": [5,3,1,-3,-4,-4,1,5,-3],
    "colors": ["b","b","w","w","w","w","w","b","w"],
    "initialSelected": { "x": 1, "y": 2 },
    "solution": [ "r","u","u","d","d","u","l","l","u","r","d","r","d","l","u","l","u","d","u","d","d","r","u","l","r","d","r","u","d","u","l" ]
  },
  {
    "type": "level",
    "number": 36,
    "mode": "b&w",
    "contents": [11,9,14,12,6,16,11,10,11],
    "colors": ["w","w","b","b","w","b","b","w","b"],
    "initialSelected": { "x": 1, "y": 1 },
    "solution": [ "u","d","d","u","r","u","d","l","l","r","u","r","d","l","r","u","d" ]
  },
  {
    "type": "level",
    "number": 37,
    "mode": "b&w",
    "contents": [-6,-12,-8,-6,-7,-8,-8,-9,-8],
    "colors": ["b","b","w","w","b","b","w","b","w"],
    "initialSelected": { "x": 0, "y": 2 },
    "solution": [ "u","r","l","u","d","d","r","u","l","u","r","l","d","r","l","r","l","d","r","r","l","r","l","u","u","l" ]
  },
  {
    "type": "level",
    "number": 38,
    "mode": "b&w",
    "contents": [0,1,-2,4,-7,1,3,-6,0],
    "colors": ["b","b","w","b","w","b","b","w","b"],
    "initialSelected": { "x": 1, "y": 1 },
    "solution": [ "l","u","r","d","l","d","r","u","d","l","r","l","u","d","u","r","r","d","l","u","d","u","r","u","l","d","l" ]
  },
  {
    "type": "level",
    "number": 39,
    "mode": "b&w",
    "contents": [13,11,11,13,10,10,12,17,11],
    "colors": ["w","w","w","b","w","w","w","b","w"],
    "initialSelected": { "x": 1, "y": 1 },
    "solution": [ "d","l","r","r","l","u","r","d","u","u","l","r","l","d","d","u","r" ]
  },
  {
    "type": "level",
    "number": 40,
    "mode": "b&w",
    "contents": [4,2,8,10,11,6,7,4,6],
    "colors": ["w","w","b","b","b","w","b","w","w"],
    "initialSelected": { "x": 2, "y": 1 },
    "solution": [ "l","u","l","d","u","d","r","l","d","r","u","l","r","u","r","l","r","l","d","d" ]
  },
  {
    "type": "instruction",
    "title": "游戏完成！",
    "text": "恭喜你！你已经成功完成了奇偶性游戏的所有关卡。",
    "button": "重新开始"
  }
]
;