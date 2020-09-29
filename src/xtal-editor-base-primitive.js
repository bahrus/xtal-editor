import { XtalElement, define, p, symbolize } from 'xtal-element/XtalElement.js';
import { createTemplate } from 'trans-render/createTemplate.js';
import { templStampSym } from 'trans-render/standardPlugins.js';
const mainTemplate = createTemplate(/* html */ `
    <div data-type=string part=editor>
        <div part=field>
            <button part=expander class=nonPrimitive>+</button><input part=key><input part=value>
        </div>
        <div part=childEditors class=nonPrimitive data-open=false></div>
    </div>
    <style>
        :host{
            display:block;
        }
        [part="field"]{
            display:flex;
            flex-direction:row;
            line-height: 20px;
            margin-top: 2px;
        }
        [part="childEditors"]{
            margin-left: 25px;
        }
        div[part="childEditors"][data-open="false"]{
            display: none;
        }
        [data-type="object"] button.nonPrimitive{
            display: inline;
        }
        [data-type="object"] div.nonPrimitive[data-open="true"]{
            display: block;
        }
        [data-type="array"] button.nonPrimitive{
            display: inline;
        }
        [data-type="array"] div.nonPrimitive[data-open="true"]{
            display: block;
        }
        [data-type="string"] .nonPrimitive{
            display: none;
        }
        [data-type="number"] .nonPrimitive{
            display: none;
        }
        [data-type="boolean"] .nonPrimitive{
            display: none;
        }
        [data-type="string"] [part="key"]{
            background-color: rgb(0, 148, 8);
        }
        [data-type="object"] [part="key"]{
            background-color: rgb(225, 112, 0);
        }
        [data-type="number"] [part="key"]{
            background-color: rgb(73, 123, 141);
        }
        [data-type="array"] [part="key"]{
            background-color: rgb(45, 91, 137);
        }
        [part="value"]{
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
const refs = { key: p, value: p, editor: p, childEditors: p, expander: p };
symbolize(refs);
const initTransform = ({ self }) => ({
    ':host': [templStampSym, refs],
    [refs.expander]: [{}, { click: self.toggle }],
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
    ({ childValues, type, self }) => ({
        [refs.childEditors]: [childValues, XtalEditorBasePrimitive.is, , ({ target, item }) => {
                if (!target)
                    return;
                //TODO:  enhance(?) TR to make this declarative
                console.log(target, item);
                target.key = item.key;
                target.value = item.value;
                target.addEventListener('internal-update-count-changed', e => {
                    self.upwardDataFlowInProgress = true;
                });
            }]
    }),
    ({ open }) => ({
        [refs.expander]: open ? '-' : '+',
        [refs.childEditors]: [{ dataset: { open: (!!open).toString() } }]
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
    self.upwardDataFlowInProgress = false;
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
const linkChildValues = ({ parsedObject, type, self, upwardDataFlowInProgress }) => {
    if (upwardDataFlowInProgress)
        return;
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
const linkValueFromChildren = ({ upwardDataFlowInProgress, self }) => {
    if (!upwardDataFlowInProgress)
        return;
    const children = Array.from(self.shadowRoot.querySelectorAll(XtalEditorBasePrimitive.is));
    const newVal = {}; //TODO: support array type
    children.forEach(child => {
        newVal[child.key] = child.value; //TODO: support for none primitive
    });
    self.value = JSON.stringify(newVal);
    self.incrementUpdateCount();
};
const propActions = [linkType, linkChildValues, linkValueFromChildren];
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
        this.incrementUpdateCount();
    }
    incrementUpdateCount() {
        this.internalUpdateCount = this.internalUpdateCount === undefined ? 0 : this.internalUpdateCount + 1;
    }
    toggle() {
        this.open = !this.open;
    }
}
XtalEditorBasePrimitive.is = 'xtal-editor-base-primitive';
XtalEditorBasePrimitive.attributeProps = ({ value, type, parsedObject, key, childValues, upwardDataFlowInProgress, internalUpdateCount, open }) => ({
    bool: [upwardDataFlowInProgress, open],
    num: [internalUpdateCount],
    str: [value, type, key],
    jsonProp: [value],
    obj: [parsedObject, childValues],
    notify: [internalUpdateCount],
});
define(XtalEditorBasePrimitive);
