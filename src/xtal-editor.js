import { xc } from 'xtal-element/lib/XtalCore.js';
import { xp } from 'xtal-element/lib/XtalPattern.js';
import { html } from 'xtal-element/lib/html.js';
import { DOMKeyPE } from 'xtal-element/lib/DOMKeyPE.js';
import('./ib-id-xtal-editor.js');
const mainTemplate = html `
<slot part=slot name=initVal></slot>
<div class="remove" part=remove></div>
<div data-type=string part=editor>
    <div part=field class=field>
        <button part=expander class="expander nonPrimitive">+</button><input part=key><input part=value class=value>
        <div part=child-inserters class="nonPrimitive child-inserters" data-open=false>
            <button part=object-adder class=object-adder>add object</button>
            <button part=string-adder class=string-adder>add string</button>
            <button part=bool-adder class=bool-adder>add bool</button>
            <button part=number-adder class=number-adder>add number</button>
            
        </div>
        <button class=copyBtn part=copy-to-clipboard><img class=copy alt="Copy to Clipboard" src="https://cdn.jsdelivr.net/npm/xtal-editor/src/copy.svg"></button>
    </div>
    <div part=child-editors class="nonPrimitive child-editors" data-open=false>
        <ib-id-xtal-editor tag=xtal-editor></ib-id-xtal-editor>
    </div>
    
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
    .object-adder{
        background-color: #E17000;
    }
    .string-adder{
        background-color: #009408;
    }
    .bool-adder{
        background-color: #B1C639;
    }
    .number-adder{
        background-color: #497B8D;
    }
    .child-inserters button{
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
    .child-inserters{
        display: flex;
        justify-content: center;
    }
    .child-editors{
        margin-left: 25px;
    }
    div[part="child-editors"][data-open="false"]{
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
`;
const refs = {
    slotElement: 0, boolAdderPart: 0, childEditorsPart: 0, copyToClipboardPart: 0,
    editorPart: 0, expanderPart: 0, keyPart: 0, objectAdderPart: 0, stringAdderPart: 0,
    removePart: 0, numberAdderPart: 0, valuePart: 0,
    ibIdXtalEditorElement: 0
};
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
const addEventHandlers = ({ domCache, self, _rootEditor }) => [
    {
        [refs.expanderPart]: [, { click: self.toggle }],
        [refs.keyPart]: [, { change: [self.handleKeyChange, 'value'], focus: self.handleKeyFocus }],
        [refs.valuePart]: [, { change: [self.handleValueChange, 'value'], focus: self.handleValueFocus }],
        [refs.objectAdderPart]: [, { click: self.addObject }],
        [refs.stringAdderPart]: [, { click: self.addString }],
        [refs.boolAdderPart]: [, { click: self.addBool }],
        [refs.numberAdderPart]: [, { click: self.addNumber }],
        [refs.copyToClipboardPart]: [, { click: self.copyToClipboard }],
        [refs.slotElement]: [, { slotchange: self.handleSlotChange }],
        [refs.ibIdXtalEditorElement]: [{ _rootEditor: _rootEditor, host: self }]
    },
    [{ handlersAttached: true }]
];
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
const updateTransforms = [
    ({ value }) => [{ [refs.valuePart]: [{ value: value }] }],
    ({ type }) => [{ [refs.editorPart]: [{ dataset: { type: type } }] }],
    ({ uiValue }) => [{ [refs.valuePart]: [uiValue === undefined ? undefined : { value: uiValue }] }],
    ({ key }) => [{ [refs.keyPart]: [{ value: key }] }],
    ({ childValues, type, self }) => [
        { [refs.ibIdXtalEditorElement]: [{ list: childValues }] }
    ],
    ({ open }) => [
        {
            [refs.expanderPart]: open ? '-' : '+',
            [refs.childEditorsPart]: [{ dataset: { open: (!!open).toString() } }]
        }
    ],
    ({ hasParent }) => [{
            [refs.removePart]: [{ style: { display: hasParent ? 'none' : 'block' } }],
        }]
];
const propActions = [
    xp.manageMainTemplate,
    linkTypeAndParsedObject,
    linkChildValues,
    linkValueFromChildren,
    addObject,
    addString,
    addBool,
    addNumber,
    link_ParsedObject,
    xp.attachShadow,
    addEventHandlers,
    updateTransforms,
];
const propDefGetter = [
    xp.props,
    ({ upwardDataFlowInProgress, open }) => ({
        type: Boolean
    }),
    ({ handlersAttached }) => ({
        type: Boolean,
        dry: true,
        stopReactionsIfFalsy: true
    }),
    ({ hasParent }) => ({
        type: Boolean,
        dry: true
    }),
    ({ objCounter, strCounter, boolCounter, numberCounter }) => ({
        type: Number
    }),
    ({ internalUpdateCount }) => ({
        type: Number,
        notify: true
    }),
    ({ type }) => ({
        type: String,
        dry: true
    }),
    ({ key, uiValue }) => ({
        type: String,
    }),
    ({ value }) => ({
        type: String,
        dry: true,
        parse: true
    }),
    ({ parsedObject }) => ({
        type: Object,
        dry: true,
        notify: true
    }),
    ({ childValues }) => ({
        type: Object,
    }),
];
const propDefs = xc.getPropDefs(propDefGetter);
/**
 * @element xtal-editor
 */
export class XtalEditor extends HTMLElement {
    constructor() {
        super(...arguments);
        this.reactor = new xc.Reactor(this, [
            {
                type: Array,
                ctor: DOMKeyPE
            }
        ]);
        this.self = this;
        this.refs = refs;
        this.propActions = propActions;
        this.mainTemplate = mainTemplate;
        /**
         * @private
         */
        this.actionCount = 0;
    }
    handleKeyChange(key) {
        if (key === '') {
            this.remove();
        }
        this.value = key;
    }
    handleKeyFocus(e) {
        this._rootEditor.domCache[refs.removePart].classList.add('editKey');
    }
    handleValueFocus(e) {
        this._rootEditor.domCache[refs.removePart].classList.remove('editKey');
    }
    handleValueChange(val) {
        this.value = val;
        this.incrementUpdateCount();
    }
    incrementUpdateCount() {
        this.internalUpdateCount = this.internalUpdateCount === undefined ? 0 : this.internalUpdateCount + 1;
    }
    copyToClipboard() {
        this[refs.valuePart].select();
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
    connectedCallback() {
        xc.hydrate(this, propDefs);
        if (!this.hasParent) {
            this._rootEditor = this;
        }
    }
    onPropChange(n, propDef, newVal) {
        this.reactor.addToQueue(propDef, newVal);
    }
}
XtalEditor.is = 'xtal-editor';
xc.letThereBeProps(XtalEditor, propDefs, 'onPropChange');
xc.define(XtalEditor);
