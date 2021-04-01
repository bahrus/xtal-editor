import {html} from 'xtal-element/lib/html.js';
export const styleTemplate = html`
<style>
    :host{
        display:block;
    }

    
    slot{
        display: none;
    }


    .expander{
        width: fit-content;
        height: fit-content;
        padding-left: 0px;
        padding-right: 0px;
        width:20px;
    }
    .copy{
        height: 16px;
    }
    .copyBtn{
        width: fit-content;
        height: fit-content;
        padding-left: 0px;
        padding-right: 0px;
        padding-top: 0px;
        padding-bottom: 0px;
        border: 0;
    }
    .object.adder{
        background-color: #C15000;
    }
    .string.adder{
        background-color:#007408;
    }
    .bool.adder{
        background-color: #516600;
    }
    .number.adder{
        background-color: #497B8D;
    }
    .adder{
        color: white;
        text-shadow:1px 1px 1px black;
        border-radius: 5px;
        padding: 2;
        border: none;
        /* width:95px; */
    }
    .remove{
        padding: 2px 4px;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        text-shadow: 1px 1px 1px black;
        background-color: black;
        
    }
    .remove::after{
        content: "JSON Editor";
    }
    .remove.editKey::after{
        content: "Remove item by deleting the property name.";
    }

    .field{
        display:flex;
        flex-direction:row;
        line-height: 20px;
        align-items: center;
    }
    @media only screen and (max-width: 1000px) {
        .field{
            flex-direction: column;
        }
        .child-inserters{
            justify-content: flex-end;
            width: 100%;
        }
        .adder{
            font-size: 2vw;
        }
        .text-editing{
            width: 100%;
        }
    }
    @media only screen and (min-width: 1001px){
        .child-inserters{
            justify-content: center;
        }
        .field{
            width: 100%;
            justify-content: space-evenly;
        }
        .text-editing{
            flex-grow: 1;
        }
    }
    .text-editing{
        display: flex;
        flex-direction: row;
        padding-top:1px;
        padding-bottom:1px;
    }
    .child-inserters{
        display: flex;
    }
    .child-editors{
        margin-left: 25px;
    }
    div[part="child-editors"][data-open="false"]{
        display: none;
    }
    [data-type="object"] button.nonPrimitive{
        display: inline;
    }
    [data-type="object"] div.nonPrimitive[data-open="true"]{
        display: block;
    }
    [data-type="array"] button.nonPrimitive{
        display: inline;
    }
    [data-type="array"] div.nonPrimitive[data-open="true"]{
        display: block;
    }
    [data-type="string"] .nonPrimitive{
        display: none;
    }
    [data-type="number"] .nonPrimitive{
        display: none;
    }
    [data-type="boolean"] .nonPrimitive{
        display: none;
    }
    [data-type="string"] [part="key"]{
        background-color: rgb(0, 148, 8);
    }
    [data-type="boolean"] [part="key"]{
        background-color: #B1C639;
    }
    [data-type="object"] [part="key"]{
        background-color: rgb(225, 112, 0);
    }
    [data-type="number"] [part="key"]{
        background-color: rgb(73, 123, 141);
    }
    [data-type="array"] [part="key"]{
        background-color: rgb(45, 91, 137);
    }
    .value{
        background-color: #ECF3C3;
        width: 100%;
        flex-grow:5;
    }
    input.key {
        
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        margin-right: 2px;
    }
    input {
        border: none;
        padding: 3px;
    }
</style>
`;