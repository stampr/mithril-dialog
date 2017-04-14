let g = null;
let w = null;

/* eslint-disable no-undef, no-empty */
try {
  g = global;
}
catch (err) {}

try {
  w = window;
}
catch (err) {}
/* eslint-enable no-undef, no-empty */

export default (g || w).jQuery || (g || w).$;
