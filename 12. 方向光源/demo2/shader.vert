attribute vec4 a_f_position;
attribute vec4 a_ub_color;
attribute vec4 a_f_normal;
uniform mat4 u_m4fv_transform;
varying vec4 v_color;

void main() {
  gl_Position = u_m4fv_transform * a_f_position;

  vec3 normal = normalize(a_f_normal.xyz);

  // 垂直屏幕向里面的光线方向
  vec3 lightDirection = vec3(0, 0, 1);

  // 计算平行光方向向量和顶点法向量的点积
  float light = dot(normal, lightDirection);

  vec3 color = vec3(a_ub_color.xyz) * light;

  //颜色插值计算
  v_color = vec4(color, 1);
}
