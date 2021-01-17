import { IbId } from 'ib-id/ib-id.js';
import { define } from 'xtal-element/lib/define.js';
export class IbIdXtalEditor extends IbId {
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
                    key = idx.toString();
                }
            }
            const hasParent = true;
            return { key, value, hasParent };
        };
        super.connectedCallback();
    }
    configureNewChild(newChild) {
        newChild._rootEditor = this._rootEditor;
        newChild.addEventListener('internal-update-count-changed', e => {
            this.host.upwardDataFlowInProgress = true;
        });
    }
}
IbIdXtalEditor.is = 'ib-id-xtal-editor';
define(IbIdXtalEditor);
