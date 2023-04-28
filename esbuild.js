import * as esbuild from 'esbuild'

await esbuild.build({
    entryPoints: ['./build/index.js'],
    bundle: true,
    platform: 'node',
    packages: 'external',
    outfile: './dist/turkey-neighbourhoods.cjs.js'
})