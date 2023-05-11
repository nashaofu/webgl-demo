attribute vec2 a_position;
attribute vec2 a_texCoord;
varying vec2 v_texCoord;
 
void main() {
  gl_Position = vec4(a_position, 0, 1);
   // 将纹理坐标传给片断着色器
   // GPU会在点之间进行插值
   v_texCoord = a_texCoord;
}