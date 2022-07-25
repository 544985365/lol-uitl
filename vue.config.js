const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                asar: false,
                productName: 'LOL工具',
                copyright: '2022',
                compression: 'store',
                nsis: {
                    oneClick: false,
                    allowToChangeInstallationDirectory: true,
                    allowElevation: true,
                    installerIcon: './public/icon.ico',
                    installerHeaderIcon: './public/icon.ico'
                },
                appId: "top.biangege",
                win: {
                    target: "nsis",
                    icon: "./public/icon.ico"
                }
            },
            preload: 'src/preload.js',
        }
    }

})
