import { html } from 'trans-render/lib/html.js';
import { XE } from 'xtal-element/src/XE.js';
import { tm } from 'trans-render/lib/mixins/TemplMgmtWithPEST.js';
import('be-observant/be-observant.js');
import('be-hive/be-hive.js');
import('be-repeated/be-repeated.js');
import('be-noticed/be-noticed.js');
import('be-switched/be-switched.js');
const tagName = 'xtal-editor-field';
const mainTemplate = html `
<div part=editor class="animated editor" be-observant='{
    "data-type": {"onSet": "type", "vft": "type", "as": "str-attr", "ocoho": true },
    "data-ro": {"onSet": "readOnly", "vft": "readOnly", "as": "str-attr", "ocoho": true}
}'>
    <div part=field class=field>
        <div class=text-editing>
            <template be-switched='{
                "if": true,
                "ifNonEmptyArray": {"ocoho": true, "vft": "childValues"}
            }'>
                <button disabled part=expander class=expander be-observant='{
                    "textContent": {"vft": "open", "trueVal": "-", "falseVal": "+", "ocoho": true}
                }' be-noticed='{
                    "click": {"tocoho": true, "toggleProp": true, "prop": "open"}
                }'
                ></button>
            </template>
            <input disabled aria-label=key part=key class=key be-observant='{
                "readOnly": ".readOnly",
                "value": ".key"
            }' be-noticed='{
                "change": "handleKeyChange"
            }'>
            <input disabled aria-label=value part=value -read-only class=value -value  be-observant='{
                "readOnly": ".readOnly",
                "value": {"onSet": "value", "vft": "value", "parseValAs": "string", "ocoho": true}
            }' be-noticed='{
                "change": "handleValueChange"
            }'>

        </div>
        <div part=child-inserters class="nonPrimitive child-inserters" data-open=false -data-ro be-observant='{
            "data-ro": {"onSet": "readOnly", "vft": "readOnly", "as": "str-attr", "ocoho": true}
        }'>
            <template be-switched='{
                "if": ".isObject"
            }'>
                <button disabled part=object-adder class="object adder" data-d=1 be-noticed='{
                    "click": {"prop": "objCounter", "plusEq": true, "vft": "dataset.d", "parseValAs": "int", "tocoho": true}
                }'>+object</button>
                <button disabled part=string-adder class="string adder" data-d=1 be-noticed='{
                    "click": {"prop": "strCounter", "plusEq": true, "vft": "dataset.d", "parseValAs": "int", "tocoho": true}
                }'>+string</button>
                <button disabled part=bool-adder class="bool adder" data-d=1 be-noticed='{
                    "click": {"prop": "boolCounter", "plusEq": true, "vft": "dataset.d", "parseValAs": "int", "tocoho": true}
                }'>+bool</button>
                <button disabled part=number-adder class="number adder" data-d=1 be-noticed='{
                    "click": {"prop": "numCounter", "plusEq": true, "vft": "dataset.d", "parseValAs": "int", "tocoho": true}
                }'>+number</button>
                <button disabled part=arr-adder class="arr adder" data-d=1 be-noticed='{
                    "click": {"prop": "arrCounter", "plusEq": true, "vft": "dataset.d", "parseValAs": "int", "tocoho": true}
                }'>+array</button>
                <button disabled id=copy class=action part=copy-to-clipboard title="Copy to Clipboard" be-noticed='{
                "click": "copyToClipboard"
            }'></button>
            <button disabled id=expand-all class=action part=expand-all title="Expand All"
                aria-label="Expand All" be-transformative='{
                    "click":{
                        "transform":{
                            ":host": [{"collapseAll": false, "expandAll": true, "open": true}]
                        }
                    }
                }'>
            </button>
            <button disabled id=collapse-all class=action part=collapse-all title="Collapse All"
                aria-label="Collapse All" be-transformative='{
                    "click":{
                        "transform":{
                            ":host": [{"collapseAll": true, "expandAll": false, "open": false}]
                        }
                    }
                }'>
            </button>
            </template>


        </div>

    </div>

    <template be-switched='{
        "if": {"ocoho": true, "vft": "open"},
        "ifNonEmptyArray": {"ocoho": true, "vft": "childValues"}
    }'>
        <div part=child-editors class="nonPrimitive child-editors" data-open=false>
            <template be-repeated='{
                    "list": "childValues",
                    "transform": {
                        "xtal-editor-field": [{"value": "value", "key": "key"}]
                    }
                }'>
                <xtal-editor-field data-is-hostish has-parent be-observant='{
                    "open": "expandAll",
                    "expandAll": "expandAll",
                    "readOnly": "readOnly",
                    "ocoho": true
                }' be-noticed='{
                    "internal-update-count-changed": {"prop": "upwardDataFlowInProgress", "parseValAs": "truthy", "tocoho": true}
                }' ></xtal-editor-field>
            </template>
        </div>
    </template>
    

</div>
`;
export class XtalEditorField extends HTMLElement {
    self = this;
    parseValue({ value }) {
        let parsedObject = value;
        if (value !== undefined) {
            switch (typeof value) {
                case 'string':
                    if (value === 'true' || value === 'false') {
                        this.type = 'boolean';
                    }
                    else if (!isNaN(value)) {
                        this.type = 'number';
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
            this.value = JSON.stringify(newVal);
            this.syncLightChild(this);
        }
        this.internalUpdateCount++;
        this.upwardDataFlowInProgress = false;
    }
    syncLightChild({ hasParent, value }) {
        const lightChild = this.querySelector('textarea, input');
        if (lightChild !== null) {
            switch (typeof value) {
                case 'string':
                    lightChild.value = value;
                    break;
                case 'object':
                    lightChild.value = JSON.stringify(value);
                    break;
            }
        }
    }
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
        return { isObject: !readOnly && (type === 'object' || type === 'array') };
    }
    async awaitKeyDepdencies() {
        // await customElements.whenDefined('be-switched');
        // await customElements.whenDefined('be-observant');
        // import('be-noticed/be-noticed.js');
        // import('be-transformative/be-transformative.js');
        // import('xtal-side-nav/xtal-side-nav.js');
        // import('@power-elements/json-viewer/json-viewer.js');
        // import('be-repeated/be-repeated.js');
        return {
            waitToInit: false
        };
    }
}
const notifyProp = {
    notify: {
        dispatch: true,
        reflect: { asAttr: true }
    }
};
const xe = new XE({
    //config is JSON Serializable
    config: {
        tagName: 'xtal-editor-field',
        propDefaults: {
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
            readOnly: false,
            textView: false,
            treeView: true,
            type: 'string',
            downloadHref: '',
            waitToInit: true,
            noshadow: true,
            isObject: false,
        },
        propInfo: {
            childValues: {
                parse: false,
                notify: {
                    dispatch: true
                }
            },
            hasParent: {
                notify: {
                    toggleTo: 'isRoot'
                }
            },
            downloadHref: {
                notify: {
                    dispatch: true,
                }
            },
            open: notifyProp,
            expandAll: notifyProp,
            collapseAll: notifyProp,
            internalUpdateCount: notifyProp,
            //valueParts: isRef,
            // textView:{
            //     notify:{
            //         toggleTo: 'fieldView'
            //     }
            // }
        },
        actions: {
            ...tm.doInitTransform,
            parseValue: {
                ifAllOf: ['value']
            },
            setChildValues: {
                ifAllOf: ['parsedObject']
            },
            syncValueFromChildren: {
                ifAllOf: ['upwardDataFlowInProgress']
            },
            addObject: {
                ifAllOf: ['objCounter']
            },
            addString: {
                ifAllOf: ['strCounter']
            },
            addBool: {
                ifAllOf: ['boolCounter']
            },
            addNumber: {
                ifAllOf: ['numCounter']
            },
            addArr: {
                ifAllOf: ['arrCounter']
            },
            syncLightChild: {
                ifAllOf: ['value'],
                ifNoneOf: ['hasParent', 'readOnly'],
            },
            makeDownloadBlob: {
                ifAllOf: ['isRoot'],
                ifKeyIn: ['parsedObject'],
            },
            awaitKeyDepdencies: {
                ifAllOf: ['waitToInit'],
                async: true,
            },
            updateIsObject: {
                ifAllOf: ['type']
            }
            // initEvenLevel:{
            //     ifKeyIn: ['rootEditor']
            // },
            // setEvenLevel:{
            //     ifKeyIn: ['parentLevel']
            // },
        },
    },
    complexPropDefaults: {
        mainTemplate: mainTemplate,
        //styles: [style.default],
    },
    superclass: XtalEditorField,
    mixins: [tm.TemplMgmtMixin]
});
export const XtalEditor = xe.classDef;
if (document.querySelector('be-hive') === null) {
    document.head.appendChild(document.createElement('be-hive'));
}
