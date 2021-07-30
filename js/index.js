import "core-js/stable";
import "regenerator-runtime/runtime";
import "quill-mention";
import {generateWords} from "./endpoint.js"
var Quill = require("quill");
var MAX_PROMPT = 2000;
var isLoading = false;
var lastPoint;

class Attributes {
    constructor(key, name, step, min, max){
        this.key = key;
        this.name = name;
        this.step = step;
        this.min = min;
        this.max = max;
    }
}
var params = {
    topP: 0.9,
    temperature: 1,
    length: 5,
    responses: 3
}
var attrs = [
    new Attributes("topP", "Top P", "any", "0", "1"),
    new Attributes("temperature", "Temperature", "any", "0", "3"),
    new Attributes("length", "Length", "1", "1", "20"),
    new Attributes("responses", "Response #", "1", "1", "5")
];
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
                lastPoint = this.quill.getSelection();
                lastPoint = this.quill.getBounds(lastPoint.index, lastPoint.length);
                mention.openMenu('@');
                this.quill.deleteText(this.quill.getSelection().index - 1, 1);
        }
    }


}

function createInput(parent, attrs){
    var div = $('<div>').appendTo(parent).addClass("description").append("</div>");
    $("<span>").appendTo(div).text(attrs.name).append("</span>");
    var box = $("<input>").appendTo(div).attr({
        step: attrs.step,
        min: attrs.min,
        max: attrs.max,
        value: params[attrs.key]
    });
    box.addClass("box");
    var slider = $("<input>").appendTo(parent).attr({
        type: "range",
        step: attrs.step,
        min: attrs.min,
        max: attrs.max,
        value: params[attrs.key]
    });
    slider.addClass("slider");
    box.change(() =>{
        var contents = box.val();
        slider.val(contents);
        params[attrs.key] = contents;
    })
    slider.change(() => {
        var contents = slider.val();
        box.val(contents);
        params[attrs.key] = contents;
    })
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
    var loadingSpinner = $(".fa-circle-notch");
    var index;
    for (var attr of attrs){
        createInput($(".settings"), attr);
    }
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
        loadingSpinner.appendTo($("#editor"));
        loadingSpinner.css({
            "left": lastPoint.left,
            "top": lastPoint.top,
        });
        loadingSpinner.removeClass("invisible");
        
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
        generateWords(text, params.length, params.temperature, params.topP, params.responses)
            .then((res) =>{
                quill.enable();
                let values = res.result
                isLoading = false;
                loadingSpinner.addClass("invisible");
                renderList(values, searchTerm);
            })
            .catch((e) =>{
                console.log(e);
                isLoading = false;
                loadingSpinner.addClass("invisible");
                alert("oopsie woopsie :(");
            });
        
    }

    quill.getModule('mention').options.onSelect = function(item, insertItem){
        quill.insertText(index-1, item.value);
    }

});




