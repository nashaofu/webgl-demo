attribute vec4 pos;
uniform vec4 color;
attribute vec2 angle;
varying vec4 v_color;

attribute vec4 normal;	// 法向量
uniform vec4 tx;	// x 方向移动

void main() {
  //旋转角度45度转化为弧度值
  float xRadian = radians(angle.x * 360.0);
  float xCos = cos(xRadian);
  float xSin = sin(xRadian);

  mat4 rotationXMatrix = mat4(1.0, 0, 0, 0.0, 0.0, xCos, -xSin, 0.0, 0.0, xSin, xCos, 0.0, 0.0, 0.0, 0.0, 1.0);

  float yRadian = radians(angle.y * 360.0);
  float yCos = cos(yRadian);
  float ySin = sin(yRadian);

  mat4 rotationYMatrix = mat4(yCos, 0.0, ySin, 0.0, 0.0, 1, 0.0, 0.0, -ySin, 0.0, yCos, 0.0, 0.0, 0.0, 0.0, 1.0);

  vec3 normal2 = normalize(vec3(normal));

  vec3 u_LightDirection = vec3(0.0, 0.0, 0.5);

  // 计算光线方向与法向量的点积
  float dotResult = max(dot(u_LightDirection, normal2), 0.0);

  vec3 u_LightColor = vec3(1.0, 1.0, 1.0);

  // 计算漫反射光的颜色
  vec3 diffuse = u_LightColor * color.rgb * dotResult;
  
  gl_Position = rotationXMatrix * rotationYMatrix * pos + tx;

  v_color = vec4(diffuse, color.a);
}