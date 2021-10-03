import { PropInfoExt, XE } from 'xtal-element/src/XE.js';
import { TemplMgmtActions, TemplMgmtProps, tm } from 'trans-render/lib/mixins/TemplMgmtWithPEST.js';
import { XtalEditorActions, XtalEditorProps, NameValue, editType } from '../types';
import('ib-id/i-bid.js');
import('tran-sister/tran-sister.js');
import('xtal-side-nav/xtal-side-nav.js');
import('if-diff/if-diff.js');
import('@power-elements/json-viewer/json-viewer.js');
import('be-observant/be-observant.js');
import('be-noticed/be-noticed.js');
// const style = await import('./theme.css', {
//     assert: { type: 'css' }
// });
// const splitPath = import.meta.url.split('/');
// splitPath.pop();
// const rel = splitPath.join('/');
// const cssPath = rel + '/theme.css';

const cssPath = 'https://unpkg.com/xtal-editor@0.0.69/src/theme.css'
const mainTemplate = tm.html`
<link rel=stylesheet href=${cssPath}>
<slot part=slot name=initVal be-noticed='{
    "slotchange": {"vft": "assignedNodes|", "fn": "handleSlotChange", "doInit": true}
}'></slot>
<header class=remove part=remove data-has-parent=true be-observant='{
    "data-has-parent": {"vft": "hasParent", "as": "str-attr"},
    "data-ro": {"vft": "readOnly", "as": "str-attr"}
}'>
    <xtal-side-nav>
        <button class="selector text-view-selector" part=text-view-selector></button>
        <tran-sister on=click transform='{
            ":host": [{"treeView": false, "textView": true}],
            ".tree-view-selector":[{"style": {"display":"inline-block"}}],
            ".text-view-selector": [{"style": {"display":"none"}}]
        }'></tran-sister>
        <button style="display:none"  class="selector tree-view-selector" part=tree-view-selector></button>
        <tran-sister on=click transform='{
            ":host": [{"treeView": true, "textView": false}],
            ".tree-view-selector":[{"style": {"display":"none"}}],
            ".text-view-selector": [{"style": {"display":"inline-block"}}]
        }'></tran-sister>
        <!-- TODO:  set download property dynamically -->
        <a class=download part=download download="file.json" be-observant='{
            "href": {"onProp": "downloadHref", "vft": "downloadHref"}
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
<if-diff class=tree-view -iff be-observant='{
    "iff": {"onProp": "treeView", "vft": "treeView"}
}'>
    <template>
        <div -data-type part=editor class=editor -data-ro be-observant='{
            "data-type": {"onProp": "type", "vft": "type", "as": "str-attr" },
            "data-ro": {"onProp": "readOnly", "vft": "readOnly", "as": "str-attr"}
        }'>
            <tran-sister observe-host on-prop=readOnly vft=readOnly transform-from-closest=.editor transform='
                "input": [{"readOnly": true}]
            '></tran-sister>
            <div part=field class=field>
                <div class=text-editing>
                    <button disabled part=expander class="expander nonPrimitive" be-observant='{
                        "textContent": {"vft": "open", "trueVal": "-", "falseVal": "+"}
                    }' be-noticed='{
                        "click": {"toHost": true, "toggleProp": true, "prop": "open", "vft": "textContent"}
                    }'
                    ></button>
                    <input disabled aria-label=key part=key class=key be-observant='{
                        "readOnly": {"onProp": "readOnly", "vft": "readOnly"},
                        "value": {"onProp": "key", "vft": "key"}
                    }' be-noticed='{
                        "change": "handleKeyChange"
                    }'>
                    <input disabled=2 aria-label=value part=value -read-only class=value -value  be-observant='{
                        "readOnly": {"onProp": "readOnly", "vft": "readOnly"},
                        "value": {"onProp": "value", "vft": "value", "parseValAs": "string"}
                    }' be-noticed='{
                        "disabled:onSet": {"vft": "disabled", "fn": "setFocus"},
                        "change": "handleValueChange"
                    }'>

                </div>
                <div part=child-inserters class="nonPrimitive child-inserters" data-open=false -data-ro be-observant='{
                    "data-ro": {"onProp": "readOnly", "vft": "readOnly", "as": "str-attr"}
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
            <div part=child-editors class="nonPrimitive child-editors" data-open=false be-observant='{
                "data-open":{"vft": "open", "as": "str-attr"}
            }'>
                <template data-from=child-editors-list>
                    <xtal-editor has-parent be-observant='{
                        "open": "expandAll",
                        "expandAll": "expandAll",
                        "readOnly": "readOnly"
                    }' be-noticed='{
                        "internal-update-count-changed": {"prop": "upwardDataFlowInProgress", "parseValAs": "truthy"}
                    }'></xtal-editor>
                </template>
                <i-bid -list id=child-editors-list updatable transform='{
                        "xtal-editor":[{"value": "value", "key": "key"}]
                    }'
                    be-observant='{
                        "list": "childValues"
                    }'
                ></i-bid>
            </div>

        </div>
    </template>
</if-diff>
<if-diff class=text-view be-observant='{
    "iff": {"onProp": "textView", "vft": "textView"}
}'>
    <template>
        <json-viewer be-observant='{
            "object": {"vft": "value", "parseValAs": "object"} 
        }'></json-viewer>
    </template>
</if-diff>
<be-observant></be-observant>
<be-noticed></be-noticed>
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