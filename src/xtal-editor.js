import { XE } from 'xtal-element/src/XE.js';
import { tm } from 'trans-render/lib/mixins/TemplMgmtWithPEST.js';
import('pass-down/p-d.js');
import('pass-up/p-u.js');
import('ib-id/i-bid.js');
import('tran-sister/tran-sister.js');
import('xtal-side-nav/xtal-side-nav.js');
import('if-diff/if-diff.js');
import('@power-elements/json-viewer/json-viewer.js');
// const style = await import('./theme.css', {
//     assert: { type: 'css' }
// });
const splitPath = import.meta.url.split('/');
splitPath.pop();
const rel = splitPath.join('/');
const cssPath = rel + '/theme.css';
//const cssPath = 'https://unpkg.com/xtal-editor@0.0.65/src/theme.css'
const mainTemplate = tm.html `
<link rel=stylesheet href=${cssPath}>
<slot part=slot name=initVal></slot>
<p-u on=slotchange vft=assignedNodes| to-host fn=handleSlotChange></p-u>
<p-d observe-host vft=hasParent to=[-data-has-parent] as=str-attr m=1></p-d>
<p-d observe-host on-prop=readOnly vft=readOnly to=[-data-ro] as=str-attr m=1></p-d>
<header class=remove part=remove -data-ro -data-has-parent data-has-parent=true>
    <xtal-side-nav>
        <button class="selector text-view-selector" part=text-view-selector></button>
        <tran-sister on=click transform='{
            ":host": [{"fieldView": false, "textView": true}],
            ".field-view-selector":[{"style": {"display":"inline-block"}}],
            ".text-view-selector": [{"style": {"display":"none"}}]
        }'></tran-sister>
        <button style="display:none"  class="selector field-view-selector" part=field-view-selector></button>
        <tran-sister on=click transform='{
            ":host": [{"fieldView": true, "textView": false}],
            ".field-view-selector":[{"style": {"display":"none"}}],
            ".text-view-selector": [{"style": {"display":"inline-block"}}]
        }'></tran-sister>
        <p-d observe-host on-prop=downloadHref vft=downloadHref to=[-href] m=1></p-d>
        <a class=download part=download -href -download download="file.json">
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
<p-d observe-host on-prop=fieldView to=.field-view[-iff] vft=fieldView m=1></p-d>
<if-diff class=field-view -iff>
    <template>
        <p-d observe-host on-prop=type vft=type to=[-data-type] as=str-attr m=1></p-d>
        <p-d observe-host on-prop=readOnly vft=readOnly to=[-data-ro] as=str-attr m=1></p-d>
        <div -data-type part=editor class=editor -data-ro>
            <div part=field class=field>
                <div class=text-editing>
                    <p-d observe-host vft=open to=[-text-content] true-val=- false-val=+ m=1></p-d>
                    <button disabled part=expander class="expander nonPrimitive" -text-content></button>
                    <p-u on=click to-host toggle-prop prop=open val=target.textContent></p-u>
                    <p-d observe-host on-prop=readOnly vft=readOnly to=[-read-only] m=2></p-d>
                    <p-d observe-host on-prop=key vft=key to=[-value] m=1></p-d>
                    <input aria-label=key part=key class=key -value -read-only>
                    <p-u to-host on=change fn=handleKeyChange></p-u>
                    <p-d observe-host on-prop=value vft=value to=[-value] parse-val-as=string m=1></p-d>
                    <input disabled=3 aria-label=value part=value -read-only class=value -value>
                    <p-u on-prop=disabled to-host fn=setFocus vft=disabled></p-u>
                    <p-u to-host on=change fn=handleValueChange val=target.value></p-u>
                    <p-u to-host on=focus fn=handleValueFocus val=target></p-u>
                </div>
                <p-d observe-host on-prop=readOnly vft=readOnly to=[-data-ro] as=str-attr m=1></p-d>
                <div part=child-inserters class="nonPrimitive child-inserters" data-open=false -data-ro>
                    <button disabled part=object-adder class="object adder" data-d=1>+object</button>
                    <p-u on=click to-host prop=objCounter plus-eq val=target.dataset.d parse-val-as=int></p-u>
                    <button disabled part=string-adder class="string adder" data-d=1>+string</button>
                    <p-u on=click to-host prop=strCounter plus-eq val=target.dataset.d parse-val-as=int></p-u>
                    <button disabled part=bool-adder class="bool adder" data-d=1>+bool</button>
                    <p-u on=click to-host prop=boolCounter plus-eq val=target.dataset.d parse-val-as=int></p-u>
                    <button disabled part=number-adder class="number adder" data-d=1>+number</button>
                    <p-u on=click to-host prop=numCounter plus-eq val=target.dataset.d parse-val-as=int></p-u>
                    <button disabled part=arr-adder class="arr adder" data-d=1>+array</button>
                    <p-u on=click to-host prop=arrCounter plus-eq val=target.dataset.d parse-val-as=int></p-u>
                    <button disabled id=copy class=action part=copy-to-clipboard title="Copy to Clipboard"></button>
                    <p-u on=click to-host fn=copyToClipboard val=target.title></p-u>
                    <button disabled id=expand-all class=action part=expand-all title="Expand All"
                        aria-label="Expand All"></button>
                    <tran-sister on=click transform='{
                            ":host": [{"collapseAll": false, "expandAll": true, "open": true}]
                        }'></tran-sister>
                    <button disabled id=collapse-all class=action part=collapse-all title="Collapse All"
                        aria-label="Collapse All"></button>
                    <tran-sister on=click transform='{
                            ":host": [{"collapseAll": true, "expandAll": false, "open": false}]
                        }'></tran-sister>

                </div>

            </div>
            <p-d observe-host vft=open to=[-data-open] as=str-attr m=1></p-d>
            <div part=child-editors class="nonPrimitive child-editors" -data-open data-open=false>
                <template data-from=child-editors-list>
                    <p-d observe-host vft=expandAll to=[-open] m=1></p-d>
                    <p-d observe-host vft=expandAll to=[-expand-all] m=1></p-d>
                    <p-d observe-host on-prop=readOnly vft=readOnly to=[-read-only]></p-d>
                    <xtal-editor -open has-parent -expand-all -read-only></xtal-editor>
                    <p-u on=internal-update-count-changed to-host prop=upwardDataFlowInProgress parse-val-as=truthy>
                    </p-u>
                </template>
                <p-d observe-host vft=childValues to=[-list] m=1></p-d>
                <i-bid -list id=child-editors-list updatable transform='{
                        "xtal-editor":[{"value": "value", "key": "key"}]
                    }'></i-bid>
            </div>

        </div>
    </template>
</if-diff>
<p-d observe-host on-prop=textView to=.text-view[-iff] vft=textView m=1></p-d>
<if-diff class=text-view -iff>
    <template>
        <p-d observe-host vft to=[-object] parse-val-as=object></p-d>
        <json-viewer -object></json-viewer>
    </template>
</if-diff>
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
export class XtalEditorCore extends HTMLElement {
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
        return Array.from(this.shadowRoot.querySelectorAll(tagName));
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
        return this.addEntity(this, 'bool', boolCounter, false);
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
        const val = typeof (this.value === 'string') ? JSON.parse(this.value) : this.value;
        const json = JSON.stringify(val, null, 2);
        navigator.clipboard.writeText(json);
    }
    handleSlotChange(slot, nodes, e) {
        for (const node of nodes) {
            const aNode = node;
            if (aNode.value !== undefined) {
                this.value = aNode.value;
            }
        }
    }
    setFocus(match, isDisabled, e) {
        if (!isDisabled && !this.readOnly) {
            const target = e.target;
            setTimeout(() => {
                target.focus();
            }, 16);
        }
    }
    makeDownloadBlob({ parsedObject }) {
        const file = new Blob([JSON.stringify(parsedObject, null, 2)], { type: 'text/json' });
        this.downloadHref = URL.createObjectURL(file);
    }
}
// const isRef:PropInfoExt = {
//     isRef: true,
//     parse: false,
// };
const notifyProp = {
    notify: {
        dispatch: true,
        reflect: { asAttr: true }
    }
};
const xe = new XE({
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
            fieldView: true,
            type: 'string',
            downloadHref: '',
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
export const XtalEditor = xe.classDef;
