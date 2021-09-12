import {PropInfoExt, XE} from 'xtal-element/src/XE.js';
import {TemplMgmtActions, TemplMgmtProps, tm} from 'trans-render/lib/mixins/TemplMgmtWithPEST.js';
import {XtalEditorActions, XtalEditorProps, NameValue} from '../types';
import('pass-down/p-d.js');
import('pass-up/p-u.js');
import('pass-prop/pass-prop.js');
import('plus-equals/p-e.js');
import('pass-message/p-m.js');
import('ib-id/i-bid.js');
const style = await import('./theme.css', {
    assert: { type: 'css' }
});
const mainTemplate = tm.html`
<slot part=slot name=initVal></slot>
<p-d observe-host vft=hasParent to=[-data-has-parent] as=str-attr m=1></p-d>
<pass-prop observe-host on=readOnly vft=readOnly to=[-data-ro] as=str-attr m=1></pass-prop>
<div class="remove" part=remove -data-ro -data-has-parent data-has-parent=true></div>
<div data-type=string part=editor class=editor>
    <div part=field class=field>
        <div class=text-editing>
            <p-d observe-host vft=open to=[-text-content] true-val=- false-val=+></p-d>
            <button disabled part=expander class="expander nonPrimitive" -text-content></button>
            <p-m on=click to-host prop=toggleOpen val=target.textContent></p-m>
            <input aria-label=key part=key class=key -value>
            <pass-prop observe-host on=readOnly vft=readOnly to=[-read-only] m=1></pass-prop>
            <input disabled=2 aria-label=value part=value -read-only class=value>
            <p-m to-host on=change prop=handleValueChange val=target.value></p-m>
            <p-m to-host on=focus prop=handleValueFocus val=target></p-m>
        </div>
        <pass-prop observe-host on=readOnly vft=readOnly to=[-data-ro] as=str-attr m=1></pass-prop>
        <div part=child-inserters class="nonPrimitive child-inserters" data-open=false -data-ro>
            <button disabled part=object-adder class="object adder" data-d=1>add object</button>
            <p-e on=click to-host prop=objCounter val=target.dataset.d parse-val-as=int></p-e>
            <button disabled part=string-adder class="string adder" data-d=1>add string</button>
            <p-e on=click to-host prop=strCounter val=target.dataset.d parse-val-as=int></p-e>
            <button disabled part=bool-adder class="bool adder" data-d=1>add bool</button>
            <p-e on=click to-host prop=boolCounter val=target.dataset.d parse-val-as=int></p-e>
            <button disabled part=number-adder class="number adder" data-d=1>add number</button>
            <p-e on=click to-host prop=numCounter val=target.dataset.d parse-val-as=int></p-e>
            <button disabled id=copy class=action part=copy-to-clipboard title="Copy to Clipboard"></button>
            <p-m on=click to-host prop=copyToClipboard val=target.title></p-m>
            <button id=expand-all class=action part=expand-all title="Expand All" aria-label="Expand All"></button>
            <button id=collapse-all class=action part=collapse-all title="Collapse All" aria-label="Collapse All"></button>
        </div>
        
    </div>
    <p-d observe-host vft=open to=[-data-open] as=str-attr m=1></p-d>
    <div part=child-editors class="nonPrimitive child-editors" -data-open data-open=false>
        <template data-from=child-editors-list>
            <p-d observe-host vft=expandAll to=[-open] m=1></p-d>
            <p-d observe-host vft=expandAll to=[-expand-all] m=1></p-d>
            <pass-prop observe-host on=readOnly vft=readOnly to=[-read-only]></pass-prop>
            <xtal-editor -open has-parent -expand-all -read-only></xtal-editor>
            <p-u on=internal-update-count-changed to-host prop=upwardDataFlowInProgress parse-val-as=truthy></p-u>
        </template>
        <p-d observe-host vft=childValues to=[-list] m=1></p-d>
        <i-bid -list id=child-editors-list updatable
              transform='{
                  "xtal-editor":[{"value": "value", "key": "key"}]
              }'
        ></i-bid>
    </div>
    
</div>
`;

