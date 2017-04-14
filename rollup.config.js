import rollup from 'rollup';

import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  entry:              'src/main.js',
  sourceMap:          true,
  globals: {
    m:                'mithril',
  },
  plugins: [
    nodeResolve({
      jsnext:         true,
      main:           true,
      browser:        true,
    }),
    commonjs({
      include:        'node_modules/**',
    }),
    babel({
      exclude:        'node_modules/**',
      babelrc:        false,
      presets:        [ [ 'es2015', { modules: false } ] ],
      plugins:        [ 'external-helpers' ],
    }),
  ],
  external:           [ 'mithril' ],
  targets: [
    { dest: 'dist/mithril-dialog.js', format: 'iife', moduleName: 'MithrilDialog', banner: 'var m$1 = m;' },
    { dest: 'dist/mithril-dialog.cjs.js', format: 'cjs' },
    { dest: 'dist/mithril-dialog.es2015.js', format: 'es' },
  ],
}
