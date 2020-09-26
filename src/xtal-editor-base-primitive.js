import { XtalElement, define } from 'xtal-element/XtalElement.js';
import { createTemplate } from 'trans-render/createTemplate.js';
import { templStampSym } from 'trans-render/standardPlugins.js';
const mainTemplate = createTemplate(/* html */ `
    <div data-type=string part=editor>
        <button part=expander>Expand</button><input part=key><input part=value>
    </div>
    <style>
        [part="editor"][data-type="object"] [part="expander"]{
            display: inline;
        }
        [part="editor"][data-type="array"] [part="expander"]{
            display: inline;
        }
        [part="editor"][data-type="string"] [part="expander"]{
            display: none;
        }
        [part="editor"][data-type="number"] [part="expander"]{
            display: none;
        }
        [part="editor"][data-type="boolean"] [part="expander"]{
            display: none;
        }
    </style>
`);
const refs = { key: Symbol(), value: Symbol(), editor: Symbol() };
const initTransform = ({ self }) => ({
    ':host': [templStampSym, refs],
    [refs.key]: [{}, { change: [self.handleKeyChange, 'value'] }],
    [refs.value]: [{}, { change: [self.handleValueChange, 'value'] }]
});
const updateTransforms = [
    ({ type }) => ({
        [refs.editor]: [{ dataset: { type: type } }]
    })
];
const linkType = ({ value, self }) => {
    if (value === undefined)
        return;
    if (value === 'true' || value === 'false') {
        self.type = 'boolean';
    }
    else if (!isNaN(value)) {
        self.type = 'number';
    }
    else {
        try {
            const obj = JSON.parse(value);
            if (Array.isArray(obj)) {
                self.type = 'array';
            }
            else {
                self.type = 'object';
            }
        }
        catch (e) {
            self.type = 'string';
        }
    }
};
const propActions = [linkType];
export class XtalEditorBasePrimitive extends XtalElement {
    constructor() {
        super(...arguments);
        this.readyToInit = true;
        this.readyToRender = true;
        this.mainTemplate = mainTemplate;
        this.initTransform = initTransform;
        this.updateTransforms = updateTransforms;
        this.propActions = propActions;
    }
    handleKeyChange(key) {
        if (key === '') {
            this.remove();
        }
    }
    handleValueChange(val) {
        this.value = val;
    }
}
XtalEditorBasePrimitive.is = 'xtal-editor-base-primitive';
XtalEditorBasePrimitive.attributeProps = ({ value, type }) => ({
    str: [value, type]
});
define(XtalEditorBasePrimitive);
