import "core-js/stable";
import "regenerator-runtime/runtime";
import "quill-mention";
const p = require('phin');
var Quill = require("quill");

var cool_values = [
    {id: 1, value: "hi"},
    {id: 2, value: "sup"}
]

var mention = {
    //assumption: bell won't be generated randomly by a textbot
    mentionDenotationChars: ['\u0007'],
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
            mention.openMenu('\u0007');           

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

    $("#editor").keypress((e) => {
        if (e.key !== "Enter"){
            var newEvent = jQuery.Event("keydown");
            newEvent.key = "Escape";
            $("input").trigger(newEvent);
        }
    
    })
});




