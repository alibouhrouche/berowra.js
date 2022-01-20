import { types } from "./parser"

export type field_t = {
    title: string,
    type: "String"|"Markdown"|"Colour",
    value: string
}|{
    title: string,
    type: "String Array" | "Files",
    value: string[]
}|{
    title: string,
    type: "Number",
    value: Number
}|{
    title: string,
    type: "Date",
    value: Date
}

export type content_t = {
    collectionKey: string,
    content:{
        [k: number]:field_t
    }
    lastUpdated: Date,
    title: string
}

export type content_up_t = {
    collectionKey: string,
    content:{
        [k: string]:{
            title: string,
            type: types,
            value: string|string[]
        }
    }
    lastUpdated: Date,
    title: string
}


export type collections_up_t = {
    key: string,
    lastUpdated: string,
    title: string
}

export type collections_t = {
    key: string,
    lastUpdated: Date,
    title: string
}

export type collections_template_t = {
    key: string,
    lastUpdated: Date,
    templateItems: {
        id: number,
        title?: string,
        type?: types
    }[],
    title: string
}

export type collection_up_t = {
    items: {
        content?: content_up_t['content'],
        key: string,
        lastUpdated: string,
        title: string
    }[],
    title: string
}


export type collection_t = {
    items: collections_t[],
    title: string
}

export type collection_content_t = {
    items: {
        content: {
            [k:string]: field_t
        },
        key: string,
        lastUpdated: Date,
        title: string
    }[],
    title: string
}
