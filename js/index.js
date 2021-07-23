var bindings = {
    tab: {
        key: 9,
        handler: function() {
            var selection = this.quill.getSelection();
            var pixelPoint = this.quill.getBounds(selection.index)
            
        }
    }
}

var quill = new Quill('#editor', {
    theme: 'snow'
  });

