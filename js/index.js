import "core-js/stable";
import "regenerator-runtime/runtime";
import "quill-mention";
import {generateWords} from "./endpoint.js"
var Quill = require("quill");
var MAX_PROMPT = 2000;
var isLoading = false;
var mention = {
    //assumption: bell won't be generated randomly by a textbot
    mentionDenotationChars: ['@'],
    allowedChars: /^[\t]*$/,
    showDenotionChar: false,
    spaceAfterInsert:false
}
var bindings = {
    tab: {
        key: 9,
        handler: function() {
            if (isLoading){
                return;
            }
            var mention = this.quill.getModule('mention');
                mention.openMenu('@');
                this.quill.deleteText(this.quill.getSelection().index - 1, 1);
        }
    }


}

function sliceText(text, range){
    var endPoint = range.index + range.length - 1;
    var startPoint;
    if (endPoint - MAX_PROMPT < 0){
        startPoint = 0;
    } else {
        startPoint = endPoint - MAX_PROMPT;
    }
    return text.slice(startPoint, endPoint);
}

function parseContents(contents){
    var text = ""
    for (var item of contents.ops){
        text += parseMention(item.insert);
    }
    return text;
}

function parseMention(content){
    if (typeof content === "string"){
        return content;
    }
    return content.mention.value;
    
}

$(document).ready(() =>{
    var index;
    var quill = new Quill('#editor', {
        theme: 'snow',
        modules: {
            mention: mention,
            keyboard: {
                bindings: bindings
            }
        }
      });

    quill.getModule('mention').options.renderLoading = function(){
        console.log("loading");
        quill.disable();
        isLoading = true;
    }
    quill.getModule('mention').options.source = 
        async function(searchTerm, renderList, mentionChar) {
        var range = quill.getSelection();
        index = range.index + range.length;
        var cutoff;
        var text = parseContents(quill.getContents());
        text = sliceText(text, range);
        console.log(text);
        //var slicedText = text.slice(0, text.length - 1);
        generateWords(text, 5, 0.9, 0.7)
            .then((res) =>{
                quill.enable();
                let values = res.result
                isLoading = false;
                renderList(values, searchTerm);
            });
        
    }

    quill.getModule('mention').options.onSelect = function(item, insertItem){
        console.log("THERE IS THE ITEM");
        console.log(item);
        quill.insertText(index-1, item.value);
    }

});




