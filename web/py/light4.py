from matplotlib.patches import Circle, FancyArrowPatch
import numpy as np

import matplotlib.pyplot as plt

def draw_schematic():
    fig, ax = plt.subplots(figsize=(8, 8))
    ax.set_xlim(-10, 10)
    ax.set_ylim(-10, 10)
    ax.set_aspect('equal')
    ax.set_title('Schematic diagram of mass-energy conversion')

    # 绘制太阳（黄色圆形）
    sun = Circle((0, 0), 5, facecolor='yellow', edgecolor='orange', lw=2)  # 半径由2改为3
    ax.add_patch(sun)
    ax.text(0, 0, "Sun", ha="center", va="center", fontsize=12)

    # 绘制太阳向外辐射能量的箭头
    angles = np.linspace(0, 2 * np.pi, 8, endpoint=False)
    for angle in angles:
        # 定义箭头的起始和结束位置
        start = np.array([5 * np.cos(angle), 5 * np.sin(angle)])
        end = np.array([7 * np.cos(angle), 7 * np.sin(angle)])
        arrow = FancyArrowPatch(start, end, arrowstyle='->', mutation_scale=20, color='red')
        ax.add_patch(arrow)

    # 标注其中一个箭头代表释放的能量
    energy_start = np.array([5, 0])
    energy_end = np.array([7, 0])
    mid_point = (energy_start + energy_end) / 2
    ax.text(mid_point[0], mid_point[1] + 0.3, "The energy released", color='red', fontsize=10, ha='center')

    # 绘制表示质量减少的箭头（太阳内部的箭头）
    mass_arrow = FancyArrowPatch((0, 3), (0, 0), arrowstyle='->', mutation_scale=20, color='blue')
    ax.add_patch(mass_arrow)
    ax.text(0, 3, "The mass decrement", color='blue', fontsize=10, ha='center', va='bottom')

    #保存图像
    plt.savefig("mass_energy_conversion.png", dpi=300)
    plt.axis('off')
    plt.show()

if __name__ == "__main__":
    draw_schematic()