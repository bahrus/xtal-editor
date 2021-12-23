import { XE } from 'xtal-element/src/XE.js';
import { tm } from 'trans-render/lib/mixins/TemplMgmtWithPEST.js';
import { importJSON } from 'be-loaded/importJSON.js';
import('be-hive/be-hive.js');
import('be-repeated/be-repeated.js');
import('be-noticed/be-noticed.js');
const tagName = 'xtal-editor-field';
export class XtalEditorField extends HTMLElement {
    self = this;
    parseValue({ value }) {
        if (this.dontReparse)
            return;
        let parsedObject = value;
        if (value !== undefined) {
            switch (typeof value) {
                case 'string':
                    if (value === 'true' || value === 'false') {
                        this.type = 'boolean';
                        parsedObject = value === 'true';
                    }
                    else if (!isNaN(value)) {
                        this.type = 'number';
                        parsedObject = Number(value);
                    }
                    else {
                        try {
                            parsedObject = JSON.parse(value);
                            if (Array.isArray(parsedObject)) {
                                this.type = 'array';
                            }
                            else {
                                this.type = 'object';
                            }
                        }
                        catch (e) {
                            this.type = 'string';
                        }
                    }
                    break;
                case 'object':
                    if (Array.isArray(parsedObject)) {
                        this.type = 'array';
                    }
                    else {
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
    #lastParsedObject;
    setChildValues({ parsedObject, type }) {
        if (parsedObject === this.#lastParsedObject)
            return {
                childValues: this.childValues
            };
        this.#lastParsedObject = parsedObject;
        if (parsedObject === undefined) {
            return {
                childValues: undefined
            };
        }
        switch (type) {
            case 'array': {
                const childValues = [];
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
                };
            }
            case 'object': {
                const childValues = [];
                for (var key in parsedObject) {
                    childValues.push({
                        key: key,
                        value: parsedObject[key] //toString(parsedObject[key]),
                    });
                }
                return { childValues };
            }
            default: {
                return {
                    childValues: undefined,
                };
            }
        }
    }
    syncValueFromChildren({ childEditors, type }) {
        let newVal;
        switch (type) {
            case 'object':
                {
                    newVal = {}; //TODO: support array type
                    childEditors.forEach(child => {
                        newVal[child.key] = child.parsedObject; //TODO: support for none primitive
                    });
                }
                break;
            case 'array':
                {
                    newVal = [];
                    childEditors.forEach(child => {
                        newVal.push(child.parsedObject); //TODO: support for none primitive
                    });
                }
                break;
        }
        if (newVal !== undefined) {
            this.setValsQuietly({ value: newVal, parsedObject: newVal });
            const childValues = this.setChildValues(this);
            this.setValsQuietly({ childValues });
            this.dontReparse = true;
            this.value = JSON.stringify(newVal);
            this.dontReparse = false;
            //this.syncLightChild(this);
        }
        this.internalUpdateCount++;
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
        const selfRoot = this.shadowRoot || this;
        return Array.from(selfRoot.querySelectorAll(tagName));
    }
    addEntity({ parsedObject, type }, entityName, entityCount, newVal) {
        let newObj;
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
    addObject({ objCounter }) {
        return this.addEntity(this, 'object', objCounter, {});
    }
    addString({ strCounter }) {
        return this.addEntity(this, 'string', strCounter, '');
    }
    addBool({ boolCounter }) {
        return this.addEntity(this, 'boolean', boolCounter, false);
    }
    addNumber({ numCounter }) {
        return this.addEntity(this, 'number', numCounter, 0);
    }
    addArr({ arrCounter }) {
        return this.addEntity(this, 'arr', arrCounter, []);
    }
    onConnected({ hasParent }) {
        if (!hasParent) {
            this.rootEditor = this;
        }
    }
    handleKeyChange(self, key) {
        if (key === '') {
            this.remove();
        }
        else {
            this.key = key;
        }
        this.internalUpdateCount++;
    }
    handleKeyFocus(e) {
        //this.rootEditor!.removeParts.forEach(x => x.classList.add('editKey'));
    }
    handleValueFocus(e) {
        //this.rootEditor!.removeParts.forEach(x => x.classList.remove('editKey'));
    }
    handleValueChange(self, val, e) {
        //const futureSelf = {...this, value: val};
        //const parsed = this.parseValue(futureSelf);
        this.value = val;
        this.internalUpdateCount++;
    }
    copyToClipboard() {
        const preval = this.value;
        const val = (typeof this.value === 'string') ? JSON.parse(this.value) : this.value;
        const json = JSON.stringify(val, null, 2);
        navigator.clipboard.writeText(json);
    }
    setFocus(match, isDisabled, e) {
        // if (!isDisabled && !this.readOnly) {
        //     const target = (<any>e).target!;
        //     setTimeout(() => {
        //         target.focus();
        //     }, 16);
        // }
    }
    makeDownloadBlob({ parsedObject, isRoot }) {
        const file = new Blob([JSON.stringify(parsedObject, null, 2)], { type: 'text/json' });
        this.downloadHref = URL.createObjectURL(file);
    }
    updateIsObject({ type, readOnly }) {
        return {
            isWritableObject: !readOnly && (type === 'object' || type === 'array'),
            isObject: type === 'object' || type === 'array',
        };
    }
}
const notifyProp = {
    notify: {
        dispatch: true,
        reflect: { asAttr: true }
    }
};
const xe = new XE();
async function register() {
    const path = 'xtal-editor/xef-config.json';
    const config = await importJSON(path, 'https://cdn.jsdelivr.net/npm/' + path);
    const def = config.default;
    xe.def({
        ...def,
        superclass: XtalEditorField,
        mixins: [tm.TemplMgmtMixin]
    });
}
register();
export const XtalEditor = xe.classDef;
