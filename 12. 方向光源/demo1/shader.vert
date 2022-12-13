attribute vec4 a_f_postion;
attribute vec4 a_ub_color;
attribute vec4 a_f_normal; // 法向量
uniform mat4 u_m4fv_transform;

varying vec4 v_color;

void main() {
  gl_Position = u_m4fv_transform * a_f_postion;

  vec3 normal = normalize(a_f_normal.xyz);

  vec3 lightDirection = vec3(1, 1, -1);

  // 计算平行光方向向量和顶点法向量的点积
  float light = max(dot(normal, lightDirection), 0.0);

  vec3 color = a_ub_color.xyz * light;

  //颜色插值计算
  v_color = vec4(color, 1);
}
