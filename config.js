export const config = {
    propDefaults: {
        treeView: true,
        textView: false,
    },
    derivedProps: ['altView'],
    propInfo: {
        value: {
            type: "String"
        },
        inputObj: {
            "type": "Object"
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
                }
            }
        }
    }
};
