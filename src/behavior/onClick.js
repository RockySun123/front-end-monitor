//统计用户点击行为
import { lazyReportBatch } from "../report"
import { generateId } from "../utils"

export default function click() {
    //监控用户鼠标按下，移动端的touchstart事件
    ['mousedown', 'touchstart'].forEach((eventType) => {
        window.addEventListener(eventType, (e) => {
            //获取用户点击的元素
            const target = e.target
            if (target.tagName) {
                const reportData = {
                    type: 'behavior',
                    subType: 'click',
                    target: target.tagName,
                    startTime: e.timeStamp,
                    innerHTML: target.innerHTML,//元素的文本
                    outerHTML: target.outerHTML,//元素的html
                    width: target.offsetWidth,//元素的宽
                    height: target.offsetHeight,//元素的高
                    eventType,
                    path: e.path,//获取元素路径,
                    // scrollTop: document.documentElement.scrollTop,//获取滚动条距离
                    uuid: generateId()
                }
                lazyReportBatch(reportData)
            }
        }, true)
    })
}



