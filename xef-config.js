import { html } from './node_modules/trans-render/lib/html.mjs';
import { doInitTransform } from './node_modules/trans-render/lib/mixins/doInitTransform.mjs';
const mainTemplate = html `
<div part=editor class="animated editor" be-observant='${{
    'data-type': { onSet: 'type', vft: 'type', as: 'str-attr', ocoho: true },
    'data-ro': { onSet: 'readOnly', vft: 'readOnly', as: 'str-attr', ocoho: true }
}}'>
    <div part=field class=field>
        <div class=text-editing>
            <template be-switched='${{
    "if": true,
    "ifNonEmptyArray": { ocoho: true, vft: "childValues" }
}}'>
                <button disabled part=expander class=expander be-observant='${{
    "textContent": { vft: "open", "trueVal": "-", "falseVal": "+", ocoho: true }
}}' be-noticed='${{
    click: { "tocoho": true, "toggleProp": true, prop: "open" }
}}'
                ></button>
            </template>
            <!-- <input disabled aria-label=key part=key class=key be-observant='{
                "readOnly": ".readOnly",
                "value": ".key"
            }' be-noticed='{
                "change": "handleKeyChange"
            }'> -->
            <input disabled aria-label=key part=key class=key ${{
    beObservant: {
        readOnly: '.readOnly',
        value: '.key'
    },
    beNoticed: {
        change: 'handleKeyChange'
    }
}}>
            <input disabled aria-label=value part=value -read-only class=value -value  be-observant='${{
    "readOnly": ".readOnly",
    "value": { onSet: "value", vft: "value", parseValAs: "string", ocoho: true }
}}' be-noticed='{
                "change": "handleValueChange"
            }'>
            <button disabled id=copy class=action part=copy-to-clipboard title="Copy to Clipboard" be-noticed='${{
    click: "copyToClipboard"
}}'></button>
        </div>

        <div part=child-inserters class="nonPrimitive child-inserters" data-open=false -data-ro be-observant='${{
    "data-ro": { onSet: "readOnly", vft: "readOnly", "as": "str-attr", ocoho: true }
}}'>

            <template be-switched='{
                "if": ".isWritableObject"
            }'>
                <button disabled part=object-adder class="object adder" data-d=1 be-noticed='${{
    click: { prop: "objCounter", plusEq: true, vft: "dataset.d", parseValAs: "int", tocoho: true }
}}'>+object</button>
                <button disabled part=string-adder class="string adder" data-d=1 be-noticed='${{
    click: { prop: "strCounter", plusEq: true, vft: "dataset.d", parseValAs: "int", "tocoho": true }
}}'>+string</button>
                <button disabled part=bool-adder class="bool adder" data-d=1 be-noticed='${{
    click: { prop: "boolCounter", plusEq: true, vft: "dataset.d", parseValAs: "int", "tocoho": true }
}}'>+bool</button>
                <button disabled part=number-adder class="number adder" data-d=1 be-noticed='${{
    click: { prop: "numCounter", plusEq: true, vft: "dataset.d", parseValAs: "int", "tocoho": true }
}}'>+number</button>
                <button disabled part=arr-adder class="arr adder" data-d=1 be-noticed='${{
    click: { prop: "arrCounter", plusEq: true, vft: "dataset.d", parseValAs: "int", "tocoho": true }
}}'>+array</button>
            </template>
            <template be-switched='{
                "if": ".isObject"
            }'>
                <button disabled id=expand-all class=action part=expand-all title="Expand All"
                        aria-label="Expand All" be-transformative='${{
    click: {
        "transform": {
            ":host": [{ "collapseAll": false, "expandAll": true, "open": true }]
        }
    }
}}'>
                    </button>
                    <button disabled id=collapse-all class=action part=collapse-all title="Collapse All"
                        aria-label="Collapse All" be-transformative='${{
    click: {
        "transform": {
            ":host": [{ "collapseAll": true, "expandAll": false, "open": false }]
        }
    }
}}'>
                    </button>
            </template>

            


        </div>

    </div>

    <template be-switched='${{
    if: { ocoho: true, vft: "open" },
    ifNonEmptyArray: { ocoho: true, vft: "childValues" }
}}'>
        <div part=child-editors class="nonPrimitive child-editors" data-open=false>
            <template be-repeated='{
                    "list": "childValues",
                    "transform": {
                        "xtal-editor-field": [{"value": "value", "key": "key"}]
                    }
                }'>
                <xtal-editor-field itemscope has-parent be-observant='${{
    "open": "expandAll",
    "expandAll": "expandAll",
    "readOnly": "readOnly",
    ocoho: true
}}' be-noticed='${{
    "internal-update-count-changed": { prop: "upwardDataFlowInProgress", parseValAs: "truthy", "tocoho": true }
}}' ></xtal-editor-field>
            </template>
        </div>
    </template>
    

</div>
`;
const notifyProp = {
    notify: {
        dispatch: true,
        reflect: { asAttr: true }
    }
};
const da = {
    config: {
        tagName: 'xtal-editor-field',
        propDefaults: {
            mainTemplate,
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
            waitToInit: false,
            noshadow: true,
            isWritableObject: false,
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
        },
        actions: {
            ...doInitTransform,
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
            makeDownloadBlob: {
                ifAllOf: ['isRoot'],
                ifKeyIn: ['parsedObject'],
            },
            updateIsObject: {
                ifAllOf: ['type'],
                ifKeyIn: ['readOnly']
            }
        },
    },
};
console.log(JSON.stringify(da));
