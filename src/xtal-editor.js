import { xc } from 'xtal-element/lib/XtalCore.js';
import { xp } from 'xtal-element/lib/XtalPattern.js';
import { html } from 'xtal-element/lib/html.js';
import { DOMKeyPE } from 'xtal-element/lib/DOMKeyPE.js';
import { styleTemplate } from './xtal-editor-style.js';
import('./ib-id-xtal-editor.js');
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
            <button class=copyBtn part=copy-to-clipboard><img class=copy alt="Copy to Clipboard" src="https://cdn.jsdelivr.net/npm/xtal-editor/src/copy.svg"></button>
        </div>
        
    </div>
    <div part=child-editors class="nonPrimitive child-editors" data-open=false>
        <ib-id-xtal-editor tag=xtal-editor></ib-id-xtal-editor>
    </div>
    
</div>
`;
const s = '';
const refs = {
    slotElement: s, boolAdderPart: s, childEditorsPart: s, copyToClipboardPart: s,
    editorPart: s, expanderPart: s, keyPart: s, objectAdderPart: s, stringAdderPart: s,
    removePart: s, numberAdderPart: s, valuePart: s,
    ibIdXtalEditorElement: s
};
const onValueChange = ({ value, self }) => {
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
        [refs.copyToClipboardPart]: [, { click: self.copyToClipboard }],
        [refs.slotElement]: [, { slotchange: self.handleSlotChange }],
        [refs.ibIdXtalEditorElement]: [{ rootEditor: self.rootEditor, host: self }]
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
const updateTransforms = [
    ({ value }) => [{ [refs.valuePart]: [{ value: value }] }],
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
];
/**
 * @element xtal-editor
 */
export class XtalEditor extends HTMLElement {
    constructor() {
        super(...arguments);
        this.reactor = new xp.RxSuppl(this, [
            {
                rhsType: Array,
                ctor: DOMKeyPE
            }
        ]);
        this.styleTemplate = styleTemplate;
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
        xc.hydrate(this, slicedPropDefs);
        if (!this.hasParent) {
            this.rootEditor = this;
        }
    }
    onPropChange(n, propDef, newVal) {
        this.reactor.addToQueue(propDef, newVal);
    }
}
XtalEditor.is = 'xtal-editor';
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
    }
};
const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);
xc.letThereBeProps(XtalEditor, slicedPropDefs, 'onPropChange');
xc.define(XtalEditor);
