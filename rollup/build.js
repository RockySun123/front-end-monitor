const path = require('path')
const json = require('@rollup/plugin-json')//允许你导入 JSON 文件。
const { babel } = require('@rollup/plugin-babel')//使用 Babel 编译 JavaScript 文件
const resolve = require('@rollup/plugin-node-resolve')//使用 Node.js 的解析算法来解析模块

const resolveFile = function (filePath) {//给定的文件路径连接起来
    return path.join(__dirname, filePath)
}

const plugins = [
    resolve(),//可以识别 xxx/index.js, 直接 使用 import xxx from 'xxx'
    json({
        compact: true // 压缩空格
    }),
    babel({
        extensions: ['.js', '.ts'],
        babelHelpers: 'bundled',
        presets: [
            [
                '@babel/preset-env',
                {
                    targets: {
                        browsers: [
                            '> 1%',
                            'last 2 versions',
                            'not ie <=8'
                        ]
                    }
                }
            ]
        ]
    })
]

//这个配置文件配置了 Rollup 来打包一个 JavaScript 模块（../src/webEyeSDK.js），并生成三种不同格式的输出文件（iife、esm、cjs），每种格式都包含了 source map 文件以便于调试。
module.exports = [
    {
        plugins,
        input: resolveFile('../src/webEyeSDK.js'),
        output: {
            file: resolveFile('../dist/monitor.js'),
            format: 'iife',//可以在 html 中直接引入使用，
            name: 'monitor',
            sourcemap: true
        }
    },
    {
        plugins,
        input: resolveFile('../src/webEyeSDK.js'),
        output: {
            file: resolveFile('../dist/monitor.esm.js'),
            format: 'esm',//可以在 node 中使用
            name: 'monitor',
            sourcemap: true
        }
    },
    {
        plugins,
        input: resolveFile('../src/webEyeSDK.js'),
        output: {
            file: resolveFile('../dist/monitor.cjs.js'),
            format: 'cjs',//可以在 node 中使用
            name: 'monitor',
            sourcemap: true
        }
    }
]

