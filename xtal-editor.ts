import {html} from 'trans-render/lib/html.js';
import {DefineArgs} from 'xtal-element/src/types';
import { PropInfoExt, XE } from 'xtal-element/src/XE.js';
import {importJSON} from 'be-loaded/importJSON.js';
import ('be-definitive/be-definitive.js');
import('be-loaded/be-loaded.js');
import('be-observant/be-observant.js');
import('be-switched/be-switched.js');
import('xtal-side-nav/xtal-side-nav.js');
import('be-transformative/be-transformative.js');
import('be-deslotted/be-deslotted.js');
import('@power-elements/json-viewer/json-viewer.js');
import('./xtal-editor-field.js');
import {tm, TemplMgmtProps, TemplMgmtActions} from 'trans-render/lib/mixins/TemplMgmtWithPEST.js';


import {XtalEditorProps, XtalEditorActions} from './types';

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
export class XtalEditorCore extends HTMLElement{}

export interface XtalEditorCore extends XtalEditorProps{}

const xe = new XE<XtalEditorProps & TemplMgmtProps, XtalEditorActions & TemplMgmtActions>();

async function register(){
    const path = 'xtal-editor/xe-config.json';
    const config = await importJSON(path, 'https://cdn.jsdelivr.net/npm/' + path);
    const def = config.default as DefineArgs<XtalEditorProps & TemplMgmtProps, XtalEditorActions & TemplMgmtActions>;
    xe.def({
        ...def,    
        mixins: [tm.TemplMgmtMixin],
        superclass: XtalEditorCore,
    });
  
}

register();

declare global {
    interface HTMLElementTagNameMap {
        "xtal-editor": XtalEditorCore,
    }
}