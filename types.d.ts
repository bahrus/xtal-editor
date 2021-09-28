// import { IBidProps } from '../ib-id/types.js';
import { PEUnionSettings } from '../trans-render/lib/types.js';


export type editType = 'string' | 'number' | 'boolean' | 'object' | 'array';

export interface XtalEditorProps{
    /**
     * @prop {string} key - Root node name to display
     * @attr {string} key - Root node name to display
     */
    key: string;
    /**
     * @prop {string} [value] JSON data to edit
     * 
     */
    value: string | object;
    /**
     * @private
     */
    type:  editType;
    /**
     * @private
     */
    parsedObject: any;
    /**
     * @prop {boolean} [open] Indicates with Editor should show child nodes expanded.
     * @attr {boolean} [open] Indicates with Editor should show child nodes expanded.
     */
    open: boolean;

    /**
     * @private
     */
    rootEditor: this;


    openEcho: boolean;

    expandAll: boolean;

    collapseAll: boolean;

    childValues: string[] | NameValue[];

    upwardDataFlowInProgress: boolean;
    internalUpdateCount: number;
    arrCounter: number;
    objCounter: number;
    strCounter: number;
    boolCounter: number;
    numCounter: number;
    hasParent: boolean;
    evenLevel: boolean;
    parentLevel: boolean;
    isC: boolean;
    expanderParts: NodeListOf<HTMLButtonElement>;
    keyParts: NodeListOf<HTMLInputElement>;
    valueParts:NodeListOf<HTMLInputElement>;
    // objectAdderParts:NodeListOf<HTMLButtonElement>;
    // stringAdderParts:NodeListOf<HTMLButtonElement>;
    // boolAdderParts: NodeListOf<HTMLButtonElement>;
    // numberAdderParts: NodeListOf<HTMLButtonElement>;
    copyToClipboardParts: NodeListOf<HTMLButtonElement>;
    slotElements: NodeListOf<HTMLSlotElement>;
    expandAllParts: NodeListOf<HTMLButtonElement>;
    collapseAllParts: NodeListOf<HTMLButtonElement>;
    removeParts: NodeListOf<HTMLButtonElement>;
    editorParts: NodeListOf<HTMLDivElement>;
    readOnly: boolean;
    textView: boolean;
    fieldView: boolean;
}

export interface XtalEditorActions{
    parseValue(self: this): {
        parsedObject: any
    }
    setChildValues(self: this):{
        childValues: string[] | NameValue[] | undefined,
    }
    syncValueFromChildren(self: this):void;
    addObject(self: this):{
        value: any,
        open: boolean,
    }
    addString(self: this):{
        value: any,
        open: boolean,
    }
    addBool(self: this):{
        value: any,
        open: boolean,
    }
    addNumber(self: this):{
        value: any,
        open: boolean,
    }
    addArr(self: this):{
        value: any,
        open: boolean,
    }
    //initEvenLevel(self: this):void;
    // setEvenLevel(self: this):{
    //     evenLevel: boolean,
    // }

    onConnected(self: this):void;
    updateValue:(self:this)=>any;
    updateType:(self:this)=>any;
    updateKey:(self:this)=>any;
    syncLightChild(self:this):void; 
}

export interface NameValue {
    key: string, 
    value: string,
}

