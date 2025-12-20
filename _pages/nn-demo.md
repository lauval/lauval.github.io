---
layout: page
title: neural net
permalink: /nn-demo/
nav: true
nav_order: 6
---

This page demonstrates the usage of the new Neural Network animation. It is designed to be "plug and play" and supports both full-background and inline container modes.

## Background Mode (Default)

By simply including the file, it will act as a background element for its nearest `relative` or `absolute` positioned parent (or the whole page if no such parent exists).

```liquid
{% raw %}{% include neural-network.html %}{% endraw %}
```

{% include neural-network.html %}

<div style="height: 200px; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.1); backdrop-filter: blur(5px); border-radius: 10px; position: relative; z-index: 1;">
  <h2 style="margin: 0;">This text is on top of the animation!</h2>
</div>

### 2. Inline Container Mode
This version is restricted to a specific box and uses the **Glassmorphism** effect (`.nn-glass`) to blur the network behind the text.

<div class="nn-inline nn-glass">
  {% include neural-network.html %}
  <div style="position: relative; z-index: 2; padding: 40px; text-align: center;">
    <h2 style="margin: 0;">Frosted Glass Interface</h2>
    <p>The neural network blurs beautifully behind this text.</p>
  </div>
</div>

```html
<div class="nn-inline nn-glass">
  {% raw %}{% include neural-network.html %}{% endraw %}
  <div style="position: relative; z-index: 2; padding: 40px; text-align: center;">
    <h2 style="margin: 0;">Frosted Glass Interface</h2>
    <p>The neural network blurs beautifully behind this text.</p>
  </div>
</div>
```

## Features

- **Dynamic Theme Integration:** Uses your site's `--global-theme-color` for the accent color.
- **Adaptive:** Automatically responds to Light/Dark mode transitions.
- **Responsive:** Scales with the window size and container width.
- **Performance:** Optimized `requestAnimationFrame` loop with frame capping.
