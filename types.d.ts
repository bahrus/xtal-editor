import {SimpleWCInfo} from 'may-it-be/SimpleWCInfo';


export type editType = 'string' | 'number' | 'boolean' | 'object' | 'array';

export interface XtalEditorProps{
    readOnly: boolean;
    value: string;
}

export interface XtalEditorActions{

}

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
    isWritableObject: boolean;
    isObject: boolean;
    dontReparse: boolean;
    stringFilter: string;
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
        isWritableObject: boolean;
        isObject: boolean;
    }
}

export interface NameValue {
    key: string, 
    value: string,
}

export abstract class XtalEditorInfo implements SimpleWCInfo{
    src: './xtal-editor.js';
    tagName: 'xtal-editor';
    props: XtalEditorProps;
    cssParts: { 
        header: 'Header Section',
        sideNav: 'Side Nav Popout',
        menu: 'Menu of commands',
        textViewSelector: 'Select Text View Button',
        treeViewSelector: 'Select Tree View Button',
        download: 'Download Button',
        objectAdder: 'Object Adder',
        stringAdder: 'String Adder',
        boolAdder: 'Bool Adder',
        numberAdder: 'Number Adder',
        arrAdder: 'Array Adder',
        title: 'Title element',
        searchLabel: 'Search Label',
        searchInput: 'Search Input',
        expandAll: 'Expand All Button',
        collapseAll: 'Collapse All Button',
        copy: 'Copy Button',
        xtalVlist: 'xtal-vlist element',
    };
    slots: {
        initVal: 'Must be a form element with "value" property, such as input or textarea.'
    };
    cssProps: { 
        objKeyBg: 'Background color of object key',
        objKeyColor: 'Color of object key',
        strKeyBg: 'Background color of string key',
        strKeyColor: 'Color of string key',
        numKeyBg: 'Background color of number key',
        numKeyColor: 'Color of number key',
        boolKeyBg: 'Background color of boolean key',
        arrayKeyBg: 'Background color of array key',
        arrayKeyColor: 'Color of array key',
        objAdderBg: 'Background color of object adder',
        stringAdderBg: 'Background color of string adder',
        boolAdderBg: 'Background color of boolean adder',
        numAdderBg: 'Background color of number adder',
        arrAdderBg: 'Background color of array adder',
    };
    events: {
        editedValueChanged: 'Fires whenever an update to the object is committed.'
    }
}

export type Package = [XtalEditorInfo];


