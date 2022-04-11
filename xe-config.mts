import {DefineArgs} from 'xtal-element/src/types';
import {html, beTransformed, define} from 'may-it-be/index.js';
import {MayItBe as mib, BeDefinitiveVirtualProps} from 'may-it-be/types';
import { IChannel } from '../be-channeling/types';

const mode = process.argv[2] as '-js' | '-html';
const beDefinitiveProps: BeDefinitiveVirtualProps = {
    config:{
        tagName: 'xtal-editor',
        propDefaults: {
            readOnly: false,
            value: '',
            key: '',
            treeView: true,
            textView: false,
            downloadHref:'',
            editedValue: '',
            stringFilter: ''
        },
        propInfo:{
            treeView:{
                notify:{
                    dispatch: true
                }
            },
            textView:{
                notify:{
                    dispatch: true
                }
            },
        },
        actions:{
            ...beTransformed,
        }
    }
}

const commonChannel: Partial<IChannel> = {
    eventFilter: "click",
    toNearestUpMatch: "xtal-tree",
    "vfe": "path.0",
};

const innerHTML = html`
<template be-active>
    <script data-version=0.0.56  id=be-loaded/be-loaded.js></script>
    <script data-version=0.0.62  id=be-noticed/be-noticed.js></script>
    <script data-version=0.0.119 id=be-observant/be-observant.js></script>
    <script data-version=0.0.67  id=be-switched/be-switched.js></script>
    <script data-version=0.0.52  id=be-intersectional/be-intersectional.js></script>
    <script data-version=0.0.81  id=xtal-side-nav/xtal-side-nav.js></script>
    <script data-version=0.0.40  id=be-transformative/be-transformative.js></script>
    <script data-version=0.0.27  id=be-deslotted/be-deslotted.js></script>
    <script data-version=0.0.132  id=xtal-tree/xtal-tree.js></script>
    <script data-version=0.0.58  id=xtal-vlist/xtal-vlist.js></script>
    <script data-version=0.0.13   id=be-channeling/be-channeling.js></script>
</template>
<style ${{
    beLoaded: {
        fallback: 'https://cdn.jsdelivr.net/npm/xtal-editor@0.0.150/theme.css',
        preloadRef: 'xtal-editor/theme.css',
        removeStyle: true,
    }
} as mib}>
header,xtal-editor-field{
    display: none;
}
</style>
<slot name=initVal be-deslotted='["value"]'></slot>
<xtal-tree id-path=path ${{
        beObservant:{
            objectGraph:{
                onSet: 'value',
                vft: 'value',
                parseValAs: 'object',
            }
        }
    } as mib}></xtal-tree>
<header part=header>
    <xtal-side-nav>
        <button class="selector text-view-selector" part=text-view-selector ${{
            beTransformative:{
                click: {
                    transform:{
                        ":host": [{treeView: false, textView: true}],
                        treeViewSelectorClasses:[{},{},{".inactive": false}],
                        textViewSelectorClasses: [{}, {}, {".inactive": true}]                            
                    }
                }
            }
        } as mib}>Text View</button>
        <button class="selector tree-view-selector inactive" part=tree-view-selector ${{
            beTransformative:{
                click: {
                    transform:{
                        ":host": [{treeView: true, textView: false}],
                        treeViewSelectorClasses:[{},{},{".inactive": true}],
                        textViewSelectorClasses: [{},{}, {".inactive": false}]
                    }
                }
            }
        } as mib}>Tree View</button>
        <!-- TODO:  set download property dynamically -->
        <a class=download part=download download="file.json" ${{
            beObservant:{
                href: {
                    observe: 'xtal-tree',
                    onSet: 'downloadHref',
                    vft: 'downloadHref',
                }
            }
        } as mib}>
            <svg viewBox="0 0 24 24" style="width:16.25px;height:16.25px">
                <g color="rgb(29, 155, 240)">
                    <path stroke="currentcolor" d="M11.96 14.945c-.067 0-.136-.01-.203-.027-1.13-.318-2.097-.986-2.795-1.932-.832-1.125-1.176-2.508-.968-3.893s.942-2.605 2.068-3.438l3.53-2.608c2.322-1.716 5.61-1.224 7.33 1.1.83 1.127 1.175 2.51.967 3.895s-.943 2.605-2.07 3.438l-1.48 1.094c-.333.246-.804.175-1.05-.158-.246-.334-.176-.804.158-1.05l1.48-1.095c.803-.592 1.327-1.463 1.476-2.45.148-.988-.098-1.975-.69-2.778-1.225-1.656-3.572-2.01-5.23-.784l-3.53 2.608c-.802.593-1.326 1.464-1.475 2.45-.15.99.097 1.975.69 2.778.498.675 1.187 1.15 1.992 1.377.4.114.633.528.52.928-.092.33-.394.547-.722.547z"></path>
                    <path stroke="currentcolor" d="M7.27 22.054c-1.61 0-3.197-.735-4.225-2.125-.832-1.127-1.176-2.51-.968-3.894s.943-2.605 2.07-3.438l1.478-1.094c.334-.245.805-.175 1.05.158s.177.804-.157 1.05l-1.48 1.095c-.803.593-1.326 1.464-1.475 2.45-.148.99.097 1.975.69 2.778 1.225 1.657 3.57 2.01 5.23.785l3.528-2.608c1.658-1.225 2.01-3.57.785-5.23-.498-.674-1.187-1.15-1.992-1.376-.4-.113-.633-.527-.52-.927.112-.4.528-.63.926-.522 1.13.318 2.096.986 2.794 1.932 1.717 2.324 1.224 5.612-1.1 7.33l-3.53 2.608c-.933.693-2.023 1.026-3.105 1.026z"></path>
                </g>
            </svg>
            Download
        </a>
        <button part=object-adder class="object adder" value=object>+object</button>
        <button part=string-adder class="string adder" value=string>+string</button>
        <button part=bool-adder class="bool adder" value=bool>+bool</button>
        <button part=number-adder class="number adder" value=number>+number</button>
        <button part=arr-adder class="arr adder" value=arr>+array</button>
    </xtal-side-nav>
    <h1 part=title >
        <span ${{
            beObservant: {
                textContent:{
                    onSet: "readOnly",
                    vft: "readOnly",
                    trueVal: "JSON Viewer",
                    falseVal: "JSON Editor",
                }
            }
        } as mib}>
        </span>
        

    </h1>
    <label part=search-label class=search-label>Search:&nbsp;&nbsp;<input part=search-input type=search ${{
            beNoticed: {
                input: {
                    toNearestUpMatch: 'xtal-tree',
                    prop: "searchString",
                    vft: "value",
                    debug: true
                }
            }
        } as mib}>
    </label>
    <div class=exp-coll>
        <button class="action expand-all" aria-label="expand all" title="expand all" ${{
            beNoticed:{
                click: {
                    toNearestUpMatch: 'xtal-tree',
                    prop: "expandAll",
                    val: true,
                }
            }
        } as mib}>&nbsp;</button>
        <button class="action collapse-all" aria-label="collapse all" title="collapse all" ${{
            beNoticed:{
                click: {
                    toNearestUpMatch: 'xtal-tree',
                    prop: "collapseAll",
                    val: true,
                }
            }
        } as mib}>&nbsp;</button>
        <button class="action copy" aria-label="copy" title="copy" name="" ${{
            beNoticed:{
                click: {
                    toNearestUpMatch: 'xtal-tree',
                    prop: 'copyNodeToClipboard',
                    vft: '.'
                }
            }
        }}>&nbsp;</button>
    </div>
</header>
<!-- Tree View -->
<template ${{
    beSwitched:{
        if: '.treeView',
    }
} as mib}>
    <xtal-vlist
        part=xtal-vlist
        class=animated 
        style="height:600px;width:100%;" 
        page-size="10" 
        id="vlist"
        min-item-height='19.5'
        ${{
            beObservant:{
                list: {observe: "xtal-tree", vft: "viewableNodes"}
            },
            beChanneling:[
                {
                    ...commonChannel,
                    prop: "toggledNodePath",
                    vfe: "path.0.parentElement.dataset.path",
                    composedPathMatch: "button.expander"
                },
                {
                    ...commonChannel,
                    eventFilter: "input",
                    prop: "editedNode",
                    composedPathMatch: "input.value",
                },
                {
                    ...commonChannel,
                    prop: "newNode",
                    composedPathMatch: "button.adder",
                },
                {
                    ...commonChannel,
                    composedPathMatch: "button.delete",
                    prop: "deleteNode",
                },
                {
                    ...commonChannel,
                    composedPathMatch: "button.copy",
                    prop: "copyNodeToClipboard",
                },
                {
                    ...commonChannel,
                    composedPathMatch: "button.expand-all",
                    prop: "expandAllNode",
                },
                {
                    ...commonChannel,
                    composedPathMatch: "button.collapse-all",
                    prop: "collapseAllNode",
                }
            ]
        } as mib}
        ${{
            rowTransform: {
                div: [{}, {}, {"data-path": "path"}],
                "div.field": [{}, {}, {"style": "marginStyle"}],
                keyClasses: [{"textContent": "name"},{},{"data-type": "type", "for": "path"}],
                valueClasses: [{value: "asString", name: "path", id: "path"},{},{readonly: "hasChildren"}],
                ".delete,.copy,.expand-all": [{name: "path", id: "path"}],
                expanderParts: [true, {if: "open"}, ["-"], ["+"]],
                buttonElements: [{}, {}, {"data-children": "hasChildren"}],
                ".adder-buttons,.exp-collapse-buttons": [{}, {}, {"data-children": "hasChildren"}],
                ".adder-template,.exp-coll-template": [{".beDecorated.intersectional.host": "."}]
            },
            rowIntersectionalSettings: {
                rootClosest: ".scroller",
                options: {
                    "rootMargin": "300px",
                    "threshold": 0
                }
            }
        }}
    >
       <template slot=row>
            <div class=field data-readonly part=field itemscope ${{
                beObservant:{
                    'data-readonly': {
                        observeHostProp: 'readOnly',
                        vft: 'readOnly',
                        as: 'bool-attr'
                    }
                }
            } as mib}>
                <div class=text-editing>
                    <button class="expander" part=expander>.</button>
                    <label part=key class=key></label>
                    <input arial-label=value class=value part=value>
                </div>
                <div class=buttons>
                    <section class=adder-buttons  part=adder-buttons >
                        <template class=adder-template be-intersectional='{
                            "transform": {
                                "button": [{"name": "path"}, {}, {}]
                            }
                        }'>
                                <button part=object-adder class="object adder" value=object>+object</button>
                                <button part=string-adder class="string adder" value=string>+string</button>
                                <button part=bool-adder class="bool adder" value=bool>+bool</button>
                                <button part=number-adder class="number adder" value=number>+number</button>
                                <button part=arr-adder class="arr adder" value=arr>+array</button>
                        </template>
                    </section>
                    <section class=exp-collapse-buttons>
                        <template class=exp-coll-template be-intersectional='{
                                "transform": {
                                    "button": [{"name": "path"}, {}, {}]
                                }
                            }'>
                                <button class="action expand-all" aria-label="expand all" title="expand all">&nbsp;</button>
                                <button class="action collapse-all" aria-label="collapse all" title="collapse all">&nbsp;</button>
                        </template>
                    </section>
                    <section class=other-buttons>
                        <button class="action copy" aria-label="copy" title="copy">&nbsp;</button>
                    </section>
                    <section class=delete-button>
                        <button class="action delete" aria-label="delete" title="delete">&times;</button>
                    </section>
                </div>
            </div>
        </template>
        <template slot="style">
            <style>

                .field{
                    display: flex;
                    flex-direction: row;
                }
                .rowContainer{
                    background: #121212;
                }
                .expander{
                    width: fit-content;
                    height: fit-content;
                    padding-left: 0px;
                    padding-right: 0px;
                    padding-top: 2px;
                    width:25px;
                }
                /*
                TODO:  make this a container query
                */
                @media only screen and (max-width: 740px) {
                    .field{
                        flex-direction: column;
                    }
                }
                label.key {
                    -webkit-border-radius: 5px;
                    -moz-border-radius: 5px;
                    border-radius: 5px;
                    margin: 1px;
                    padding: 3px;
                    height: fit-content;
                    width:175px;
                }
                label.key::after{
                    content: ": ";
                }
                button.expander{
                    display:none;
                }
                button.expander[data-children]{
                    display:inline;
                    margin: 1px;
                }
                .value{
                    background-color: #ECF3C3;
                    /* width: 100%; */
                    flex-grow:5;
                }
                .text-editing{
                    display:flex;
                    flex-direction: row;
                    flex-basis: 100%;
                }
                .text-editing .key[data-type="string"]{
                    background-color: var(--str-key-bg);
                    color: var(--str-key-color);
                }
                .text-editing .key[data-type="number"]{
                    background-color: var(--num-key-bg);
                    color: var(--num-key-color);
                }
                .text-editing .key[data-type="array"]{
                    background-color: var(--array-key-bg);
                    color: var(--array-key-color);
                }
                .text-editing .key[data-type="object"]{
                    background-color: var(--obj-key-bg);
                    color: var(--obj-key-color);
                }
                .text-editing .key[data-type="boolean"]{
                    background-color: var(--bool-key-bg);
                }
                section,div.buttons{
                    display:flex;
                    flex-direction: row;
                }
                section.adder-buttons{
                    display:none;
                }
                section.adder-buttons[data-children]{
                    display:flex;
                    width:240px;
                }
                div.field[data-readonly] section.adder-buttons[data-children]{
                    display:none;
                }
                div.field[data-readonly] .delete-button{
                    display:none;
                }
                section.exp-collapse-buttons{
                    display:none;
                }
                section.exp-collapse-buttons[data-children]{
                    display:flex;
                    width:40px;
                }
                section{
                    align-items: center;
                }
                .action{
                    background-repeat:no-repeat;
                    background-position-y:center;
                    height: 22px;
                }
                .object.adder{
                    background-color: var(--obj-adder-bg);
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
                    padding: 2px;
                    margin: 1px;
                    border: none;
                }

                .expand-all{
                    background-image: url(https://cdn.jsdelivr.net/npm/xtal-editor/src/arrows-expand.svg);
                    width: 20px;
                }
                .collapse-all{
                    background-image: url(https://cdn.jsdelivr.net/npm/xtal-editor/src/arrows-collapse.svg);
                    width: 20px;
                }
                .copy{
                    background-image: url(https://cdn.jsdelivr.net/npm/xtal-editor/src/copy.svg);
                }
            </style>
        </template>
    </xtal-vlist>

</template>
<!-- Text View -->
<template ${{
    beSwitched:{
        if: {onSet: "textView", vft: "textView"}
    }
} as mib}>
    <template be-active>
        <script id=@power-elements/json-viewer/json-viewer.js></script>
    </template>
    <json-viewer class=animated ${{
        beObservant:{
            object: {vft: "value", parseValAs: "object"} 
        }
    } as mib}></json-viewer>
</template>
<be-hive></be-hive>
`;

define({
    innerHTML,
    mode,
    beDefinitiveProps,
    encodeAndWrite: console.log,
});