const initTransform = {
    expandAllParts: [{}, {click:{collapseAll: false, expandAll: true, open: true}}], 
    collapseAllParts: [{}, {click:{expandAll: false, collapseAll: true, open: false}}],
    slot: [{}, {slotchange: 'handleSlotChange'}],
}
const doKeyParts = ({self}: X) => [{}, {change:[self.handleKeyChange, 'value'], focus: self.handleKeyFocus}];
const updateValue = ({value}: X) => [{value: typeof value === 'string' ? value : JSON.stringify(value)}];
const updateKey = ({key}: X) => [{value: key}];
const updateType = ({type}: X) => [{dataset: {type: type}}];

const tagName = 'xtal-editor';
export class XtalEditorCore extends HTMLElement implements XtalEditorActions{
    self = this;
    doKeyParts = doKeyParts;
    updateValue = updateValue;
    updateType = updateType;
    updateKey = updateKey;
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
    #lastParsedObject: any;
    setChildValues({parsedObject, type}: this){
        if(parsedObject === this.#lastParsedObject) return {
            childValues: this.childValues
        };
        this.#lastParsedObject = parsedObject;
        if(parsedObject === undefined) {
            return {
                childValues: undefined
            }
        }
        switch(type){
            case 'array':{
                    const childValues: NameValue[] = [];
                    let cnt = 0;
                    for(const item of parsedObject){
                        childValues.push({
                            key: cnt.toString(),
                            value: item
                        });
                        cnt++;
                    }
                    return{
                        childValues,
                    }
                }
            case 'object':
                {
                    const childValues: NameValue[] = [];
                    for(var key in parsedObject){
                        childValues.push({
                            key: key,
                            value: parsedObject[key] //toString(parsedObject[key]),
                        } as NameValue);
                    }
                    return {childValues};
                }

            default:{
                return {
                    childValues: undefined,
                }
            }
        }        
    }

    syncValueFromChildren({childEditors, type}: this){
        let newVal: any;
        switch(type){
            case 'object': {
                newVal = {}; //TODO: support array type
                childEditors.forEach(child =>{
                    newVal[child.key!] = child.parsedObject!;//TODO: support for none primitive
                });

            }
            break;
            case 'array':{
                newVal = [];
                childEditors.forEach(child =>{
                    newVal.push(child.parsedObject!);//TODO: support for none primitive
                });
            }
            break;
        }
        if(newVal !== undefined){
            (<any>this).setValsQuietly({value: newVal, parsedObject: newVal});
            const childValues = this.setChildValues(this);
            (<any>this).setValsQuietly({childValues});
            this.valueParts[0].value = JSON.stringify(newVal);
        }
        
        this.internalUpdateCount!++;
        this.upwardDataFlowInProgress = false;        
    }

    get childEditors(){
        return Array.from(this.shadowRoot!.querySelectorAll(tagName)) as (HTMLElement & XtalEditorProps)[]
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
            value: newObj,//JSON.stringify(newObj),
            internalUpdateCount: this.internalUpdateCount + 1,
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
            internalUpdateCount: this.internalUpdateCount + 1,
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
            internalUpdateCount: this.internalUpdateCount + 1,
            open: true,
        };

    }

    addNumber({numCounter, parsedObject, type}: this){
        let newObj: any;
        switch(type){
            case 'object':
                newObj = {...parsedObject};
                newObj['number' + numCounter] = '0';
                break;
            case 'array':
                newObj = [...parsedObject];
                newObj.push(0);
                break;
        }
        return{
            value: JSON.stringify(newObj),
            internalUpdateCount: this.internalUpdateCount + 1,
            open: true,
        };
    }


    onConnected({hasParent}: this){
        if(!hasParent){
            this.rootEditor = this;
        }
    }

    handleKeyChange(self: this, key: string){
        if(key === ''){
            this.remove();
        }
        this.value = key;
    }
    handleKeyFocus(e: Event){
        this.rootEditor!.removeParts.forEach(x => x.classList.add('editKey'));
    }
    handleValueFocus(e: Event){
        //this.rootEditor!.removeParts.forEach(x => x.classList.remove('editKey'));
    }
    handleValueChange(self: this, val: string, e: InputEvent){
        this.value = val;
        this.internalUpdateCount!++;
    }
    copyToClipboard(){
        this.valueParts[0].select();
        document.execCommand("copy");
    }
    handleSlotChange(e: Event){
        const slot = e.target as HTMLSlotElement;
        const nodes = slot.assignedNodes();
        for(const node of nodes){
            const aNode = node as any;
            if(aNode.value !== undefined){
                this.value = aNode.value;
            }            
        }
    }
    toggleOpen = (e: Event) =>{
        this.open = !this.open;
    }
}

