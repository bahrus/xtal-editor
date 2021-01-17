import { XtalElement, define, p, symbolize } from 'xtal-element/XtalElement.js';
import { createTemplate } from 'trans-render/createTemplate.js';
import { templStampSym } from 'trans-render/standardPlugins.js';
const mainTemplate = createTemplate(/* html */ `
    <slot part=slotPart name=initVal></slot>
    <div class="remove" part=remove></div>
    <div data-type=string part=editor>
        <div part=field class=field>
            <button part=expander class="expander nonPrimitive">+</button><input part=key><input part=value class=value>
            <div part=childInserters class="nonPrimitive childInserters" data-open=false>
                <button part=objectAdder class=objectAdder>add object</button>
                <button part=stringAdder class=stringAdder>add string</button>
                <button part=boolAdder class=boolAdder>add bool</button>
                <button part=numberAdder class=numberAdder>add number</button>
                
            </div>
            <button class=copyBtn part=copyToClipboard><img class=copy alt="Copy to Clipboard" src="https://cdn.jsdelivr.net/npm/xtal-editor/src/copy.svg"></button>
        </div>
        <div part=childEditors class="nonPrimitive childEditors" data-open=false></div>
        
    </div>
    <style>
        :host{
            display:block;
        }
        slot{
            display: none;
        }
        .expander{
            width: fit-content;
            height: fit-content;
            padding-left: 0px;
            padding-right: 0px;
            width:20px;
        }
        .copy{
            height: 16px;
        }
        .copyBtn{
            width: fit-content;
            height: fit-content;
            padding-left: 0px;
            padding-right: 0px;
            padding-top: 0px;
            padding-bottom: 0px;
            border: 0;
        }
        .objectAdder{
            background-color: #E17000;
        }
        .stringAdder{
            background-color: #009408;
        }
        .boolAdder{
            background-color: #B1C639;
        }
        .numberAdder{
            background-color: #497B8D;
        }
        .childInserters button{
            color: white;
            text-shadow:1px 1px 1px black;
            border-radius: 5px;
            padding: 2;
            border: none;
        }
        .remove{
            padding: 2px 4px;
            -webkit-border-radius: 5px;
            -moz-border-radius: 5px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            text-shadow: 1px 1px 1px black;
            background-color: black;
            
        }
        .remove::after{
            content: "JSON Editor";
        }
        .remove.editKey::after{
            content: "Remove item by deleting the property name.";
        }

        .field{
            display:flex;
            flex-direction:row;
            line-height: 20px;
            margin-top: 2px;
            align-items: center;
        }
        .childInserters{
            display: flex;
            justify-content: center;
        }
        .childEditors{
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
        [data-type="boolean"] [part="key"]{
            background-color: #B1C639;
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
        .value{
            background-color: #ECF3C3;
            flex-grow: 5;
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
const refs = {
    boolAdder: p, childEditors: p, copyToClipboard: p, editor: p, expander: p, key: p,
    objectAdder: p, slotPart: p, stringAdder: p, remove: p, numberAdder: p, value: p,
};
symbolize(refs);
const initTransform = ({ self, type, hasParent }) => ({
    ':host': [templStampSym, refs],
    [refs.expander]: [{}, { click: self.toggle }],
    [refs.key]: [{}, { change: [self.handleKeyChange, 'value'], focus: self.handleKeyFocus }],
    [refs.value]: [{}, { change: [self.handleValueChange, 'value'], focus: self.handleValueFocus }],
    [refs.objectAdder]: [{}, { click: self.addObject }],
    [refs.stringAdder]: [{}, { click: self.addString }],
    [refs.boolAdder]: [{}, { click: self.addBool }],
    [refs.numberAdder]: [{}, { click: self.addNumber }],
    [refs.remove]: !hasParent,
    [refs.copyToClipboard]: [{}, { click: self.copyToClipboard }],
    [refs.slotPart]: [{}, { slotchange: self.handleSlotChange }]
});
const updateTransforms = [
    ({ type }) => ({
        [refs.editor]: [{ dataset: { type: type } }],
    }),
    ({ value }) => ({
        [refs.value]: [{ value: value }]
    }),
    ({ uiValue }) => ({
        [refs.value]: [uiValue === undefined ? undefined : { value: uiValue }]
    }),
    ({ key }) => ({
        [refs.key]: [{ value: key }]
    }),
    ({ childValues, type, self }) => ({
        //insert child editor elements
        [refs.childEditors]: [childValues, XtalEditor.is, , ({ target, item, idx }) => {
                if (!target)
                    return;
                //TODO:  enhance(?) TR to make this declarative
                switch (typeof item) {
                    case 'object':
                        target.key = item.key;
                        target.value = item.value;
                        break;
                    default:
                        target.value = item;
                        target.key = idx.toString();
                }
                target.hasParent = true;
                target._rootEditor = self._rootEditor;
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
const linkTypeAndParsedObject = ({ value, self }) => {
    let parsedObject = value;
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
const link_ParsedObject = ({ uiValue, self }) => {
    if (uiValue === undefined)
        return;
    switch (self.type) {
        case 'object':
        case 'array':
            self._parsedObject = JSON.parse(uiValue);
            self._value = uiValue;
            self.dispatchEvent(new CustomEvent('parsed-object-changed', {
                detail: {
                    value: self._parsedObject
                }
            }));
    }
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
const linkValueFromChildren = ({ upwardDataFlowInProgress, self, type }) => {
    if (!upwardDataFlowInProgress)
        return;
    const children = Array.from(self.shadowRoot.querySelectorAll(XtalEditor.is));
    switch (type) {
        case 'object':
            {
                const newVal = {}; //TODO: support array type
                children.forEach(child => {
                    newVal[child.key] = child.parsedObject; //TODO: support for none primitive
                });
                self.uiValue = JSON.stringify(newVal);
            }
            break;
        case 'array':
            {
                const newVal = [];
                children.forEach(child => {
                    newVal.push(child.parsedObject); //TODO: support for none primitive
                });
                self.uiValue = JSON.stringify(newVal);
            }
            break;
    }
    self.incrementUpdateCount();
    self.upwardDataFlowInProgress = false;
};
const addObject = ({ objCounter, self }) => {
    if (objCounter === undefined)
        return;
    self.open = true;
    const newObj = { ...self.parsedObject };
    newObj['object' + objCounter] = {};
    self.value = JSON.stringify(newObj);
};
const addString = ({ strCounter, self }) => {
    if (strCounter === undefined)
        return;
    const newObj = { ...self.parsedObject };
    newObj['string' + strCounter] = 'val' + strCounter;
    self.value = JSON.stringify(newObj);
    self.open = true;
};
const addBool = ({ boolCounter, self }) => {
    if (boolCounter === undefined)
        return;
    const newObj = { ...self.parsedObject };
    newObj['bool' + boolCounter] = 'false';
    self.value = JSON.stringify(newObj);
    self.open = true;
};
const addNumber = ({ numberCounter, self }) => {
    if (numberCounter === undefined)
        return;
    const newObj = { ...self.parsedObject };
    newObj['number' + numberCounter] = '0';
    self.value = JSON.stringify(newObj);
    self.open = true;
};
const propActions = [linkTypeAndParsedObject, linkChildValues, linkValueFromChildren, addObject, addString, addBool, addNumber, link_ParsedObject];
/**
 * @element xtal-editor
 */
export class XtalEditor extends XtalElement {
    constructor() {
        super(...arguments);
        this.readyToInit = true;
        this.readyToRender = true;
        this.mainTemplate = mainTemplate;
        this.initTransform = initTransform;
        this.updateTransforms = updateTransforms;
        this.propActions = propActions;
        /**
         * @private
         */
        this.actionCount = 0;
    }
    connectedCallback() {
        super.connectedCallback();
        if (!this.hasParent) {
            this._rootEditor = this;
        }
    }
    handleKeyChange(key) {
        if (key === '') {
            this.remove();
        }
        this.value = key;
    }
    handleKeyFocus(e) {
        this._rootEditor[refs.remove].classList.add('editKey');
    }
    handleValueFocus(e) {
        this._rootEditor[refs.remove].classList.remove('editKey');
    }
    handleValueChange(val) {
        this.value = val;
        this.incrementUpdateCount();
    }
    incrementUpdateCount() {
        this.internalUpdateCount = this.internalUpdateCount === undefined ? 0 : this.internalUpdateCount + 1;
    }
    copyToClipboard() {
        this[refs.value].select();
        document.execCommand("copy");
    }
    toggle() {
        this.open = !this.open;
    }
    propActionsHub(propAction) {
    }
    transformHub(transform) {
    }
    addObject() {
        this.objCounter = this.objCounter === undefined ? 1 : this.objCounter + 1;
    }
    addString() {
        this.strCounter = this.strCounter === undefined ? 1 : this.strCounter + 1;
    }
    addBool() {
        this.boolCounter = this.boolCounter === undefined ? 1 : this.boolCounter + 1;
    }
    addNumber() {
        this.numberCounter = this.numberCounter === undefined ? 1 : this.numberCounter + 1;
    }
    handleSlotChange(e) {
        const slot = e.target;
        const nodes = slot.assignedNodes();
        nodes.forEach(node => {
            const aNode = node;
            if (aNode.value !== undefined) {
                this.value = aNode.value;
            }
        });
        // console.log('Element in Slot "' + slots[1].name + '" changed to "' + nodes[0].outerHTML + '".');
    }
}
XtalEditor.is = 'xtal-editor';
XtalEditor.formAssociated = true;
XtalEditor.attributeProps = ({ value, uiValue, type, parsedObject, key, childValues, upwardDataFlowInProgress, internalUpdateCount, open, objCounter, strCounter, boolCounter, numberCounter, hasParent }) => ({
    bool: [upwardDataFlowInProgress, open, hasParent],
    dry: [type, parsedObject, value, hasParent],
    num: [internalUpdateCount, objCounter, strCounter, boolCounter, numberCounter],
    str: [value, type, key, uiValue],
    jsonProp: [value],
    obj: [parsedObject, childValues],
    notify: [internalUpdateCount, parsedObject],
});
define(XtalEditor);