# xtal-editor

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/xtal-editor)

<a href="https://nodei.co/npm/xtal-editor/"><img src="https://nodei.co/npm/xtal-editor.png"></a>


[![Playwright Tests](https://github.com/bahrus/xtal-editor/actions/workflows/CI.yml/badge.svg?branch=baseline)](https://github.com/bahrus/xtal-editor/actions/workflows/CI.yml)

Re-creation of [flexi-json](http://www.daviddurman.com/flexi-json-editor/jsoneditor.html), taking some liberties, but as a web component.


## [Demo](https://json-editor-pwa.bahrus.workers.dev/)

xtal-editor is able to scale somewhat better for large JSON objects as compared to other alternative editors.

At least if a height is specified (if not, not very scalable).

## [API](https://cf-sw.bahrus.workers.dev/?href=https%3A%2F%2Fcdn.jsdelivr.net%2Fnpm%2Fxtal-editor%400.0.159%2Fcustom-elements.json&stylesheet=https%3A%2F%2Fcdn.jsdelivr.net%2Fnpm%2Fwc-info%2Fsimple-ce-style.css&embedded=false&tags=&ts=0.0.159&tocXSLT=https%3A%2F%2Fcdn.jsdelivr.net%2Fnpm%2Fwc-info%2Ftoc.xsl)

## Usage

Locally:

```html
<xtal-editor style=height:350px;>
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




