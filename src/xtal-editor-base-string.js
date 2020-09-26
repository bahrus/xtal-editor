import { XtalElement, define } from 'xtal-element/XtalElement.js';
import { createTemplate } from 'trans-render/createTemplate.js';
const mainTemplate = createTemplate(/* html */ `
    <input part=key><input part=value>
`);
export class XtalEditorBaseString extends XtalElement {
    constructor() {
        super(...arguments);
        this.readyToInit = true;
        this.readyToRender = true;
        this.mainTemplate = mainTemplate;
        this.initTransform = {
            keyPart: [{}, { change: [this.handleKeyChange, 'value'] }]
        };
    }
    handleKeyChange(key) {
        if (key === '') {
            this.remove();
        }
    }
}
XtalEditorBaseString.is = 'xtal-editor-base-string';
define(XtalEditorBaseString);
