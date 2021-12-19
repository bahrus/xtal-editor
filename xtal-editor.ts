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

export class XtalEditor extends HTMLElement{}

export interface XtalEditor extends XtalEditorProps{}

const xe = new XE<XtalEditorProps & TemplMgmtProps, XtalEditorActions & TemplMgmtActions>();

async function register(){
    const path = 'xtal-editor/xe-config.json';
    const config = await importJSON(path, 'https://cdn.jsdelivr.net/npm/' + path);
    const def = config.default as DefineArgs<XtalEditorProps & TemplMgmtProps, XtalEditorActions & TemplMgmtActions>;
    xe.def({
        ...def,    
        mixins: [tm.TemplMgmtMixin],
        superclass: XtalEditor,
    });
  
}

register();