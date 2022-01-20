import { test } from "uvu";
import * as assert from 'uvu/assert';
import { Berowra, filter } from "../src";

test("filter",()=>{
    assert.equal(decodeURIComponent(filter({
        content:{
            1570026906494:{
                title: "colour"
            },
            1570026906495:{
                "value?r": [10,20]
            }
        }
    }).toString()),"content.1570026906494.title=colour&content.1570026906495.value!gte=10&content.1570026906495.value!lte=20")
})

test.run()