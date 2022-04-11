# xtal-editor

<a href="https://nodei.co/npm/xtal-editor/"><img src="https://nodei.co/npm/xtal-editor.png"></a>

<img src="https://badgen.net/bundlephobia/minzip/xtal-editor">

[![Actions Status](https://github.com/bahrus/xtal-editor/workflows/CI/badge.svg)](https://github.com/bahrus/xtal-editor/actions?query=workflow%3ACI)

Re-creation of [flexi-json](http://www.daviddurman.com/flexi-json-editor/jsoneditor.html), taking some liberties, but as a web component.

## [Demo](https://codepen.io/bahrus/pen/gOojgoP)

xtal-editor is able to scale somewhat better for large JSON objects as compared to other alternative editors.

## Usage

Locally:

```html
<xtal-editor key=root>
    <textarea>
        {
            "string":"foo",
            "number":5,
            "array":[1,2,3],
            "object":{
                "property":"value",
                "subobj":{
                    "arr":["foo","ha"],
                    "numero":1
                }
            }
        }
    </textarea>
</xtal-editor>
<script type=module>
    import 'xtal-editor/src/xtal-editor.js';
</script>
```

## [Reference API](https://bahrus.github.io/wc-info/cdn-base.html?npmPackage=xtal-editor@0.0.46)

## Referencing via CDN

```html
<script type=module crossorigin>
    import 'https://esm.run/xtal-editor@0.0.154';
</script>
```


## Running demos locally

To run locally (instructions may vary depending on OS):

1.  Install [node.js](https://nodejs.org/)
2.  Install [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
3.  Choose a directory where you would like the files to be placed, and open a command prompt from that location.
4.  Issue command "git clone https://github.com/bahrus/xtal-editor" in the command window.
5.  CD into the git clone directory.
6.  Issue command "npm install"
7.  When step 6 is completed, issue command "npm run start".




