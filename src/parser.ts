export type types = "Colour"|"Markdown"|"Files"|"String"|"String Array"|"Number"|"Date"
export const Parser: {
    [k in types]: (d:{title: string,type: types,value?: string|string[]}) => any
} = {
    "Colour": (d:any)=>d.value,
    "Markdown": (d:any)=>d.value,
    "Files": (d:any)=>d.value ?? [],
    "String": (d:any)=>d.value,
    "String Array": (d:any)=>d.value,
    "Number": (d:any)=>parseInt(d.value),
    "Date": (d:any)=>new Date(d.value)
}