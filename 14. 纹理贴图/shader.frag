precision mediump float;
 
// 纹理
uniform sampler2D u_image;
 
// 从顶点着色器传入的纹理坐标
varying vec2 v_texCoord;
 
void main() {
   // 在纹理上寻找对应颜色值
   gl_FragColor = texture2D(u_image, v_texCoord);
}