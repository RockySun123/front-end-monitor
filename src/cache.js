import { deepCopy } from "./utils"
//上报数据缓存
const caches = []

export function getCaches() {
    return deepCopy(caches)
}

export function addCache(data) {
    caches.push(data)
}

export function clearCaches() {
    caches.length = 0
}