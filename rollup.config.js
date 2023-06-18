import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'

export default [
    {
        external: [/@babel\/runtime/, /core-js/],
        input: 'build/index.js',
        output: [
            {
                format: 'cjs',
                file: 'dist/turkey-neighbourhoods.cjs',
                sourcemap: false
            }
        ],
        plugins: [
            json(),
            nodeResolve({preferBuiltins: true}),
            commonjs({sourceMap: true})
        ]
    }
]
