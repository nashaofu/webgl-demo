// attribute 声明 vec4 类型变量 a_position
// vec4 前三个值为点的 x,y,z 坐标
attribute vec4 a_position;

void main() {
  // 顶点坐标 a_position 赋值给内置变量 gl_Position
  // 逐顶点处理数据
  gl_Position = a_position;
}