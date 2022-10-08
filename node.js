import { multiply } from './m4.js';
// 单位矩阵
const um = [1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0];
export function writeVertexInfo(gl, shaderProgram, vertexInfo) {
    Object.entries(vertexInfo).forEach(([key, value]) => {
        if (key.startsWith('a_')) {
            let attribLocation = gl.getAttribLocation(shaderProgram, key);
            gl.enableVertexAttribArray(attribLocation);
            const buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(value.data), gl.STATIC_DRAW);
            gl.vertexAttribPointer(attribLocation, value.size ?? value.data.length, gl.FLOAT, false, value.offset ?? 0, value.length ?? 0);
            return;
        }
        if (key.startsWith('u_')) {
            const uniformLocation = gl.getUniformLocation(shaderProgram, key);
            let buf = new Float32Array(value.data);
            let [, n, t, v] = key.match(/^u_([1234])(f|i)(v)?_/) ?? [];
            if (n && t) {
                if (v) {
                    ;
                    gl[`uniform${n}${t}v`](uniformLocation, buf);
                }
                else {
                    ;
                    gl[`uniform${n}${t}`](uniformLocation, ...value.data);
                }
                return;
            }
            let [, d] = key.match(/^u_m([234]|[234]x[234])_/) ?? [];
            if (d) {
                ;
                gl[`uniformMatrix${d}fv`](uniformLocation, false, buf);
                return;
            }
        }
    });
}
export default class Node {
    children = [];
    shape;
    drawInfo;
    transform;
    m4 = [...um];
    constructor({ shape, drawInfo, transform }) {
        this.shape = shape;
        this.drawInfo = drawInfo;
        this.transform = transform;
    }
    setShape(shape) {
        this.shape = shape;
    }
    setDrawInfo(drawInfo) {
        this.drawInfo = drawInfo;
    }
    addChild(node) {
        this.children.push(node);
    }
    render(gl, shaderProgram, transform = [...um]) {
        let m4 = multiply(transform, this.m4);
        writeVertexInfo(gl, shaderProgram, this.shape);
        writeVertexInfo(gl, shaderProgram, {
            [this.transform]: { data: m4, size: 4 }
        });
        gl.drawArrays(this.drawInfo.mode, this.drawInfo.offset ?? 0, this.drawInfo.count);
        this.children.forEach(item => {
            item.render(gl, shaderProgram, m4);
        });
    }
    translation(x, y, z) {
        this.m4 = multiply([
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            x, y, z, 1.0
        ], this.m4);
    }
    scale(x, y, z) {
        let sm = [x, 0.0, 0.0, 0.0, 0.0, y, 0.0, 0.0, 0.0, 0.0, z, 0.0, 0.0, 0.0, 0.0, 1.0];
        this.m4 = multiply(sm, this.m4);
    }
    rotate(x, y, z) {
        let rx = (x / 180) * Math.PI;
        let rxCos = Math.cos(rx);
        let rxSin = Math.sin(rx);
        let rxm = [
            1.0, 0.0, 0.0, 0.0,
            0.0, rxCos, rxSin, 0.0,
            0.0, -rxSin, rxCos, 0.0,
            0.0, 0.0, 0.0, 1.0
        ];
        let ry = (y / 180) * Math.PI;
        let ryCos = Math.cos(ry);
        let rySin = Math.sin(ry);
        let rym = [
            ryCos, 0.0, rySin, 0.0,
            0.0, 1, 0, 0.0,
            -rySin, 0, ryCos, 0.0,
            0.0, 0.0, 0.0, 1.0
        ];
        let rz = (z / 180) * Math.PI;
        let rzCos = Math.cos(rz);
        let rzSin = Math.sin(rz);
        let rzm = [
            rzCos, rzSin, 0.0, 0.0,
            -rzSin, rzCos, 0, 0.0,
            0, 0, 1, 0.0,
            0.0, 0.0, 0.0, 1.0
        ];
        let rxym = multiply(rxm, rym);
        let rxyzm = multiply(rxym, rzm);
        this.m4 = multiply(rxyzm, this.m4);
    }
}
