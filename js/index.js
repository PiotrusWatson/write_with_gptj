var isOut = false;


mention = {
    mentionDenotationChars: ["@"]
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

var quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
        keyboard: {
            bindings: bindings
        }
    }
  });

