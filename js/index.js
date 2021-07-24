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
    source: function(searchTerm, renderList, mentionChar) {
        let values = cool_values;
        renderList(values, searchTerm);
    }
}
var bindings = {
    tab: {
        key: 9,
        handler: async function() {
            var mention = this.quill.getModule('mention')
            mention.source = function(searchTerm, renderList, mentionChar) {
                let values = cool_values;
                renderList(values, searchTerm);
            } 
            generateWords("hey gamers", 30, 1, 0.9)
            .then((res) =>{
                console.log(res.body);
            })
            
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




