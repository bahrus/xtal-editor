export type editType = 'string' | 'number' | 'boolean' | 'object' | 'array' | undefined;

export interface XtalEditorPublicProps extends HTMLElement{
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
}

