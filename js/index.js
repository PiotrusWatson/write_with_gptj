//import "core-js/stable";
//import "regenerator-runtime/runtime";
import "quill-mention";
const p = require('phin');
var Quill = require("quill");

var cool_values = [
    {id: 1, value: "hi"},
    {id: 2, value: "sup"}
]
var isOpen = false;
var mention = {
    //assumption: bell won't be generated randomly by a textbot
    mentionDenotationChars: ['\u0007'],
    allowedChars: /^[ \t]*$/,
    showDenotionChar: false,
    source: function(searchTerm, renderList, mentionChar) {
        let values = cool_values;
        renderList(values, searchTerm);
    }
}
var bindings = {
    tab: {
        key: 9,
        handler: function() {
            var mention = this.quill.getModule('mention')
            mention.source = function(searchTerm, renderList, mentionChar) {
                let values = cool_values;
                renderList(values, searchTerm);
            } 
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
    var mench = quill.getModule("mention");
    $("#editor").keypress((e) => {
        if (e.key === "a" && isOpen){
            console.log("hi");
            mench.hideMentionList();
            isOpen = false;
        }
    
    })
});




