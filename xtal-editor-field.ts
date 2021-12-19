import {html} from 'trans-render/lib/html.js';
import { PropInfoExt, XE } from 'xtal-element/src/XE.js';
import {DefineArgs} from 'xtal-element/src/types';
import { TemplMgmtActions, TemplMgmtProps, tm } from 'trans-render/lib/mixins/TemplMgmtWithPEST.js';
import { XtalEditorFieldActions, XtalEditorFieldProps, NameValue, editType } from './types';
import { importJSON } from 'be-loaded/importJSON.js';
import('be-observant/be-observant.js');
import('be-hive/be-hive.js');
import('be-repeated/be-repeated.js');
import('be-noticed/be-noticed.js');
import('be-switched/be-switched.js');

const tagName = 'xtal-editor-field';



export class XtalEditorField extends HTMLElement implements XtalEditorFieldActions {
    self = this;
    parseValue({ value }: this) {
        if(this.dontReparse) return;
        let parsedObject = value;
        if (value !== undefined) {
            switch (typeof value) {
                case 'string':
                    if (value === 'true' || value === 'false') {
                        this.type = 'boolean';
                        parsedObject = value === 'true';
                    } else if (!isNaN(value as any as number)) {
                        this.type = 'number';
                        parsedObject = Number(value);
                    } else {
                        try {
                            parsedObject = JSON.parse(value);
                            if (Array.isArray(parsedObject)) {
                                this.type = 'array';
                            } else {
                                this.type = 'object';
                            }
                        } catch (e) {
                            this.type = 'string';
                        }
                    }
                    break;
                case 'object':
                    if (Array.isArray(parsedObject)) {
                        this.type = 'array';
                    } else {
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
        return { parsedObject };

    }
    #lastParsedObject: any;
    setChildValues({ parsedObject, type }: this) {
        if (parsedObject === this.#lastParsedObject) return {
            childValues: this.childValues
        };
        this.#lastParsedObject = parsedObject;
        if (parsedObject === undefined) {
            return {
                childValues: undefined
            }
        }
        switch (type) {
            case 'array': {
                const childValues: NameValue[] = [];
                let cnt = 0;
                for (const item of parsedObject) {
                    childValues.push({
                        key: cnt.toString(),
                        value: item
                    });
                    cnt++;
                }
                return {
                    childValues,
                }
            }
            case 'object': {
                const childValues: NameValue[] = [];
                for (var key in parsedObject) {
                    childValues.push({
                        key: key,
                        value: parsedObject[key] //toString(parsedObject[key]),
                    } as NameValue);
                }
                return { childValues };
            }
            default: {
                return {
                    childValues: undefined,
                }
            }
        }
    }

    syncValueFromChildren({ childEditors, type }: this) {
        let newVal: any;
        switch (type) {
            case 'object': {
                newVal = {}; //TODO: support array type
                childEditors.forEach(child => {
                    newVal[child.key!] = child.parsedObject!;//TODO: support for none primitive
                });

            }
                break;
            case 'array': {
                newVal = [];
                childEditors.forEach(child => {
                    newVal.push(child.parsedObject!);//TODO: support for none primitive
                });
            }
                break;
        }
        if (newVal !== undefined) {
            (<any>this).setValsQuietly({ value: newVal, parsedObject: newVal });
            const childValues = this.setChildValues(this);
            (<any>this).setValsQuietly({ childValues });
            this.dontReparse = true;
            this.value = JSON.stringify(newVal);
            this.dontReparse = false;
            //this.syncLightChild(this);
        }



        this.internalUpdateCount!++;
        this.upwardDataFlowInProgress = false;
    }

    // syncLightChild({ hasParent, value }: this) {
    //     const lightChild = this.querySelector('textarea, input') as HTMLInputElement;
    //     if (lightChild !== null) {
    //         switch (typeof value) {
    //             case 'string':
    //                 lightChild.value = value;
    //                 break;
    //             case 'object':
    //                 lightChild.value = JSON.stringify(value);
    //                 break;
    //         }
    //     }
    // }

    get childEditors() {
        const selfRoot = this.shadowRoot || this as Element;
        return Array.from(selfRoot.querySelectorAll(tagName)) as (HTMLElement & XtalEditorFieldProps)[]
    }

    addEntity({ parsedObject, type }: this, entityName: string, entityCount: number, newVal: any) {
        let newObj: any;
        switch (type) {
            case 'object':
                newObj = { ...parsedObject };
                newObj[entityName + entityCount] = newVal;
                break;
            case 'array': {
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

    addObject({ objCounter }: this) {
        return this.addEntity(this, 'object', objCounter, {});
    }

    addString({ strCounter }: this) {
        return this.addEntity(this, 'string', strCounter, '');
    }

    addBool({ boolCounter }: this) {
        return this.addEntity(this, 'boolean', boolCounter, false);
    }

    addNumber({ numCounter }: this) {
        return this.addEntity(this, 'number', numCounter, 0);
    }

    addArr({ arrCounter }: this) {
        return this.addEntity(this, 'arr', arrCounter, []);
    }

    onConnected({ hasParent }: this) {
        if (!hasParent) {
            this.rootEditor = this;
        }
    }

    handleKeyChange(self: this, key: string) {
        if (key === '') {
            this.remove();
        } else {
            this.key = key;
        }
        this.internalUpdateCount!++;
    }
    handleKeyFocus(e: Event) {
        //this.rootEditor!.removeParts.forEach(x => x.classList.add('editKey'));
    }
    handleValueFocus(e: Event) {
        //this.rootEditor!.removeParts.forEach(x => x.classList.remove('editKey'));
    }
    handleValueChange(self: this, val: string, e: InputEvent) {
        //const futureSelf = {...this, value: val};
        //const parsed = this.parseValue(futureSelf);
        this.value = val;
        this.internalUpdateCount!++;
    }
    copyToClipboard() {
        const preval = this.value;
        const val = (typeof this.value === 'string') ? JSON.parse(this.value as any as string) : this.value;
        const json = JSON.stringify(val, null, 2);
        navigator.clipboard.writeText(json);
    }

    setFocus(match: any, isDisabled: boolean, e: Event) {
        // if (!isDisabled && !this.readOnly) {
        //     const target = (<any>e).target!;
        //     setTimeout(() => {
        //         target.focus();
        //     }, 16);
        // }
    }

    makeDownloadBlob({parsedObject, isRoot}: this){
        const file = new Blob([JSON.stringify(parsedObject, null, 2)], {type: 'text/json'});
        this.downloadHref = URL.createObjectURL(file);
    }


    updateIsObject({type, readOnly}: this){
        return {
            isWritableObject: !readOnly && (type === 'object' || type === 'array'),
            isObject: type === 'object' || type === 'array',
        };
    }

}


type t = XtalEditorFieldProps & TemplMgmtProps

export interface XtalEditorField extends t { }

const notifyProp: PropInfoExt = {
    notify: {
        dispatch: true,
        reflect: { asAttr: true }
    }
}

const xe = new XE<XtalEditorFieldProps & TemplMgmtProps, XtalEditorFieldActions>();

async function register(){
    const path = 'xtal-editor/xef-config.json';
    const config = await importJSON(path, 'https://cdn.jsdelivr.net/npm/' + path);
    const def = config.default as DefineArgs<XtalEditorFieldProps & TemplMgmtProps, XtalEditorFieldActions>;
    xe.def({
        ...def,
        superclass: XtalEditorField,
        mixins: [tm.TemplMgmtMixin]
    })
}

register();
    


export const XtalEditor = xe.classDef!;

type X = XtalEditorField;

