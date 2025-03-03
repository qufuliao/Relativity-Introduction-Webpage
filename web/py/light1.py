import numpy as np

import matplotlib.pyplot as plt

# 设置图形范围
t = np.linspace(-10, 10, 400)
x_light_pos = t  # 光束向正x方向
x_light_neg = -t  # 光束向负x方向

# 定义观察者A：静止（世界线在 x=0 处，从 t=0 开始）
t_obs = np.linspace(0, 10, 100)
x_obsA = np.zeros_like(t_obs)

# 定义观察者B：以 v = 0.5c 运动，其世界线 x = v*t
v = 0.5
x_obsB = v * t_obs

plt.figure(figsize=(8, 6))

# 绘制光束（45°斜线，表示光速不变）
plt.plot(x_light_pos, t, 'r--', label='light beam (forward)')
plt.plot(x_light_neg, t, 'r--', label='light beam (backward)')

# 绘制观察者A的世界线 (静止)
plt.plot(x_obsA, t_obs, 'b-', linewidth=2, label='observer A (v=0)')

# 绘制观察者B的世界线 (运动)
plt.plot(x_obsB, t_obs, 'g-', linewidth=2, label='observer B (v=0.5c)')

# 标注各部分
plt.xlabel('space x')
plt.ylabel('time ct')
plt.title('Light Speed Invariance')
plt.legend(loc="upper left")
plt.xlim(-10, 10)
plt.ylim(0, 10)
plt.grid(True)

# 保存并显示图像
plt.savefig("light_speed_invariance.png", dpi=300)
plt.show()