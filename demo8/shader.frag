precision mediump float;

uniform vec4 u_color;

// 从顶点着色器中传入的值
varying vec3 v_normal;
varying vec3 v_surfaceToLight;

void main() {
  // 由于 v_normal 是可变量，所以经过插值后不再是单位向量，
  // 单位化后会成为单位向量
  vec3 normal = normalize(v_normal);

  vec3 surfaceToLightDirection = normalize(v_surfaceToLight);

  float light = max(dot(normal, surfaceToLightDirection), 0.0);

  gl_FragColor = u_color;

  // 只将颜色部分（不包含 alpha） 和光照相乘
  gl_FragColor.rgb *= light;
}