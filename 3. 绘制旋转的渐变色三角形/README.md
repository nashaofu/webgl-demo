# 绘制旋转的三角形

接着前面[三角形的示例](../2.%20%E7%BB%98%E5%88%B6%E4%B8%89%E8%A7%92%E5%BD%A2/README.md)，让它绕 Z 轴旋转的三角形，并修改颜色为渐变色.

## 着色器代码

- 顶点着色器

```glsl
attribute vec4 a_f_position;
attribute vec4 a_f_color;
uniform mat4 u_m4fv_transform_z;
varying vec4 v_color;

void main() {
  gl_Position = u_m4fv_transform_z * a_f_position;
  v_color = a_f_color;
}
```

`a_f_color`用于指定每个顶点的颜色， `uniform`声明的变量为全局变量，在一次绘制过程中传递给着色器的值都一样，上面代码中，给传入的顶点进行了一次矩阵变换。`varying`声明的变量用于顶点着色器给片断着色器传值，这里表示把顶点颜色传递给片段着色器。

- 片段着色器

```glsl
precision mediump float;
varying vec4 v_color;

void main() {
  gl_FragColor = v_color;
}
```

`precision` 用于指定片段着色器中的`float`类型的精度，`varying`用于接收顶点着色器传递过来的值。由于每一个顶点都有不同颜色，所以生成的每一个像素点会使用顶点间的颜色进行插值，从而生成渐变色。

## 绘制流程

1. 获取 WebGL 上下文，创建程序，并传入三角形坐标

2. 设置顶点颜色

```js
setAttribute(gl, program, {
  name: 'a_f_color',
  // 三角形的各个顶点的颜色
  data: new Float32Array([
    // 第一个
    1, 0, 0,
    // 第二个点
    0, 1, 0,
    // 第三个点
    0, 0, 1
  ]),
  size: 3,
  normalized: false,
  stride: 0,
  offset: 0
})
```

3. 设置旋转矩阵，并绘制

```js
function draw() {
  let sin = Math.sin(zRad)
  let cos = Math.cos(zRad)
  setUniform(gl, program, {
    name: 'u_m4fv_transform_z'
    data: [
      // 绕 Z 轴旋转矩阵
      cos, sin, 0 ,0,
      -sin, cos, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]
  })

  // 清理画布
  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  // 开始绘制图形
  gl.drawArrays(gl.TRIANGLES, 0, 3)
  requestAnimationFrame(draw)
}
```

三维矩阵变换公式如下：

- 平移

![平移](./translation-matrix.svg)

- 缩放

![缩放](./scaling-matrix.svg)

- 绕 x 轴旋转

![绕 x 轴旋转](./rotation-x-matrix.svg)

- 绕 y 轴旋转

![绕 y 轴旋转](./rotation-y-matrix.svg)

- 绕 z 轴旋转

![绕 z 轴旋转](./rotation-z-matrix.svg)

我们可以看到，我们实际书写的旋转矩阵与上图中的有一些区别，这是因为 WebGL 中的矩阵与数学上的矩阵不一样，WebGL 为了方便计算，把矩阵进行了转置，详情可参考：[https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-matrix-vs-math.html](https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-matrix-vs-math.html)

## 示例效果

[查看示例效果](./demo.html)
