// import { IBidProps } from '../ib-id/types.js';
import { PEUnionSettings } from '../trans-render/lib/types.js';


export type editType = 'string' | 'number' | 'boolean' | 'object' | 'array' | undefined;

export interface XtalEditorProps{
    /**
     * @prop {string} key - Root node name to display
     * @attr {string} key - Root node name to display
     */
    key: string | undefined;
    /**
     * @prop {string} [value] JSON data to edit
     * 
     */
    value: string | undefined;
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
    open: boolean | undefined;

    /**
     * @private
     */
    rootEditor: this | undefined;


    openEcho: boolean | undefined;

    expandAll: boolean | undefined;

    collapseAll: boolean | undefined;


    uiValue: string | undefined;



    childValues: string[] | undefined | NameValue[];

    upwardDataFlowInProgress: boolean;

    objCounter: number;
    strCounter: number;
    boolCounter: number;
    numberCounter: number;
    hasParent: boolean;
    evenLevel: boolean;
    parentLevel: boolean;
    isC: boolean;
    expanderParts: NodeListOf<HTMLButtonElement>;
    keyParts: NodeListOf<HTMLInputElement>;
    valueParts:NodeListOf<HTMLInputElement>;
    objectAdderParts:NodeListOf<HTMLButtonElement>;
    stringAdderParts:NodeListOf<HTMLButtonElement>;
    boolAdderParts: NodeListOf<HTMLButtonElement>;
    numberAdderParts: NodeListOf<HTMLButtonElement>;
    copyIds: NodeListOf<HTMLButtonElement>;
    slotElements: NodeListOf<HTMLSlotElement>;
    expandAllIds: NodeListOf<HTMLButtonElement>;
    collapseAllIds: NodeListOf<HTMLButtonElement>;
    removeParts: NodeListOf<HTMLButtonElement>;
    editorParts: NodeListOf<HTMLDivElement>;
}

export interface XtalEditorActions{
    parseValue(self: this): {
        parsedObject: any
    }
    setChildValues(self: this):{
        childValues: string[] | undefined | NameValue[],
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
    initEvenLevel(self: this):void;
    setEvenLevel(self: this):{
        evenLevel: boolean,
    }
    onExpandAll(self: this):{
        open: boolean,
    }
    onCollapseAll(self: this):{
        open: boolean,
    }
    onConnected(self: this):void;
    doExpanderParts:(self: this) => any;
    //doOpen:(self: this) => any;
    doKeyParts:(self:this)=>any;
    doValueParts:(self:this)=>any;
    doObjectAdderParts:(self:this)=>any;
    doStringAdderParts:(self:this)=>any;
    doBoolAdderParts:(self:this)=>any;
    doNumberAdderParts:(self:this)=>any;
    doCopy:(self:this)=>any;
    doSlotElements:(self:this)=>any;
    doExpandAll:(self:this)=>any;
    doCollapseAll:(self:this)=>any;
    updateValue:(self:this)=>any;
    updateType:(self:this)=>any;
    updateKey:(self:this)=>any;
}

export interface NameValue {
    key: string, 
    value: string,
}

// export interface IbIdXtalEditorProps extends XtalEditor{
//     _rootEditor: any | undefined;
//     host: HTMLElement | undefined;
// }

