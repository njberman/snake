#ifdef GL_ES
precision mediump float;
#endif

varying vec2 pos;

uniform sampler2D filter_background;
uniform vec2 filter_res;
uniform vec2 u_bounds;
uniform vec2 u_resolution;

void main() {
  // Color of pixel from the canvas
  vec4 col = texture2D(filter_background, pos);

  vec2 uv = (gl_FragCoord.xy - u_resolution.xy * 0.5) / u_resolution.y;

  // Colors closer to the centre should be bright
  float flooringFactor = 9.0;
  float dist = floor(flooringFactor * length(0.5 * uv)) / flooringFactor * 0.9;

  // New color of pixel
  // gl_FragColor = vec4(vec3(1.0 - dist), 1.0);
  gl_FragColor = vec4(col.rgb * (1.0 - dist), 1.0);

  // Do nothing, just return pixel
  // gl_FragColor = col;
}