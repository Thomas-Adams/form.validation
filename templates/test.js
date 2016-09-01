var lodash = require('lodash');

var getAttributes = function(attrArray) {
  var attributes = '', keys = [];
  lodash.each(attrArray, function(value, index){
      lodash.each(value, function(v,k){
          if(keys.indexOf(k)==-1) {
            attributes += ' ' + k +'="';
            attributes += v +'"';
            keys.push(k);
          }
      });
  });
  return attributes;
};

var fieldRow = {
    row: {
        class: 'form-group'
    },
    field: {
        id: 'username',
        name: 'username',
        class: 'form-control',
        tag: 'input',
        type: 'text',
        closing: true
    },
    attributes: [{
        'required': 'required',
        'data-validation-email': 'email',
        'data-validation-date' : 'yyyy-mm-dd',
        'required': 'required'
    }]
};

console.log(getAttributes(fieldRow.attributes));
