attribute vec4 a_f_position;
uniform mat4 u_m4fv_scale;

void main() {
  gl_Position = u_m4fv_scale * a_f_position;
}
