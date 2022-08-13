attribute vec4 pos;
attribute vec4 color;
attribute float y_angle;
varying vec4 v_color;

void main() {
  //旋转角度45度转化为弧度值
  float xRadian = radians(45.0);
  float xCos = cos(xRadian);
  float xSin = sin(xRadian);

  mat4 rotationXMatrix = mat4(1., 0, 0, 0.0, 0.0, xCos, -xSin, 0.0, 0.0, xSin, xCos, 0.0, 0.0, 0.0, 0.0, 1.);

  float yRadian = radians(y_angle * 360.0);
  float yCos = cos(yRadian);
  float ySin = sin(yRadian);

  mat4 rotationYMatrix = mat4(yCos, 0.0, ySin, 0.0, 0.0, 1, 0.0, 0.0, -ySin, 0.0, yCos, 0.0, 0.0, 0.0, 0.0, 1.);

  gl_Position = rotationXMatrix * rotationYMatrix * pos;
  v_color = color;
}