// 所有float类型数据的精度是lowp
precision lowp float;
// 接收顶点着色器中v_color数据
varying vec4 v_color;
void main() {
  // 插值后颜色数据赋值给对应的片元
    gl_FragColor = v_color;
}