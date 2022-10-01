# 绘制立方体线框

绘制一个立方体线框，红色线框在前面，蓝色线框在后面，前后两个面用渐变色线段连接。

## 着色器

- 顶点着色器

```glsl
attribute vec4 a_f_position;
attribute vec4 a_f_color;
uniform mat4 u_m4fv_transform_y;
varying vec4 v_color;

void main() {
  // 旋转角度 15 度转化为弧度值
  float radian = radians(15.0);
  // 求解旋转角度余弦值
  float cos = cos(radian);
  // 求解旋转角度正弦值
  float sin = sin(radian);
  mat4 rotationXMatrix = mat4(
    1, 0, 0, 0,
    0, cos, sin, 0,
    0, -sin, cos, 0,
    0, 0, 0, 1
  );
  gl_Position = rotationXMatrix * u_m4fv_transform_y * a_f_position;
  v_color = a_f_color;
}
```

在顶点着色器中定义一个矩阵`rotationXMatrix`，让整个图形绕 x 轴顺时针旋转 15°。把所有的变换矩阵相乘，然后再与顶点坐标相乘，就能获取到顶点的最终额坐标点。

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
    // 前面正方形坐标
    -0.5, -0.5, -0.5,
    -0.5, 0.5, -0.5,
    0.5, 0.5, -0.5,
    0.5, -0.5, -0.5,

    // 后面正方形坐标
    -0.5, -0.5, 0.5,
    -0.5, 0.5, 0.5,
    0.5, 0.5, 0.5,
    0.5, -0.5, 0.5,

    // 连接前后两个面
    -0.5, -0.5, -0.5,
    -0.5, -0.5, 0.5,

    -0.5, 0.5, -0.5,
    -0.5, 0.5, 0.5,

    0.5, 0.5, -0.5,
    0.5, 0.5, 0.5,

    0.5, -0.5, -0.5,
    0.5, -0.5, 0.5,
  ]),
  size: 3,
  normalized: false,
  stride: 0,
  offset: 0
})
```

我们可以看到，一个立方体的顶点实际只有8个，但这里却16个顶点。这样做的目的是方便后面绘制。

## 设置顶点颜色

```js
setAttribute(gl, program, {
  name: 'a_f_color',
  data: new Float32Array([
    // 前面正方形
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,

    // 后面正方形
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,

    // 连接前后两个面的点的颜色
    1, 0, 0,
    0, 0, 1,

    1, 0, 0,
    0, 0, 1,

    1, 0, 0,
    0, 0, 1,

    1, 0, 0,
    0, 0, 1,
  ]),
  size: 3,
  normalized: false,
  stride: 0,
  offset: 0
})
```

## 设置旋转矩阵，并绘制

```js
function draw() {
  let sin = Math.sin(yRad);
  let cos = Math.cos(yRad);
  setUniform(gl, program, {
    name: 'u_m4fv_transform_y',
    data: [
      // 绕 y 轴旋转矩阵
      cos, 0, sin ,0,
      0, 1, 0, 0,
      -sin, 0, cos, 0,
      0, 0, 0, 1
    ]
  })
  // 清理画布
  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.enable(gl.DEPTH_TEST)

  // 绘制前面的正方形
  gl.drawArrays(gl.LINE_LOOP, 0, 4)
  // 绘制后面的正方形
  gl.drawArrays(gl.LINE_LOOP, 4, 4)
  // 绘制连接前后两个正方形的4条线
  gl.drawArrays(gl.LINES, 8, 8)

  requestAnimationFrame(draw)
}
```

我们在这里，连续调用了 3 次`gl.drawArrays`，第一次绘制朝向前面的这个正方形，第二次绘制了后面的，第三次把前后两个面对应的顶点用线段连接起来，这样就构成了一个完整的立方体。

## 示例效果

[查看示例效果](./demo.html)

## 练习

修改代码，传入 x 旋转角度到着色器中，让 x 轴旋转角度也能动态修改。顶点着色器伪代码如下：

```glsl
// 旋转角度 radian 从 js 中写入过来
float cos = cos(radian);
float sin = sin(radian);
mat4 rotationXMatrix = mat4(
  1, 0, 0, 0,
  0, cos, sin, 0,
  0, -sin, cos, 0,
  0, 0, 0, 1
);
```
