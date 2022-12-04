attribute vec4 a_f_position;
attribute vec4 a_f_color;
uniform mat4 u_m4fv_transform_z;
varying vec4 v_color;

void main() {
  gl_Position = u_m4fv_transform_z * a_f_position;
  v_color = a_f_color;
}
