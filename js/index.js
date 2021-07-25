import "core-js/stable";
import "regenerator-runtime/runtime";
import "quill-mention";
import {generateWords} from "./endpoint.js"
var Quill = require("quill");

var cool_values = [
    {id: 1, value: "hi"},
    {id: 2, value: "sup"}
]
var isOpen = false;
var mention = {
    //assumption: bell won't be generated randomly by a textbot
    mentionDenotationChars: ['\u0007'],
    allowedChars: /^[\t]*$/,
    showDenotionChar: false,
    renderLoading: function(){
        console.log("loading");
    },
    source: async function(searchTerm, renderList, mentionChar) {
        generateWords("hey gamers", 10, 1, 0.9)
            .then((res) =>{
                let values = res.result
                renderList(values, searchTerm);
            });
        
    }
}
var bindings = {
    tab: {
        key: 9,
        handler: async function() {
            var mention = this.quill.getModule('mention')
                mention.openMenu('\u0007');  
                isOpen = true;  

        }
    }


}

$(document).ready(() =>{
    var quill = new Quill('#editor', {
        theme: 'snow',
        modules: {
            mention: mention,
            keyboard: {
                bindings: bindings
            }
        }
      });

});




