import('be-definitive/be-definitive.js');
import('be-active/be-active.js');

if(!document.body){
    document.addEventListener('DOMContentLoaded', () => {
        document.body.insertAdjacentHTML('beforeend', `<template be-definitive='{"config":{"tagName":"xtal-editor","propDefaults":{"readOnly":false,"key":"","treeView":true,"textView":false,"downloadHref":"","editedValue":{},"stringFilter":"","transform":{"header":[{},{},{"data-read-only":"readOnly"}]}},"propInfo":{"editedValue":{"notify":{"dispatch":true}},"inputObj":{"type":"Object"},"value":{"type":"String"}},"actions":{"cloneTemplate":{"ifAllOf":["mainTemplate"],"ifKeyIn":["noshadow","waitToInit"]},"doTemplMount":{"ifAllOf":["clonedTemplate","transform"],"ifKeyIn":["waitToInit"],"async":true}}}}'>
<template be-active>
    
    <script data-version=0.0.83  id=be-loaded/be-loaded.js></script>
    <script data-version=0.0.36  id=be-deslotted/be-deslotted.js></script>
    
</template>
<style be-loaded='{"path":"xtal-editor/shell.css","version":"0.0.193","removeStyle":true}'>
main{
    display: none;
}
</style>
<slot name=init-val be-deslotted='["value"]'></slot>
<main part=main>
    <template be-active>
        <script data-version=0.0.165 id=xtal-tree/xtal-tree.js></script>
        <script data-version=0.0.92  id=xtal-side-nav/xtal-side-nav.js></script>
        <script data-version=0.0.134 id=be-observant/be-observant.js></script>
        <script data-version=0.0.68  id=be-noticed/be-noticed.js></script>
        <script data-version=0.0.47  id=be-transformative/be-transformative.js></script>
    </template>
    <xtal-tree id-path=path be-observant='[{"objectGraph":{"onSet":"value","vft":"value","parseValAs":"object"}},{"objectGraph":{"onSet":"inputObj","vft":"inputObj"}}]'be-noticed='{"updateCount:onSet":{"vft":"objectGraph","prop":"editedValue"}}'></xtal-tree>
    </div>
    <header part=header>
        <xtal-side-nav part=side-nav>
            <aside part=aside>
                <template be-lazy>
                <button class="selector text-view-selector" part=text-view-selector be-transformative='{"click":{"transform":{":host":[{"treeView":false,"textView":true}],"treeViewSelectorClasses":[{},{},{".inactive":false}],"textViewSelectorClasses":[{},{},{".inactive":true}]}}}'>Text View</button>
                <button class="selector tree-view-selector inactive" part=tree-view-selector be-transformative='{"click":{"transform":{":host":[{"treeView":true,"textView":false}],"treeViewSelectorClasses":[{},{},{".inactive":true}],"textViewSelectorClasses":[{},{},{".inactive":false}]}}}'>Tree View</button>
                <!-- TODO:  set download property dynamically -->
                <a class=download part=download download="file.json" be-observant='{"href":{"observe":"xtal-tree","onSet":"downloadHref","vft":"downloadHref"}}'>
                    <svg viewBox="0 0 24 24" style="width:16.25px;height:16.25px">
                        <g color="rgb(29, 155, 240)">
                            <path stroke="currentcolor" d="M11.96 14.945c-.067 0-.136-.01-.203-.027-1.13-.318-2.097-.986-2.795-1.932-.832-1.125-1.176-2.508-.968-3.893s.942-2.605 2.068-3.438l3.53-2.608c2.322-1.716 5.61-1.224 7.33 1.1.83 1.127 1.175 2.51.967 3.895s-.943 2.605-2.07 3.438l-1.48 1.094c-.333.246-.804.175-1.05-.158-.246-.334-.176-.804.158-1.05l1.48-1.095c.803-.592 1.327-1.463 1.476-2.45.148-.988-.098-1.975-.69-2.778-1.225-1.656-3.572-2.01-5.23-.784l-3.53 2.608c-.802.593-1.326 1.464-1.475 2.45-.15.99.097 1.975.69 2.778.498.675 1.187 1.15 1.992 1.377.4.114.633.528.52.928-.092.33-.394.547-.722.547z"></path>
                            <path stroke="currentcolor" d="M7.27 22.054c-1.61 0-3.197-.735-4.225-2.125-.832-1.127-1.176-2.51-.968-3.894s.943-2.605 2.07-3.438l1.478-1.094c.334-.245.805-.175 1.05.158s.177.804-.157 1.05l-1.48 1.095c-.803.593-1.326 1.464-1.475 2.45-.148.99.097 1.975.69 2.778 1.225 1.657 3.57 2.01 5.23.785l3.528-2.608c1.658-1.225 2.01-3.57.785-5.23-.498-.674-1.187-1.15-1.992-1.376-.4-.113-.633-.527-.52-.927.112-.4.528-.63.926-.522 1.13.318 2.096.986 2.794 1.932 1.717 2.324 1.224 5.612-1.1 7.33l-3.53 2.608c-.933.693-2.023 1.026-3.105 1.026z"></path>
                        </g>
                    </svg>
                    Download
                </a>
                <button part=object-adder class="object adder" value=object
                name="" be-noticed='{"click":{"toNearestUpMatch":"xtal-tree","prop":"newNode","vft":"."}}'>+object</button>
                <button part=string-adder class="string adder" value=string be-noticed='{"click":{"toNearestUpMatch":"xtal-tree","prop":"newNode","vft":"."}}'>+string</button>
                <button part=bool-adder class="bool adder" value=bool be-noticed='{"click":{"toNearestUpMatch":"xtal-tree","prop":"newNode","vft":"."}}'>+bool</button>
                <button part=number-adder class="number adder" value=number be-noticed='{"click":{"toNearestUpMatch":"xtal-tree","prop":"newNode","vft":"."}}'>+number</button>
                <button part=arr-adder class="arr adder" value=arr be-noticed='{"click":{"toNearestUpMatch":"xtal-tree","prop":"newNode","vft":"."}}'>+array</button>
                </template>
            </aside>
            

        </xtal-side-nav>
        <h1 part=title >
            <span be-observant='{"textContent":{"onSet":"readOnly","vft":"readOnly","trueVal":"JSON Viewer","falseVal":"JSON Editor"}}'>
            </span>
            

        </h1>
        <label part=search-label class=search-label>Search:&nbsp;&nbsp;<input part=search-input type=search be-noticed='{"input":{"toNearestUpMatch":"xtal-tree","prop":"searchString","vft":"value"}}'>
        </label>
        <div class=exp-coll>
            <button part=expand-all class="action expand-all" aria-label="expand all" title="expand all" be-noticed='{"click":{"toNearestUpMatch":"xtal-tree","prop":"expandAll","val":true}}'>&nbsp;</button>
            <button part=collapse-all class="action collapse-all" aria-label="collapse all" title="collapse all" be-noticed='{"click":{"toNearestUpMatch":"xtal-tree","prop":"collapseAll","val":true}}'>&nbsp;</button>
            <button part=copy class="action copy" aria-label="copy" title="copy" name="" be-noticed='{"click":{"toNearestUpMatch":"xtal-tree","prop":"copyNodeToClipboard","vft":"."}}'>&nbsp;</button>
        </div>
    </header>
    <!-- Tree View -->
    <template be-active>
        <script data-version=0.0.78  id=be-switched/be-switched.js></script>
    </template>
    <template be-switched='{"if":".treeView"}'>
        <template be-active>
            <script data-version=0.0.79  id=xtal-vlist/xtal-vlist.js></script>
            <script data-version=0.0.19  id=be-lazy/be-lazy.js></script>
            <script data-version=0.0.6   id=be-adopted/be-adopted.js></script>
            <script data-version=0.0.24  id=be-channeling/be-channeling.js></script>
            <script data-version=0.0.3   id=be-composed/be-composed.js></script>
            <script data-version=0.0.1   id=be-open-and-shut/be-open-and-shut.js></script>
        </template>
        <xtal-vlist
            part=xtal-vlist
            class=animated 
            style="width:100%;" 
            timestamp-key="timestamp" 
            id="vlist"
            min-item-height=23
            page-size=10
            be-observant='{"list":{"observe":"xtal-tree","vft":"viewableNodes"}}'be-channeling='[{"eventFilter":"click","toNearestUpMatch":"xtal-tree","vfe":"path.0.parentElement.dataset.path","prop":"toggledNodePath","composedPathMatch":"button.expander"},{"eventFilter":"c2b4531e-993d-4109-84fe-b9af0fb45927","toNearestUpMatch":"xtal-tree","vfe":"path.0","prop":"editedNode","composedPathMatch":"input.value"},{"eventFilter":"click","toNearestUpMatch":"xtal-tree","vfe":"path.0","prop":"newNode","composedPathMatch":"button.adder"},{"eventFilter":"click","toNearestUpMatch":"xtal-tree","vfe":"path.0","composedPathMatch":"button.delete","prop":"deleteNode"},{"eventFilter":"click","toNearestUpMatch":"xtal-tree","vfe":"path.0","composedPathMatch":"button.copy","prop":"copyNodeToClipboard"},{"eventFilter":"click","toNearestUpMatch":"xtal-tree","vfe":"path.0","composedPathMatch":"button.expand-all","prop":"expandAllNode"},{"eventFilter":"click","toNearestUpMatch":"xtal-tree","vfe":"path.0","composedPathMatch":"button.collapse-all","prop":"collapseAllNode"}]'
            row-transform='{"divEs":[{},{},{"data-path":"path"}],"fieldCs":[{},{},{"style":"marginStyle"}],"keyCs":[{"textContent":"name","title":"name"},{},{"data-type":"type","for":"path"}],"valueCs":[{"name":"path","id":"path"},{},{"data-value-type":"type"}],"^":[true,{"lhs":"type","op":"===","rhsVal":"boolean"},[{"readOnly":false,"type":["checkbox"],"checked":"value"}]],"^^":[true,{"lhs":"type","op":"===","rhsVal":"string"},[{"readOnly":false,"type":["text"],"value":"asString"}]],"^3":[true,{"lhs":"type","op":"===","rhsVal":"number"},[{"readOnly":false,"type":["number"],"value":"value"}]],"^4":[true,{"lhs":"type","op":"===","rhsVal":"object"},[{"readOnly":true,"type":["text"],"value":"asString","class":"object-adder"}]],"^5":[true,{"lhs":"type","op":"===","rhsVal":"array"},[{"readOnly":true,"type":["text"],"value":"asString","class":"object-adder"}]],".delete,.copy,.expand-all":[{"name":"path","id":"path"}],"expanderCs":[true,{"if":"open"},["-"],["+"]],"buttonEs":[{"name":"path"},{},{"data-children":"hasChildren"}],"aside":[{},{},{"data-children":"hasChildren","data-can-have-children":"canHaveChildren"}],"template[be-lazy],template[is-lazy]":[{".beDecorated.lazy.ctx":":"}]}'row-intersectional-settings='{"rootClosest":".scroller","options":{"rootMargin":"600px","threshold":0}}'
        >
        <style be-adopted="xtal-editor/list.css" slot=header></style>
        <template slot=row>
                <div class=field data-readonly debug part=field itemscope be-observant='{"data-readonly":{"observeHostProp":"readOnly","vft":"readOnly","as":"bool-attr"}}'>
                    <div class=text-editing>
                        <button class="expander" part=expander>.</button>
                        <label part=key class=key></label>
                        <input arial-label=value class=value part=value be-composed='{
                            "dispatch":{
                                "change": {
                                    "as": "c2b4531e-993d-4109-84fe-b9af0fb45927",
                                    "bubbles": true,
                                    "composed": true
                                }
                            }
                        }'>
                        <xtal-side-nav mode=rtl be-open-and-shut>
                            <aside>
                                <template be-lazy class=buttons-template>
                                    <div class=buttons>
                                        <section class=adder-buttons  part=adder-buttons >
                                            <button part=object-adder class="object adder" value=object>+object</button>
                                            <button part=string-adder class="string adder" value=string>+string</button>
                                            <button part=bool-adder class="bool adder" value=bool>+bool</button>
                                            <button part=number-adder class="number adder" value=number>+number</button>
                                            <button part=arr-adder class="arr adder" value=arr>+array</button>
                                        </section>
                                        <section class=exp-collapse-buttons>
                                            <button class="action expand-all" aria-label="expand all" title="expand all">Expand All</button>
                                            <button class="action collapse-all" aria-label="collapse all" title="collapse all">Collapse All</button>
                                        </section>
                                        <section class=other-buttons>
                                            <button class="action copy" aria-label="copy" title="copy">Copy to clipboard</button>
                                        </section>
                                        <section class=delete-button>
                                            <button class="action delete" aria-label="delete" title="delete">&times; Delete node</button>
                                        </section>
                                    </div>                                
                                </template>
                            </aside>
                        </xtal-side-nav>
                    </div>


                </div>
            </template>
        </xtal-vlist>

    </template>
    <!-- Text View -->
    <template be-switched='{"if":{"onSet":"textView","vft":"textView"}}'>
        <template be-active>
            <script id=@power-elements/json-viewer/json-viewer.js></script>
        </template>
        <json-viewer class=animated be-observant='{"object":{"vft":"value","parseValAs":"object"}}'></json-viewer>
    </template>
</main>
<be-hive></be-hive>
</template>`);
    });
}else{
    document.body.insertAdjacentHTML('beforeend', `<template be-definitive='{"config":{"tagName":"xtal-editor","propDefaults":{"readOnly":false,"key":"","treeView":true,"textView":false,"downloadHref":"","editedValue":{},"stringFilter":"","transform":{"header":[{},{},{"data-read-only":"readOnly"}]}},"propInfo":{"editedValue":{"notify":{"dispatch":true}},"inputObj":{"type":"Object"},"value":{"type":"String"}},"actions":{"cloneTemplate":{"ifAllOf":["mainTemplate"],"ifKeyIn":["noshadow","waitToInit"]},"doTemplMount":{"ifAllOf":["clonedTemplate","transform"],"ifKeyIn":["waitToInit"],"async":true}}}}'>
<template be-active>
    
    <script data-version=0.0.83  id=be-loaded/be-loaded.js></script>
    <script data-version=0.0.36  id=be-deslotted/be-deslotted.js></script>
    
</template>
<style be-loaded='{"path":"xtal-editor/shell.css","version":"0.0.193","removeStyle":true}'>
main{
    display: none;
}
</style>
<slot name=init-val be-deslotted='["value"]'></slot>
<main part=main>
    <template be-active>
        <script data-version=0.0.165 id=xtal-tree/xtal-tree.js></script>
        <script data-version=0.0.92  id=xtal-side-nav/xtal-side-nav.js></script>
        <script data-version=0.0.134 id=be-observant/be-observant.js></script>
        <script data-version=0.0.68  id=be-noticed/be-noticed.js></script>
        <script data-version=0.0.47  id=be-transformative/be-transformative.js></script>
    </template>
    <xtal-tree id-path=path be-observant='[{"objectGraph":{"onSet":"value","vft":"value","parseValAs":"object"}},{"objectGraph":{"onSet":"inputObj","vft":"inputObj"}}]'be-noticed='{"updateCount:onSet":{"vft":"objectGraph","prop":"editedValue"}}'></xtal-tree>
    </div>
    <header part=header>
        <xtal-side-nav part=side-nav>
            <aside part=aside>
                <template be-lazy>
                <button class="selector text-view-selector" part=text-view-selector be-transformative='{"click":{"transform":{":host":[{"treeView":false,"textView":true}],"treeViewSelectorClasses":[{},{},{".inactive":false}],"textViewSelectorClasses":[{},{},{".inactive":true}]}}}'>Text View</button>
                <button class="selector tree-view-selector inactive" part=tree-view-selector be-transformative='{"click":{"transform":{":host":[{"treeView":true,"textView":false}],"treeViewSelectorClasses":[{},{},{".inactive":true}],"textViewSelectorClasses":[{},{},{".inactive":false}]}}}'>Tree View</button>
                <!-- TODO:  set download property dynamically -->
                <a class=download part=download download="file.json" be-observant='{"href":{"observe":"xtal-tree","onSet":"downloadHref","vft":"downloadHref"}}'>
                    <svg viewBox="0 0 24 24" style="width:16.25px;height:16.25px">
                        <g color="rgb(29, 155, 240)">
                            <path stroke="currentcolor" d="M11.96 14.945c-.067 0-.136-.01-.203-.027-1.13-.318-2.097-.986-2.795-1.932-.832-1.125-1.176-2.508-.968-3.893s.942-2.605 2.068-3.438l3.53-2.608c2.322-1.716 5.61-1.224 7.33 1.1.83 1.127 1.175 2.51.967 3.895s-.943 2.605-2.07 3.438l-1.48 1.094c-.333.246-.804.175-1.05-.158-.246-.334-.176-.804.158-1.05l1.48-1.095c.803-.592 1.327-1.463 1.476-2.45.148-.988-.098-1.975-.69-2.778-1.225-1.656-3.572-2.01-5.23-.784l-3.53 2.608c-.802.593-1.326 1.464-1.475 2.45-.15.99.097 1.975.69 2.778.498.675 1.187 1.15 1.992 1.377.4.114.633.528.52.928-.092.33-.394.547-.722.547z"></path>
                            <path stroke="currentcolor" d="M7.27 22.054c-1.61 0-3.197-.735-4.225-2.125-.832-1.127-1.176-2.51-.968-3.894s.943-2.605 2.07-3.438l1.478-1.094c.334-.245.805-.175 1.05.158s.177.804-.157 1.05l-1.48 1.095c-.803.593-1.326 1.464-1.475 2.45-.148.99.097 1.975.69 2.778 1.225 1.657 3.57 2.01 5.23.785l3.528-2.608c1.658-1.225 2.01-3.57.785-5.23-.498-.674-1.187-1.15-1.992-1.376-.4-.113-.633-.527-.52-.927.112-.4.528-.63.926-.522 1.13.318 2.096.986 2.794 1.932 1.717 2.324 1.224 5.612-1.1 7.33l-3.53 2.608c-.933.693-2.023 1.026-3.105 1.026z"></path>
                        </g>
                    </svg>
                    Download
                </a>
                <button part=object-adder class="object adder" value=object
                name="" be-noticed='{"click":{"toNearestUpMatch":"xtal-tree","prop":"newNode","vft":"."}}'>+object</button>
                <button part=string-adder class="string adder" value=string be-noticed='{"click":{"toNearestUpMatch":"xtal-tree","prop":"newNode","vft":"."}}'>+string</button>
                <button part=bool-adder class="bool adder" value=bool be-noticed='{"click":{"toNearestUpMatch":"xtal-tree","prop":"newNode","vft":"."}}'>+bool</button>
                <button part=number-adder class="number adder" value=number be-noticed='{"click":{"toNearestUpMatch":"xtal-tree","prop":"newNode","vft":"."}}'>+number</button>
                <button part=arr-adder class="arr adder" value=arr be-noticed='{"click":{"toNearestUpMatch":"xtal-tree","prop":"newNode","vft":"."}}'>+array</button>
                </template>
            </aside>
            

        </xtal-side-nav>
        <h1 part=title >
            <span be-observant='{"textContent":{"onSet":"readOnly","vft":"readOnly","trueVal":"JSON Viewer","falseVal":"JSON Editor"}}'>
            </span>
            

        </h1>
        <label part=search-label class=search-label>Search:&nbsp;&nbsp;<input part=search-input type=search be-noticed='{"input":{"toNearestUpMatch":"xtal-tree","prop":"searchString","vft":"value"}}'>
        </label>
        <div class=exp-coll>
            <button part=expand-all class="action expand-all" aria-label="expand all" title="expand all" be-noticed='{"click":{"toNearestUpMatch":"xtal-tree","prop":"expandAll","val":true}}'>&nbsp;</button>
            <button part=collapse-all class="action collapse-all" aria-label="collapse all" title="collapse all" be-noticed='{"click":{"toNearestUpMatch":"xtal-tree","prop":"collapseAll","val":true}}'>&nbsp;</button>
            <button part=copy class="action copy" aria-label="copy" title="copy" name="" be-noticed='{"click":{"toNearestUpMatch":"xtal-tree","prop":"copyNodeToClipboard","vft":"."}}'>&nbsp;</button>
        </div>
    </header>
    <!-- Tree View -->
    <template be-active>
        <script data-version=0.0.78  id=be-switched/be-switched.js></script>
    </template>
    <template be-switched='{"if":".treeView"}'>
        <template be-active>
            <script data-version=0.0.79  id=xtal-vlist/xtal-vlist.js></script>
            <script data-version=0.0.19  id=be-lazy/be-lazy.js></script>
            <script data-version=0.0.6   id=be-adopted/be-adopted.js></script>
            <script data-version=0.0.24  id=be-channeling/be-channeling.js></script>
            <script data-version=0.0.3   id=be-composed/be-composed.js></script>
            <script data-version=0.0.1   id=be-open-and-shut/be-open-and-shut.js></script>
        </template>
        <xtal-vlist
            part=xtal-vlist
            class=animated 
            style="width:100%;" 
            timestamp-key="timestamp" 
            id="vlist"
            min-item-height=23
            page-size=10
            be-observant='{"list":{"observe":"xtal-tree","vft":"viewableNodes"}}'be-channeling='[{"eventFilter":"click","toNearestUpMatch":"xtal-tree","vfe":"path.0.parentElement.dataset.path","prop":"toggledNodePath","composedPathMatch":"button.expander"},{"eventFilter":"c2b4531e-993d-4109-84fe-b9af0fb45927","toNearestUpMatch":"xtal-tree","vfe":"path.0","prop":"editedNode","composedPathMatch":"input.value"},{"eventFilter":"click","toNearestUpMatch":"xtal-tree","vfe":"path.0","prop":"newNode","composedPathMatch":"button.adder"},{"eventFilter":"click","toNearestUpMatch":"xtal-tree","vfe":"path.0","composedPathMatch":"button.delete","prop":"deleteNode"},{"eventFilter":"click","toNearestUpMatch":"xtal-tree","vfe":"path.0","composedPathMatch":"button.copy","prop":"copyNodeToClipboard"},{"eventFilter":"click","toNearestUpMatch":"xtal-tree","vfe":"path.0","composedPathMatch":"button.expand-all","prop":"expandAllNode"},{"eventFilter":"click","toNearestUpMatch":"xtal-tree","vfe":"path.0","composedPathMatch":"button.collapse-all","prop":"collapseAllNode"}]'
            row-transform='{"divEs":[{},{},{"data-path":"path"}],"fieldCs":[{},{},{"style":"marginStyle"}],"keyCs":[{"textContent":"name","title":"name"},{},{"data-type":"type","for":"path"}],"valueCs":[{"name":"path","id":"path"},{},{"data-value-type":"type"}],"^":[true,{"lhs":"type","op":"===","rhsVal":"boolean"},[{"readOnly":false,"type":["checkbox"],"checked":"value"}]],"^^":[true,{"lhs":"type","op":"===","rhsVal":"string"},[{"readOnly":false,"type":["text"],"value":"asString"}]],"^3":[true,{"lhs":"type","op":"===","rhsVal":"number"},[{"readOnly":false,"type":["number"],"value":"value"}]],"^4":[true,{"lhs":"type","op":"===","rhsVal":"object"},[{"readOnly":true,"type":["text"],"value":"asString","class":"object-adder"}]],"^5":[true,{"lhs":"type","op":"===","rhsVal":"array"},[{"readOnly":true,"type":["text"],"value":"asString","class":"object-adder"}]],".delete,.copy,.expand-all":[{"name":"path","id":"path"}],"expanderCs":[true,{"if":"open"},["-"],["+"]],"buttonEs":[{"name":"path"},{},{"data-children":"hasChildren"}],"aside":[{},{},{"data-children":"hasChildren","data-can-have-children":"canHaveChildren"}],"template[be-lazy],template[is-lazy]":[{".beDecorated.lazy.ctx":":"}]}'row-intersectional-settings='{"rootClosest":".scroller","options":{"rootMargin":"600px","threshold":0}}'
        >
        <style be-adopted="xtal-editor/list.css" slot=header></style>
        <template slot=row>
                <div class=field data-readonly debug part=field itemscope be-observant='{"data-readonly":{"observeHostProp":"readOnly","vft":"readOnly","as":"bool-attr"}}'>
                    <div class=text-editing>
                        <button class="expander" part=expander>.</button>
                        <label part=key class=key></label>
                        <input arial-label=value class=value part=value be-composed='{
                            "dispatch":{
                                "change": {
                                    "as": "c2b4531e-993d-4109-84fe-b9af0fb45927",
                                    "bubbles": true,
                                    "composed": true
                                }
                            }
                        }'>
                        <xtal-side-nav mode=rtl be-open-and-shut>
                            <aside>
                                <template be-lazy class=buttons-template>
                                    <div class=buttons>
                                        <section class=adder-buttons  part=adder-buttons >
                                            <button part=object-adder class="object adder" value=object>+object</button>
                                            <button part=string-adder class="string adder" value=string>+string</button>
                                            <button part=bool-adder class="bool adder" value=bool>+bool</button>
                                            <button part=number-adder class="number adder" value=number>+number</button>
                                            <button part=arr-adder class="arr adder" value=arr>+array</button>
                                        </section>
                                        <section class=exp-collapse-buttons>
                                            <button class="action expand-all" aria-label="expand all" title="expand all">Expand All</button>
                                            <button class="action collapse-all" aria-label="collapse all" title="collapse all">Collapse All</button>
                                        </section>
                                        <section class=other-buttons>
                                            <button class="action copy" aria-label="copy" title="copy">Copy to clipboard</button>
                                        </section>
                                        <section class=delete-button>
                                            <button class="action delete" aria-label="delete" title="delete">&times; Delete node</button>
                                        </section>
                                    </div>                                
                                </template>
                            </aside>
                        </xtal-side-nav>
                    </div>


                </div>
            </template>
        </xtal-vlist>

    </template>
    <!-- Text View -->
    <template be-switched='{"if":{"onSet":"textView","vft":"textView"}}'>
        <template be-active>
            <script id=@power-elements/json-viewer/json-viewer.js></script>
        </template>
        <json-viewer class=animated be-observant='{"object":{"vft":"value","parseValAs":"object"}}'></json-viewer>
    </template>
</main>
<be-hive></be-hive>
</template>`);
}
