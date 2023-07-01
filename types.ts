export interface EndUserProps{
    treeView: boolean;
    textView: boolean;
    value: string;
    inputObj: object;
    readOnly: boolean;
}

export interface Props extends EndUserProps{
    downloadHref: string;
    altView: string;
    title: string;
    //currentView: string;
}