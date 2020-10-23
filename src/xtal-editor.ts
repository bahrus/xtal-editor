import {XtalElement, define, TransformValueOptions, AttributeProps, RenderContext, SelectiveUpdate, p, symbolize, EventScopes} from 'xtal-element/XtalElement.js';
import {createTemplate} from 'trans-render/createTemplate.js';
import {templStampSym} from 'trans-render/standardPlugins.js';
import {XtalEditorPublicProps, editType} from '../types.d.js';

const basePathSplit = import.meta.url.split('/');
basePathSplit.pop();
const basePath = basePathSplit.join('/') + '/';
const mainTemplate = createTemplate(/* html */`
    <div class="remove" part=remove>Remove item by deleting a property name.
    
    </div>
    <div data-type=string part=editor>
        <div part=field class=field>
            <button part=expander class="expander nonPrimitive">+</button><input part=key><input part=value class=value>
            <div part=childInserters class="nonPrimitive childInserters" data-open=false>
                <button part=objectAdder class=objectAdder>add object</button>
                <button part=stringAdder class=stringAdder>add string</button>
                <button part=boolAdder class=boolAdder>add bool</button>
                <button part=numberAdder class=numberAdder>add number</button>
                
            </div>
            <button class=copyBtn part=copyToClipboard><img class=copy alt="Copy to Clipboard" part=copyImg></button>
        </div>
        <div part=childEditors class="nonPrimitive childEditors" data-open=false></div>
        
    </div>
    <style>
        :host{
            display:block;
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
    key: p, value: p, editor: p, childEditors: p, copyToClipboard: p, copyImg: p, expander: p, objectAdder: p, stringAdder: p, boolAdder: p, remove: p, numberAdder: p
};
symbolize(refs);


const initTransform = ({self, type, hasParent}: XtalEditor) => ({
    ':host': [templStampSym, refs],
    [refs.expander]: [{}, {click: self.toggle}],
    [refs.key]: [{},{change: [self.handleKeyChange, 'value']}],
    [refs.value]: [{}, {change: [self.handleValueChange, 'value']}],
    [refs.objectAdder]: [{}, {click: self.addObject}],
    [refs.stringAdder]: [{}, {click: self.addString}],
    [refs.boolAdder]: [{}, {click: self.addBool}],
    [refs.numberAdder]: [{}, {click: self.addNumber}],
    [refs.remove]: !hasParent,
    [refs.copyToClipboard]: [{}, {click: self.copyToClipboard}],
    [refs.copyImg]: [{src:basePath + 'copy.svg'}]

} as TransformValueOptions);

const updateTransforms = [
    ({type}: XtalEditor) => ({
        [refs.editor]: [{dataset: {type: type}}],
    }),
    ({value}: XtalEditor) => ({
        [refs.value]: [{value: value}]
    }),
    ({uiValue}: XtalEditor) => ({
        [refs.value]: [uiValue === undefined ? undefined : {value: uiValue}]
    }),
    ({key}: XtalEditor) => ({
        [refs.key]: [{value: key}]
    }),
    ({childValues, type, self}: XtalEditor) => ({
        //insert child editor elements
        [refs.childEditors]: [childValues, XtalEditor.is,, ({target, item, idx}: RenderContext<XtalEditor>) => {
            if(!target) return;
            //TODO:  enhance(?) TR to make this declarative
            switch(typeof item){
                case 'object':
                    target.key = item.key;
                    target.value = item.value;
                    break;
                default:
                    target.value = item;
                    target.key = idx!.toString();
            }
            
            target.hasParent = true;
            target.addEventListener('internal-update-count-changed', e =>{
                self.upwardDataFlowInProgress = true;
            });
        }]
    }),
    ({open}: XtalEditor) => ({
        [refs.expander]: open ? '-' : '+',
        [refs.childEditors] : [{dataset:{open: (!!open).toString()}}]
    })
] as SelectiveUpdate<any>[]

const linkTypeAndParsedObject = ({value, self}: XtalEditor) => {
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

const link_ParsedObject = ({uiValue, self}: XtalEditor) => {
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

const linkChildValues = ({parsedObject, type, self}: XtalEditor) => {
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

const addObject = ({objCounter, self}: XtalEditor) => {
    if(objCounter === undefined) return;
    self.open = true;
    const newObj = {...self.parsedObject};
    newObj['object' + objCounter] = {};
    self.value = JSON.stringify(newObj);
    
}

const addString = ({strCounter, self}: XtalEditor) => {
    if(strCounter === undefined) return;
    const newObj = {...self.parsedObject};
    newObj['string' + strCounter] = 'val' + strCounter;
    self.value = JSON.stringify(newObj);
    self.open = true;
}

const addBool = ({boolCounter, self}: XtalEditor) => {
    if(boolCounter === undefined) return;
    const newObj = {...self.parsedObject};
    newObj['bool' + boolCounter] = 'false';
    self.value = JSON.stringify(newObj);
    self.open = true;
}

const addNumber = ({numberCounter, self}: XtalEditor) => {
    if(numberCounter === undefined) return;
    const newObj = {...self.parsedObject};
    newObj['number' + numberCounter] = '0';
    self.value = JSON.stringify(newObj);
    self.open = true;
}


const propActions = [linkTypeAndParsedObject, linkChildValues, linkValueFromChildren, addObject, addString, addBool, addNumber, link_ParsedObject];

interface NameValue {
    key: string, 
    value: string,
}

export class XtalEditor extends XtalElement implements XtalEditorPublicProps{
    static is = 'xtal-editor';
    static attributeProps = ({value, uiValue, type, parsedObject, key, childValues, upwardDataFlowInProgress, 
        internalUpdateCount, open, objCounter, strCounter, boolCounter, numberCounter, hasParent}: XtalEditor) => ({
        bool: [upwardDataFlowInProgress, open, hasParent],
        dry: [type, parsedObject, value, hasParent],
        num: [internalUpdateCount, objCounter, strCounter, boolCounter, numberCounter],
        str: [value, type, key, uiValue],
        jsonProp: [value],
        obj: [parsedObject, childValues],
        notify: [internalUpdateCount, parsedObject],
    } as AttributeProps);

    readyToInit = true;
    readyToRender = true;
     
    mainTemplate = mainTemplate;
    initTransform = initTransform;
    updateTransforms = updateTransforms;
    propActions = propActions;
    handleKeyChange(key: string){
        if(key === ''){
            this.remove();
        }
        this.value = key;
    }
    handleValueChange(val: string){
        this.value = val;
        this.incrementUpdateCount();
    }
    incrementUpdateCount(){
        this.internalUpdateCount = this.internalUpdateCount === undefined ? 0 : this.internalUpdateCount + 1;
    }
    copyToClipboard(){
        (<any>this)[refs.value].select();
        document.execCommand("copy");
    }

    toggle(){
        this.open = !this.open;
    }
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


    key: string | undefined;

    value: string | undefined;
    uiValue: string | undefined;

    type: editType;

    parsedObject: any;

    childValues: string[] | undefined | NameValue[];

    open: boolean | undefined;

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

}
define(XtalEditor);