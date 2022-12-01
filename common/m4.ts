export function multiply(a: number[], b: number[]) {
  const dst = []

  const a00 = a[0]
  const a01 = a[1]
  const a02 = a[2]
  const a03 = a[3]
  const a10 = a[4 + 0]
  const a11 = a[4 + 1]
  const a12 = a[4 + 2]
  const a13 = a[4 + 3]
  const a20 = a[8 + 0]
  const a21 = a[8 + 1]
  const a22 = a[8 + 2]
  const a23 = a[8 + 3]
  const a30 = a[12 + 0]
  const a31 = a[12 + 1]
  const a32 = a[12 + 2]
  const a33 = a[12 + 3]
  const b00 = b[0]
  const b01 = b[1]
  const b02 = b[2]
  const b03 = b[3]
  const b10 = b[4 + 0]
  const b11 = b[4 + 1]
  const b12 = b[4 + 2]
  const b13 = b[4 + 3]
  const b20 = b[8 + 0]
  const b21 = b[8 + 1]
  const b22 = b[8 + 2]
  const b23 = b[8 + 3]
  const b30 = b[12 + 0]
  const b31 = b[12 + 1]
  const b32 = b[12 + 2]
  const b33 = b[12 + 3]

  dst[0] = a00 * b00 + a10 * b01 + a20 * b02 + a30 * b03
  dst[1] = a01 * b00 + a11 * b01 + a21 * b02 + a31 * b03
  dst[2] = a02 * b00 + a12 * b01 + a22 * b02 + a32 * b03
  dst[3] = a03 * b00 + a13 * b01 + a23 * b02 + a33 * b03
  dst[4] = a00 * b10 + a10 * b11 + a20 * b12 + a30 * b13
  dst[5] = a01 * b10 + a11 * b11 + a21 * b12 + a31 * b13
  dst[6] = a02 * b10 + a12 * b11 + a22 * b12 + a32 * b13
  dst[7] = a03 * b10 + a13 * b11 + a23 * b12 + a33 * b13
  dst[8] = a00 * b20 + a10 * b21 + a20 * b22 + a30 * b23
  dst[9] = a01 * b20 + a11 * b21 + a21 * b22 + a31 * b23
  dst[10] = a02 * b20 + a12 * b21 + a22 * b22 + a32 * b23
  dst[11] = a03 * b20 + a13 * b21 + a23 * b22 + a33 * b23
  dst[12] = a00 * b30 + a10 * b31 + a20 * b32 + a30 * b33
  dst[13] = a01 * b30 + a11 * b31 + a21 * b32 + a31 * b33
  dst[14] = a02 * b30 + a12 * b31 + a22 * b32 + a32 * b33
  dst[15] = a03 * b30 + a13 * b31 + a23 * b32 + a33 * b33

  return dst
}

export function translation(tx: number, ty: number, tz: number) {
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1]
}

export function translate(m: number[], tx: number, ty: number, tz: number) {
  return multiply(m, translation(tx, ty, tz))
}

export function xRotation(rad: number) {
  const sin = Math.sin(rad)
  const cos = Math.cos(rad)

  return [1, 0, 0, 0, 0, cos, sin, 0, 0, -sin, cos, 0, 0, 0, 0, 1]
}

export function xRotate(m: number[], rad: number) {
  return multiply(m, xRotation(rad))
}

export function yRotation(rad: number) {
  const sin = Math.sin(rad)
  const cos = Math.cos(rad)

  return [cos, 0, -sin, 0, 0, 1, 0, 0, sin, 0, cos, 0, 0, 0, 0, 1]
}

export function yRotate(m: number[], rad: number) {
  return multiply(m, yRotation(rad))
}

export function zRotation(rad: number) {
  const sin = Math.sin(rad)
  const cos = Math.cos(rad)

  return [cos, sin, 0, 0, -sin, cos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
}

export function zRotate(m: number[], rad: number) {
  return multiply(m, zRotation(rad))
}

export function scaling(sx: number, sy: number, sz: number) {
  return [sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1]
}

export function scale(m: number[], sx: number, sy: number, sz: number) {
  return multiply(m, scaling(sx, sy, sz))
}

export function orthographicProjection(
  left: number,
  right: number,
  bottom: number,
  top: number,
  near: number,
  far: number
) {
  return [
    2 / (right - left),
    0,
    0,
    0,
    0,
    2 / (top - bottom),
    0,
    0,
    0,
    0,
    2 / (near - far),
    0,

    (left + right) / (left - right),
    (bottom + top) / (bottom - top),
    (near + far) / (near - far),
    1
  ]
}

// 正交投影
export function orthographic(
  m: number[],
  left: number,
  right: number,
  bottom: number,
  top: number,
  near: number,
  far: number
) {
  return multiply(m, orthographicProjection(left, right, bottom, top, near, far))
}

export function perspectiveProjection(rad: number, aspect: number, near: number, far: number) {
  const f = Math.tan(Math.PI * 0.5 - 0.5 * rad)
  const rangeInv = 1.0 / (near - far)

  return [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (near + far) * rangeInv, -1, 0, 0, near * far * rangeInv * 2, 0]
}

// 透视投影
export function perspective(m: number[], rad: number, aspect: number, near: number, far: number) {
  return multiply(m, perspectiveProjection(rad, aspect, near, far))
}
