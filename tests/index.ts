import { test } from "uvu";
import * as assert from 'uvu/assert';
import { Berowra, parseContent } from "../src";
import MockAdapter from "axios-mock-adapter";
// import { Content, getMap } from "../src/content";
// import { ContentT, values } from "../src/items";
import collections_template from "./data/collections_template.json"
import collections from "./data/collections.json"
import testcollection_content from "./data/testcollection_content.json"
import testcollection from "./data/testcollection.json";
import testcontent from "./data/testcontent.json";
import axios from "axios";
function _mock(baseURL:string) {
    let _axios = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
        }
    })
    var mock = new MockAdapter(_axios);
    mock.onGet('https://example.test/api/collections').reply(function (config) {
        let params:URLSearchParams = config.params
        return [200,params.has('template')?collections_template:collections]
    })
    mock.onGet('https://example.test/api/collection/testcoll').reply(function (config) {
        let params:URLSearchParams = config.params
        return [200,params.has('content')?testcollection_content:testcollection]
    })
    mock.onGet('https://example.test/api/content/testcontent').reply(200,testcontent)
    return async (url:string,params?:URLSearchParams) => {
        let r = await _axios.get(url,{
            params
        })
        return r.data
    }
}

let berowra = new Berowra('https://example.test',_mock)
test("getCollections", async ()=>{
    let data = await berowra.getCollections(true)
    assert.equal(data,[
        {
            "key": "testcoll",
            "lastUpdated": new Date('2021-12-30 12:25:52.501703+00:00'),
            "templateItems": [
                {
                    "id": 6881642076773,
                    "title": "string",
                    "type": "String"
                },
                {
                    "id": 7377043458582,
                    "title": "date",
                    "type": "Date"
                },
                {
                    "id": 4465018618901,
                    "title": "markdown",
                    "type": "Markdown"
                },
                {
                    "id": 2287570115778,
                    "title": "number",
                    "type": "Number"
                },
                {
                    "id": 5941553441329,
                    "title": "colour",
                    "type": "Colour"
                },
                {
                    "id": 8617780377464,
                    "title": "files",
                    "type": "Files"
                },
                {
                    "id": 4147718720142,
                    "title": "str array",
                    "type": "String Array"
                },{
                    "id": 0
                }
            ],
            "title": "Test"
        }
    ])
})



test.run()