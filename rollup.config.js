import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
    input: 'swag-tag.js',
    output: {
        dir: 'dist/',
        format: 'es'
    },
    plugins: [nodeResolve()]
}