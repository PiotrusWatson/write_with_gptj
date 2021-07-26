import "core-js/stable";
import "regenerator-runtime/runtime";
import "quill-mention";
import {generateWords} from "./endpoint.js"
var Quill = require("quill");
var MAX_PROMPT = 2000;
var mention = {
    //assumption: bell won't be generated randomly by a textbot
    mentionDenotationChars: ['\u0007'],
    allowedChars: /^[\t]*$/,
    showDenotionChar: false,
    spaceAfterInsert:false,
    renderLoading: function(){
        console.log("loading");
    }
}
var bindings = {
    tab: {
        key: 9,
        handler: async function() {
            var mention = this.quill.getModule('mention')
                mention.openMenu('\u0007');  
        }
    }


}

function sliceText(text, range){
    var endPoint = range.index + range.length;
    var startPoint;
    if (endPoint - MAX_PROMPT < 0){
        startPoint = 0;
    } else {
        startPoint = endPoint - MAX_PROMPT;
    }
    return text.slice(startPoint, endPoint);
}

function parseContents(contents){
    console.log(contents);
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
    var quill = new Quill('#editor', {
        theme: 'snow',
        modules: {
            mention: mention,
            keyboard: {
                bindings: bindings
            }
        }
      });
    quill.getModule('mention').options.source = 
        async function(searchTerm, renderList, mentionChar) {
        var range = quill.getSelection();
        var cutoff;
        var text = parseContents(quill.getContents());
        text = sliceText(text, range);
        console.log(text);
        if (text.charAt(text.length - 1) === "\n"){
            cutoff = 2
        }
        else {
            cutoff = 1
        }
        var slicedText = text.slice(0, text.length - cutoff);
        generateWords(slicedText, 5, 1, 0.9)
            .then((res) =>{
                let values = res.result
                renderList(values, searchTerm);
            });
        
    }

});




