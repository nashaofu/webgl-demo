attribute vec2 a_position;

uniform vec2 u_resolution;

void main() {
  gl_Position = vec4(a_position / u_resolution, 0, 1);
}