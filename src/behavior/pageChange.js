//单页面应用还要统计页面变化
import { generateId } from "../utils";
import { lazyReportBatch } from "../report";

export default function pageChange() {
    //监听路由变化
    //hash
    //history

    let oldUrl = ''
    window.addEventListener("hashchange", function (event) {
        const newUrl = event.newURL
        const reportData = {
            from: oldUrl,
            to: newUrl,
            type: 'behavior',
            subType: 'hashChange',
            startTime: performance.now(),
            uuid: generateId(),
        }
        lazyReportBatch(reportData);
        oldUrl = newUrl
    },
        true//默认冒泡改成捕获
    );

    //history路由
    let from = ''
    window.addEventListener('popstate', function (event) {
        const to = window.location.href;
        const reportData = {
            from,
            to,
            type: 'behavior',
            subType: 'popstate',
            startTime: performance.now(),
            uuid: generateId(),
        }
        lazyReportBatch(reportData);
        from = to
    }, true)

}