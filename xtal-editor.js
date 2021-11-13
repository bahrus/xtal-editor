import { html } from 'trans-render/lib/html.js';
import('be-hive/be-hive.js');
import('be-definitive/be-definitive.js');
import('be-observant/be-observant.js');
import('be-switched/be-switched.js');
import('xtal-side-nav/xtal-side-nav.js');
import('be-transformative/be-transformative.js');
import('be-deslotted/be-deslotted.js');
import('@power-elements/json-viewer/json-viewer.js');
import('./xtal-editor-field.js');
if (document.querySelector('be-hive') === null) {
    document.body.appendChild(document.createElement('be-hive'));
}
const mainTemplate = html `
<style>

:host{
    display:block;
}
:host[hidden]{
    display:none;
}

slot{
    display: none;
}


.editor, header{
    background-color: black;
    color: white;
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

:host{
    --obj-key-bg: #FFD4B8;
    --obj-key-color: #000000;
    --str-key-bg: #B8FFBB;
    --str-key-color: #000000;
    --num-key-bg: #BCD3DC;
    --num-key-color: #000000;
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
.editor[data-type="object"]>.field>.text-editing>.key{
    background-color: var(--obj-key-bg);
    color: var(--obj-key-color);
}
.editor[data-type="number"]>.field>.text-editing>.key{
    background-color: var(--num-key-bg);
    color: var(--num-key-color);
}
.editor[data-type="string"]>.field>.text-editing.key{
    background-color: var(--str-key-bg);
    color: var(--str-key-color);
}
.editor[data-type="array"]>.field>.text-editing>.key{
    background-color: var(--array-key-bg);
    /* color: color-contrast(var(--array-key-bg) vs white, black); */
    color: var(--array-key-color);
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
.selector{
    color: white;
    text-shadow:1px 1px 1px black;
    border-radius: 5px;
    padding: 2;
    border: none;
    margin-left: 12px;
    background-color: var(--selector-bg);   
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

.header{
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

header h1{
    display: inline-block;
    margin-top: 0px;
    margin-bottom: 0px;
    font-size: small;
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

[data-type="object"] button.nonPrimitive{
    display: inline;
}

[data-type="array"] button.nonPrimitive{
    display: inline;
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
[data-type="string"] .key{
    background-color: var(--str-key-bg);
    color: var(--str-key-color);
}
[data-type="boolean"] .key{
    background-color: #B1C639;
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
<slot name=initVal be-deslotted='["value"]'></slot>
<header part=header>
    <xtal-side-nav>
        <button class="selector text-view-selector" part=text-view-selector be-transformative='{
            "click": {
                "transform":{
                    ":host": [{"treeView": false, "textView": true}],
                    ".tree-view-selector":[{},{},{".inactive": false}],
                    ".text-view-selector": [{}, {}, {".inactive": true}]                            
                }
            }
        }'>Text View</button>
        <button class="selector tree-view-selector inactive" part=tree-view-selector be-transformative='{
            "click": {
                "transform":{
                    ":host": [{"treeView": true, "textView": false}],
                    ".tree-view-selector":[{},{},{".inactive": true}],
                    ".text-view-selector": [{},{}, {".inactive": false}]
                }
            }
        }'>Tree View</button>
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
    <h1 part=title be-observant='{
        "textContent":{
            "onSet": "readOnly",
            "vft": "readOnly",
            "trueVal": "JSON Viewer",
            "falseVal": "JSON Editor"
        }
    }'></h1>
</header>
<!-- Tree View -->
<template be-switched='{
    "if": {"onSet": "treeView", "vft": "treeView"}
}'>
    <xtal-editor-field data-is-hostish be-observant='{
        "value": ".value",
        "key": {"ocoho": "xtal-editor", "onSet": "key", "vft": ".key"},
        "readOnly": ".readOnly"
    }'
    be-noticed='{
        "download-href-changed": {"prop": "downloadHref", "vft": "downloadHref", "doInit": true},
        "value:onSet": {"prop": "editedValue", "vft": "value"}
    }'
    ></xtal-editor-field>
</template>
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
const beDefinitiveProps = {
    config: {
        tagName: 'xtal-editor',
        propDefaults: {
            readOnly: false,
            value: '',
            key: '',
            treeView: true,
            textView: false,
            downloadHref: '',
            editedValue: '',
        },
        propInfo: {
            treeView: {
                notify: {
                    dispatch: true
                }
            },
            textView: {
                notify: {
                    dispatch: true
                }
            },
        }
    }
};
mainTemplate.setAttribute('be-definitive', JSON.stringify(beDefinitiveProps));
document.body.appendChild(mainTemplate);
