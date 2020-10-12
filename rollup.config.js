import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
    input: 'src/xtal-editor.js',
    output: {
        dir: 'dist/',
        format: 'es'
    },
    plugins: [nodeResolve()]
}