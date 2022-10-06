# 绘制立方体

绘制一个立方体线框，每个面使用不同颜色。

## 着色器

- 顶点着色器

```glsl
attribute vec4 a_f_position;
attribute vec4 a_f_color;
uniform mat4 u_m4fv_transform_x;
uniform mat4 u_m4fv_transform_y;
varying vec4 v_color;

void main() {
  gl_Position = u_m4fv_transform_x * u_m4fv_transform_y * a_f_position;

  v_color = a_f_color;
}
```

在顶点着色器中接收两个矩阵，用于绕 x 轴和 y 轴旋转立方体。

- 片段着色器

```glsl
precision mediump float;
varying vec4 v_color;

void main() {
    gl_FragColor = v_color;
}
```

## 设置立方体顶点坐标

```js
setAttribute(gl, program, {
  name: 'a_f_position',
  data: new Float32Array([
    // 前面
    -0.5, -0.5, 0.5,
    0.5, -0.5, 0.5,
    0.5, 0.5, 0.5,
    -0.5, 0.5, 0.5,
    -0.5, -0.5, 0.5,
    0.5, 0.5, 0.5,

    // 后面
    -0.5, -0.5, -0.5,
    -0.5, 0.5, -0.5,
    0.5, 0.5, -0.5,
    0.5, -0.5, -0.5,
    -0.5, -0.5, -0.5,
    0.5, 0.5, -0.5,

    // 顶部
    -0.5, 0.5, -0.5,
    -0.5, 0.5, 0.5,
    0.5, 0.5, 0.5,
    0.5, 0.5, -0.5,
    -0.5, 0.5, -0.5,
    0.5, 0.5, 0.5,

    // 底部
    -0.5, -0.5, -0.5,
    0.5, -0.5, -0.5,
    0.5, -0.5, 0.5,
    -0.5, -0.5, 0.5,
    -0.5, -0.5, -0.5,
    0.5, -0.5, 0.5,

    // 右侧
    0.5, -0.5, -0.5,
    0.5, 0.5, -0.5,
    0.5, 0.5, 0.5,
    0.5, -0.5, 0.5,
    0.5, -0.5, -0.5,
    0.5, 0.5, 0.5,

    // 左侧
    -0.5, -0.5, -0.5,
    -0.5, -0.5, 0.5,
    -0.5, 0.5, 0.5,
    -0.5, 0.5, -0.5,
    -0.5, -0.5, -0.5,
    -0.5, 0.5, 0.5,
  ]),
  size: 3,
  normalized: false,
  stride: 0,
  offset: 0
})
```

我们使用两个三角形来，绘制立方体的一个面，所以一个面需要 6 个点。立方体一共有 6 个面，所以顶点数量一共有 36 个。

## 设置顶点颜色

```js
const faceColors = [
  [1.0, 1.0, 1.0, 1.0], // 前面颜色
  [1.0, 0.0, 0.0, 1.0], // 后面颜色
  [0.0, 1.0, 0.0, 1.0], // 顶部颜色
  [0.0, 0.0, 1.0, 1.0], // 底部颜色
  [1.0, 1.0, 0.0, 1.0], // 右侧颜色
  [1.0, 0.0, 1.0, 1.0]  // 左侧颜色
]

const colors = []

for (let j = 0; j < faceColors.length; ++j) {
  const c = faceColors[j]
  // 每个面 6 个顶点
  for (let i =0;i<6;i++) {
    colors.push(...c)
  }
}

setAttribute(gl, program, {
  name: 'a_f_color',
  data: new Float32Array(colors),
  size: 4
})
```

`faceColors`表示每个面的颜色，由于一个面有 6 个顶点，所以最终颜色数量也为 36 个，`colors`数组长度为 144(`4 * 6 * 6`)

## 示例效果

[查看示例效果](./demo.html)

## 练习

在这个示例中，去掉`gl.enable(gl.DEPTH_TEST)`看看是什么效果呢？
