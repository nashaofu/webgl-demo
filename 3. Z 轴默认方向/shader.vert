attribute vec4 a_f_position;
attribute vec4 a_f_color;
varying vec4 v_color;

void main() {
  gl_Position = a_f_position;
  v_color = a_f_color;
}
