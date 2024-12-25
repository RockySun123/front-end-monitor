//SDK 的公共参数,可自定义
const config = {
    //上传的 url 地址
    url: 'http://127.0.0.1:8080/api',
    // 监控的项目
    projectName: 'eyesdk',

    isImageUpload: true,
    batchSize: 5

}


//设置config
export function setConfig(options) {
    for (const key in config) {
        if (options[key]) {
            config[key] = options[key]
        }
    }
}

export default config