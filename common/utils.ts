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

export function createProgram(gl: WebGL2RenderingContext, vsSource: string, fsSource: string) {
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

export interface Attribute {
  name: string
  data: ArrayBufferView
  size: 1 | 2 | 3 | 4
  normalized?: boolean
  stride?: number
  offset?: number
}

/**
 * name:
 * a_b_xxx
 * a_s_xxx
 * a_ub_xxx
 * a_us_xxx
 * a_f_xxx
 * a_hf_xxx
 * @param gl
 * @param program
 * @param param2
 */
export function setAttribute(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  { name, data, size, normalized = false, stride = 0, offset = 0 }: Attribute
) {
  let [, t] = name.match(/^a_(b|s|f|ub|us|hf)_/) ?? []

  if (!t) {
    throw Error('attribute 必须以 a_b_/a_s_/a_ub_/a_us_/a_f_/a_hf_ 开头')
  }

  const types: Record<string, number> = {
    b: gl.BYTE,
    s: gl.SHORT,
    ub: gl.UNSIGNED_BYTE,
    us: gl.UNSIGNED_SHORT,
    f: gl.FLOAT,
    hf: gl.HALF_FLOAT
  }

  // 获取数据类型
  let index = gl.getAttribLocation(program, name)
  gl.enableVertexAttribArray(index)

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)

  gl.vertexAttribPointer(index, size, types[t], normalized, stride, offset)
}

interface Uniform {
  name: string
  data: number[]
}

/**
 * name:
 * u_([1234])(f|i)(v)?_
 * u_m([234]|[234]x[234])fv_
 * @param gl
 * @param program
 * @param param2
 * @returns
 */
export function setUniform(gl: WebGL2RenderingContext, program: WebGLProgram, { name, data }: Uniform) {
  const uniformLocation = gl.getUniformLocation(program, name)

  let [, n, t, v] = name.match(/^u_([1234])(f|i)(v)?_/) ?? []
  if (n && t) {
    if (v) {
      if (t === 'f') {
        ;(gl as any)[`uniform${n}${t}v`](uniformLocation, new Float32Array(data))
      } else {
        ;(gl as any)[`uniform${n}${t}v`](uniformLocation, new Int32Array(data))
      }
    } else {
      ;(gl as any)[`uniform${n}${t}`](uniformLocation, ...data)
    }
    return
  }

  let [, d] = name.match(/^u_m([234]|[234]x[234])fv_/) ?? []
  if (d) {
    ;(gl as any)[`uniformMatrix${d}fv`](uniformLocation, false, new Float32Array(data))
    return
  }

  throw new Error('name 必须为 /^u_([1234])(f|i)(v)?_/ 或 /^u_m([234]|[234]x[234])fv_/ 形式')
}
