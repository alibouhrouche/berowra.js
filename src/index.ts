import { filter, Filter } from "./filter"
import { Parser } from "./parser"
import { collections_t, collections_template_t, collections_up_t, collection_content_t, collection_t, collection_up_t, content_t, content_up_t } from "./types"

function parseContent(data: Record<number, any>, map: Record<string, number>) {
    let ret = {}
    Object.entries(map).forEach(([v, k]) => {
        let d = data[k]
        if (d && d.type) {
            ret[v] = d.value
        }
    })
    return ret
}

function parseFields(content: content_up_t['content']) {
    let ret:content_t['content'] = {}
    Object.entries(content).forEach(([k, v]) => {
        ret[parseInt(k)] = {
            title: v.title,
            type: v.type,
            value: Parser[v.type](v)
        }
    })
    return ret
}

type FetchT = <T>(url: string, params?: URLSearchParams) => Promise<T>

interface parseItems {
    (items: collection_up_t['items'],content:true):collection_content_t['items'],
    (items: collection_up_t['items'],content:false):collection_t['items']
}

function parseItems(items: collection_up_t['items'],content:boolean) {
    return items.map(v=>({
        title:v.title,
        key:v.key,
        lastUpdated:new Date(v.lastUpdated),
        ...(content)?{
            content:parseFields(v.content!)
        }:{}}))
}

export interface Berowra {
    getCollections(template: true,filter?: URLSearchParams): Promise<collections_template_t[]>,
    getCollections(template: false,filter?: URLSearchParams): Promise<collections_t[]>,
    getCollection(key: string, content: true, filter?: URLSearchParams): Promise<collection_content_t>,
    getCollection(key: string, content: false, filter?: URLSearchParams): Promise<collection_t>,
    getContent(key: string): Promise<content_t>
}

export class Berowra {
    url: string
    fetch: FetchT
    static defaultFetch = (baseurl: string) => {
        if(!('fetch' in globalThis)) throw new Error("fetch Not Supported");
        return (async (_url, _params) => {
            let url = baseurl + _url
            if ((_params != null) && (_params.toString() !== "")) url += '?' + _params.toString()
            let r = await fetch(url)
            return await r.json()
        })
    }
    constructor(url: string, _fetch: (url: string) => FetchT = Berowra.defaultFetch) {
        this.url = url
        this.fetch = _fetch(url)
    }
    async getCollections(template: boolean = false, filter?: URLSearchParams) {
        let params = new URLSearchParams(filter)
        if (template) params.set('template', '')
        let data = await this.fetch<collections_up_t[]>('/api/collections', params)
        return data.map(v => ({...v,lastUpdated: new Date(v.lastUpdated)}))
    }
    async getCollection(key: string, content: boolean = false, filter?: URLSearchParams) {
        let params = new URLSearchParams(filter)
        if (content) params.set('content', '')
        let data = await this.fetch<collection_up_t>(`/api/collection/${encodeURIComponent(key)}`, params)
        return {title: data.title,items:parseItems(data.items,content)}
    }
    async getContent(key: string) {
        let data = await this.fetch<content_up_t>(`/api/content/${encodeURIComponent(key)}`)
        return {...data,content:parseFields(data.content)}
    }
}
export { Filter, filter, Parser, parseContent };