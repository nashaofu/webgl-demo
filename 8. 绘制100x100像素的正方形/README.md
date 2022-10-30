# 绘制 100x100 像素的正方形

## 着色器代码

- 顶点着色器

```glsl
attribute vec4 a_f_position;
uniform mat4 u_m4fv_scale;

void main() {
  gl_Position = u_m4fv_scale * a_f_position;
}
```

- 片段着色器

```glsl
void main() {
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
```

## js 代码

相对于前面[7. 裁剪空间与像素空间](../7.%20%E8%A3%81%E5%89%AA%E7%A9%BA%E9%97%B4%E4%B8%8E%E5%83%8F%E7%B4%A0%E7%A9%BA%E9%97%B4/)中[示例 3](../7.%20%E8%A3%81%E5%89%AA%E7%A9%BA%E9%97%B4%E4%B8%8E%E5%83%8F%E7%B4%A0%E7%A9%BA%E9%97%B4/demo3/)的代码，修改了传入缓冲区的顶点坐标。

```js
setAttribute(gl, program, {
  name: 'a_f_position',
  // 正方形的顶点坐标
  data: new Float32Array([
    // 第一个点
    -50, -50,
    // 第二个点
    -50, 50,
    // 第三个点
    50, 50,
    // 第四个点
    50, -50
  ]),
  size: 2,
  normalized: false,
  stride: 0,
  offset: 0
})
```

同时修改了`draw`方法

```diff
         // 裁剪空间单位1的宽度对应 $glcanvas.clientWidth 这么多个像素点
+        const scale =  1 / $glcanvas.clientWidth
+        const scaleX = scale
+        // 以宽度方向为基准，对高度方向进行缩放，以保证宽高方向绘制出来的实际像素值相同
+        const scaleY = gl.drawingBufferWidth / gl.drawingBufferHeight * scaleX

         setUniform(gl, program, {
           name: 'u_m4fv_scale',
           data: [
+            scaleX, 0, 0 ,0,
             0, scaleY, 0, 0,
             0, 0, 1, 0,
             0, 0, 0, 1
           ]
         })
```

从结果我们可以看到，不管我们怎么改变画布大小，绘制图形的的大小始终为 100x100

## 练习

如何改变画布的原点坐标？请把原点坐标移动到画布的左上角。
