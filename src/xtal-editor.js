import { xc } from 'xtal-element/lib/XtalCore.js';
import { xp } from 'xtal-element/lib/XtalPattern.js';
import { html } from 'xtal-element/lib/html.js';
import { DOMKeyPE } from 'xtal-element/lib/DOMKeyPE.js';
import { styleTemplate } from './xtal-editor-style.js';
import('./ib-id-xtal-editor.js');
import('pass-prop/p-p.js');
const mainTemplate = html `
<slot part=slot name=initVal></slot>
<div class="remove" part=remove></div>
<div data-type=string part=editor class=editor>
    <div part=field class=field>
        <div class=text-editing>
            <button part=expander class="expander nonPrimitive">+</button>
            <input aria-label=key part=key class=key><input aria-label=value part=value class=value>
        </div>
        <div part=child-inserters class="nonPrimitive child-inserters" data-open=false>
            <button part=object-adder class="object adder">add object</button>
            <button part=string-adder class="string adder">add string</button>
            <button part=bool-adder class="bool adder">add bool</button>
            <button part=number-adder class="number adder">add number</button>
            <button id=copy class=action part=copy-to-clipboard title="Copy to Clipboard"></button>
            <button id=expand-all class=action part=expand-all title="Expand All" aria-label="Expand All"></button>
            <button id=collapse-all class=action part=collapse-all title="Collapse All" aria-label="Collapse All"></button>
        </div>
        
    </div>
    <div part=child-editors class="nonPrimitive child-editors" data-open=false>
        <p-p from-host observe-prop=expandAll to=xtal-editor prop=expandAll></p-p>
        <p-p from-host observe-prop=collapseAll to=xtal-editor prop=collapseAll></p-p>
        <p-p from-host observe-prop=evenLevel to=xtal-editor prop=parentLevel></p-p>
        <ib-id-xtal-editor tag=xtal-editor></ib-id-xtal-editor>
    </div>
    
</div>
`;
const s = '';
const refs = {
    slotElement: s, boolAdderPart: s, childEditorsPart: s, copyId: s,
    editorPart: s, expanderPart: s, keyPart: s, objectAdderPart: s, stringAdderPart: s,
    removePart: s, numberAdderPart: s, valuePart: s,
    ibIdXtalEditorElement: s, expandAllId: s, collapseAllId: s,
};
const onValueChange = ({ value, self }) => {
    let parsedObject = value;
    if (value !== undefined) {
        switch (typeof value) {
            case 'string':
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
                break;
            case 'object':
                if (Array.isArray(parsedObject)) {
                    self.type = 'array';
                }
                else {
                    self.type = 'object';
                }
                break;
        }
    }
    self.parsedObject = parsedObject;
};
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
const onUiValue = ({ uiValue, self }) => {
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
const addEventHandlers = ({ domCache, self }) => [
    {
        [refs.expanderPart]: [, { click: self.toggle }],
        [refs.keyPart]: [, { change: [self.handleKeyChange, 'value'], focus: self.handleKeyFocus }],
        [refs.valuePart]: [, { change: [self.handleValueChange, 'value'], focus: self.handleValueFocus }],
        [refs.objectAdderPart]: [, { click: self.addObject }],
        [refs.stringAdderPart]: [, { click: self.addString }],
        [refs.boolAdderPart]: [, { click: self.addBool }],
        [refs.numberAdderPart]: [, { click: self.addNumber }],
        [refs.copyId]: [, { click: self.copyToClipboard }],
        [refs.slotElement]: [, { slotchange: self.handleSlotChange }],
        [refs.ibIdXtalEditorElement]: [{ rootEditor: self.rootEditor, host: self }],
        [refs.expandAllId]: [, { click: { collapseAll: false, expandAll: true } }],
        [refs.collapseAllId]: [, { click: { expandAll: false, collapseAll: true } }]
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
        case 'object':
            return JSON.stringify(item);
    }
}
const linkValueFromChildren = ({ upwardDataFlowInProgress, self, type }) => {
    if (!upwardDataFlowInProgress)
        return;
    const children = self.childEditors;
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
    let newObj;
    switch (self.type) {
        case 'object':
            newObj = { ...self.parsedObject };
            newObj['object' + objCounter] = {};
            break;
        case 'array':
            newObj = [...self.parsedObject];
            newObj.push({});
    }
    self.value = JSON.stringify(newObj);
    self.open = true;
};
const addString = ({ strCounter, self }) => {
    if (strCounter === undefined)
        return;
    let newObj;
    switch (self.type) {
        case 'object':
            newObj = { ...self.parsedObject };
            newObj['string' + strCounter] = 'val' + strCounter;
            break;
        case 'array':
            newObj = [...self.parsedObject];
            newObj.push('string');
            break;
    }
    self.value = JSON.stringify(newObj);
    self.open = true;
};
const addBool = ({ boolCounter, self }) => {
    if (boolCounter === undefined)
        return;
    let newObj;
    switch (self.type) {
        case 'object':
            newObj = { ...self.parsedObject };
            newObj['bool' + boolCounter] = 'false';
            break;
        case 'array':
            newObj = [...self.parsedObject];
            newObj.push(true);
            break;
    }
    self.value = JSON.stringify(newObj);
    self.open = true;
};
const addNumber = ({ numberCounter, self }) => {
    if (numberCounter === undefined)
        return;
    let newObj;
    switch (self.type) {
        case 'object':
            newObj = { ...self.parsedObject };
            newObj['number' + numberCounter] = '0';
            break;
        case 'array':
            newObj = [...self.parsedObject];
            newObj.push(0);
            break;
    }
    self.value = JSON.stringify(newObj);
    self.open = true;
};
const initEvenLevel = ({ rootEditor, self }) => {
    if (rootEditor === self)
        self.evenLevel = true;
};
const linkEvenLevel = ({ parentLevel, self }) => {
    self.evenLevel = !parentLevel;
};
const onExpandAll = ({ expandAll, self }) => {
    self.open = true;
};
const onCollapseAll = ({ collapseAll, self }) => {
    self.open = false;
};
const updateTransforms = [
    ({ value }) => [{ [refs.valuePart]: [{ value: typeof value === 'string' ? value : JSON.stringify(value) }] }],
    ({ type }) => [{ [refs.editorPart]: [{ dataset: { type: type } }] }],
    ({ uiValue }) => [{ [refs.valuePart]: [uiValue === undefined ? undefined : { value: uiValue }] }],
    ({ key }) => [{ [refs.keyPart]: [{ value: key }] }],
    ({ childValues, type, openEcho, self }) => [
        { [refs.ibIdXtalEditorElement]: [{ _rootEditor: self.rootEditor, list: childValues }] }
    ],
    ({ open }) => [
        {
            [refs.expanderPart]: open ? '-' : '+',
            [refs.childEditorsPart]: [{ dataset: { open: (!!open).toString() } }]
        }
    ],
    ({ hasParent }) => [{
            [refs.removePart]: [{ style: { display: hasParent ? 'none' : 'block' } }],
        }],
    ({ evenLevel }) => [{
            [refs.editorPart]: [{ dataset: { evenLevel: evenLevel } }]
        }]
];
const propActions = [
    xp.manageMainTemplate,
    onValueChange,
    linkChildValues,
    linkValueFromChildren,
    addObject,
    addString,
    addBool,
    addNumber,
    onUiValue,
    xp.attachShadow,
    addEventHandlers,
    updateTransforms,
    onExpandAll,
    onCollapseAll,
    initEvenLevel,
    linkEvenLevel
];
/**
 * @element xtal-editor
 * @slot initVal - Pass in the initial JSON string via a textarea component with this slot (or some other input element with property "value" where the string can be pulled from.)
 * @prop {string} key - Root node name to display
 * @attr {string} key - Root node name to display
 * @prop {boolean} [open] Indicates with Editor should show child nodes expanded.
 * @attr {boolean} [open] Indicates with Editor should show child nodes expanded.
 * @event {ValueDetail} parsed-object-changed - Fired after successfully parsing JSON string to edit.
 * @event {ValueDetail} internal-updated-count-changed -- Used for internal use.
 * @cssprop --text-color - Controls the color of foo
 * @cssprop [--obj-key-bg = rgb(225, 112, 0)] - Object Key Background Color
 * @cssprop [--array-key-bg = rgb(45, 91, 137)] - Array Key Background Color
 * @cssprop [--obj-even-level-editor-bg = #F1E090] - Object Even Level Editor Background Color
 * @cssprop [--obj-odd-level-editor-bg = #FFEFCC] - Object Odd Level Editor Background Color
 * @cssprop [--array-even-level-editor-bg = #A9DBDD] - Array Even Level Editor Background Color
 * @cssprop [--array-odd-level-editor-bg = #D9DBDD] - Array Odd Level Editor Background Color
 * @cssprop [--string-adder-bg = #007408] - String Adder Background Color
 * @cssprop [--bool-adder-bg = #516600] - Bool Adder Background Color
 * @cssprop [--num-adder-bg = #497B8D] - Number Adder Background Color
 * @csspart remove - Element that displays title only at top level
 * @csspart editor - Element containing the editor
 * @csspart field - Element containing a field
 * @csspart expander - Expander button
 * @csspart key - Input element for editing key
 * @csspart child-inserts - Section containing buttons to insert children
 * @csspart object-adder - Button to add a subobject
 * @csspart string-adder - Button to add a string child
 * @csspart bool-adder - Button to add a boolean child
 * @csspart number-adder - Button to add a number child
 * @csspart copy-to-clipboard - Button to copy JSON to clipboard
 * @csspart expand-all - Button to expand JSON tree
 * @csspart collapse-all - Button to collapse JSON tree
 * @csspart child-editors - section containing child editors
 *
 */
export class XtalEditor extends HTMLElement {
    static is = 'xtal-editor';
    constructor() {
        super();
        xc.initInternals(this);
    }
    /**
     * @private
     */
    _internals;
    /**
     * @private

     */
    reactor = new xp.RxSuppl(this, [
        {
            rhsType: Array,
            ctor: DOMKeyPE
        }
    ]);
    /**
     * @private
     */
    styleTemplate = styleTemplate;
    /**
     * @private
     */
    self = this;
    /**
     * @private
     */
    refs = refs;
    /**
     * @private
     */
    propActions = propActions;
    /**
     * @private
     */
    mainTemplate = mainTemplate;
    /**
     * @private
     */
    clonedTemplate;
    domCache;
    handleKeyChange(key) {
        if (key === '') {
            this.remove();
        }
        this.value = key;
    }
    handleKeyFocus(e) {
        this.rootEditor.domCache[refs.removePart].classList.add('editKey');
    }
    handleValueFocus(e) {
        this.rootEditor.domCache[refs.removePart].classList.remove('editKey');
    }
    handleValueChange(val) {
        this.value = val;
        this.incrementUpdateCount();
    }
    incrementUpdateCount() {
        this.internalUpdateCount = this.internalUpdateCount === undefined ? 0 : this.internalUpdateCount + 1;
    }
    copyToClipboard() {
        this.domCache[refs.valuePart].select();
        document.execCommand("copy");
    }
    toggle() {
        this.open = !this.open;
    }
    /**
     * @private
     */
    actionCount = 0;
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
    /**
     * @private
     */
    upwardDataFlowInProgress;
    internalUpdateCount;
    objCounter;
    strCounter;
    boolCounter;
    numberCounter;
    hasParent;
    evenLevel;
    parentLevel;
    handlersAttached;
    connectedCallback() {
        console.log('iah');
        xc.mergeProps(this, slicedPropDefs);
        if (!this.hasParent) {
            this.rootEditor = this;
        }
    }
    onPropChange(n, propDef, newVal) {
        this.reactor.addToQueue(propDef, newVal);
    }
    get childEditors() {
        return Array.from(this.shadowRoot.querySelectorAll(XtalEditor.is));
    }
}
const baseProp = {
    dry: true,
    async: true,
};
const num = {
    ...baseProp,
    type: Number,
};
const bool = {
    ...baseProp,
    type: Boolean,
};
const bool2 = {
    ...bool,
    stopReactionsIfFalsy: true,
};
const bool3 = {
    ...bool2,
    dry: false,
};
const bool4 = {
    ...bool,
    reflect: true,
};
const str = {
    ...baseProp,
    type: String,
};
const propDefMap = {
    ...xp.props,
    upwardDataFlowInProgress: bool,
    open: {
        ...bool,
        echoTo: 'openEcho'
    },
    expandAll: bool3,
    collapseAll: bool3,
    handlersAttached: bool2,
    hasParent: bool,
    objCounter: num, strCounter: num, boolCounter: num, numberCounter: num,
    internalUpdateCount: {
        ...num,
        notify: true
    },
    type: str,
    key: str, uiValue: str,
    value: {
        ...str,
        parse: true
    },
    parsedObject: {
        ...baseProp,
        type: Object,
        notify: true
    },
    childValues: {
        ...baseProp,
        stopReactionsIfFalsy: true,
        type: Object
    },
    openEcho: bool2,
    rootEditor: {
        ...baseProp,
        type: Object,
    },
    evenLevel: bool4,
    parentLevel: bool,
};
const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);
xc.letThereBeProps(XtalEditor, slicedPropDefs, 'onPropChange');
xc.define(XtalEditor);
