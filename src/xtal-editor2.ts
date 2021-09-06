import {PropInfo, XE} from 'xtal-element/src/XE.js';
import {TemplMgmtActions, TemplMgmtProps, tm} from 'trans-render/lib/mixins/TemplMgmtWithPEST.js';
import {XtalEditorActions, XtalEditorProps, NameValue} from '../types';
import('pass-down/p-d.js');
import('ib-id/i-bid.js');

const mainTemplate = tm.html`
<style>
    :host{
        display:block;
    }
    :host[hidden]{
        display:none;
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
    .copyBtn{
        width: fit-content;
        height: fit-content;
        padding-left: 0px;
        padding-right: 0px;
        padding-top: 0px;
        padding-bottom: 0px;
        border: 0;
    }
    .object.adder{
        background-color: #C15000;
    }
    .editor{
        --obj-key-bg: rgb(225, 112, 0);
        --array-key-bg: rgb(45, 91, 137);
        --obj-even-level-editor-bg: #F1E090;
        --obj-odd-level-editor-bg: #FFEFCC;
        --array-even-level-editor-bg: #A9DBDD;
        --array-odd-level-editor-bg: #D9DBDD;
        --string-adder-bg: #007408;
        --bool-adder-bg: #516600;
        --num-adder-bg:#497B8D
    }
    .editor[data-type="object"][data-even-level="true"]{
        background-color: var(--obj-even-level-editor-bg);
    }
    .editor[data-type="object"][data-even-level="false"]{
        background-color: var(--obj-odd-level-editor-bg);
    }
    .editor[data-type="array"][data-even-level="true"]{
        background-color: var(--array-even-level-editor-bg);
    }
    .editor[data-type="array"][data-even-level="false"]{
        background-color: var(--array-odd-level-editor-bg);
    }
    .string.adder{
        background-color:var(--string-adder-bg);
    }
    .bool.adder{
        background-color: var(--bool-adder-bg);
    }
    .number.adder{
        background-color: var(--num-adder-bg);
    }
    .adder{
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
        align-items: center;
    }
    #copy{
        background-image: url(https://cdn.jsdelivr.net/npm/xtal-editor/src/copy.svg);
        
    }
    #expand-all{
        background-image: url(https://cdn.jsdelivr.net/npm/xtal-editor/src/arrows-expand.svg);
        width: 20px;
    }
    .action{
        background-repeat:no-repeat;
        background-position-y:center;
        height: 22px;
    }
    #collapse-all{
        background-image: url(https://cdn.jsdelivr.net/npm/xtal-editor/src/arrows-collapse.svg);
        width: 20px;
    }
    @media only screen and (max-width: 1000px) {
        .field{
            flex-direction: column;
        }
        .child-inserters{
            justify-content: flex-end;
            width: 100%;
        }
        .text-editing{
            width: 100%;
        }
    }
    @media only screen and (min-width: 1001px){
        .child-inserters{
            justify-content: center;
        }
        .field{
            width: 100%;
            justify-content: space-evenly;
        }
        .text-editing{
            flex-grow: 1;
        }
    }
    .text-editing{
        display: flex;
        flex-direction: row;
        padding-top:1px;
        padding-bottom:1px;
    }
    .child-inserters{
        display: flex;
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
        background-color: var(--obj-key-bg);
        color: color-contrast(var(--obj-key-bg) vs white, black);
    }
    [data-type="number"] [part="key"]{
        background-color: rgb(73, 123, 141);
    }
    [data-type="array"] [part="key"]{
        background-color: var(--array-key-bg);
        color: color-contrast(var(--array-key-bg) vs white, black);
    }
    .value{
        background-color: #ECF3C3;
        width: 100%;
        flex-grow:5;
    }
    input.key {
        
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        margin-right: 2px;
    }
    input {
        border: none;
        padding: 3px;
    }
</style>
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
        <p-d from-host observe-prop=expandAll to=xtal-editor prop=expandAll></p-d>
        <p-d from-host observe-prop=collapseAll to=xtal-editor prop=collapseAll></p-d>
        <p-d from-host observe-prop=evenLevel to=xtal-editor prop=parentLevel></p-d>
        <template data-from=child-editors-list>
            <xtal-editor></xtal-editor>
        </template>
        <i-bid id=child-editors-list></i-bid>
    </div>
    
</div>
`;

const doExpanderParts = ({self}: X) => [{open:!self.open}];
const doKeyParts = ({self}: X) => [{}, {change:[self.handleKeyChange, 'value'], focus: self.handleKeyFocus}];
const doValueParts = ({self}: X) => [{}, {change: [self.handleValueChange, 'value'], focus: self.handleValueFocus}];
const doObjectAdderParts = ({self}: X) => [{}, {click: self.addObject}];
const doStringAdderParts = ({self}: X) => [{}, {click: self.addString}];
const doBoolAdderParts = ({self}: X) => [{}, {click: self.addBool}];
const doNumberAdderParts = ({self}: X) => [{}, {click: self.addNumber}];
const doCopy = ({self}: X) => [{}, {click: self.copyToClipboard}];
const doSlotElements = ({self}: X) => [{}, {slotchange: self.handleSlotChange}];
const doExpandAll = ({self}: X) => [{}, {click:{collapseAll: false, expandAll: true}}];
const doCollapseAll = ({self}: X) => [{}, {click:{expandAll: false, collapseAll: true}}];

