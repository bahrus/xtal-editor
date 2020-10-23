import { XtalEditor } from './xtal-editor.js';
/**
 * @element xtal-editor
 */
export class XtalEditorExample1 extends XtalEditor {
    constructor() {
        super(...arguments);
        this.key = 'root';
        this.value = '{}';
        this.type = 'object';
        this.parsedObject = {};
        this.open = false;
    }
}
