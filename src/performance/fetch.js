//统计fetch请求时间
import { lazyReportBatch } from '../report'
const originalFetch = window.fetch;
function overwriteFetch() {
    window.fetch = function newFetch(url, config) {
        const startTime = Date.now();
        const reportData = {
            type: 'performance',
            subType: 'fetch',
            url,
            startTime,
            method: config.method.toUpperCase()
        }
        return originalFetch(url, config).then((res) => {
            const endTime = Date.now();
            reportData.endTime = endTime;
            reportData.duration = endTime - reportData.startTime
            const data = res.clone()
            reportData.status = data.status
            reportData.success = data.ok
            //todo 上报数据
            lazyReportBatch(reportData)
            return res
        }).catch(err => {
            const endTime = Date.now();
            reportData.endTime = endTime;
            reportData.duration = endTime - reportData.startTime
            reportData.status = 0
            reportData.success = false
            //todo 上报数据
            lazyReportBatch(reportData)
        })
    }
}

export default function fetch() {
    overwriteFetch()
}