export interface XtalEditorCore extends XtalEditorProps{} 


const isRef:PropInfoExt = {
    isRef: true,
    parse: false,
};
const notifyProp:PropInfoExt = {
    notify:{
        dispatch:true,
        reflect:{asAttr:true}
    }
}
const xe = new XE<XtalEditorProps & TemplMgmtProps, XtalEditorActions>({
    //config is JSON Serializable
    config:{
        tagName: 'xtal-editor',
        propDefaults:{
            value: '',
            key: '',
            open: false,
            objCounter: 0,
            strCounter: 0,
            numCounter: 0,
            boolCounter: 0,
            evenLevel: false,
            parentLevel: false,
            expandAll: false,
            collapseAll: false,
            isC: true,
            hasParent: false,
            upwardDataFlowInProgress: false,
            internalUpdateCount: 0,
            initTransform: initTransform,
            readOnly: false,
        },
        propInfo:{
            expanderParts: isRef,
            keyParts: isRef,
            valueParts: isRef,
            objectAdderParts: isRef,
            stringAdderParts: isRef,
            boolAdderParts: isRef,
            numberAdderParts: isRef,
            copyToClipboardParts: isRef,
            slotElements: isRef,
            expandAllParts: isRef,
            collapseAllParts: isRef,
            editorParts: isRef,
            childValues:{
                parse: false,
                notify: {
                    dispatch: true
                }
            },
            open:notifyProp,
            expandAll:notifyProp,
            collapseAll:notifyProp,
            internalUpdateCount:notifyProp,
        },
        actions:{
            ...tm.doInitTransform,
            parseValue:{
                ifAllOf: ['value']
            },
            updateKey: {
                ifAllOf:['key', 'keyParts'],
                target: 'keyParts'
            },
            updateValue:{
                ifKeyIn: ['value'],
                ifAllOf: ['valueParts'],
                target: 'valueParts'
            },
            updateType:{
                ifAllOf: ['type', 'editorParts'],
                target: 'editorParts',
            },
            setChildValues:{
                ifAllOf: ['parsedObject', 'open']
            },
            syncValueFromChildren:{
                ifAllOf: ['upwardDataFlowInProgress']
            },
            addObject:{
                ifAllOf:['objCounter']
            },
            addString:{
                ifAllOf:['strCounter']
            },
            addBool:{
                ifAllOf:['boolCounter']
            },
            addNumber:{
                ifAllOf:['numCounter']
            },
            // initEvenLevel:{
            //     ifKeyIn: ['rootEditor']
            // },
            // setEvenLevel:{
            //     ifKeyIn: ['parentLevel']
            // },



            // doKeyParts:{
            //     ifAllOf:['clonedTemplate'],
            //     target:'keyParts'
            // },





            // doCollapseAll:{
            //     ifAllOf:['clonedTemplate'],
            //     target: 'collapseAllIds'
            // }
        },
        
    },
    complexPropDefaults:{
        mainTemplate: mainTemplate,
        styles: [style.default],

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