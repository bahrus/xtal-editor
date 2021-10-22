import { PropInfoExt, XE } from 'xtal-element/src/XE.js';
import { TemplMgmtActions, TemplMgmtProps, tm } from 'trans-render/lib/mixins/TemplMgmtWithPEST.js';
import { XtalEditorActions, XtalEditorProps, NameValue, editType } from '../types';
import('xtal-side-nav/xtal-side-nav.js');
import('@power-elements/json-viewer/json-viewer.js');
import('be-observant/be-observant.js');
import('be-noticed/be-noticed.js');
import('be-transformative/be-transformative.js');
import('be-switched/be-switched.js');
import('be-repeated/be-repeated.js');
import('be-hive/be-hive.js');
// const style = await import('./theme.css', {
//     assert: { type: 'css' }
// });
// const splitPath = import.meta.url.split('/');
// splitPath.pop();
// const rel = splitPath.join('/');
// const cssPath = rel + '/theme.css';

//const cssPath = 'https://unpkg.com/xtal-editor@0.0.73/src/theme.css'
const mainTemplate = tm.html`

<!-- <link rel=stylesheet href={cssPath}> -->
<style>
header[data-has-parent="true"]{
    display: none;
}
    :host{
    display:block;
}
:host[hidden]{
    display:none;
}


slot{
    display: none;
}

@media (prefers-color-scheme: dark) {
    .editor{
        background-color: black;
    }
}

.expander{
    width: fit-content;
    height: fit-content;
    padding-left: 0px;
    padding-right: 0px;
    width:25px;
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
.object.adder{
    background-color: #C15000;
}
.editor{
    --obj-key-bg: #e17000;
    --array-key-bg: #2d5b89;
    --array-key-color: #D2A476;
    --obj-even-level-editor-bg: #F1E090;
    --obj-odd-level-editor-bg: #FFEFCC;
    --array-even-level-editor-bg: #A9DBDD;
    --array-odd-level-editor-bg: #D9DBDD;
    --string-adder-bg: #007408;
    --bool-adder-bg: #516600;
    --num-adder-bg:#497B8D;
    --arr-adder-bg: #2d5b89;
}
.editor[data-type="object"][data-even-level="true"]{
    background-color: var(--obj-even-level-editor-bg);
}
.editor[data-type="object"][data-even-level="false"]{
    background-color: var(--obj-odd-level-editor-bg);
}
.editor[data-type="array"][data-even-level="true"]{
    background-color: var(--array-even-level-editor-bg);
    
}
.editor[data-type="array"][data-even-level="false"]{
    background-color: var(--array-odd-level-editor-bg);
}
/* .editor{
    transition-timing-function: ease;
} */
@keyframes fadeIn {
    0% {opacity: 0;}
    100% {opacity: 1;}
}
.animated {
    animation-duration: 1s;
    animation-fill-mode: both;
}
.editor,json-viewer {
    animation-name: fadeIn;
}


.child-inserters[data-ro="true"] .adder{
    display: none;
}
.string.adder{
    background-color:var(--string-adder-bg);
}
.bool.adder{
    background-color: var(--bool-adder-bg);
}
.number.adder{
    background-color: var(--num-adder-bg);
}
.arr.adder{
    background-color: var(--arr-adder-bg);
}
.adder{
    color: white;
    text-shadow:1px 1px 1px black;
    border-radius: 5px;
    padding: 2;
    border: none;
}
.selector{
    color: white;
    text-shadow:1px 1px 1px black;
    border-radius: 5px;
    padding: 2;
    border: none;
    margin-left: 12px;
    background-color: hotpink;   
}
/* .download{
    color: white;
    text-shadow:1px 1px 1px black;
    border-radius: 5px;
    padding: 2;
    font-size:14px;
    border: none;
    margin-left: 12px;
    background-color: rgb(182, 197, 114);
} */
.download{
    color: rgb(29, 155, 240);
    margin-left: 11px;
    
}

.remove[data-has-parent="false"]{
    display: flex;
    justify-content: space-between;
    /* padding: 0px 4px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px; */
    color: white;
    font-weight: bold;
    text-shadow: 1px 1px 1px black;
    background-color: black;
}
.remove[data-has-parent="false"]::after{
    content: "JSON Editor";
}
.remove[data-has-parent="false"][data-ro="true"]::after{
    content: "JSON Viewer";
}
.text-view-selector::after{
    content: "Text View"
}
.tree-view-selector::after{
    content: "Tree View"
}
.tree-view-selector.inactive{
    display:none;
}
.text-view-selector.inactive{
    display:none;
}
.remove.editKey::after{
    content: "Remove item by deleting the property name.";
}
xtal-side-nav::part(opener), xtal-side-nav::part(close-btn){
    font-size:12px;
}
xtal-side-nav::part(side-nav){
    left: inherit;
    top:initial;
    height: 40px;
    padding-top:20px;
    justify-content: space-evenly;
    /* top: inherit; */
}
.field{
    display:flex;
    flex-direction:row;
    line-height: 20px;
    align-items: center;
}
#copy{
    background-image: url(https://cdn.jsdelivr.net/npm/xtal-editor/src/copy.svg);
    
}
#expand-all{
    background-image: url(https://cdn.jsdelivr.net/npm/xtal-editor/src/arrows-expand.svg);
    width: 20px;
}
.action{
    background-repeat:no-repeat;
    background-position-y:center;
    height: 22px;
}
xtal-side-nav{
    display: inline;
    --drawer-width:140px;
}

#collapse-all{
    background-image: url(https://cdn.jsdelivr.net/npm/xtal-editor/src/arrows-collapse.svg);
    width: 20px;
}
@media only screen and (max-width: 1000px) {
    [data-ro="false"] .field{
        flex-direction: column;
    }
    [data-ro="false"] .child-inserters{
        justify-content: flex-end;
        width: 100%;
    }
    [data-ro="false"] .text-editing{
        width: 100%;
    }
}
@media only screen and (min-width: 1001px){
    [data-ro="false"] .child-inserters{
        justify-content: center;
    }
    [data-ro="false"] .field{
        width: 100%;
        justify-content: space-evenly;
    }
    [data-ro="false"] .text-editing{
        flex-grow: 1;
    }
}
@media only screen and (max-width: 500px) {
    [data-ro="true"] .field{
        flex-direction: column;
    }
    [data-ro="true"] .child-inserters{
        justify-content: flex-end;
        width: 100%;
    }
    [data-ro="true"] .text-editing{
        width: 100%;
    }
}
@media only screen and (min-width: 501px){
    [data-ro="true"] .child-inserters{
        justify-content: center;
    }
    [data-ro="true"] .field{
        width: 100%;
        justify-content: space-evenly;
    }
    [data-ro="true"] .text-editing{
        flex-grow: 1;
    }
}
.text-editing{
    display: flex;
    flex-direction: row;
    padding-top:1px;
    padding-bottom:1px;
}
.child-inserters{
    display: flex;
}
.child-editors{
    margin-left: 15px;
}
div[part="child-editors"][data-open="false"]{
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
    background-color: var(--obj-key-bg);
    color: color-contrast(var(--obj-key-bg) vs white, black);
}
[data-type="number"] [part="key"]{
    background-color: rgb(73, 123, 141);
}
[data-type="array"] [part="key"]{
    background-color: var(--array-key-bg);
    /* color: color-contrast(var(--array-key-bg) vs white, black); */
    color: var(--array-key-color);
}
.value{
    background-color: #ECF3C3;
    width: 100%;
    flex-grow:5;
}
input.key {
    
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    margin-right: 2px;
}
input {
    border: none;
    padding: 3px;
}

</style>
<slot part=slot name=initVal be-noticed='{
    "slotchange": {"vft": "assignedNodes|", "fn": "handleSlotChange", "doInit": true}
}'></slot>

<!-- Header -->
<template be-switched='{
    "if": true,
    "lhs": {"vft": "hasParent"},
    "op":  "===",
    "rhs": false
}'>
    <header class=remove part=remove data-has-parent=true be-observant='{
        "data-has-parent": {"vft": "hasParent", "as": "str-attr"},
        "data-ro": {"vft": "readOnly", "as": "str-attr"}
    }'>
        <xtal-side-nav>
            <button class="selector text-view-selector" part=text-view-selector be-transformative='{
                "click": {
                    "transform":{
                        ":host": [{"treeView": false, "textView": true}],
                        ".tree-view-selector":[{},{},{".inactive": false}],
                        ".text-view-selector": [{}, {}, {".inactive": true}]                            
                    }
                }
            }'></button>
            <button class="selector tree-view-selector inactive" part=tree-view-selector be-transformative='{
                "click": {
                    "transform":{
                        ":host": [{"treeView": true, "textView": false}],
                        ".tree-view-selector":[{},{},{".inactive": true}],
                        ".text-view-selector": [{},{}, {".inactive": false}]
                    }
                }
            }'></button>
            <!-- TODO:  set download property dynamically -->
            <a class=download part=download download="file.json" be-observant='{
                "href": {"onSet": "downloadHref", "vft": "downloadHref"}
            }'>
                <svg viewBox="0 0 24 24" style="width:16.25px;height:16.25px">
                    <g color="rgb(29, 155, 240)">
                        <path stroke="currentcolor" d="M11.96 14.945c-.067 0-.136-.01-.203-.027-1.13-.318-2.097-.986-2.795-1.932-.832-1.125-1.176-2.508-.968-3.893s.942-2.605 2.068-3.438l3.53-2.608c2.322-1.716 5.61-1.224 7.33 1.1.83 1.127 1.175 2.51.967 3.895s-.943 2.605-2.07 3.438l-1.48 1.094c-.333.246-.804.175-1.05-.158-.246-.334-.176-.804.158-1.05l1.48-1.095c.803-.592 1.327-1.463 1.476-2.45.148-.988-.098-1.975-.69-2.778-1.225-1.656-3.572-2.01-5.23-.784l-3.53 2.608c-.802.593-1.326 1.464-1.475 2.45-.15.99.097 1.975.69 2.778.498.675 1.187 1.15 1.992 1.377.4.114.633.528.52.928-.092.33-.394.547-.722.547z"></path>
                        <path stroke="currentcolor" d="M7.27 22.054c-1.61 0-3.197-.735-4.225-2.125-.832-1.127-1.176-2.51-.968-3.894s.943-2.605 2.07-3.438l1.478-1.094c.334-.245.805-.175 1.05.158s.177.804-.157 1.05l-1.48 1.095c-.803.593-1.326 1.464-1.475 2.45-.148.99.097 1.975.69 2.778 1.225 1.657 3.57 2.01 5.23.785l3.528-2.608c1.658-1.225 2.01-3.57.785-5.23-.498-.674-1.187-1.15-1.992-1.376-.4-.113-.633-.527-.52-.927.112-.4.528-.63.926-.522 1.13.318 2.096.986 2.794 1.932 1.717 2.324 1.224 5.612-1.1 7.33l-3.53 2.608c-.933.693-2.023 1.026-3.105 1.026z"></path>
                    </g>
                </svg>
                Download
            </a>
        </xtal-side-nav>

    </header>
</template>

<!-- Tree View -->
<template be-switched='{
    "if": {"onSet": "treeView", "vft": "treeView"},
    "debug": true
}'>
    <div part=editor class="animated editor" be-observant='{
        "data-type": {"onSet": "type", "vft": "type", "as": "str-attr" },
        "data-ro": {"onSet": "readOnly", "vft": "readOnly", "as": "str-attr"}
    }'>
        <div part=field class=field>
            <div class=text-editing>
                <button disabled part=expander class="expander nonPrimitive" be-observant='{
                    "textContent": {"vft": "open", "trueVal": "-", "falseVal": "+"}
                }' be-noticed='{
                    "click": {"toggleProp": true, "prop": "open"}
                }'
                ></button>
                <input disabled aria-label=key part=key class=key be-observant='{
                    "readOnly": {"onSet": "readOnly", "vft": "readOnly"},
                    "value": {"onSet": "key", "vft": "key"}
                }' be-noticed='{
                    "change": "handleKeyChange"
                }'>
                <input disabled=2 aria-label=value part=value -read-only class=value -value  be-observant='{
                    "readOnly": {"onSet": "readOnly", "vft": "readOnly"},
                    "value": {"onSet": "value", "vft": "value", "parseValAs": "string"}
                }' be-noticed='{
                    "disabled:onSet": {"vft": "disabled", "fn": "setFocus"},
                    "change": "handleValueChange"
                }'>

            </div>
            <div part=child-inserters class="nonPrimitive child-inserters" data-open=false -data-ro be-observant='{
                "data-ro": {"onSet": "readOnly", "vft": "readOnly", "as": "str-attr"}
            }'>
                <button disabled part=object-adder class="object adder" data-d=1 be-noticed='{
                    "click": {"prop": "objCounter", "plusEq": true, "vft": "dataset.d", "parseValAs": "int"}
                }'>+object</button>
                <button disabled part=string-adder class="string adder" data-d=1 be-noticed='{
                    "click": {"prop": "strCounter", "plusEq": true, "vft": "dataset.d", "parseValAs": "int"}
                }'>+string</button>
                <button disabled part=bool-adder class="bool adder" data-d=1 be-noticed='{
                    "click": {"prop": "boolCounter", "plusEq": true, "vft": "dataset.d", "parseValAs": "int"}
                }'>+bool</button>
                <button disabled part=number-adder class="number adder" data-d=1 be-noticed='{
                    "click": {"prop": "numCounter", "plusEq": true, "vft": "dataset.d", "parseValAs": "int"}
                }'>+number</button>
                <button disabled part=arr-adder class="arr adder" data-d=1 be-noticed='{
                    "click": {"prop": "arrCounter", "plusEq": true, "vft": "dataset.d", "parseValAs": "int"}
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

            </div>

        </div>
        <div part=child-editors class="nonPrimitive child-editors" data-open=false be-observant='{
            "data-open":{"vft": "open", "as": "str-attr"}
        }'>
            <xtal-editor has-parent be-observant='{
                "open": "expandAll",
                "expandAll": "expandAll",
                "readOnly": "readOnly"
            }' be-noticed='{
                "internal-update-count-changed": {"prop": "upwardDataFlowInProgress", "parseValAs": "truthy"}
            }' be-repeated='{
                "list": "childValues",
                "transform": {
                    "xtal-editor": [{"value": "value", "key": "key"}]
                }
            }'></xtal-editor>
        </div>

    </div>
</template>

<!-- Text View -->
<template be-switched='{
    "if": {"onSet": "textView", "vft": "textView"}
}'>
    <json-viewer class=animated be-observant='{
        "object": {"vft": "value", "parseValAs": "object"} 
    }'></json-viewer>
</template>
<be-hive></be-hive>
`;


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
export class XtalEditorCore extends HTMLElement implements XtalEditorActions {
    self = this;
    parseValue({ value }: this) {
        let parsedObject = value;
        if (value !== undefined) {
            switch (typeof value) {
                case 'string':
                    if (value === 'true' || value === 'false') {
                        this.type = 'boolean';
                    } else if (!isNaN(value as any as number)) {
                        this.type = 'number';
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
            this.value = JSON.stringify(newVal);
            this.syncLightChild(this);
        }



        this.internalUpdateCount!++;
        this.upwardDataFlowInProgress = false;
    }

    syncLightChild({ hasParent, value }: this) {
        const lightChild = this.querySelector('textarea, input') as HTMLInputElement;
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
        return Array.from(this.shadowRoot!.querySelectorAll(tagName)) as (HTMLElement & XtalEditorProps)[]
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
        return this.addEntity(this, 'bool', boolCounter, false);
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
        this.value = val;
        this.internalUpdateCount!++;
    }
    copyToClipboard() {
        const preval = this.value;
        const val = typeof (this.value === 'string') ? JSON.parse(this.value as any as string) : this.value;
        const json = JSON.stringify(val, null, 2);
        navigator.clipboard.writeText(json);
    }
    handleSlotChange(slot: HTMLSlotElement, nodes: Node[], e: Event) {
        for (const node of nodes) {
            const aNode = node as any;
            if (aNode.value !== undefined) {
                this.value = aNode.value;
            }
        }
    }

    setFocus(match: any, isDisabled: boolean, e: Event) {
        if (!isDisabled && !this.readOnly) {
            const target = (<any>e).target!;
            setTimeout(() => {
                target.focus();
            }, 16);
        }
    }

    makeDownloadBlob({parsedObject}: this){
        const file = new Blob([JSON.stringify(parsedObject, null, 2)], {type: 'text/json'});
        this.downloadHref = URL.createObjectURL(file);
    }
}

export interface XtalEditorCore extends XtalEditorProps { }

// const isRef:PropInfoExt = {
//     isRef: true,
//     parse: false,
// };

const notifyProp: PropInfoExt = {
    notify: {
        dispatch: true,
        reflect: { asAttr: true }
    }
}
const xe = new XE<XtalEditorProps & TemplMgmtProps, XtalEditorActions>({
    //config is JSON Serializable
    config: {
        tagName: 'xtal-editor',
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
            downloadHref:'',
        },
        propInfo: {
            childValues: {
                parse: false,
                notify: {
                    dispatch: true
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
                ifAllOf: ['parsedObject', 'open']
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
                ifKeyIn: ['parsedObject'],
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
    superclass: XtalEditorCore,
    mixins: [tm.TemplMgmtMixin]
});


export const XtalEditor = xe.classDef!;

type X = XtalEditorCore;

if(document.querySelector('be-hive') === null){
    document.head.appendChild(document.createElement('be-hive'));
}