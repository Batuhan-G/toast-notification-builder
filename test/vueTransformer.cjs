// eslint-disable-next-line @typescript-eslint/no-require-imports
const vueJest = require('@vue/vue3-jest')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const babelJest = require('babel-jest')

const babelTransformer = babelJest.createTransformer({
  presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
})

module.exports = {
  process(sourceText, sourcePath, options) {
    const vueResult = vueJest.process(sourceText, sourcePath, options)
    let code = typeof vueResult === 'string' ? vueResult : vueResult.code

    // vue3-jest smashes the sourcemap directly into the template imports:
    //   ...base64==import { openBlock... } from "vue";
    // Fix: insert a newline before the template's ESM import so babel can parse it.
    code = code.replace(/(\/\/# sourceMappingURL=data:[^\n]*?)(import\s)/, '$1\n$2')

    const result = babelTransformer.process(code, sourcePath + '.js', options)
    const resultCode = typeof result === 'string' ? result : result.code

    const patched =
      resultCode + '\nif (exports.render) { exports.default.render = exports.render; }\n'
    return typeof result === 'string' ? patched : { ...result, code: patched }
  },
}
