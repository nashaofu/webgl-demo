# 三维透视投影

在之前的例子中，我们在 WebGL 中绘制的图形都是正射投影，所谓正射投影就是图像不会体现出远近的区别（远处与近处的图形大小没有区别），在这里我们实现透视投影（远小近大）。

想要实现远小近大的效果， 简单的做法就是将裁减空间中的 X 和 Y 值除以 Z 值。在[9. 绘制三维字母 F](../9.%20%E7%BB%98%E5%88%B6%E4%B8%89%E7%BB%B4%E5%AD%97%E6%AF%8D%20F/)的基础上，修改顶点着色器即可。

修改顶点着色器代码为：

```glsl
attribute vec4 a_f_position;
attribute vec4 a_ub_color;
uniform mat4 u_m4fv_transform;
varying vec4 v_color;

void main() {
  vec4 position= u_m4fv_transform * a_f_position;
  // 调整除数
  float z_to_divide_by = 1.0 + position.z;
  gl_Position = vec4(position.xy / z_to_divide_by, position.zw);
  v_color = a_ub_color;
}
```

## 示例效果

[查看示例效果](./demo1)
