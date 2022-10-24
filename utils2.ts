//
// 创建指定类型的着色器，上传 source 源码并编译
//
export function loadShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)

  if (!shader) {
    console.log('createShader fail')
    return null
  }

  // Send the source to the shader object
  gl.shaderSource(shader, source)

  // Compile the shader program
  gl.compileShader(shader)

  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }

  return shader
}

//
//  初始化着色器程序，让 WebGL 知道如何绘制我们的数据
export function initShaderProgram(gl: WebGL2RenderingContext, vsSource: string, fsSource: string) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource)
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)

  if (!vertexShader || !fragmentShader) {
    return null
  }

  // 创建着色器程序
  const shaderProgram = gl.createProgram()
  if (!shaderProgram) {
    console.error('createProgram fail')
    return null
  }
  gl.attachShader(shaderProgram, vertexShader)
  gl.attachShader(shaderProgram, fragmentShader)
  gl.linkProgram(shaderProgram)
  //使用program
  gl.useProgram(shaderProgram)

  // 创建失败， alert
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram))
    return null
  }

  return shaderProgram
}

export function writeVertexAttrib(
  gl: WebGL2RenderingContext,
  attribLocation: number,
  data: ArrayBufferView,
  size: number,
  offset: number = 0,
  length: number = 0
) {
  gl.enableVertexAttribArray(attribLocation)
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
  gl.vertexAttribPointer(attribLocation, size, gl.FLOAT, false, offset, length)
}

export function clear(gl: WebGL2RenderingContext, color: [number, number, number, number] = [0, 0, 0, 1]) {
  // Clear to black, fully opaque
  gl.clearColor(...color)
  // Clear everything
  gl.clearDepth(1.0)
  gl.depthFunc(gl.LEQUAL);
  // Near things obscure far things
  // Clear the canvas before we start drawing on it.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}
