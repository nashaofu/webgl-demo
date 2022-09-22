# 绘制三角形

使用 WebGL 绘制一个三角形。

## 着色器代码

- 顶点着色器

```glsl
attribute vec4 a_f_position;

void main() {
  gl_Position = a_f_position;
}
```

顶点着色器的主要工作是生成裁剪空间坐标值，每个顶点调用一次（顶点）着色器，每次调用都需要设置一个特殊的全局变量`gl_Position`, 该变量的值就是裁减空间坐标值。`attribute`声明的变量字用于从缓冲中获取对应的数据。

- 片段着色器

```glsl
void main() {
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
```

片断着色器的主要工作是为当前光栅化的像素提供颜色值，每个像素都会调用一次片段着色器。这里设置颜色为红色(`rgba(255,0,0,1)`)。

关于着色器与 GLSL 可参考: https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-shaders-and-glsl.html

## 绘制流程

1. 首先获取到 WebGL 上下文

```js
const $glcanvas = document.querySelector('#glcanvas')
// 初始化 WebGL 上下文
const gl = $glcanvas.getContext('webgl')
```

2. 使用着色器代码创建程序，这里封装了一个函数`createProgram`以简化代码，具体源码可参考 [common/utils.ts](../common/utils.ts)。

```js
// Vertex shader program
const vsSource = await fetch('./shader.vert').then(r => r.text())
const fsSource = await fetch('./shader.frag').then(r => r.text())

let program = createProgram(gl, vsSource, fsSource)
```

3. 设置顶点坐标, `name`为`a_f_position`，与顶点着色器中`attribute`声明的属性对应，这样顶点着色器才能获取到对应的值。

```js
setAttribute(gl, program, {
  name: 'a_f_position',
  // 三角形的顶点坐标
  data: new Float32Array([
    // 第一个点
    -0.5, 0,
    // 第二个点
    0.5, 0,
    // 第三个点
    0, 0.5
  ]),
  size: 2,
  normalized: false,
  stride: 0,
  offset: 0
})
```

特别说明: 顶点着色器中声明的属性使用`a_f_`开头，是为了能明确的表示出这个变量是什么类型的数据，a 表示为`attribute`声明的属性，`f`表示为`float`类型，同时也方便`setAttribute`函数封装。`setAttribute`函数源码参考 [common/utils.ts](../common/utils.ts)。

4. 绘制出三角形

```js
// 清理画布
gl.clearColor(0, 0, 0, 1)
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

// 开始绘制图形
gl.drawArrays(gl.TRIANGLES, 0, 3)
```

`drawArrays`第一个参数指定绘制模式，这里指定为三角形，第二个参数指定开始绘制的顶点，第三个参数指定要绘制额顶点个数。

## 示例效果

[查看示例效果](./demo.html)

## 练习

1. 修改绘制模式为线段(`gl.LINES`)模式，看看是什么效果。
2. 多添加几个顶点，修改绘制起始顶点。
