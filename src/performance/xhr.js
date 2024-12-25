import { lazyReportBatch } from "../report"
//统计 xhr 时间
//重写原来的 xhr
export const originalProto = XMLHttpRequest.prototype
export const originalSend = originalProto.send
export const originalOpen = originalProto.open

function overwriteAndSend() {
    originalProto.open = function newOpen(...args) {
        this.url = args[1];//获取url
        this.method = args[0];//获取方法
        originalOpen.apply(this, args)
    }
    originalProto.send = function newSend(...args) {
        this.startTime = Date.now();
        const onloaded = () => {
            this.endTime = Date.now();
            this.duration = this.endTime = this.startTime
            const { url, method, startTime, endTime, duration, status } = this

            const reportData = {
                status,
                duration,
                startTime,
                endTime,
                url,
                method: method.toUpperCase(),
                type: 'performance',
                subType: 'xhr',
                success: status >= 200 && status < 300
            }
            //todo
            lazyReportBatch(reportData)
            //移除监听
            this.removeEventListener('loadend', onloaded, true)
        }
        //loadend 在一个资源的加载进度停止之后被触发（例如：已经触发 "error","abort"或“load”事件之后）
        //适用于 XMLHttpRequest 对象,以及<img> 或 <video> 之类的元素的内容
        this.addEventListener('loadend', onloaded, true)
        originalSend.apply(this, args)
    }
}


export default function xhr() {
    overwriteAndSend()
}