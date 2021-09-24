import {XtalEditor} from './xtal-editor.js';

/**
 * @element xtal-editor-example1
 * @tagName xtal-editor-example1
 */
export class XtalEditorExample1 extends XtalEditor{
    key = 'abc';
    value = {
        "string":"foo",
        "number":5,
        "array":[1,2,3],
        "object":{
            "property":"value",
            "subobj":{
                "arr":["foo","ha"],
                "numero":1
            }
        }
    };
}
customElements.define('xtal-editor-example1', XtalEditorExample1)