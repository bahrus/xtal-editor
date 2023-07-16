export const config = {
    propDefaults: {
        treeView: true,
        textView: false,
        readOnly: false,
    },
    derivedProps: ['altView', 'title'],
    propInfo: {
        value: {
            type: "String"
        },
        inputObj: {
            "type": "Object"
        },
        readOnly: {
            notify: {
                mapTo: {
                    key: 'title',
                    map: [
                        [true, 'JSON Viewer'],
                        [false, 'JSON Editor']
                    ]
                }
            }
        },
        treeView: {
            notify: {
                negateTo: {
                    key: "textView"
                },
                mapTo: {
                    key: "altView",
                    map: [
                        [true, "Text View"],
                        [false, "Tree View"]
                    ]
                },
            }
        },
        textView: {
            notify: {
                negateTo: {
                    key: 'treeView'
                }
            }
        }
    }
};
