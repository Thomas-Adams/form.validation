var lodash = require('lodash');
var nunjucks = require('nunjucks');
var fs = require('fs');
var path = require('path');
var args =[];

process.argv.forEach(function(value, index){
    args.push(value);
    console.log('Arguments at ' + (index +1) + ' : ' + value);
});


var fieldRow = {
    row : {
        class : 'form-group'
    },
    field : {
        id : 'username1',
        name : 'username',
        class : 'form-control',
        tag : 'input',
        type : 'text',
        closing : true
    },
    validations : [{
        'required' : 'required',
        'data-validation-email' : 'email'
    }],
    getAttributes : function() {
      var attributes = '', keys = [];
      lodash.each(this.validations, function(value, index){
          lodash.each(value, function(v,k){
              if(keys.indexOf(k)==-1) {
                attributes += k +'="';
                attributes += v +'" ';
                keys.push(k);
              }
          });
      });
      return attributes;
    },

    init: function() {
      this.attributes = this.getAttributes();
      console.log(JSON.stringify(this.attributes));
    }
};

var element = {};
fieldRow.init();
element.row = fieldRow.row;
element.field = fieldRow.field;
element.attributes = fieldRow.getAttributes();

fieldRow.init();
nunjucks.render(args[2], element, function(err,res){
    if(err) {
        console.log(err);
    } else {
        res = res.replace(/^\s*\n/gm,'');
        fs.writeFile('test.html', res,{encoding:'utf8', flag:'w+'}, function(err){
            console.log(err);
        });
    }
});
