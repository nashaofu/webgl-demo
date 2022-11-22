attribute vec4 a_f_position;
uniform mat4 u_m4fv_transform;

void main() {
  gl_Position = u_m4fv_transform * a_f_position;
}
