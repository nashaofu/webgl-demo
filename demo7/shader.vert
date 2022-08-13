attribute vec4 pos;
attribute vec4 color;
attribute vec2 angle;
attribute vec4 normal; // 法向量

varying vec4 v_color;

void main() {
  float xRadian = radians(angle.x * 360.0);
  float xCos = cos(xRadian);
  float xSin = sin(xRadian);

  mat4 rotationXMatrix = mat4(1.0, 0, 0, 0.0, 0.0, xCos, -xSin, 0.0, 0.0, xSin, xCos, 0.0, 0.0, 0.0, 0.0, 1.0);

  float yRadian = radians(angle.y * 360.0);
  float yCos = cos(yRadian);
  float ySin = sin(yRadian);

  mat4 rotationYMatrix = mat4(yCos, 0.0, ySin, 0.0, 0.0, 1, 0.0, 0.0, -ySin, 0.0, yCos, 0.0, 0.0, 0.0, 0.0, 1.0);

  gl_Position = rotationXMatrix * rotationYMatrix * pos;

  vec3 normal2 = normalize(normal.xyz);

  vec3 lightDirection = vec3(1, 1, -1);

  // 计算平行光方向向量和顶点法向量的点积
  float light = max(dot(normal2, lightDirection), 0.0);

  vec3 lightColor = vec3(1, 1, 1);

  vec3 color2 = color.rgb * light * lightColor;

  //颜色插值计算
  v_color = vec4(color2, color.a);
}