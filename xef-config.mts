import {DefineArgs, PropInfoExt} from 'xtal-element/src/types';
import {TemplMgmtProps} from 'trans-render/lib/types';
import {XtalEditorFieldProps as props, XtalEditorFieldActions as actions} from './types';
import {html, doInitTransform} from 'may-it-be';
import {MayItBe as mib} from 'may-it-be/types';

type b = Partial<HTMLButtonElement>;
type bpa = mib<b, props, actions>;
const mainTemplate = html`
<template be-active>
    <script id=be-noticed/be-noticed.js></script>
    <script id=be-repeated/be-repeated.js></script>
    <script id=be-intersectional/be-intersectional.js></script>
</template>
<div part=editor class="animated editor" ${{
    beObservant:{
        'data-type': {onSet: 'type', vft: 'type', as: 'str-attr', ocoho: true },
        'data-ro': {onSet: 'readOnly', vft: 'readOnly', as: 'str-attr', ocoho: true}
    }
} as mib<any, props>}>
    <div part=field class=field>
        <div class=text-editing>
            <template ${{
                beSwitched:{
                    if: true,
                    ifNonEmptyArray: {ocoho: true, vft: 'childValues'}
                }
            } as mib}>
                <button disabled part=expander class=expander ${{
                    beObservant:{
                        textContent: {vft: 'open', trueVal: '-', falseVal: '+', ocoho: true}
                    },
                    beNoticed:{
                        click: {tocoho: true, toggleProp: true, prop: "open"}
                    },
                } as bpa} 
                ></button>
            </template>
            <input disabled aria-label=key part=key class=key ${{
                beObservant:{
                    readOnly: ".readOnly",
                    value: ".key"
                },
                beNoticed:{
                    change: "handleKeyChange"
                }
            } as mib}>
            
            <input disabled aria-label=value part=value -read-only class=value -value ${{
                beObservant:{
                    readOnly: ".readOnly",
                    "value": {onSet: "value", vft: "value", parseValAs: "string", ocoho: true}
                },
                beNoticed:{
                    change: "handleValueChange"
                }
            } as mib}>
            <button disabled id=copy class=action part=copy-to-clipboard title="Copy to Clipboard" ${{
                beNoticed:{
                    click: "copyToClipboard"
                }
            } as bpa}></button>
        </div>

        <div part=child-inserters class="nonPrimitive child-inserters" data-open=false -data-ro ${{
            beObservant:{
                "data-ro": {onSet: "readOnly", vft: "readOnly", as: "str-attr", ocoho: true}
            }
        } as mib}>

            <template be-switched='{
                "if": ".isWritableObject"
            }'>
                <button disabled part=object-adder class="object adder" data-d=1 ${{
                    beNoticed:{
                        click: {prop: "objCounter", plusEq: true, vft: "dataset.d", parseValAs: "int", tocoho: true}
                    }
                } as bpa}>+object</button>
                <button disabled part=string-adder class="string adder" data-d=1 ${{
                    beNoticed:{
                        click: {prop: "strCounter", plusEq: true, vft: "dataset.d", parseValAs: "int", tocoho: true}
                    }
                } as bpa}>+string</button>
                <button disabled part=bool-adder class="bool adder" data-d=1 ${{
                    beNoticed:{
                        click: {prop: "boolCounter", plusEq: true, vft: "dataset.d", parseValAs: "int", tocoho: true}
                    }
                } as bpa}>+bool</button>
                <button disabled part=number-adder class="number adder" data-d=1 ${{
                    beNoticed:{
                        click: {prop: "numCounter", plusEq: true, vft: "dataset.d", parseValAs: "int", tocoho: true}
                    }
                } as bpa}>+number</button>
                <button disabled part=arr-adder class="arr adder" data-d=1 ${{
                    beNoticed:{
                        click: {prop: "arrCounter", plusEq: true, vft: "dataset.d", parseValAs: "int", tocoho: true}
                    }
                } as bpa}>+array</button>
            </template>
            <template be-switched='{
                "if": ".isObject"
            }'>
                <button disabled id=expand-all class=action part=expand-all title="Expand All"
                        aria-label="Expand All" ${{
                            beTransformative:{
                                click: {
                                    transform:{
                                        ":host": [{"collapseAll": false, "expandAll": true, "open": true}]
                                    }
                                }
                            }
                        } as mib}>
                    </button>
                    <button disabled id=collapse-all class=action part=collapse-all title="Collapse All"
                        aria-label="Collapse All" ${{
                            beTransformative:{
                                click: {
                                    transform:{
                                        ":host": [{"collapseAll": true, "expandAll": false, "open": false}]
                                    }
                                }
                            }
                        } as mib}>
                    </button>
            </template>

            


        </div>

    </div>

    <template ${{
        beSwitched:{
            if: {ocoho: true, vft: "open"},
            ifNonEmptyArray: {ocoho: true, vft: "childValues"},
        }
    } as bpa}>
        <template be-intersectional>
            <div part=child-editors class="nonPrimitive child-editors" data-open=false>
                <template be-repeated='{
                        "list": "childValues",
                        "transform": {
                            "xtal-editor-field": [{"value": "value", "key": "key"}]
                        }
                    }'>
                    <xtal-editor-field itemscope has-parent ${{
                        beObservant:{
                            open: "expandAll",
                            expandAll: "expandAll",
                            readOnly: ".readOnly",
                            stringFilter: '.stringFilter',
                            ocoho: true
                        },
                        beNoticed:{
                            "internal-update-count-changed": {
                                prop: "upwardDataFlowInProgress", 
                                parseValAs: "truthy", 
                                "tocoho": true
                            }
                        }
                    } as mib}></xtal-editor-field>
                </template>
            </div>
        </template>
    </template>
    

</div>
`;

const notifyProp: PropInfoExt = {
    notify: {
        dispatch: true,
        reflect: { asAttr: true }
    }
}
const da: DefineArgs<props & TemplMgmtProps, actions> = {
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
            downloadHref:'',
            waitToInit: false,
            noshadow: true,
            isWritableObject: false,
            isObject: false,
            stringFilter: '',
        },
        propInfo: {
            childValues: {
                parse: false,
                notify: {
                    dispatch: true
                }
            },
            hasParent:{
                notify: {
                    toggleTo: 'isRoot'
                }

            },
            downloadHref:{
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
                ifAllOf: ['value'],
                ifKeyIn: ['stringFilter'],
            },
            setChildValues: {
                ifAllOf: ['parsedObject'],
                ifKeyIn: ['stringFilter'],
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
            updateIsObject:{
                ifAllOf: ['type'],
                ifKeyIn: ['readOnly']
            }


        },

    },

};

console.log(JSON.stringify(da));

