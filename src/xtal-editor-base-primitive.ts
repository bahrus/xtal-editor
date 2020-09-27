import {XtalElement, define, TransformValueOptions, AttributeProps, RenderContext} from 'xtal-element/XtalElement.js';
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
    } as TransformValueOptions),
    ({value}: XtalEditorBasePrimitive) => ({
        [refs.value]: [{value: value}]
    } as TransformValueOptions),
    ({key}: XtalEditorBasePrimitive) => ({
        [refs.key]: [{value: key}]
    } as TransformValueOptions),
    ({childValues, type}: XtalEditorBasePrimitive) => ({
        [refs.childEditors]: [childValues, XtalEditorBasePrimitive.is,, (context: RenderContext<XtalEditorBasePrimitive>) => {
                console.log(context);
        }]
    } as TransformValueOptions)
] 

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

const linkChildValues = ({parsedObject, type, self}: XtalEditorBasePrimitive) => {
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


const propActions = [linkType, linkChildValues];

interface NameValue {
    key: string, 
    value: string,
}

export class XtalEditorBasePrimitive extends XtalElement{
    static is = 'xtal-editor-base-primitive';
    static attributeProps = ({value, type, parsedObject, key, childValues}: XtalEditorBasePrimitive) => ({
        str: [value, type, key],
        jsonProp: [value],
        obj: [parsedObject, childValues],
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
    }

    key: string | undefined;

    value: string | undefined;

    type: 'string' | 'number' | 'boolean' | 'object' | 'array' | undefined;

    parsedObject: any;

    childValues: string[] | undefined | NameValue[];

}
define(XtalEditorBasePrimitive);