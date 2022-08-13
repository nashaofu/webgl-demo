precision mediump float;

varying vec3 v_normal;
uniform vec4 u_4fv_color;

void main() {
  // because v_normal is a varying it's interpolated
  // so it will not be a unit vector. Normalizing it
  // will make it a unit vector again
  vec3 normal = normalize(v_normal);

  float light = max(dot(normal, normalize(vec3(1, 1, -1))), 0.0);

  gl_FragColor = u_4fv_color;

  // Lets multiply just the color portion (not the alpha)
  // by the light
  gl_FragColor.rgb *= light;
}