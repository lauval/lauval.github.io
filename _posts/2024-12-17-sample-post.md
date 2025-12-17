---
layout: post
title: A Sample Post on Math and Code
date: 2024-12-17 11:12:00-0400
description: An example post demonstrating LaTeX equations and syntax highlighting.
tags: math code python
categories: sample-posts
---

This is a sample blog post to demonstrate how the theme handles text, mathematics, and code blocks.

## Introduction

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Mathematical Typography

The theme supports math rendering via MathJax. Here is an inline equation: $e^{i\pi} + 1 = 0$.

And here is a block equation, featuring the Navier-Stokes momentum equation for an incompressible fluid:

$$
\frac{\partial \mathbf{u}}{\partial t} + (\mathbf{u} \cdot \nabla) \mathbf{u} = -\frac{1}{\rho} \nabla p + \nu \nabla^2 \mathbf{u} + \mathbf{g}
$$

Where:
*   $\mathbf{u}$ is the flow velocity field
*   $p$ is the pressure field
*   $\rho$ is the density
*   $\nu$ is the kinematic viscosity
*   $\mathbf{g}$ is the external force field (e.g., gravity)

## Code Highlighting

We can also display code snippets with syntax highlighting. Here is a Python function that implements a simple vector addition:

```python
import numpy as np

def vector_add(v1, v2):
    """
    Adds two numpy arrays element-wise.
    """
    if len(v1) != len(v2):
        raise ValueError("Vectors must be of the same length")
    return np.add(v1, v2)

# Example usage
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])
result = vector_add(a, b)
print(f"Result: {result}")
```

## Conclusion

Suspendisse potenti. Nullam ac tortor vitae purus faucibusornare suspendisse. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla.
