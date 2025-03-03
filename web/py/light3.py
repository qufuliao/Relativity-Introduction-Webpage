import numpy as np

import matplotlib.pyplot as plt
import matplotlib.patches as patches

def plot_length_contraction():
    # Parameters
    L = 10                       # Proper length of the object at rest
    v = 0.8                      # Velocity as a fraction of the speed of light
    contraction_factor = np.sqrt(1 - v**2)
    L_contracted = L * contraction_factor  # Contracted length

    # Create figure and axis
    fig, ax = plt.subplots(figsize=(8, 4))
    
    # Draw the stationary object (proper length)
    y_stationary = 1.5
    rect_stationary = patches.Rectangle((1, y_stationary), L, 0.8, 
                                        edgecolor='blue', facecolor='none', lw=2)
    ax.add_patch(rect_stationary)
    ax.text(1 + L/2, y_stationary + 0.4, 'Stationary\nProper Length', 
            ha='center', va='center', color='blue')
    
    # Draw the moving object (length-contracted)
    y_moving = 0.2
    rect_moving = patches.Rectangle((1, y_moving), L_contracted, 0.8, 
                                    edgecolor='red', facecolor='none', lw=2)
    ax.add_patch(rect_moving)
    ax.text(1 + L_contracted/2, y_moving + 0.4, f'Moving (v=0.8c)\nLength = {L_contracted:.2f}', 
            ha='center', va='center', color='red')
    
    # Plot configuration
    ax.set_xlim(0, L + 3)
    ax.set_ylim(0, 3)
    ax.set_aspect('equal')
    ax.set_title('Length Contraction: Stationary vs High-Speed Object')
    ax.axis('off')
    
    # Save and show the plot
    plt.savefig("length_contraction.png", dpi=300)
    plt.show()

if __name__ == "__main__":
    plot_length_contraction()