const tagName = 'xtal-editor';
export class XtalEditorCore extends HTMLElement implements XtalEditorActions{
    self = this;
    doExpanderParts = doExpanderParts;
    doKeyParts = doKeyParts;
    doValueParts = doValueParts;
    doObjectAdderParts = doObjectAdderParts;
    doStringAdderParts = doStringAdderParts;
    doBoolAdderParts = doBoolAdderParts;
    doNumberAdderParts = doNumberAdderParts;
    doCopy = doCopy;
    doSlotElements = doSlotElements;
    doExpandAll = doExpandAll;
    doCollapseAll = doCollapseAll;
    parseValue({value}: this){
        let parsedObject = value;
        if(value !==  undefined){
            switch(typeof value){
                case 'string':
                    if(value === 'true' || value === 'false'){
                        this.type = 'boolean';
                    }else if(!isNaN(value as any as number)){
                        this.type = 'number';
                    }else{
                        try{
                            parsedObject = JSON.parse(value);
                            if(Array.isArray(parsedObject)){
                                this.type = 'array';
                            }else{
                                this.type = 'object';
                            }
                        }catch(e){
                            this.type = 'string';
                        }
                    }
                    break;
                case 'object':
                    if(Array.isArray(parsedObject)){
                        this.type = 'array';
                    }else{
                        this.type = 'object';
                    }
    
                    break;
            }
    
        }
        return {parsedObject};
           
    }

    setChildValues({parsedObject, type}: this){
        if(parsedObject === undefined) {
            return {
                childValues: undefined
            }
        }
        switch(type){
            case 'array':
                return{
                    childValues: (parsedObject as any[]).map(item => toString(item)) as string[],
                }
                break;
            case 'object':
                const childValues: NameValue[] = [];
                for(var key in parsedObject){
                    childValues.push({
                        key: key,
                        value: toString(parsedObject[key]),
                    } as NameValue);
                }
                return {childValues};
            default:{
                return {
                    childValues: undefined,
                }
            }
        }        
    }

    syncValueFromChildren({upwardDataFlowInProgress, childEditors, type}: this){
        switch(type){
            case 'object': {
                const newVal: any = {}; //TODO: support array type
                childEditors.forEach(child =>{
                    newVal[child.key!] = child.parsedObject!;//TODO: support for none primitive
                });
                this.uiValue = JSON.stringify(newVal);
            }
            break;
            case 'array':{
                const newVal: any[] = [];
                childEditors.forEach(child =>{
                    newVal.push(child.parsedObject!);//TODO: support for none primitive
                });
                this.uiValue = JSON.stringify(newVal);
            }
            break;
        }
        
        this.incrementUpdateCount();
        this.upwardDataFlowInProgress = false;        
    }

    get childEditors(){
        return Array.from(this.shadowRoot!.querySelectorAll(tagName)) as (HTMLElement & XtalEditorProps)[]
    }
    internalUpdateCount: number | undefined;
    incrementUpdateCount(){
        this.internalUpdateCount = this.internalUpdateCount === undefined ? 0 : this.internalUpdateCount + 1;
    }
    addObject({objCounter, parsedObject, type}: this){
        let newObj: any;
        switch(type){
            case 'object':    
                newObj = {...parsedObject};
                newObj['object' + objCounter] = {};
                break;
            case 'array':
                newObj = [...parsedObject];
                newObj.push({});
        }
        return {
            value: JSON.stringify(newObj),
            open: true,
        };

    }

    addString({strCounter, parsedObject, type}: this){
        let newObj: any;
        switch(type){
            case 'object':
                newObj = {...parsedObject};
                newObj['string' + strCounter] = 'val' + strCounter;
                break;
            case 'array':
                newObj = [...parsedObject];
                newObj.push('string');
                break;
        }
        return{
            value:JSON.stringify(newObj),
            open: true,
        };
    }

    addBool({boolCounter, parsedObject, type}: this){
        let newObj: any;
        switch(type){
            case 'object':
                newObj = {...parsedObject};
                newObj['bool' + boolCounter] = 'false';
                break;
            case 'array':
                newObj = [...parsedObject];
                newObj.push(true);
                break;
        }
        return{
            value: JSON.stringify(newObj),
            open: true,
        };

    }

