#ifdef GL_ES
precision mediump float;
#endif

varying vec2 pos;

uniform sampler2D filter_background;
uniform vec2 filter_res;
uniform vec2 u_resolution;

void main() {
  // Color of pixel from the canvas
  vec4 col = texture2D(filter_background, pos);

  vec2 uv = vec2(pos.x * filter_res.x / filter_res.y, pos.y) - vec2(1.0, 0.5);

  // Colors closer to the centre should be bright
  float dist = smoothstep(0.2, 1.0, length(0.5 * uv));

  // New color of pixel
  // gl_FragColor = vec4(vec3(dist), 1.0);
  gl_FragColor = vec4(col.rgb * (1.0 - dist), 1.0);

  // Do nothing, just return pixel
  // gl_FragColor = col;
}