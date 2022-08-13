attribute vec4 a_position;
attribute vec3 a_normal;

uniform vec2 u_angle;

uniform vec3 u_lightPosition;

varying vec3 v_normal;

varying vec3 v_surfaceToLight;

void main() {
  float xRadian = radians(u_angle.x * 360.0);
  float xCos = cos(xRadian);
  float xSin = sin(xRadian);
  mat4 rotationXMatrix = mat4(1.0, 0, 0, 0.0, 0.0, xCos, -xSin, 0.0, 0.0, xSin, xCos, 0.0, 0.0, 0.0, 0.0, 1.0);

  float yRadian = radians(u_angle.y * 360.0);
  float yCos = cos(yRadian);
  float ySin = sin(yRadian);
  mat4 rotationYMatrix = mat4(yCos, 0.0, ySin, 0.0, 0.0, 1, 0.0, 0.0, -ySin, 0.0, yCos, 0.0, 0.0, 0.0, 0.0, 1.0);

  // 将位置和矩阵相乘
  gl_Position = rotationXMatrix * rotationYMatrix * a_position;

  // 法向量传递给片断着色器
  v_normal = a_normal;

  // 计算表面到光源的方向
  // 传递给片断着色器
  v_surfaceToLight = u_lightPosition - a_position.xyz;
}