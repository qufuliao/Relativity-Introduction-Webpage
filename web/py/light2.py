import numpy as np
import time
import math

"""
演示时间膨胀：比较静止参考系和高速运动参考系中的时钟

本代码利用 matplotlib 动画显示两个时钟，
左侧时钟：静止参考系
右侧时钟：高速运动参考系（相对于静止参考系，其走时变慢）
在本示例中，高速运动的速度取 v = 0.8c，对应 γ ≈ 1.6667，
因此运动时钟的计时为 t/γ。
"""

import matplotlib.pyplot as plt
import matplotlib.animation as animation

# 设置速度参数及相应的洛伦兹因子 gamma
v = 0.8         # 0.8c
gamma = 1 / np.sqrt(1 - v**2)
print(f"（显示中 : v = {v}c，γ = {gamma:.4f}）")

# 模拟参数：设静止时钟每10秒转一圈
period = 10.0  # 静止时钟周期（秒）
# 动画更新间隔（毫秒）和总模拟时间（秒）
interval = 50  # 每帧间隔 50 毫秒
total_time = 20  # 模拟总时长

# 创建图形和两个子图
fig, (ax_static, ax_moving) = plt.subplots(1, 2, figsize=(10, 5))
axes = [ax_static, ax_moving]

# 配置两个时钟的轴参数（隐藏坐标轴，并设置相等比例）
for ax in axes:
    ax.set_xlim(-1.2, 1.2)
    ax.set_ylim(-1.2, 1.2)
    ax.set_aspect('equal')
    ax.axis('off')
    # 绘制时钟表盘
    circle = plt.Circle((0, 0), 1, fill=False, linewidth=2)
    ax.add_patch(circle)

# 添加标题
ax_static.set_title("Stationary reference clock")
ax_moving.set_title("High-speed motion reference clock")

# 初始化时钟指针
hand_static, = ax_static.plot([], [], lw=3, color='blue')
hand_moving, = ax_moving.plot([], [], lw=3, color='red')

start_real_time = time.time()

def init():
    hand_static.set_data([], [])
    hand_moving.set_data([], [])
    return hand_static, hand_moving

def animate(frame):
    # 当前经过的实际模拟时间 (秒)
    t = (frame * interval) / 1000.0

    # 对于静止时钟，角度按实际时间线性增加，一圈对应 period 秒
    angle_static = 2 * np.pi * (t % period) / period

    # 对于运动时钟，由于时间膨胀，局部时间 t_local = t/γ
    t_local = t / gamma
    angle_moving = 2 * np.pi * (t_local % period) / period

    # 钟表的指针从中心 (0, 0) 指向 (cos(angle), sin(angle))
    x_static = [0, np.cos(np.pi/2 - angle_static)]
    y_static = [0, np.sin(np.pi/2 - angle_static)]
    hand_static.set_data(x_static, y_static)

    x_moving = [0, np.cos(np.pi/2 - angle_moving)]
    y_moving = [0, np.sin(np.pi/2 - angle_moving)]
    hand_moving.set_data(x_moving, y_moving)

    return hand_static, hand_moving

# 创建动画
frames = int(total_time * 1000 / interval)
ani = animation.FuncAnimation(fig, animate, frames=frames, init_func=init, interval=interval, blit=True)

#将动画保存为GIF文件 
ani.save('time_dilation.gif', fps=20)   
plt.tight_layout()
plt.show()
