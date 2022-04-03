import {DefineArgs} from 'xtal-element/src/types';
import {html, beTransformed, define} from 'may-it-be/index.js';
import {MayItBe as mib, BeDefinitiveVirtualProps} from 'may-it-be/types';

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

const innerHTML = html`
<template be-active>
    <script data-version=0.0.51  id=be-loaded/be-loaded.js></script>
    <script data-version=0.0.101 id=be-observant/be-observant.js></script>
    <script data-version=0.0.64  id=be-switched/be-switched.js></script>
    <!-- <script data-version=0.0.43  id=be-intersectional/be-intersectional.js></script> -->
    <script data-version=0.0.70  id=xtal-side-nav/xtal-side-nav.js></script>
    <script data-version=0.0.33  id=be-transformative/be-transformative.js></script>
    <!-- <script data-version=0.0.24  id=be-deslotted/be-deslotted.js></script> -->
    <!-- <script data-version=0.0.95  id=xtal-tree/xtal-tree.js></script> -->
    <!-- <script data-version=0.0.53  id=xtal-vlist/xtal-vlist.js></script> -->
    <!-- <script data-version=0.0.5   id=be-channeling/be-channeling.js></script> -->
</template>
<style ${{
    beLoaded: {
        fallback: 'https://cdn.jsdelivr.net/npm/xtal-editor@0.0.140/theme.css',
        preloadRef: 'xtal-editor/theme.css',
        removeStyle: true,
    }
} as mib}>
header,xtal-editor-field{
    display: none;
}
</style>
<slot name=initVal be-deslotted='["value"]'></slot>
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
        <a class=download part=download download="file.json" be-observant='{
            "href": ".downloadHref"
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
    <label part=search-label class=search-label>Search:  <input part=search-input type=search ${{
            beNoticed: {
                input: {
                    prop: "stringFilter",
                }
            }
        } as mib}></label>
</header>
<!-- Tree View -->
<template ${{
    beSwitched:{
        if: '.treeView',
    }
} as mib}>
    
    <xtal-tree id-path=path ${{
        beObservant:{
            //objectGraph: ".value"
            objectGraph:{
                onSet: 'value',
                vft: 'value',
                parseValAs: 'object',
            }
        }
    } as mib}></xtal-tree>
    <xtal-vlist 
        style="height:600px;width:100%;" 
        page-size="10" 
        id="vlist"
        min-item-height='19.5'
        be-observant='{
            "list": {"observe": "xtal-tree", "vft": "viewableNodes"}
        }' 
        row-transform='{
            "div": [{}, {}, {"data-path": "path", "style": "marginStyle"}],
            ".key": [{"textContent": "name"},{},{"data-type": "type", "for": "path"}],
            ".value": [{"value": "asString", "name": "path", "id": "path"},{},{"readonly": "hasChildren"}],
            ".delete,.copy": [{"name": "path", "id": "path"}],
            "expanderParts": [true, {"if": "open"}, ["-"], ["+"]],
            "button": [{}, {}, {"data-children": "hasChildren"}],
            ".adder-buttons,.exp-collapse-buttons": [{}, {}, {"data-children": "hasChildren"}],
            ".adder-template": [{".beDecorated.intersectional.host": "."}]
        }'
        be-channeling='[
            {
                "eventFilter": "click",
                "toNearestUpMatch": "xtal-tree",
                "prop": "toggledNodePath",
                "vfe": "path.0.parentElement.dataset.path",
                "composedPathMatch": "button.expander"
            },
            {
                "eventFilter": "input",
                "composedPathMatch": "input.value",
                "toNearestUpMatch": "xtal-tree",
                "prop": "editedNode",
                "vfe": "path.0"
            },
            {
                "eventFilter": "click",
                "composedPathMatch": "button.bool",
                "toNearestUpMatch": "xtal-tree",
                "prop": "newBoolNode",
                "vfe": "path.0"
            },
            {
                "eventFilter": "click",
                "composedPathMatch": "button.number",
                "toNearestUpMatch": "xtal-tree",
                "prop": "newNumberNode",
                "vfe": "path.0"
            },
            {
                "eventFilter": "click",
                "composedPathMatch": "button.string",
                "toNearestUpMatch": "xtal-tree",
                "prop": "newStringNode",
                "vfe": "path.0"
            },
            {
                "eventFilter": "click",
                "composedPathMatch": "button.arr",
                "toNearestUpMatch": "xtal-tree",
                "prop": "newArrayNode",
                "vfe": "path.0"
            },
            {
                "eventFilter": "click",
                "composedPathMatch": "button.adder",
                "toNearestUpMatch": "xtal-tree",
                "prop": "newNode",
                "vfe": "path.0"
            },
            {
                "eventFilter": "click",
                "composedPathMatch": "button.delete",
                "toNearestUpMatch": "xtal-tree",
                "prop": "deleteNode",
                "vfe": "path.0"
            },
            {
                "eventFilter": "click",
                "composedPathMatch": "button.copy",
                "toNearestUpMatch": "xtal-tree",
                "prop": "copyNodeToClipboard",
                "vfe": "path.0"
            }
        ]'
        row-intersectional-settings='{
            "rootClosest": ".scroller",
            "options": {
                "rootMargin": "300px",
                "threshold": 0
            }
        }'
    >
       <template slot=row>
            <div class=field part=field itemscope >
                <div class=text-editing>
                    <button class="expander" part=expander>.</button>
                    <label part=key class=key></label>
                    <input arial-label=value class=value part=value>
                </div>
                <section class=adder-buttons part=adder-buttons>
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
                    <template be-intersectional='{
                            "transform": {
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
        </template>
        <template slot="style">
            <style>
                :host{
                    --obj-key-bg: #FFD4B8;
                    --obj-key-color: #000000;
                    --str-key-bg: #B8FFBB;
                    --str-key-color: #000000;
                    --num-key-bg: #BCD3DC;
                    --num-key-color: #000000;
                    --bool-key-bg: #B1C639;
                    --array-key-bg: #AAC7E4;
                    --array-key-color: #000000;
                    --obj-even-level-editor-bg: #F1E090;
                    --obj-odd-level-editor-bg: #FFEFCC;
                    --array-even-level-editor-bg: #A9DBDD;
                    --array-odd-level-editor-bg: #D9DBDD;
                    --obj-adder-bg: #C15000;
                    --string-adder-bg: #007408;
                    --bool-adder-bg: #516600;
                    --num-adder-bg:#497B8D;
                    --arr-adder-bg: #2d5b89;
                    --selector-bg: #CD138F;
                }
                button.expander{
                    display:none;
                }
                button.expander[data-children]{
                    display:inline;
                }
                .value{
                    background-color: #ECF3C3;
                    width: 100%;
                    flex-grow:5;
                }
                .text-editing{
                    display:flex;
                    flex-direction: row;
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
                section.adder-buttons{
                    display:none;
                }
                section.adder-buttons[data-children]{
                    display:block;
                }
                section.exp-collapse-buttons{
                    display:none;
                }
                section.exp-collapse-buttons[data-children]{
                    display:block;
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
                    padding: 2;
                    border: none;
                }
                .field{
                    display: flex;
                    flex-direction: row;
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