import { XtalElement, define } from 'xtal-element/XtalElement.js';
import { createTemplate } from 'trans-render/createTemplate.js';
import { templStampSym } from 'trans-render/standardPlugins.js';
const mainTemplate = createTemplate(/* html */ `
    <div data-type=string part=editor>
        <button part=expander class="nonPrimitive">Expand</button><input part=key><input part=value>
        <div part=childEditors class="nonPrimitive"></div>
    </div>
    <style>
        [part="editor"][data-type="object"] .nonPrimitive{
            display: inline;
        }
        [part="editor"][data-type="array"] .nonPrimitive{
            display: inline;
        }
        [part="editor"][data-type="string"] .nonPrimitive{
            display: none;
        }
        [part="editor"][data-type="number"] .nonPrimitive{
            display: none;
        }
        [part="editor"][data-type="boolean"] .nonPrimitive{
            display: none;
        }
        [part="editor"][data-type="string"] [part="key"]{
            background-color: #B1C639;;
        }
        [part="editor"][data-type="object"] [part="key"]{
            background-color: #E17000;
        }

        [part="editor"] [part="value"]{
            background-color: #ECF3C3;
            width: 600px;
        }

        input {
            border: none;
            -webkit-border-radius: 5px;
            -moz-border-radius: 5px;
            border-radius: 5px;
            padding: 3px;
            margin-right: 2px;
        }

    </style>
`);
const refs = { key: Symbol(), value: Symbol(), editor: Symbol(), childEditors: Symbol() };
const initTransform = ({ self }) => ({
    ':host': [templStampSym, refs],
    [refs.key]: [{}, { change: [self.handleKeyChange, 'value'] }],
    [refs.value]: [{}, { change: [self.handleValueChange, 'value'] }]
});
const updateTransforms = [
    ({ type }) => ({
        [refs.editor]: [{ dataset: { type: type } }],
    }),
    ({ value }) => ({
        [refs.value]: [{ value: value }]
    }),
    ({ key }) => ({
        [refs.key]: [{ value: key }]
    }),
    ({ childValues, type }) => ({
        [refs.childEditors]: [childValues, XtalEditorBasePrimitive.is, , (context) => {
                console.log(context);
            }]
    })
];
const linkType = ({ value, self }) => {
    let parsedObject = undefined;
    if (value !== undefined) {
        if (value === 'true' || value === 'false') {
            self.type = 'boolean';
        }
        else if (!isNaN(value)) {
            self.type = 'number';
        }
        else {
            try {
                parsedObject = JSON.parse(value);
                if (Array.isArray(parsedObject)) {
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
    }
    self.parsedObject = parsedObject;
};
function toString(item) {
    switch (typeof item) {
        case 'string':
            return item;
        case 'number':
        case 'boolean':
            return item.toString();
            break;
        case 'object':
            return JSON.stringify(item);
    }
}
const linkChildValues = ({ parsedObject, type, self }) => {
    if (parsedObject === undefined) {
        self.childValues = undefined;
        return;
    }
    switch (type) {
        case 'array':
            self.childValues = parsedObject.map(item => toString(item));
            break;
        case 'object':
            const childValues = [];
            for (var key in parsedObject) {
                childValues.push({
                    key: key,
                    value: toString(parsedObject[key]),
                });
            }
            self.childValues = childValues;
            return;
    }
};
const propActions = [linkType, linkChildValues];
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
        this.value = key;
    }
    handleValueChange(val) {
        this.value = val;
    }
}
XtalEditorBasePrimitive.is = 'xtal-editor-base-primitive';
XtalEditorBasePrimitive.attributeProps = ({ value, type, parsedObject, key, childValues }) => ({
    str: [value, type, key],
    jsonProp: [value],
    obj: [parsedObject, childValues],
});
define(XtalEditorBasePrimitive);
