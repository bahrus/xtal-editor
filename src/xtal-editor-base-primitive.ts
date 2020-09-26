import {XtalElement, define, TransformValueOptions} from 'xtal-element/XtalElement.js';
import {createTemplate} from 'trans-render/createTemplate.js';
import {templStampSym} from 'trans-render/standardPlugins.js';

const mainTemplate = createTemplate(/* html */`
    <div data-type=string part=editor>
        <button part=expander>Expand</button><input part=key><input part=value>
    </div>
    <style>
        [part="editor"][data-type="object"] [part="expander"]{
            display: inline;
        }
        [part="editor"][data-type="array"] [part="expander"]{
            display: inline;
        }
        [part="editor"][data-type="string"] [part="expander"]{
            display: none;
        }
        [part="editor"][data-type="number"] [part="expander"]{
            display: none;
        }
        [part="editor"][data-type="boolean"] [part="expander"]{
            display: none;
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
        [refs.editor]: [{dataset: {type: type}}]
    } as TransformValueOptions)
]

const linkType = ({value, self}: XtalEditorBasePrimitive) => {
    if(value === undefined) return;
    if(value === 'true' || value === 'false'){
        self.type = 'boolean';
    }else if(!isNaN(value as any as number)){
        self.type = 'number';
    }else{
        try{
            const obj = JSON.parse(value);
            if(Array.isArray(obj)){
                self.type = 'array';
            }else{
                self.type = 'object';
            }
        }catch(e){
            self.type = 'string';
        }
    }
}

const propActions = [linkType];

export class XtalEditorBasePrimitive extends XtalElement{
    static is = 'xtal-editor-base-primitive';
    static attributeProps = ({value, type}: XtalEditorBasePrimitive) => ({
        str: [value, type]
    })
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
    }
    handleValueChange(val: string){
        this.value = val;
    }
    value: string | undefined;

    type: 'string' | 'number' | 'boolean' | 'object' | 'array' | undefined;
}
define(XtalEditorBasePrimitive);