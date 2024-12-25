import { lazyReportBatch } from "../report"
//错误收集代码
export default function error() {
    //捕获子资源加载失败的错误，js,css,img
    window.addEventListener('error', function (e) {
        const target = e.target
        if (!target) {//说明不是资源加载的错误
            return
        }
        if (target.src || target.href) {
            const url = target.src || target.href
            const reportData = {
                type: 'error',
                subType: 'resource',
                url,
                html: target.outerHTML,
                pageUrl: window.location.href,
                paths: e.path,
                startTime: performance.now()
            }
            //todo
            lazyReportBatch(reportData)
        }
    }, true)

    //真正js错误捕获
    window.onerror = function (message, url, lineNo, columnNo, error) {
        const reportData = {
            type: 'error',
            subType: 'js',
            message,
            url,
            lineNo,
            columnNo,
            stack: error.stack,//error 调用栈
            pageUrl: window.location.href,
            startTime: performance.now()
        }
        //todo
        lazyReportBatch(reportData)
    }

    //捕获Promise，async awit 错误，
    window.addEventListener('unhandledrejection', function (e) {
        const reportData = {
            type: 'error',
            subType: 'promise',
            reason: e.reason?.stack,//错误信息
            pageUrl: window.location.href,
            startTime: performance.now()
        }
        //todo
        lazyReportBatch(reportData)
    }, true)
}