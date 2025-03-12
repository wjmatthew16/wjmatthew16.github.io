const canvas = document.getElementById('glCanvas');
const gl = canvas.getContext('webgl2');

if (!gl) {
    console.error('WebGL 2 is not supported by your browser.');
}

// 초기 캔버스 크기 설정
canvas.width = 500;
canvas.height = 500;

function resizeCanvas() {
    const size = Math.min(window.innerWidth, window.innerHeight);
    canvas.width = size;
    canvas.height = size;
    gl.viewport(0, 0, size, size);
    render();
}

// 네 개의 색상을 채우는 정점과 색상 데이터
const vertices = new Float32Array([
    // 좌하단 (파랑)
    -1, -1,  0, 0, 1,  // 좌하단
     0, -1,  0, 0, 1,  // 우하단
    -1,  0,  0, 0, 1,  // 좌상단
     0,  0,  0, 0, 1,  // 우상단
    
    // 우하단 (노랑)
     0, -1,  1, 1, 0,
     1, -1,  1, 1, 0,
     0,  0,  1, 1, 0,
     1,  0,  1, 1, 0,
    
    // 좌상단 (빨강)
    -1,  0,  1, 0, 0,
     0,  0,  1, 0, 0,
    -1,  1,  1, 0, 0,
     0,  1,  1, 0, 0,
    
    // 우상단 (초록)
     0,  0,  0, 1, 0,
     1,  0,  0, 1, 0,
     0,  1,  0, 1, 0,
     1,  1,  0, 1, 0
]);

const indices = new Uint16Array([
    0, 1, 2,  1, 2, 3,  // 파랑
    4, 5, 6,  5, 6, 7,  // 노랑
    8, 9,10,  9,10,11,  // 빨강
    12,13,14, 13,14,15  // 초록
]);

const vertexShaderSource = `
    attribute vec2 a_position;
    attribute vec3 a_color;
    varying vec3 v_color;
    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_color = a_color;
    }
`;

const fragmentShaderSource = `
    precision mediump float;
    varying vec3 v_color;
    void main() {
        gl_FragColor = vec4(v_color, 1.0);
    }
`;

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program));
}
gl.useProgram(program);

const vao = gl.createVertexArray();
gl.bindVertexArray(vao);

const vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const ebo = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

const aPosition = gl.getAttribLocation(program, 'a_position');
gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 5 * 4, 0);
gl.enableVertexAttribArray(aPosition);

const aColor = gl.getAttribLocation(program, 'a_color');
gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 5 * 4, 2 * 4);
gl.enableVertexAttribArray(aColor);

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
