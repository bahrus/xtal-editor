import {SimpleWCInfo} from 'may-it-be/SimpleWCInfo';


export type editType = 'string' | 'number' | 'boolean' | 'object' | 'array';

export interface XtalEditorProps{
    /**
     * Indicates if the editor is in read-only mode.
     */
    readOnly: boolean;
    /**
     * JSON formatted string to edit
     */
    value: string;
    /**
     * Already parsed JSON object to edit
     */
    inputObj: any;
}

export interface XtalEditorActions{

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


