const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
        builderOptions: {
            asar: false
        },
        preload: 'src/preload.js',
        logo: 'src/assets/sullly.jpg'
    }
}

})
