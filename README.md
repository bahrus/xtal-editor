# xtal-editor

<a href="https://nodei.co/npm/xtal-editor/"><img src="https://nodei.co/npm/xtal-editor.png"></a>

<img src="https://badgen.net/bundlephobia/minzip/xtal-editor">

Re-creation of [flexi-json](http://www.daviddurman.com/flexi-json-editor/jsoneditor.html), taking some liberties, but as a web component.

## [Demo](https://jsfiddle.net/bahrus/u5e4okn6/4/)

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

## CDN

The script tag above can be replaced by:

```html
<script type=module src=https://unpkg.com/xtal-editor/src/xtal-editor.js?module></script>
```

or 

```html
<script type=module src=https://cdn.jsdelivr.net/npm/xtal-editor/dist/xtal-editor.js></script>
```

or

```html
<script type=module>
import xtalEditor from 'https://cdn.skypack.dev/xtal-editor';
</script>
```

## Installation

To run locally (instructions may vary depending on OS):

1.  Install [node.js](https://nodejs.org/)
2.  Install [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
3.  Choose a directory where you would like the files to be placed, and open a command prompt from that location.
4.  Issue command "git clone https://github.com/bahrus/xtal-editor" in the command window.
5.  CD into the git clone directory.
6.  Issue command "npm install"
7.  When step 6 is completed, issue command "npm run start".


