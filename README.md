# xtal-editor

Re-creation of [flexi-json](http://www.daviddurman.com/flexi-json-editor/jsoneditor.html), taking some liberties, but as a web component.

## Usage

```html
<xtal-editor-base-primitive key=root 
    value='{"string":"foo","number":5,"array":[1,2,3],"object":{"property":"value","subobj":{"arr":["foo","ha"],"numero":1}}}'>
</xtal-editor-base-primitive>
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


