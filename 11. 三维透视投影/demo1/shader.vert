attribute vec4 a_f_position;
attribute vec4 a_ub_color;
uniform mat4 u_m4fv_transform;
varying vec4 v_color;

void main() {
  vec4 position= u_m4fv_transform * a_f_position;
  // 调整除数
  float z_to_divide_by = 1.0 + position.z;
  gl_Position = vec4(position.xy / z_to_divide_by, position.zw);
  v_color = a_ub_color;
}
