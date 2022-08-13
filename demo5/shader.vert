attribute vec4 pos;
attribute vec4 color;
varying vec4 v_color;

void main() {
  //旋转角度45度转化为弧度值
  float radian = radians(45.0);
  //求解旋转角度余弦值
  float cos = cos(radian);
  //求解旋转角度正弦值
  float sin = sin(radian);
  mat4 rotationXMatrix = mat4(1.0, 0, 0, 0.0, 0.0, cos, -sin, 0.0, 0.0, sin, cos, 0.0, 0.0, 0.0, 0.0, 1.0);
  mat4 rotationYMatrix = mat4(cos, 0.0, sin, 0.0, 0.0, 1, 0.0, 0.0, -sin, 0.0, cos, 0.0, 0.0, 0.0, 0.0, 1.0);
  gl_Position = rotationXMatrix * rotationYMatrix * pos;
  v_color = color;
}