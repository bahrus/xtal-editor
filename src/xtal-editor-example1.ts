import {XtalEditor} from './xtal-editor.js';

/**
 * @element xtal-editor
 */
export class XtalEditorExample1 extends XtalEditor {
    key = 'root';
    value = '{}';
    type = 'object';
    parsedObject = {};
    open = false;
}