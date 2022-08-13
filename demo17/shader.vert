attribute vec3 a_position_v3;
attribute vec3 a_normal_v3;
uniform mat4 u_m4_transform;

varying vec3 v_normal;

void main() {
  gl_Position = u_m4_transform * vec4(a_position_v3, 1);

  v_normal = (u_m4_transform * vec4(a_normal_v3, 0)).xyz;
}