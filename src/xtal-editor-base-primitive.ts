import {XtalElement, define, TransformValueOptions, AttributeProps} from 'xtal-element/XtalElement.js';
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
const refs = {key: Symbol(), value: Symbol(), editor: Symbol()};

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

const linkChildValues = ({parsedObject, type, self}: XtalEditorBasePrimitive) => {
    if(parsedObject === undefined) {
        self.childValues = undefined;
        return;
    }
    switch(type){
        case 'array':
        case 'number':
        case 'string':
            self.childValues = undefined;
            return;
    }

};


const propActions = [linkType, linkChildValues];

export class XtalEditorBasePrimitive extends XtalElement{
    static is = 'xtal-editor-base-primitive';
    static attributeProps = ({value, type, parsedObject, key}: XtalEditorBasePrimitive) => ({
        str: [value, type, key],
        jsonProp: [value],
        obj: [parsedObject],
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

    childValues: string[] | undefined;

}
define(XtalEditorBasePrimitive);