# 使用顶点索引绘制立方体线框

修改前面[4. 绘制立方体线框](../4.%20%E7%BB%98%E5%88%B6%E7%AB%8B%E6%96%B9%E4%BD%93%E7%BA%BF%E6%A1%86/)的代码，改为使用顶点索引绘制立方体线框

## 着色器

着色器代码完全与[4. 绘制立方体线框](../4.%20%E7%BB%98%E5%88%B6%E7%AB%8B%E6%96%B9%E4%BD%93%E7%BA%BF%E6%A1%86/)中的一样。

## 立方体顶点坐标

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
    0.5, -0.5, 0.5
  ]),
  size: 3,
  normalized: false,
  stride: 0,
  offset: 0
})
```

在这里我们只声明了立方体的 8 个顶点的坐标，没有重复声明。

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
    0, 0, 1
  ]),
  size: 3,
  normalized: false,
  stride: 0,
  offset: 0
})
```

同样的，我们也只是指定了 8 个顶点的颜色，没有重复指定。

## 指定顶点索引

```js
// 顶点索引数组
const indexes = new Uint8Array([
  // 前后两个正方形
  0, 1, 2, 3,
  4, 5, 6, 7,

  // 连接前后两个面
  0, 4,
  1, 5,
  2, 6,
  3, 7
])

// 创建缓冲区对象
const indexesBuffer = gl.createBuffer()
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexesBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexes, gl.STATIC_DRAW)
```

前面顶点坐标与顶点颜色，按照 3 个一组的方式写入到缓存中，所以顶点数据在缓冲中有 8 个顶点数据（包含顶点坐标与颜色），存储形式可以想象为数组。

然后我们可以使用数组下标来指向顶点数据，然后就可以较灵活的对顶点进行编排，从而实现图形绘制。

## 使用顶点索引绘制

```js
//开始绘制图形
gl.drawElements(gl.LINE_LOOP, 4, gl.UNSIGNED_BYTE, 0)
gl.drawElements(gl.LINE_LOOP, 4, gl.UNSIGNED_BYTE, 4)
gl.drawElements(gl.LINES, 8, gl.UNSIGNED_BYTE, 8)
```

顶点索引绘制的方法为[`drawElements`](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/drawElements)，第一个参数为绘制模式，与`drawArrays`方法完全一样，第二个参数为绘制顶点个数，第三个为索引数据类型，第四个参数为offset，表示顶点索引下标偏移量。

每次绘制时，WebGL 程序会先通过顶点索引找到索引指向的顶点数据，然后再把顶点数据传递给顶点着色器。

## 示例效果

[查看示例效果](./demo.html)

## 顶点索引的优势

1. 减少顶点代码书写量，避免了一个顶点多次书写，同时减少内存开销。
2. 提升了 WebGL 的绘制能力，对于相同的顶点数据，我们可以修改其顶点索引来实现不同的绘制效果。
