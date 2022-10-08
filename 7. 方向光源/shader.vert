attribute vec4 a_f_postion;
attribute vec2 a_f_angle;
attribute vec4 a_f_normal; // 法向量

varying vec4 v_color;

void main() {
  float xRadian = radians(a_f_angle.x * 360.0);
  float xCos = cos(xRadian);
  float xSin = sin(xRadian);

  mat4 rotationXMatrix = mat4(1.0, 0, 0, 0.0, 0.0, xCos, -xSin, 0.0, 0.0, xSin, xCos, 0.0, 0.0, 0.0, 0.0, 1.0);

  float yRadian = radians(a_f_angle.y * 360.0);
  float yCos = cos(yRadian);
  float ySin = sin(yRadian);

  mat4 rotationYMatrix = mat4(yCos, 0.0, ySin, 0.0, 0.0, 1, 0.0, 0.0, -ySin, 0.0, yCos, 0.0, 0.0, 0.0, 0.0, 1.0);

  gl_Position = rotationXMatrix * rotationYMatrix * a_f_postion;

  vec3 normal = normalize(a_f_normal.xyz);

  vec3 lightDirection = vec3(1, 1, -1);

  // 计算平行光方向向量和顶点法向量的点积
  float light = max(dot(normal, lightDirection), 0.0);

  vec3 lightColor = vec3(1, 1, 1);

  vec3 color = vec3(1.0, 1.0, 0.0) * light * lightColor;

  //颜色插值计算
  v_color = vec4(color, 1);
}
