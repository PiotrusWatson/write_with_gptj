import "quill-mention";
var Quill = require("quill");

var isOut = false;
var cool_values = [
    {id: 1, value: "hi"},
    {id: 2, value: "sup"}
]

var mention = {
    mentionDenotationChars: ["@"],
    source: function(searchTerm, renderList, mentionChar) {
        let values = cool_values;
        renderList(values, searchTerm);
    }
}
var bindings = {
    tab: {
        key: 9,
        handler: function() {
            if (!isOut){
                var selection = this.quill.getSelection();
                var pixelPoint = this.quill.getBounds(selection.index);
                $("#dropdown").css({left: pixelPoint.left, top: pixelPoint.top}).removeClass("invisible");
                isOut = true;
            }
            else{
                $("#dropdown").addClass("invisible");
                isOut = false;
            }

        }
    }
}

$(document).ready(() =>{
    var quill = new Quill('#editor', {
        theme: 'snow',
        modules: {
            mention: mention
        }
      });
});


