import {XtalElement, define, TransformValueOptions} from 'xtal-element/XtalElement.js';
import {createTemplate} from 'trans-render/createTemplate.js';

const mainTemplate = createTemplate(/* html */`
    <input part=key><input part=value>
`);

export class XtalEditorBaseString extends XtalElement{
    static is = 'xtal-editor-base-string';
    readyToInit = true;
    readyToRender = true;
    mainTemplate = mainTemplate;
    initTransform = {
        keyPart: [{},{change: [this.handleKeyChange, 'value']}]
    } as TransformValueOptions;
    handleKeyChange(key: string){
        if(key === ''){
            this.remove();
        }
    }
}
define(XtalEditorBaseString);