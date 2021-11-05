// import { IBidProps } from '../ib-id/types.js';
import { PEUnionSettings } from '../trans-render/lib/types.js';


export type editType = 'string' | 'number' | 'boolean' | 'object' | 'array';

export interface XtalEditorFieldProps{
    /**
     * @prop {string} key - Root node name to display
     * @attr {string} key - Root node name to display
     */
    key: string;
    /**
     * @prop {string} [value] JSON data to edit
     * 
     */
    value: string | object | number | boolean | null;
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
    isRoot: boolean;
    evenLevel: boolean;
    parentLevel: boolean;
    isC: boolean;
    expanderParts: NodeListOf<HTMLButtonElement>;
    readOnly: boolean;
    textView: boolean;
    treeView: boolean;
    downloadHref: string;
    isObject: boolean;
    dontReparse: boolean;
}

export interface XtalEditorFieldActions{
    parseValue(self: this): {
        parsedObject: string | object | number | boolean | null;
    } | undefined;
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
    //syncLightChild(self:this):void; 
    makeDownloadBlob(self:this): void;


    updateIsObject(self: this):{
        isObject: boolean;
    }
}

export interface NameValue {
    key: string, 
    value: string,
}

