import { editType } from '../types.js';
import {XtalEditor} from './xtal-editor.js';

/**
 * @element xtal-editor
 */
export class XtalEditorExample1 extends XtalEditor {
    key = 'root';
    value = '{}';
    type: editType = 'object';
    parsedObject = {};
    open = false;
}