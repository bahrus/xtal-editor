export type editType = 'string' | 'number' | 'boolean' | 'object' | 'array' | undefined;

export interface XtalEditorPublicProps{
    key: string | undefined;
    value: string | undefined;
    type:  editType;
    parsedObject: any;
    open: boolean | undefined;
}

declare global {
    interface HTMLElementTagNameMap {
        "xtal-editor": XtalEditorPublicProps,
    }
}