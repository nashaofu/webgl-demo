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

export function initShaderProgram(gl: WebGL2RenderingContext, vsSource: string, fsSource: string) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource)
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)

  if (!vertexShader || !fragmentShader) {
    return null
  }

  // 创建着色器程序
  const program = gl.createProgram()
  if (!program) {
    console.error('createProgram fail')
    return null
  }
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  // 创建失败
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program))
    return null
  }

  //使用program
  gl.useProgram(program)

  return program
}

export function writeVertexAttrib(
  gl: WebGL2RenderingContext,
  index: number,
  data: Float32Array,
  size: number,
  normalized = false,
  stride = 0,
  offset = 0
) {
  gl.enableVertexAttribArray(index)
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)

  gl.vertexAttribPointer(index, size, gl.FLOAT, normalized, stride, offset)
}

export function clear(gl: WebGL2RenderingContext, color: [number, number, number, number] = [0, 0, 0, 1]) {
  // 清理画布
  gl.clearColor(...color)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}
