attribute vec4 a_f_position;
attribute vec4 a_f_color;
uniform mat4 u_m4fv_transform_y;
varying vec4 v_color;

void main() {
  // 旋转角度 15 度转化为弧度值
  float radian = radians(15.0);
  // 求解旋转角度余弦值
  float cos = cos(radian);
  // 求解旋转角度正弦值
  float sin = sin(radian);
  mat4 rotationXMatrix = mat4(
    1, 0, 0, 0,
    0, cos, sin, 0,
    0, -sin, cos, 0,
    0, 0, 0, 1
  );
  gl_Position = rotationXMatrix * u_m4fv_transform_y * a_f_position;
  v_color = a_f_color;
}
