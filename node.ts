import { multiply } from './m4.js'

export interface VertexInfo {
  data: number[]
  size?: number
  offset?: number
  length?: number
}

// 单位矩阵
const um = [1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0]

export function writeVertexInfo(
  gl: WebGL2RenderingContext,
  shaderProgram: WebGLProgram,
  vertexInfo: Record<string, VertexInfo>
) {
  Object.entries(vertexInfo).forEach(([key, value]) => {
    if (key.startsWith('a_')) {
      let attribLocation = gl.getAttribLocation(shaderProgram, key)
      gl.enableVertexAttribArray(attribLocation)

      const buffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(value.data), gl.STATIC_DRAW)
      gl.vertexAttribPointer(
        attribLocation,
        value.size ?? value.data.length,
        gl.FLOAT,
        false,
        value.offset ?? 0,
        value.length ?? 0
      )
      return
    }

    if (key.startsWith('u_')) {
      const uniformLocation = gl.getUniformLocation(shaderProgram, key)
      let buf = new Float32Array(value.data)
      let [, n, t, v] = key.match(/^u_([1234])(f|i)(v)?_/) ?? []
      if (n && t) {
        if (v) {
          ;(gl as any)[`uniform${n}${t}v`](uniformLocation, buf)
        } else {
          ;(gl as any)[`uniform${n}${t}`](uniformLocation, ...value.data)
        }
        return
      }

      let [, d] = key.match(/^u_m([234]|[234]x[234])_/) ?? []
      if (d) {
        ;(gl as any)[`uniformMatrix${d}fv`](uniformLocation, false, buf)
        return
      }
    }
  })
}

interface DrawInfo {
  mode: number
  offset?: number
  count: number
}

interface NodeCtorOpts {
  shape: Record<string, VertexInfo>
  drawInfo: DrawInfo
  transform: string
}

export default class Node {
  children: Node[] = []
  shape: Record<string, VertexInfo>
  drawInfo: DrawInfo
  transform: string
  m4 = [...um]

  constructor({ shape, drawInfo, transform }: NodeCtorOpts) {
    this.shape = shape
    this.drawInfo = drawInfo
    this.transform = transform
  }

  setShape(shape: Record<string, VertexInfo>) {
    this.shape = shape
  }

  setDrawInfo(drawInfo:DrawInfo) {
    this.drawInfo = drawInfo
  }

  addChild(node: Node) {
    this.children.push(node)
  }

  render(
    gl: WebGL2RenderingContext,
    shaderProgram: WebGLProgram,
    transform: number[] = [...um]
  ) {
    let m4 = multiply(transform, this.m4)
    writeVertexInfo(gl, shaderProgram, this.shape)
    writeVertexInfo(gl, shaderProgram, {
      [this.transform]: { data: m4, size: 4 }
    })

    gl.drawArrays(this.drawInfo.mode, this.drawInfo.offset ?? 0, this.drawInfo.count)

    this.children.forEach(item => {
      item.render(gl, shaderProgram, m4)
    })
  }

  translation(x: number, y: number, z: number) {
    this.m4 = multiply([
      1.0, 0.0, 0.0, 0.0,
      0.0, 1.0, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      x, y, z, 1.0
    ], this.m4)
  }

  scale(x: number, y: number, z: number) {
    let sm = [x, 0.0, 0.0, 0.0, 0.0, y, 0.0, 0.0, 0.0, 0.0, z, 0.0, 0.0, 0.0, 0.0, 1.0]
    this.m4 = multiply(sm, this.m4)
  }

  rotate(x: number, y: number, z: number) {
    let rx = (x / 180) * Math.PI
    let rxCos = Math.cos(rx)
    let rxSin = Math.sin(rx)
    let rxm = [
      1.0, 0.0, 0.0,0.0,
      0.0, rxCos, rxSin, 0.0,
      0.0, -rxSin, rxCos, 0.0,
      0.0, 0.0, 0.0, 1.0
    ]

    let ry = (y / 180) * Math.PI
    let ryCos = Math.cos(ry)
    let rySin = Math.sin(ry)
    let rym = [
      ryCos, 0.0, rySin,0.0,
      0.0, 1, 0, 0.0,
      -rySin, 0, ryCos, 0.0,
      0.0, 0.0, 0.0, 1.0
    ]

    let rz = (z / 180) * Math.PI
    let rzCos = Math.cos(rz)
    let rzSin = Math.sin(rz)
    let rzm = [
      rzCos, rzSin, 0.0, 0.0,
      -rzSin, rzCos, 0, 0.0,
      0, 0, 1, 0.0,
      0.0, 0.0, 0.0, 1.0
    ]

    let rxym = multiply(rxm, rym);
    let rxyzm = multiply(rxym, rzm);
    this.m4 = multiply(rxyzm, this.m4)
  }
}
