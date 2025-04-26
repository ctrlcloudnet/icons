## 🌐 Icons
Each service is a self-contained React component and can be resized using standard `width` and `height` props.
We use optimized SVGs with optional `colors[]` and `colorsByHex{}` support, so they adapt their colors recursively and behave consistently across your app.


### 🛠️ Setup


#### install
```bash
npm i @crtcloudnet/icons
```
#### basic usage
```js
import {EC2} from '@crtcloudnet/icons';

export default function Home() {
  return (
    <div className="flex gap-4">
      <EC2 />
    </div>
  );
}
````
#### Next.js Config
To use this library in a Next.js app, add the following to your `next.config.js`:

```js

  transpilePackages: ['@crtcloudnet/icons'], // Explicitly transpile this package
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
| width    | number | Sets the width of the icon. Defaults to `40px`. |
| height   | number | Sets the height of the icon. Defaults to `40px`. |
| colors  | string[] | Replaces colors in order of appearance (first color replaces first fill, etc.)|
| colorsByHex  | object | Precise color overrides: { "ORIGINAL_HEX": "NEW_HEX" }. |
| ...props | any | All other SVG-compatible props like `className`, `style`, `aria-label`, etc. |
---
💡 Tip: Use your browser's inspector to check the original SVG colors before replacing

### Usage


Example usage:

```jsx
import { EC2, S3, Lambda } from '@crtcloudnet/icons';

export default function Example() {
  return (
    <div style={{ display: 'flex', gap: '16px' }}>
      <S3 width={48} height={48} />
      
      // Replace first color in svg:
      <Lambda width={48} height={48} colors={['#FF9900']} />

      // You can also override specific colors easily:
      <EC2 colorsByHex={{ "#ED7100": "#00ADEF", "#FFFFFF": "#F7FAFC" }} />
    </div>
  );
}

```
```jsx
```
---
Enjoy using `icons` in your project! 🌐🌟

