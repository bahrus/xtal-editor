import {XtalElement, define, TransformValueOptions, AttributeProps, RenderContext, SelectiveUpdate} from 'xtal-element/XtalElement.js';
import {createTemplate} from 'trans-render/createTemplate.js';
import {templStampSym} from 'trans-render/standardPlugins.js';

const mainTemplate = createTemplate(/* html */`
    <div data-type=string part=editor>
        <button part=expander class="nonPrimitive">Expand</button><input part=key><input part=value>
        <div part=childEditors class="nonPrimitive"></div>
    </div>
    <style>
        [part="editor"][data-type="object"] .nonPrimitive{
            display: inline;
        }
        [part="editor"][data-type="array"] .nonPrimitive{
            display: inline;
        }
        [part="editor"][data-type="string"] .nonPrimitive{
            display: none;
        }
        [part="editor"][data-type="number"] .nonPrimitive{
            display: none;
        }
        [part="editor"][data-type="boolean"] .nonPrimitive{
            display: none;
        }
        [part="editor"][data-type="string"] [part="key"]{
            background-color: #B1C639;;
        }
        [part="editor"][data-type="object"] [part="key"]{
            background-color: #E17000;
        }

        [part="editor"] [part="value"]{
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
const refs = {key: Symbol(), value: Symbol(), editor: Symbol(), childEditors: Symbol()};

const initTransform = ({self}: XtalEditorBasePrimitive) => ({
    ':host': [templStampSym, refs],
    [refs.key]: [{},{change: [self.handleKeyChange, 'value']}],
    [refs.value]: [{}, {change: [self.handleValueChange, 'value']}]
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
        [refs.childEditors]: [childValues, XtalEditorBasePrimitive.is,, ({target, item}: RenderContext<XtalEditorBasePrimitive>) => {
            if(!target) return;
            //TODO:  enhance(?) TR to make this declarative
            target.key = item.key;
            target.value = item.value;
            target.addEventListener('internal-update-count-changed', e =>{
                self.upwardDataFlowInProgress = true;
            })
        }]
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

const linkValueFromChildren = ({upwardDataFlowInProgress, self}: XtalEditorBasePrimitive) => {
    if(!upwardDataFlowInProgress) return;
    const children = Array.from(self.shadowRoot!.querySelectorAll(XtalEditorBasePrimitive.is)) as XtalEditorBasePrimitive[];
    const newVal: any = {}; //TODO: support array type
    children.forEach(child =>{
        newVal[child.key!] = child.value!;//TODO: support for none primitive
    });
    self.value = JSON.stringify(newVal);
    self.incrementUpdateCount();
    
}


const propActions = [linkType, linkChildValues, linkValueFromChildren];

interface NameValue {
    key: string, 
    value: string,
}

export class XtalEditorBasePrimitive extends XtalElement{
    static is = 'xtal-editor-base-primitive';
    static attributeProps = ({value, type, parsedObject, key, childValues, upwardDataFlowInProgress, internalUpdateCount}: XtalEditorBasePrimitive) => ({
        bool: [upwardDataFlowInProgress],
        num: [internalUpdateCount],
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

    key: string | undefined;

    value: string | undefined;

    type: 'string' | 'number' | 'boolean' | 'object' | 'array' | undefined;

    parsedObject: any;

    childValues: string[] | undefined | NameValue[];

    /**
     * @private
     */
    upwardDataFlowInProgress: boolean | undefined;

    internalUpdateCount: number | undefined;

}
define(XtalEditorBasePrimitive);