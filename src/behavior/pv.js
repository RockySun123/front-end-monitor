//pv -- 页面访问次数
import { generateId } from "../utils"
import { lazyReportBatch } from "../report"
export default function pv() {
    const reportData = {
        type: 'behavior',
        subType: 'pv',
        startTime: performance.now(),//开始时间，因为要同时访问时长
        pageUrl: window.location.href,
        referrer: document.referrer,//页面来源 -- 上一页
        uuid: generateId(),//用户唯一标识
    }
    lazyReportBatch(reportData)
}