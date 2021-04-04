import {xc} from 'xtal-element/lib/XtalCore.js';
import {xp} from 'xtal-element/lib/XtalPattern.js';
import {PropAction, XtalPattern, PropDef, PSettings, PropDefMap} from 'xtal-element/types.d.js';
import {html} from 'xtal-element/lib/html.js';
import {XtalEditorPublicProps, editType} from '../types.js';
import {DOMKeyPE} from 'xtal-element/lib/DOMKeyPE.js';
import {styleTemplate} from './xtal-editor-style.js';
import('./ib-id-xtal-editor.js');

const mainTemplate = html`
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


const onValueChange = ({value, self}: X) => {
    let parsedObject = value;
    if(value !==  undefined){
        if(value === 'true' || value === 'false'){
            self.type = 'boolean';
        }else if(!isNaN(value as any as number)){
            self.type = 'number';
        }else{
            try{
                parsedObject = JSON.parse(value);
                if(Array.isArray(parsedObject)){
                    self.type = 'array';
                }else{
                    self.type = 'object';
                }
            }catch(e){
                self.type = 'string';
            }
        }
    }
    self.parsedObject = parsedObject;
};

const linkChildValues = ({parsedObject, type, self}: X) => {
    if(parsedObject === undefined) {
        self.childValues = undefined;
        return;
    }
    switch(type){
        case 'array':
            self.childValues = (parsedObject as any[]).map(item => toString(item)) as string[];
            break;
        case 'object':
            const childValues: NameValue[] = [];
            for(var key in parsedObject){
                childValues.push({
                    key: key,
                    value: toString(parsedObject[key]),
                } as NameValue);
            }
            self.childValues = childValues;
            return;
    }

};

const onUiValue = ({uiValue, self}: X) => {
    if(uiValue === undefined) return;
    switch(self.type){
        case 'object':
        case 'array':
            (<any>self)._parsedObject = JSON.parse(uiValue);
            (<any>self)._value = uiValue;
            self.dispatchEvent(new CustomEvent('parsed-object-changed', {
                detail:{
                    value: (<any>self)._parsedObject
                }
            }));
    }
}

const addEventHandlers = ({domCache, self}: X) => [
    {
        [refs.expanderPart]: [,{click:self.toggle}],
        [refs.keyPart]: [,{change: [self.handleKeyChange, 'value'], focus: self.handleKeyFocus}],
        [refs.valuePart]: [,{change: [self.handleValueChange, 'value'], focus: self.handleValueFocus}],
        [refs.objectAdderPart]: [, {click: self.addObject}],
        [refs.stringAdderPart]: [,{click: self.addString}],
        [refs.boolAdderPart]: [, {click: self.addBool}],
        [refs.numberAdderPart]: [, {click: self.addNumber}],
        [refs.copyToClipboardPart]: [,{click: self.copyToClipboard}],
        [refs.slotElement]: [,{slotchange: self.handleSlotChange}],
        [refs.ibIdXtalEditorElement]: [{rootEditor: self.rootEditor, host: self}]
    },
    [{handlersAttached: true}] as PSettings<XtalEditor>
]

function toString(item: any){
    switch(typeof item){
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

const linkValueFromChildren = ({upwardDataFlowInProgress, self, type}: XtalEditor) => {
    if(!upwardDataFlowInProgress) return;
    const children = Array.from(self.shadowRoot!.querySelectorAll(XtalEditor.is)) as XtalEditor[];
    switch(type){
        case 'object': {
            const newVal: any = {}; //TODO: support array type
            children.forEach(child =>{
                newVal[child.key!] = child.parsedObject!;//TODO: support for none primitive
            });
            self.uiValue = JSON.stringify(newVal);
        }
        break;
        case 'array':{
            const newVal: any[] = [];
            children.forEach(child =>{
                newVal.push(child.parsedObject!);//TODO: support for none primitive
            });
            self.uiValue = JSON.stringify(newVal);
        }
        break;
    }
    
    self.incrementUpdateCount();
    self.upwardDataFlowInProgress = false;
    
}


const addObject = ({objCounter, self}: X) => {
    if(objCounter === undefined) return;
    self.open = true;
    const newObj = {...self.parsedObject};
    newObj['object' + objCounter] = {};
    self.value = JSON.stringify(newObj);
    
}

const addString = ({strCounter, self}: X) => {
    if(strCounter === undefined) return;
    const newObj = {...self.parsedObject};
    newObj['string' + strCounter] = 'val' + strCounter;
    self.value = JSON.stringify(newObj);
    self.open = true;
}

const addBool = ({boolCounter, self}: X) => {
    if(boolCounter === undefined) return;
    let newObj: any;
    switch(self.type){
        case 'object':
            newObj = {...self.parsedObject};
            newObj['bool' + boolCounter] = 'false';
            break;
        case 'array':
            newObj = [...self.parsedObject];
            newObj.push(true);
            break;
    }
    self.value = JSON.stringify(newObj);
    self.open = true;
}

const addNumber = ({numberCounter, self}: X) => {
    if(numberCounter === undefined) return;
    let newObj: any;
    switch(self.type){
        case 'object':
            newObj = {...self.parsedObject};
            newObj['number' + numberCounter] = '0';
            break;
        case 'array':
            newObj = [...self.parsedObject];
            newObj.push(0);
            break;
    }

    self.value = JSON.stringify(newObj);
    self.open = true;
}

const updateTransforms = [
    ({value}: X) => [{[refs.valuePart]: [{value: value}]}],
    ({type}: X) => [{[refs.editorPart]: [{dataset: {type: type}}]}],
    ({uiValue}: X) => [{[refs.valuePart]: [uiValue === undefined ? undefined : {value: uiValue}]}],
    ({key}: X) => [{[refs.keyPart]: [{value: key}]}],
    ({childValues, type, openEcho, self}: X) => [
        {[refs.ibIdXtalEditorElement]: [{_rootEditor: self.rootEditor, list: childValues}]}
    ],
    ({open}: X) => [
        {
            [refs.expanderPart]: open ? '-' : '+',
            [refs.childEditorsPart]: [{dataset: {open: (!!open).toString()}}]
        }
    ],
    ({hasParent}: X) => [{
        [refs.removePart]: [{style: {display: hasParent ? 'none' : 'block' }}],
    }]
]

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
] as PropAction[];



/**
 * @element xtal-editor
 */
export class XtalEditor extends HTMLElement implements XtalEditorPublicProps, XtalPattern{
    static is = 'xtal-editor';
    reactor = new xp.RxSuppl(this, [
        {
            rhsType: Array,
            ctor: DOMKeyPE
        }
    ]);
    styleTemplate = styleTemplate;
    self=this; refs=refs; propActions = propActions; mainTemplate = mainTemplate; 
    clonedTemplate: DocumentFragment | undefined; domCache: any;


    rootEditor: XtalEditor | undefined;
    handleKeyChange(key: string){
        if(key === ''){
            this.remove();
        }
        this.value = key;
    }
    handleKeyFocus(e: Event){
        (this.rootEditor!.domCache[refs.removePart] as HTMLElement).classList.add('editKey');
    }
    handleValueFocus(e: Event){
        (this.rootEditor!.domCache[refs.removePart] as HTMLElement).classList.remove('editKey');
    }
    handleValueChange(val: string){
        this.value = val;
        this.incrementUpdateCount();
    }
    incrementUpdateCount(){
        this.internalUpdateCount = this.internalUpdateCount === undefined ? 0 : this.internalUpdateCount + 1;
    }
    copyToClipboard(){
        (<any>this)[refs.valuePart].select();
        document.execCommand("copy");
    }
    toggle(){
        this.open = !this.open;
    }
    /**
     * @private
     */
    actionCount = 0;

    propActionsHub(propAction: any){
    }

    transformHub(transform: any){
    }

    addObject(){
        this.objCounter = this.objCounter === undefined ? 1 : this.objCounter + 1;
    }

    addString(){
        this.strCounter = this.strCounter === undefined ? 1 : this.strCounter + 1;
    }
    addBool(){
        this.boolCounter = this.boolCounter === undefined ? 1: this.boolCounter + 1;
    }
    addNumber(){
        this.numberCounter = this.numberCounter === undefined ? 1 : this.numberCounter + 1;
    }
    handleSlotChange(e: Event){
        const slot = e.target as HTMLSlotElement;
        const nodes = slot.assignedNodes();
        nodes.forEach(node => {
            const aNode = node as any;
            if(aNode.value !== undefined){
                this.value = aNode.value;
            }
        })
        // console.log('Element in Slot "' + slots[1].name + '" changed to "' + nodes[0].outerHTML + '".');
    }


    key: string | undefined;

    value: string | undefined;
    uiValue: string | undefined;

    type: editType;

    parsedObject: any;

    childValues: string[] | undefined | NameValue[];

    open: boolean | undefined;

    openEcho: boolean | undefined;

    /**
     * @private
     */
    upwardDataFlowInProgress: boolean | undefined;

    internalUpdateCount: number | undefined;

    objCounter: number | undefined;
    strCounter: number | undefined;
    boolCounter: number | undefined;
    numberCounter: number | undefined;
    hasParent: boolean | undefined;

    handlersAttached: boolean | undefined;

    connectedCallback(){
        xc.hydrate<XtalEditorPublicProps>(this, slicedPropDefs);
        if(!this.hasParent){
            this.rootEditor = this;
        }
    }
    onPropChange(n: string, propDef: PropDef, newVal: any){
        this.reactor.addToQueue(propDef, newVal);
    }
}

type X = XtalEditor;

const baseProp: PropDef = {
    dry: true,
    async: true,
}

const num: PropDef = {
    ...baseProp,
    type: Number,
};
const bool: PropDef = {
    ...baseProp,
    type: Boolean,
};
const bool2: PropDef = {
    ...bool,
    stopReactionsIfFalsy: true,
}
const str: PropDef = {
    ...baseProp,
    type: String,
};

const propDefMap: PropDefMap<XtalEditor> = {
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
    openEcho:  bool2,
    rootEditor: {
        ...baseProp,
        type: Object,
    }
};

const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);


interface NameValue {
    key: string, 
    value: string,
}

xc.letThereBeProps(XtalEditor, slicedPropDefs, 'onPropChange');
xc.define(XtalEditor);