attribute vec4 a_f_position;
attribute vec4 a_ub_color;
uniform mat4 u_m4fv_transform;
varying vec4 v_color;

void main() {
  gl_Position = u_m4fv_transform * a_f_position;
  v_color = a_ub_color;
}