    addNumber({numberCounter, parsedObject, type}: this){
        let newObj: any;
        switch(type){
            case 'object':
                newObj = {...parsedObject};
                newObj['number' + numberCounter] = '0';
                break;
            case 'array':
                newObj = [...parsedObject];
                newObj.push(0);
                break;
        }
        return{
            value: JSON.stringify(newObj),
            open: true,
        };
    }
    initEvenLevel({rootEditor}: this){
        if(rootEditor === this) this.evenLevel = true;
    }
    setEvenLevel({parentLevel}: this){
        return {
            evenLevel: !parentLevel
        }
    }
    onExpandAll({}: this){
        return{
            open: true,
        }
    }
    onCollapseAll({}: this){
        return{
            open: false,
        }
    }
    onConnected({hasParent}: this){
        if(!hasParent){
            this.rootEditor = this;
        }
    }

    handleKeyChange(key: string){
        if(key === ''){
            this.remove();
        }
        this.value = key;
    }
    handleKeyFocus(e: Event){
        this.rootEditor!.removeParts.forEach(x => x.classList.add('editKey'));
    }
    handleValueFocus(e: Event){
        this.rootEditor!.removeParts.forEach(x => x.classList.remove('editKey'));
    }
    handleValueChange(val: string){
        this.value = val;
        this.incrementUpdateCount();
    }
    copyToClipboard(){
        this.valueParts[0].select();
        document.execCommand("copy");
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
}

export interface XtalEditorCore extends XtalEditorProps{} 

function toString(item: any){
    switch(typeof item){
        case 'string':
            return item;
        case 'number':
        case 'boolean':
            return item.toString();
        case 'object':
            return JSON.stringify(item);
    }
}
const isRef:PropInfo = {
    isRef: true,
    parse: false,
};
const xe = new XE<XtalEditorProps & TemplMgmtProps, XtalEditorActions>({
    config:{
        tagName: 'xtal-editor',
        propDefaults:{
            value: '',
            open: false,
            uiValue: '',
            objCounter: 0,
            evenLevel: false,
            parentLevel: false,
            expandAll: false,
            collapseAll: false,
            isC: true,
        },
        propInfo:{
            expanderParts: isRef,
            keyParts: isRef,
            valueParts: isRef,
            objectAdderParts: isRef,
            stringAdderParts: isRef,
            boolAdderParts: isRef,
            numberAdderParts: isRef,
            copyIds: isRef,
            slotElements: isRef,
            expandAllIds: isRef,
            collapseAllIds: isRef,
        },
        actions:{
            ...tm.doInitTransform,
            parseValue:{
                ifAllOf: ['value']
            },
            // setChildValues:{
            //     ifKeyIn: ['parsedObject']
            // },
            // syncValueFromChildren:{
            //     ifAllOf: ['upwardDataFlowInProgress']
            // },
            // addObject:{
            //     ifAllOf:['objCounter']
            // },
            // addString:{
            //     ifAllOf:['strCounter']
            // },
            // addBool:{
            //     ifAllOf:['boolCounter']
            // },
            // addNumber:{
            //     ifAllOf:['numberCounter']
            // },
            // initEvenLevel:{
            //     ifKeyIn: ['rootEditor']
            // },
            // setEvenLevel:{
            //     ifKeyIn: ['parentLevel']
            // },
            // onExpandAll:{
            //     ifAllOf: ['expandAll']
            // },
            // onCollapseAll:{
            //     ifAllOf: ['collapseAll']
            // },
            // doExpanderParts:{
            //     ifKeyIn:['open'],
            // },
            // doKeyParts:{
            //     ifAllOf:['clonedTemplate'],
            //     target:'keyParts'
            // },
            // doValueParts:{
            //     ifAllOf:['clonedTemplate'],
            //     target:'valueParts'
            // },
            // doObjectAdderParts:{
            //     ifAllOf:['clonedTemplate'],
            //     target:'objectAdderParts'
            // },
            // doStringAdderParts:{
            //     ifAllOf:['clonedTemplate'],
            //     target:'stringAdderParts'
            // },
            // doBoolAdderParts:{
            //     ifAllOf:['clonedTemplate'],
            //     target:'boolAdderParts'
            // },
            // doNumberAdderParts:{
            //     ifAllOf:['clonedTemplate'],
            //     target:'numberAdderParts'
            // },
            // doCopy:{
            //     ifAllOf:['clonedTemplate'],
            //     target:'copyIds'
            // },
            // doSlotElements:{
            //     ifAllOf:['clonedTemplate'],
            //     target:'slotElements'
            // },
            // doExpandAll:{
            //     ifAllOf:['clonedTemplate'],
            //     target:'expandAllIds'
            // },
            // doCollapseAll:{
            //     ifAllOf:['clonedTemplate'],
            //     target: 'collapseAllIds'
            // }
        },
        
    },
    complexPropDefaults:{
        mainTemplate: mainTemplate,
    },
    superclass: XtalEditorCore,
    mixins:[tm.TemplMgmtMixin]
});

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
const XtalEditor = xe.classDef!;

type X = XtalEditorCore;