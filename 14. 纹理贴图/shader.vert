attribute vec4 a_f_position;
attribute vec2 a_f_texCoord;
varying vec2 v_texCoord;

void main() {
  gl_Position = a_f_position;
  // 将纹理坐标传给片断着色器
  // GPU会在点之间进行插值
  v_texCoord = a_f_texCoord;
}
