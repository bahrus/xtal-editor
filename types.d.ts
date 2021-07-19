import { IBidProps } from '../ib-id/types.js';
import {XtalEditor} from './src/xtal-editor.js';
export type editType = 'string' | 'number' | 'boolean' | 'object' | 'array' | undefined;

export interface XtalEditorProps extends HTMLElement{
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
    rootEditor: XtalEditor | undefined;


    openEcho: boolean | undefined;

    expandAll: boolean | undefined;

    collapseAll: boolean | undefined;


    uiValue: string | undefined;



    childValues: string[] | undefined | NameValue[];
}

export interface NameValue {
    key: string, 
    value: string,
}

export interface IbIdXtalEditorProps extends XtalEditor{
    _rootEditor: any | undefined;
    host: HTMLElement | undefined;
}

