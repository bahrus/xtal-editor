import { IBid } from 'ib-id/i-bid.js';
import { define } from 'xtal-element/lib/define.js';
/**
 * @element ib-id-xtal-editor
 */
export class IbIdXtalEditor extends IBid {
    connectedCallback() {
        this.map = (x, idx) => {
            let key = undefined;
            let value = undefined;
            switch (typeof x) {
                case 'object':
                    {
                        key = x.key;
                        value = x.value;
                    }
                    break;
                default: {
                    value = x;
                    key = `[${idx.toString()}]`;
                }
            }
            const hasParent = true;
            return { key, value, hasParent };
        };
        super.connectedCallback();
    }
    configureNewChild(newChild) {
        newChild._rootEditor = this._rootEditor;
        newChild.addEventListener('internal-update-count-changed', (e) => {
            this.host.upwardDataFlowInProgress = true;
        });
    }
}
IbIdXtalEditor.is = 'ib-id-xtal-editor';
define(IbIdXtalEditor);
