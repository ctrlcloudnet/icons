## 🌐 Services Icons
Each service is a self-contained React component and can be resized using standard `width` and `height` props.
We use optimized SVGs with optional `colors[]` and `colorsByHex{}` support, so they adapt their colors recursively and behave consistently across your app.


### 🛠️ Setup


install
```bash
npm i @tradevpsnet/icons
```

To use this library in a Next.js app, add the following to your `next.config.js`:

```js

  transpilePackages: ['@tradevpsnet/icons'], // Explicitly transpile this package
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
```

Also install the following package:

```bash
npm install --save-dev @svgr/webpack
```

### Attributes

| Name     | Type | Description |
|:---------|:-----|:------------|
| width    | number | Sets the width of the icon. Defaults to `40`. |
| height   | number | Sets the height of the icon. Defaults to `40`. |
| colors  | string[] | Array of colors that replace the default fills, mapped by order. |
| colorsByHex  | object | Object to override specific hex values in the SVG (e.g., { "#FFFFFF": "#000000" }). |
| ...props | any | All other SVG-compatible props like `className`, `style`, `aria-label`, etc. |

---

### Usage


Example usage:

```jsx
import { EC2, S3 } from '@tradevpsnet/icons';

export default function Example() {
  return (
    <div style={{ display: 'flex', gap: '16px' }}>
      <EC2 width={48} height={48} colors={['#FF9900']} />
      <S3 width={48} height={48} />
    </div>
  );
}

```
You can also override specific colors easily:
```jsx
<EC2 colorsByHex={{ "#ED7100": "#00ADEF", "#FFFFFF": "#F7FAFC" }} />
```
---
Enjoy using `icons` in your project! 🌐🌟

