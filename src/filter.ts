export type Filter = {
    [k:string]: string|number|number[]|Filter
}

const padn = (n:number,p:number) => String(n).padStart(p,'0')

const dateToStr = (d:Date) => `${d.getFullYear()}-${padn(d.getMonth()+1,2)}-${padn(d.getDate(),2)}`

const parseCond = (s:URLSearchParams,cond:string,value:string|number|number[],pref:string) => {
    const [key,rule] = cond.split("?")
    if(rule === "r"){
        if(Array.isArray(value)){
            s.set(`${pref}${key}!gte`,String(value[0]))
            s.set(`${pref}${key}!lte`,String(value[1]))
        }
    }else{
        if(["string","number"].includes(typeof value)){
            let k = `${pref}${key}`
            if(rule === "!contains"){
                k += '!not_contains'
            }else if(rule != null){
                k += rule
            }
            s.set(k,String(value))
        }
    }
}
const filter_obj = (search:URLSearchParams,cond:string,val:Filter[''],pfx:string = "") => {
    if((typeof val === "object") && !Array.isArray(val)){
        if(val instanceof Date){
            parseCond(search,cond,dateToStr(val),pfx)
        }else{
            Object.entries(val).forEach(([_cond,_val])=>{
                let prev = pfx + cond
                filter_obj(search,_cond,_val,(prev === ""?"":(prev + '.')))
            })
        }
    }else{
        parseCond(search,cond,val,pfx)
    }
}
export const filter = (obj:Filter) => {
    let search = new URLSearchParams()
    filter_obj(search,"",obj)
    return search
}
