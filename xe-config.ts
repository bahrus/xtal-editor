import {DefineArgs} from 'xtal-element/src/types';
import {html} from './node_modules/trans-render/lib/html.mjs';
import {BeLoadedVirtualProps as bl} from 'be-loaded/types';
import {IObserveMap as iom} from 'be-observant/types';
import {INotifyMap as inm} from 'be-noticed/types';
import {XtalEditorFieldProps as xfp} from './types';
import { doInitTransform } from './node_modules/trans-render/lib/mixins/doInitTransform.mjs';
import {BeSwitchedVirtualProps as bs} from 'be-switched/types';

const fallback = "https://cdn.jsdelivr.net/npm/xtal-editor/theme.css";

const mainTemplate = html`
<style be-loaded='${{
    fallback,
    preloadRef: "xtal-editor/theme.css",
    removeStyle: true,
} as bl}'>
header,xtal-editor-field{
    display: none;
}
</style>
<slot name=initVal be-deslotted='["value"]'></slot>
<header part=header>
    <xtal-side-nav>
        <button class="selector text-view-selector" part=text-view-selector be-transformative='${{
            click: {
                transform:{
                    ":host": [{treeView: false, textView: true}],
                    treeViewSelectorClasses:[{},{},{".inactive": false}],
                    textViewSelectorClasses: [{}, {}, {".inactive": true}]                            
                }
            }
        }}'>Text View</button>
        <button class="selector tree-view-selector inactive" part=tree-view-selector be-transformative='${{
            click: {
                transform:{
                    ":host": [{treeView: true, textView: false}],
                    treeViewSelectorClasses:[{},{},{".inactive": true}],
                    textViewSelectorClasses: [{},{}, {".inactive": false}]
                }
            }
        }}'>Tree View</button>
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
    <h1 part=title be-observant='${{
        textContent:{
            onSet: "readOnly",
            vft: "readOnly",
            trueVal: "JSON Viewer",
            falseVal: "JSON Editor",
        }
    } as iom}'></h1>
</header>
<!-- Tree View -->
<template be-switched='${{
    if: '.treeView'
}}'>
    <xtal-editor-field itemscope be-observant='${{
        value: ".value",
        key: {ocoho: "xtal-editor", onSet: "key", vft: ".key"},
        readOnly: ".readOnly"
    } as iom<xfp>}'
    be-noticed='${{
        "download-href-changed": {prop: "downloadHref", vft: "downloadHref", doInit: true},
        "value:onSet": {prop: "editedValue", vft: "value"}
    } as inm}'>
    </xtal-editor-field>
</template>
</template>
<!-- Text View -->
<template be-switched='${{
    if: {onSet: "textView", vft: "textView"}
} as bs}'>
    <json-viewer class=animated be-observant='${{
        object: {vft: "value", parseValAs: "object"} 
    } as iom<{"object": any}>}'></json-viewer>
</template>
<be-hive></be-hive>
<template be-active>
    <script id=be-observant/be-observant.js></script>
    <script id=be-switched/be-switched.js></script>
    <script id=xtal-side-nav/xtal-side-nav.js></script>
    <script id=be-transformative/be-transformative.js></script>
    <script id=be-deslotted/be-deslotted.js></script>
    <script id=@power-elements/json-viewer/json-viewer.js></script>
</template>
`;

const da: DefineArgs = {
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
            mainTemplate,
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
            ...doInitTransform,
        }
    }
}

console.log(JSON.stringify(da));