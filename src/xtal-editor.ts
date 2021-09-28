import {PropInfoExt, XE} from 'xtal-element/src/XE.js';
import {TemplMgmtActions, TemplMgmtProps, tm} from 'trans-render/lib/mixins/TemplMgmtWithPEST.js';
import {XtalEditorActions, XtalEditorProps, NameValue, editType} from '../types';
import('pass-down/p-d.js');
import('pass-up/p-u.js');
import('ib-id/i-bid.js');
import('tran-sister/tran-sister.js');
import('xtal-side-nav/xtal-side-nav.js');
// const style = await import('./theme.css', {
//     assert: { type: 'css' }
// });
const splitPath = import.meta.url.split('/');
splitPath.pop();
const rel = splitPath.join('/');
const cssPath = rel + '/theme.css';

// const cssPath = 'https://unpkg.com/xtal-editor@0.0.63/src/theme.css'
const mainTemplate = tm.html`
<link rel=stylesheet href=${cssPath}>
<slot part=slot name=initVal></slot>
<p-d observe-host vft=hasParent to=[-data-has-parent] as=str-attr m=1></p-d>
<p-d observe-host on-prop=readOnly vft=readOnly to=[-data-ro] as=str-attr m=2></p-d>
<span class=remove part=remove -data-ro -data-has-parent data-has-parent=true>
    <xtal-side-nav>
        <button class=view-selector part=view-selector></button>
    </xtal-side-nav>
    
</span>
<div data-type=string part=editor class=editor -data-ro>
    <div part=field class=field>
        <div class=text-editing>
            <p-d observe-host vft=open to=[-text-content] true-val=- false-val=+ m=1></p-d>
            <button disabled part=expander class="expander nonPrimitive" -text-content></button>
            <p-u on=click to-host fn=toggleOpen val=target.textContent></p-u>
            <p-d observe-host on-prop=readOnly vft=readOnly to=[-read-only] m=2></p-d>
            <input aria-label=key part=key class=key -value -read-only>
            <p-u to-host on=change fn=handleKeyChange></p-u>
            <input disabled=3 aria-label=value part=value -read-only class=value>
            <p-u on-prop=disabled to-host fn=setFocus vft=disabled></p-u>
            <p-u to-host on=change fn=handleValueChange val=target.value></p-u>
            <p-u to-host on=focus fn=handleValueFocus val=target></p-u>
        </div>
        <p-d observe-host on-prop=readOnly vft=readOnly to=[-data-ro] as=str-attr m=1></p-d>
        <div part=child-inserters class="nonPrimitive child-inserters" data-open=false -data-ro>
            <button disabled part=object-adder class="object adder" data-d=1>+object</button>
            <p-u on=click to-host prop=objCounter plus-eq val=target.dataset.d parse-val-as=int></p-u>
            <button disabled part=string-adder class="string adder" data-d=1>+string</button>
            <p-u on=click to-host prop=strCounter plus-eq val=target.dataset.d parse-val-as=int></p-u>
            <button disabled part=bool-adder class="bool adder" data-d=1>+bool</button>
            <p-u on=click to-host prop=boolCounter plus-eq val=target.dataset.d parse-val-as=int></p-u>
            <button disabled part=number-adder class="number adder" data-d=1>+number</button>
            <p-u on=click to-host prop=numCounter plus-eq val=target.dataset.d parse-val-as=int></p-u>
            <button disabled part=arr-adder class="arr adder" data-d=1>+array</button>
            <p-u on=click to-host prop=arrCounter plus-eq val=target.dataset.d parse-val-as=int></p-u>
            <button disabled id=copy class=action part=copy-to-clipboard title="Copy to Clipboard"></button>
            <p-u on=click to-host fn=copyToClipboard val=target.title></p-u>
            <button disabled id=expand-all class=action part=expand-all title="Expand All" aria-label="Expand All"></button>
            <tran-sister on=click transform='{
                ":host": [{"collapseAll": false, "expandAll": true, "open": true}]
            }'></tran-sister>
            <button disabled id=collapse-all class=action part=collapse-all title="Collapse All" aria-label="Collapse All"></button>
            <tran-sister on=click transform='{
                ":host": [{"collapseAll": true, "expandAll": false, "open": false}]
            }'></tran-sister>

        </div>
        
    </div>
    <p-d observe-host vft=open to=[-data-open] as=str-attr m=1></p-d>
    <div part=child-editors class="nonPrimitive child-editors" -data-open data-open=false>
        <template data-from=child-editors-list>
            <p-d observe-host vft=expandAll to=[-open] m=1></p-d>
            <p-d observe-host vft=expandAll to=[-expand-all] m=1></p-d>
            <p-d observe-host on-prop=readOnly vft=readOnly to=[-read-only]></p-d>
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
    slot: [{}, {slotchange: 'handleSlotChange'}],
}
const updateValue = ({value}: X) => [{value: typeof value === 'string' ? value : JSON.stringify(value)}];
const updateKey = ({key}: X) => [{value: key}];
const updateType = ({type}: X) => [{dataset: {type: type}}];

const tagName = 'xtal-editor';
/**
 * @element xtal-editor
 * @tagName xtal-editor
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
export class XtalEditorCore extends HTMLElement implements XtalEditorActions{
    self = this;
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
                case 'number':
                    this.type = 'number';
                    break;
                case 'boolean':
                    this.type = 'boolean';
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
            case 'object':{
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
            this.syncLightChild(this);
        }


        
        this.internalUpdateCount!++;
        this.upwardDataFlowInProgress = false;        
    }

    syncLightChild({hasParent, value}: this){
        const lightChild = this.querySelector('textarea, input') as HTMLInputElement;
        if(lightChild !== null){
            switch(typeof value){
                case 'string':
                    lightChild.value = value;
                    break;
                case 'object':
                    lightChild.value = JSON.stringify(value);
                    break;
            }
        }
    }

    get childEditors(){
        return Array.from(this.shadowRoot!.querySelectorAll(tagName)) as (HTMLElement & XtalEditorProps)[]
    }

    addEntity({parsedObject, type}: this, entityName: string, entityCount: number, newVal: any){
        let newObj: any;
        switch(type){
            case 'object':
                newObj = {...parsedObject};
                newObj[entityName + entityCount] = newVal;
                break;
            case 'array':{
                newObj = [...parsedObject];
                newObj.push(newVal);
                break;
            }
        }
        return {
            value: newObj,
            internalUpdateCount: this.internalUpdateCount + 1,
            open: true,
        };
    }

    addObject({objCounter}: this){
        return this.addEntity(this, 'object', objCounter, {});
    }

    addString({strCounter}: this){
        return this.addEntity(this, 'string', strCounter, '');
    }

    addBool({boolCounter}: this){
        return this.addEntity(this, 'bool', boolCounter, false);
    }

    addNumber({numCounter}: this){
        return this.addEntity(this, 'number', numCounter, 0);
    }

    addArr({arrCounter}: this){
        return this.addEntity(this, 'arr', arrCounter, []);
    }

    onConnected({hasParent}: this){
        if(!hasParent){
            this.rootEditor = this;
        }
    }

    handleKeyChange(self: this, key: string){
        if(key === ''){
            this.remove();
        }else{
            this.key = key;
        }
        this.internalUpdateCount!++;
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
        const preval = this.value;
        const val = typeof(this.value === 'string') ? JSON.parse(this.value as any as string) : this.value;
        const json = JSON.stringify(val, null, 2);
        navigator.clipboard.writeText(json);
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
    setFocus(match:any, isDisabled: boolean, e: Event){
        if(!isDisabled && !this.readOnly){
            const target = (<any>e).target!;
            setTimeout(() => {
                target.focus();
            }, 16);
        }
        //console.log(match, isDisabled, e);
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
            arrCounter: 0,
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
            // objectAdderParts: isRef,
            // stringAdderParts: isRef,
            // boolAdderParts: isRef,
            // numberAdderParts: isRef,
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
            addArr:{
                ifAllOf:['arrCounter']
            },
            syncLightChild:{
                ifAllOf:['value'],
                ifNoneOf: ['hasParent', 'readOnly'],
            }
            // initEvenLevel:{
            //     ifKeyIn: ['rootEditor']
            // },
            // setEvenLevel:{
            //     ifKeyIn: ['parentLevel']
            // },

        },
        
    },
    complexPropDefaults:{
        mainTemplate: mainTemplate,
        //styles: [style.default],

    },
    superclass: XtalEditorCore,
    mixins:[tm.TemplMgmtMixin]
});


export const XtalEditor = xe.classDef!;

type X = XtalEditorCore;