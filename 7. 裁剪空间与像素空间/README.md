# 裁剪空间与像素空间

本文介绍如何把像素空间映射到裁剪空间，做映射的目的是为了便于我们描述坐标。

## 画布尺寸

每个画布都有两个尺寸，一个是绘制的`drawingBuffer`尺寸， 这个表示画布中有多少个像素。另一是画布显示的尺寸， CSS 决定画布显示的尺寸。

绘制尺寸可以通过 HTML 与 js 设置：

```html
<!-- 通过 HTML 标签属性设置 -->
<canvas id="canvas" width="400" height="400"></canvas>
<script>
  // 通过js设置宽高
  const $canvas = document.querySelector('#canvas')
  $canvas.width = 400
  $canvas.height = 400
</script>
```

## 裁剪空间

WebGL 渲染的空间的坐标为 -1 至 +1

## 像素空间

空间坐标使用像素值描述

## 裁剪空间与像素空间映射

裁剪空间与像素空间映射可以理解为，把裁剪空间-1 至+1 的坐标值转换为一个像素范围，例如-1 至 +1 转换为 -100px 至 +100px。通常会把裁剪空间映射为画布大小范围的。

## 绘制一个正方形

[示例 1](./demo1)

1. 设置 canvas 的大小为整个窗口的大小

```css
#glcanvas {
  display: block;
  width: 100%;
  height: 100%;
}
```

2. 调整窗口大小，我们可以看到正方形并不是正方形，并且宽度方向的边与高度方向的边粗细也不一样。
   ![示例 1](./demo1.png)

出现这种现象的原因是，在 chrome 中，canvas 默认宽高为 300x150，因为使用 css 设置了 canvas 宽高，导致 canvas 被拉伸了，可以简单理解为一张 300x150 的图片被拉伸了。

## 设置画布的绘制尺寸

1. 修改前面示例中的代码

```js
function draw() {
  if ($glcanvas.width !== $glcanvas.clientWidth || $glcanvas.height !== $glcanvas.clientHeight) {
    $glcanvas.width = $glcanvas.clientWidth
    $glcanvas.height = $glcanvas.clientHeight
  }

  // 清理画布
  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  // 开始绘制图形
  gl.drawArrays(gl.LINE_LOOP, 0, 4)

  requestAnimationFrame(draw)
}
```

2. 我们可以看到绘制的正方形在页面的左下角很小一块地方
   ![demo2](./demo2.png)

这是因为我们还需要设置[gl.viewport](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/viewport),画布默认 viewport 为初始化时 canvas 的绘制尺寸。当画布绘制尺寸改变时，同时也要设置 viewport 才生效。`gl.viewport` 告诉 WebGL 如何将裁剪空间（-1 到 +1）中的点转换到像素空间。如果一条线`（-1，0）（1，0）`,通过设置 viewport，我们可以让这条线从左到右填满画布，也可以让其只填充一半的画布。

我们可以通过如下代码去设置 viewport

```js
gl.viewport(0, 0, $glcanvas.clientWidth, $glcanvas.clientHeight)
// 或者
gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
```

关于使用 `clientWidth/clientHeight`与`drawingBufferWidth/drawingBufferHeight` 的区别参考：https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-anti-patterns.html#drawingbuffer，可按情况选择使用。

设置 viewport 后，打开[示例 2](./demo2)页面，改变窗口大小，可以看到正方形并不是正方形，只是边的粗细不会像[示例 1](./demo1)一样了。

出现这个现象的原因是，画布的宽高不是相等的，也就是说裁剪空间映射到像素空间在宽和高的方向上的比例是不一致的，以宽度方向为基准，裁剪空间长度为 1 的尺寸，映射到像素空间的高的方向可能变成 0.5。也就是在屏幕上实际显示的像素点少了一半。

针对这个问题，我们可以对画布进行缩放，这里有两种方式，一种是直接修改传入到缓冲区的坐标值，另一种是传入一个缩放矩阵，然后在顶点着色器中修改顶点坐标，这里我们采用第二种。
在`draw`方法中添加如下代码:

```js
// 以宽度方向为基准，对高度方向进行缩放，以保证宽高方向绘制出来的实际像素值相同
const scaleY = gl.drawingBufferWidth / gl.drawingBufferHeight
setUniform(gl, program, {
  name: 'u_m4fv_scale',
  data: [1, 0, 0, 0, 0, scaleY, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
})
```

并在修改顶点着色器为如下代码：

```glsl
attribute vec4 a_f_position;
uniform mat4 u_m4fv_scale;

void main() {
  gl_Position = u_m4fv_scale * a_f_position;
}
```

实际运行效果：[示例 3](./demo3)

## 总结

以上内容我们实现了一个简单的裁剪空间到像素空间的映射，但我们传入的顶点坐标值仍然是基于裁剪空间的值，如果我们想要传入像素值，只需要再多一次把像素值转换为裁剪空间值就好了，下一篇我们将实现绘制一个`100x100` 像素的正方形。上面的代码中，我们只对 x、y 轴方向的像素进行了转换，但在大多数情况下，我们还需要对 Z 轴进行转换，即深度也要转换到像素空间。
