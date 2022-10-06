attribute vec4 a_f_position;
attribute vec4 a_f_color;
uniform mat4 u_m4fv_transform_x;
uniform mat4 u_m4fv_transform_y;
varying vec4 v_color;

void main() {
  gl_Position = u_m4fv_transform_x * u_m4fv_transform_y * a_f_position;

  v_color = a_f_color;
}
