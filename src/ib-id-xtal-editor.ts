import {IbId} from 'ib-id/ib-id.js';
import {XtalEditor} from './xtal-editor.js';
import {define} from 'xtal-element/lib/define.js';
import { XtalElement } from '../../xtal-element/XtalElement.js';

export class IbIdXtalEditor extends IbId{
    static is = 'ib-id-xtal-editor';
    _rootEditor: XtalElement | undefined;
    host: HTMLElement | undefined;
    connectedCallback(){
        this.map = (x, idx) => {
            let key: any = undefined;
            let value: any = undefined;
            switch(typeof x){
                case 'object': {
                    key = x.key;
                    value = x.value;
                }
                break;
                default: {
                    value = x;
                    key = idx!.toString()
                }
            }
            const hasParent = true;
            return {key, value, hasParent};
        }
        super.connectedCallback();
    }

    configureNewChild(newChild: XtalElement){
        (<any>newChild)._rootEditor = this._rootEditor;
        newChild.addEventListener('internal-update-count-changed', e =>{
            (<any>this).host!.upwardDataFlowInProgress = true;
        });
    }
    
}
define(IbIdXtalEditor);