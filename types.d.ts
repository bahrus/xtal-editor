export type editType = 'string' | 'number' | 'boolean' | 'object' | 'array' | undefined;

export interface XtalEditorPublicProps extends Partial<HTMLElement>{
    key: string | undefined;
    value: string | undefined;
    type:  editType;
    parsedObject: any;
    open: boolean | undefined;
}

