# Z 轴默认方向

绘制两个三角形，让蓝色三角形从后面穿过红色三角形，观察 Z 轴的默认方向。红色三角形的坐标为`(-0.5, 0, 0),(0.5, 0, 0),(0.5, 0.5, 0)`, 蓝色三角形坐标为`(-0.5, 0, 0.5)、(-0.5, 0.5, 0.5),(0.5, 0.1, -0.3)`。

## 着色器代码

- 顶点着色器

```glsl
attribute vec4 a_f_position;
attribute vec4 a_f_color;
varying vec4 v_color;

void main() {
  gl_Position = a_f_position;
  v_color = a_f_color;
}
```

顶点着色器代码比较简单，主要是获取三角形的顶点坐标与顶点颜色，并把顶点颜色传递给片段着色器。

- 片段着色器

```glsl
precision mediump float;
varying vec4 v_color;

void main() {
  gl_FragColor = v_color;
}
```

`precision` 用于指定片段着色器中的`float`类型的精度，`varying`用于接收顶点着色器传递过来的值。

## 主要代码

1. 设置两个三角形的顶点坐标，第一个三角形的平行于 xy 平面，第二个三角形与 xy 平面不平行。

```js
setAttribute(gl, program, {
  name: "a_f_position",
  // 三角形的顶点坐标
  data: new Float32Array([
    // 第一个三角形
    // 第一个点
    -0.5, 0, 0,
    // 第二个点
    0.5, 0, 0,
    // 第三个点
    0.5, 0.5, 0,

    // 第二个三角形
    // 第一个点
    -0.5, 0, 0.5,
    // 第二个点
    -0.5, 0.5, 0.5,
    // 第三个点
    0.5, 0.1, -0.3,
  ]),
  size: 3,
  normalized: false,
  stride: 0,
  offset: 0,
});
```

2. 设置顶点颜色，第一个三角形为红色，第二个三角形为蓝色。

```js
setAttribute(gl, program, {
  name: "a_f_color",
  // 三角形的各个顶点的颜色
  data: new Float32Array([
    // 第一个
    1, 0, 0,
    // 第二个点
    1, 0, 0,
    // 第三个点
    1, 0, 0,

    // 第一个
    0, 0, 1,
    // 第二个点
    0, 0, 1,
    // 第三个点
    0, 0, 1,
  ]),
  size: 3,
  normalized: false,
  stride: 0,
  offset: 0,
});
```

3. 绘制图形

```js
// 清理画布
gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
// 激活深度比较
gl.enable(gl.DEPTH_TEST);

// 开始绘制图形
gl.drawArrays(gl.TRIANGLES, 0, 6);
```

`gl.enable(gl.DEPTH_TEST)`会开启深度测试，如果不开启，则会是简单的颜色覆盖，即后绘制的会覆盖先绘制的图形。我们可以把这一句注释掉，然后调整两个三角形的绘制顺序看看。

## 示例效果

[查看示例效果](./demo.html)

可以看到，红色的三角形在上层，蓝色的穿过了红色三角形。这说明 Z 轴默认是垂直屏幕的，垂直画布向里为 z 轴正方向，原理观察者的方向为正方向。

你也可以在这里去实际体验 https://codesandbox.io/s/admiring-hill-rrpb3o?file=/index.html
