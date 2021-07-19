import {IBid} from 'ib-id/i-bid.js';
import {XtalEditor} from './xtal-editor.js';
import {define} from 'xtal-element/lib/define.js';
import { IbIdXtalEditorProps } from '../types.js';

/**
 * @element ib-id-xtal-editor
 */
export class IbIdXtalEditor extends IBid{
    static is = 'ib-id-xtal-editor';

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
                    key = `[${idx!.toString()}]`
                }
            }
            const hasParent = true;
            return {key, value, hasParent};
        }
        super.connectedCallback();
    }

    configureNewChild(newChild: any){
        (<any>newChild)._rootEditor = this._rootEditor;
        newChild.addEventListener('internal-update-count-changed', (e:Event) =>{
            (<any>this).host!.upwardDataFlowInProgress = true;
        });
    }
    
}
export interface IbIdXtalEditor extends IbIdXtalEditorProps{}
define(IbIdXtalEditor);