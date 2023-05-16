attribute vec4 a_f_pos;
uniform vec4 u_4fv_color;
varying vec4 v_color;

uniform vec2 u_2fv_angle;	// 旋转角度
uniform vec4 u_4fv_transform_x;	// x 方向移动

void main() {
  // x 轴旋转角度转化为弧度值
  float xRadian = radians(u_2fv_angle.x);
  float xCos = cos(xRadian);
  float xSin = sin(xRadian);

  mat4 rotationXMatrix = mat4(1.0, 0, 0, 0.0, 0.0, xCos, -xSin, 0.0, 0.0, xSin, xCos, 0.0, 0.0, 0.0, 0.0, 1.0);

  // y 轴旋转角度转化为弧度值
  float yRadian = radians(u_2fv_angle.y);
  float yCos = cos(yRadian);
  float ySin = sin(yRadian);

  mat4 rotationYMatrix = mat4(yCos, 0.0, ySin, 0.0, 0.0, 1, 0.0, 0.0, -ySin, 0.0, yCos, 0.0, 0.0, 0.0, 0.0, 1.0);

  gl_Position = rotationXMatrix * rotationYMatrix * a_f_pos + u_4fv_transform_x;

  v_color = u_4fv_color;
}
