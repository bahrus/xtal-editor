import {XtalElement, define, TransformValueOptions, AttributeProps, RenderContext, SelectiveUpdate, p, symbolize} from 'xtal-element/XtalElement.js';
import {createTemplate} from 'trans-render/createTemplate.js';
import {templStampSym} from 'trans-render/standardPlugins.js';


const mainTemplate = createTemplate(/* html */`
    <div class="remove" part=remove>Remove item by deleting a property name.</div>
    <div data-type=string part=editor>
        <div part=field class=field>
            <button part=expander class="expander nonPrimitive">+</button><input part=key><input part=value>
            <div part=childInserters class="nonPrimitive childInserters" data-open=false>
                <button part=objectAdder class="objectAdder">add object</button>
                <button part=stringAdder class="stringAdder">add string</button>
            </div>
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
        .objectAdder{
            background-color: #E17000;
        }
        .stringAdder{
            background-color: #009408;
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
const refs = {key: p, value: p, editor: p, childEditors: p, expander: p, objectAdder: p, stringAdder: p, remove: p};
symbolize(refs);

const initTransform = ({self, type, hasParent}: XtalEditorBasePrimitive) => ({
    ':host': [templStampSym, refs],
    [refs.expander]: [{}, {click: self.toggle}],
    [refs.key]: [{},{change: [self.handleKeyChange, 'value']}],
    [refs.value]: [{}, {change: [self.handleValueChange, 'value']}],
    [refs.objectAdder]: [{}, {click: self.addObject}],
    [refs.stringAdder]: [{}, {click: self.addString}],
    [refs.remove]: !hasParent

} as TransformValueOptions);

const updateTransforms = [
    ({type}: XtalEditorBasePrimitive) => ({
        [refs.editor]: [{dataset: {type: type}}],
    }),
    ({value}: XtalEditorBasePrimitive) => ({
        [refs.value]: [{value: value}]
    }),
    ({key}: XtalEditorBasePrimitive) => ({
        [refs.key]: [{value: key}]
    }),
    ({childValues, type, self}: XtalEditorBasePrimitive) => ({
        //insert child editor elements
        [refs.childEditors]: [childValues, XtalEditorBasePrimitive.is,, ({target, item}: RenderContext<XtalEditorBasePrimitive>) => {
            if(!target) return;
            //TODO:  enhance(?) TR to make this declarative
            target.key = item.key;
            target.value = item.value;
            target.hasParent = true;
            target.addEventListener('internal-update-count-changed', e =>{
                self.upwardDataFlowInProgress = true;
            })
        }]
    }),
    ({open}: XtalEditorBasePrimitive) => ({
        [refs.expander]: open ? '-' : '+',
        [refs.childEditors] : [{dataset:{open: (!!open).toString()}}]
    })
] as SelectiveUpdate<any>[]

const linkType = ({value, self}: XtalEditorBasePrimitive) => {
    let parsedObject = undefined;
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
    self.upwardDataFlowInProgress = false;
};

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

const linkChildValues = ({parsedObject, type, self, upwardDataFlowInProgress}: XtalEditorBasePrimitive) => {
    if(upwardDataFlowInProgress) return;
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

const linkValueFromChildren = ({upwardDataFlowInProgress, self, type}: XtalEditorBasePrimitive) => {
    if(!upwardDataFlowInProgress) return;
    const children = Array.from(self.shadowRoot!.querySelectorAll(XtalEditorBasePrimitive.is)) as XtalEditorBasePrimitive[];

    const newVal: any = {}; //TODO: support array type
    children.forEach(child =>{
        newVal[child.key!] = child.value!;//TODO: support for none primitive
    });
    self.value = JSON.stringify(newVal);
    self.incrementUpdateCount();
    
}

const addObject = ({objCounter, self}: XtalEditorBasePrimitive) => {
    if(objCounter === undefined) return;
    const newObj = {...self.parsedObject};
    newObj['object' + objCounter] = {};
    self.value = JSON.stringify(newObj);
    self.open = true;
}

const addString = ({strCounter, self}: XtalEditorBasePrimitive) => {
    if(strCounter === undefined) return;
    const newObj = {...self.parsedObject};
    newObj['string' + strCounter] = 'val' + strCounter;
    self.value = JSON.stringify(newObj);
    self.open = true;
}


const propActions = [linkType, linkChildValues, linkValueFromChildren, addObject, addString];

interface NameValue {
    key: string, 
    value: string,
}

export class XtalEditorBasePrimitive extends XtalElement{
    static is = 'xtal-editor-base-primitive';
    static attributeProps = ({value, type, parsedObject, key, childValues, upwardDataFlowInProgress, internalUpdateCount, open, objCounter, strCounter, hasParent}: XtalEditorBasePrimitive) => ({
        bool: [upwardDataFlowInProgress, open, hasParent],
        num: [internalUpdateCount, objCounter, strCounter],
        str: [value, type, key],
        jsonProp: [value],
        obj: [parsedObject, childValues],
        notify: [internalUpdateCount],
    } as AttributeProps)
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

    toggle(){
        this.open = !this.open;
    }

    addObject(){
        this.objCounter = this.objCounter === undefined ? 1 : this.objCounter + 1;
    }

    addString(){
        this.strCounter = this.strCounter === undefined ? 1 : this.strCounter + 1
    }


    key: string | undefined;

    value: string | undefined;

    type: 'string' | 'number' | 'boolean' | 'object' | 'array' | undefined;

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
    hasParent: boolean | undefined;

}
define(XtalEditorBasePrimitive);