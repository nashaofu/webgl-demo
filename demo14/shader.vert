attribute vec3 a_position_v3;
uniform vec4 u_4fv_color;
uniform mat4 u_m4_transform;

varying vec4 v_color;

void main() {
  gl_Position = u_m4_transform * vec4(a_position_v3, 1);

  v_color = u_4fv_color;
}