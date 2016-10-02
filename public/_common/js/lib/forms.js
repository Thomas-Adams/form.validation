/**
 * Array.prototype.remove - removes an/several element/elements from an array.
 *
 * @param  {integer} from   Index from which the removal starts.
 * @param  {integer} to     Index until the removal ends.
 * @return {Array}          returns the resulting array.
 */
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};



/**
 * Constructor foe base class for all HTML elements
 * @param {String} tagName   name of the tag
 * @param {String} id        id of the element
 * @param {String} name      name of the element
 * @param {String} className class of the element
 * @param {String} style     style of the element
 */
var HTMLElement = function() {

    this.attributesMap = {};
    this.tagName = tagName;
    this.attributes['tagName'] = tagName;

    this.id = id;
    this.attributes['id'] = id;
    this.name = name;
    this.attributes['name'] = name;
    this.class = class;
    this.attributes['class'] = class;
    this.style = style;
    this.attributes['style'] = style;
};

HTMLElement.prototype.setAttribute = function(attributeName, value) {
    this.attributes[attributeName] = value;
};


HTMLElement.prototype.getAttribute = function(attributeName) {
    return this.attributes[attributeName];
};

HTMLElement.prototype.removeAttribute = function(attributeName) {
    delete this.attributes[attributeName];
};
/**
 * Rule class construvtor, represents a ruke for
 * validation of a value.
 *
 * @param  {String}     name                  name of the rule
 * @param  {selector}   errorMessageContainer container DOM element that holds the corresponding error messages.
 * @param  {String}     errorMessage          the error message, if this rule fails
 * @param  {Function}   validationFunction    the function to validate the given value, that function should be globally defined.
 * @property {String}   name                  name of the rule.
 * @property {String}   errorMessageContainer jQuery selector ofthe error message container.
 * @property {String}   errorMessage          Error message if an error occurs.
 * @property {Object}   validationFunction    validation function.
 */
var Rule = function( name, errorMessageContainer, errorMessage, validationFunction) {

    this.name = name;
    this.errorMessageContainer = errorMessageContainer;
    this.errorMessage = errorMessage;
    this.validationFunction = validationFunction;
    this.valid = false;
};

/**
 * Rule.prototype.validate - validate a given value according to
 * the validation function.
 *
 * @param  {Any}        value the value to be validated.
 * @param  {Any}        args  additional arguments.
 * @return {boolean}    returns true if the validation is successful otherwise false.
 */
Rule.prototype.validate = function(value, elememt, args) {
    this.valid = this.validationFunction(value, element, args);
    return this.valid;
};



/**
 * Form class contructor, represents a form element width
 * its fieldsets and fields as children elements.
 *
 * @param  {String} id      id of the form element
 * @param  {String} method  the HTTP method (GET, POST, etc.)
 * @param  {String} action  the action property, usually an URL
 */
var Form = function(id, method, action) {
    this.fieldSets = [];
    this.fieldSetMap = {};
    this.fieldMap = {};
    this.fields=[];
    this.rules = [];
    this.rulesMap ={};
    this.id = id;
    this.method=method;
    this.action=action;
};

/**
 * FieldSet class constructor
 * @param {String} id  id of the fieldset element.
 */
var FieldSet = function(id) {
    this.id = id;
    this.fieldMap = {};
    this.fields=[];
    this.rules = [];
    this.parent = null;
};

/**
 * Field default constructor
 * @param {String} id id of the field element of the form.
 */
var Field = function(id) {
    this.id = id;
    this.parent = null;
    this.rules = [];
};


/**
 * Form.prototype.addFieldSet - adds a fieldset to the form
 *
 * @param  {FiledSet} fieldSet FieldSet instance
 * @return {Form}              returns the form object for chainability
 */
Form.prototype.addFieldSet = function(fieldSet) {
    fieldSet.parent = this;
    this.fieldMap[field.id]=field;
    this.fields.push(field);
    return this;
};

/**
 * Form.prototype.getFieldSet - retrieves a FieldSet object by its id or its index
 *
 * @param  {Object}             Object key is either String or an Integer.
 * @return {type}               FieldSet instance or null in case a matching
 *                              Fieldset doesn't exist.
 */
Form.prototype.getFieldSet = function(key) {
    if(key!==null && typeof(key)===String && isNaN(key)) {
        return this.fieldSetMap[key];
    } else if(typeof(key)===Number && key<this.fieldSet.length && key>=this.fieldSet.length) {
        return this.fieldSet[key];
    } else {
        return null;
    }
};

/**
 * Form.prototype.removeFieldSet removes a FieldSet onbject from the given Form instance
 * @param  {Object} Object key is either String or an Integer.
 * @return {Form}   returns the form object for chainability
 */
Form.prototype.removeFieldSet = function(key) {
    if(key!==null && typeof(key)===String && isNaN(key)) {
        var item = null;
        this.fieldSet.each(function(obj, index){
            if(value.id==key) {
                this.fieldSet.remove(index);
            }
        });
        delete this.fieldSetMap[key];
    } else if(typeof(key)===Number && key<this.fieldSet.length && key>=this.fieldSet.length) {
        var prop = this.fieldSet[key].id;
        this.fieldSet.remove(key);
        delete this.fieldSetMap[prop];
    }
    return this;
};


/**
 * Form.prototype.addField adds a field object directly to the form
 * @param {Object} field Field object to add
 */
Form.prototype.addField = function(field) {
    field.parent=this;
    this.fieldMap[field.id]=field;
    this.fields.push(field);
};

/**
 * Form.prototype.getField retrieves a Field object from the form. The field in question
 * has to directly added to the form before
 * @param  {Object} key The key object is either a String in case of the retrieval by
 *                      the field id, or it is am Integer.
 * @return {Field}      returns the field object or null, if it is not found.
 */
Form.prototype.getField = function(key) {
    if(key!==null && typeof(key)===String && isNaN(key)) {
        return this.fieldMap[key];
    } else if(typeof(key)===Number && key<this.fields.length && key>=this.fieldSet.length) {
        return this.fields[key];
    } else {
        return null;
    }
};

/**
 * Form.prototype.removeField   removes a Field object from the given Form instance
 * @param  {Object} Object key is either String or an Integer.
 * @return {Form}    returns the form object for chainability
 */
Form.prototype.removeField = function(key) {
    if(key!==null && typeof(key)===String && isNaN(key)) {
        var item = null;
        this.fields.each(function(obj, index){
            if(value.id==key) {
                this.fields.remove(index);
            }
        });
        delete this.fieldMap[key];
    } else if(typeof(key)===Number && key<this.fields.length && key>=this.fields.length) {
        var prop = this.fields[key].id;
        this.fields.remove(key);
        delete this.fieldMap[prop];
    }
    return this;
};

/**
 * Form.prototype.addRule adds a rule object to the Form instance.
 * @param {Rule} rule Rule object instance to be added
 */
Form.prototype.addRule = function(rule) {
    this.rulesMap[rule.name]=rule;
    this.rules.push(rule);
};

/**
 * Form.prototype.getRule retrieves a Rule object by its id or its index
 * @param  {Object} key   Object key is either String or an Integer.
 * @return {Rule}         returns the retrieved rule object or null,
 *                        if the object cannot be retrieved.
 */
Form.prototype.getRule = function(key) {
    if(key!==null && typeof(key)===String && isNaN(key)) {
        return this.rulesMap[key];
    } else if(typeof(key)===Number && key<this.rules.length && key>=this.rules.length) {
        return this.rules[key];
    } else {
        return null;
    }
};

/**
 * Form.prototype.deleteRule removes a Rule object from the given Form instance
 * @param  {Object} Object key is either String or an Integer.
 * @return {Form}   returns the form object for chainability
 */
Form.prototype.deleteRule = function(key) {
    if(key!==null && typeof(key)===String && isNaN(key)) {
        var item = null;
        this.rules.each(function(obj, index){
            if(value.id==key) {
                this.rules.remove(index);
            }
        });
        delete this.rulesMap[key];
    } else if(typeof(key)===Number && key<this.rules.length && key>=this.rules.length) {
        var prop = this.rules[key].id;
        this.rules.remove(key);
        delete this.rulesMap[prop];
    }
    return this;
};

/**
 * FieldSet.prototype.addField add a Field object t the FieldSet instance.
 * @param {Field} field Field object to be added
 * @return {FieldSet}   returns the fieldSet object for chainability
 */
FieldSet.prototype.addField = function(field) {
    this.fieldMap[field.id]=field;
    this.fields.push(field);
    return this;
};


/**
 * FieldSet.prototype.getField retrieves a Field object from the fieldet. The field in question
 * has to directly added to the fieldSet before
 * @param  {Object} key The key object is either a String in case of the retrieval by
 *                      the field id, or it is am Integer.
 * @return {FieldSet}      returns the fieldSet object or null, if it is not found.
 */
FieldSet.prototype.getField = function(key) {
    if(key!==null && typeof(key)===String && isNaN(key)) {
        return this.fieldMap[key];
    } else if(typeof(key)===Number && key<this.fields.length && key>=this.fieldSet.length) {
        return this.fields[key];
    } else {
        return null;
    }
};

/**
 * FieldSet.prototype.removeField   removes a Field object from the given FieldSet instance
 * @param  {Object} Object key is either String or an Integer.
 * @return {FieldSet}    returns the fieldSet object for chainability
 */
FieldSet.prototype.removeField = function(key) {
    if(key!==null && typeof(key)===String && isNaN(key)) {
        var item = null;
        this.fields.each(function(obj, index){
            if(value.id==key) {
                this.fields.remove(index);
            }
        });
        delete this.fieldMap[key];
    } else if(typeof(key)===Number && key<this.fields.length && key>=this.fields.length) {
        var prop = this.fields[key].id;
        this.fields.remove(key);
        delete this.fieldMap[prop];
    }
    return this;
};



/**
 * FieldSet.prototype.addRule adds a rule object to the FieldSet instance.
 * @param {Rule} rule Rule object instance to be added
 * @return {FieldSet}              returns the fieldSet object for chainability
 */
FieldSet.prototype.addRule = function(rule) {
    this.rulesMap[rule.name]=rule;
    this.rules.push(rule);
    return this;
};

/**
 * FieldSet.prototype.getRule retrieves a Rule object by its id or its index
 * @param  {Object} key   Object key is either String or an Integer.
 * @return {Rule}         returns the retrieved rule object or null,
 *                        if the object cannot be retrieved.
 */
FieldSet.prototype.getRule = function(key) {
    if(key!==null && typeof(key)===String && isNaN(key)) {
        return this.rulesMap[key];
    } else if(typeof(key)===Number && key<this.rules.length && key>=this.rules.length) {
        return this.rules[key];
    } else {
        return null;
    }
};

/**
 * FieldSet.prototype.deleteRule removes a Rule object from the given Form instance
 * @param  {Object} Object key is either String or an Integer.
 * @return {Form}   returns the fieldSet object for chainability
 */
FieldSet.prototype.deleteRule = function(key) {
    if(key!==null && typeof(key)===String && isNaN(key)) {
        var item = null;
        this.rules.each(function(obj, index){
            if(value.id==key) {
                this.rules.remove(index);
            }
        });
        delete this.rulesMap[key];
    } else if(typeof(key)===Number && key<this.rules.length && key>=this.rules.length) {
        var prop = this.rules[key].id;
        this.rules.remove(key);
        delete this.rulesMap[prop];
    }
    return this;
};

/**
 * Field.prototype.addRule adds a rule object to the Field instance.
 * @param {Rule} rule Rule object instance to be added
 * @return {Field}   returns the field object for chainability
 */
Field.prototype.addRule = function(rule) {
    this.rulesMap[rule.name]=rule;
    this.rules.push(rule);
};

/**
 * Field.prototype.getRule retrieves a Rule object by its id or its index
 * @param  {Object} key   Object key is either String or an Integer.
 * @return {Rule}         returns the retrieved rule object or null,
 *                        if the object cannot be retrieved.
 */
Field.prototype.getRule = function(key) {
    if(key!==null && typeof(key)===String && isNaN(key)) {
        return this.rulesMap[key];
    } else if(typeof(key)===Number && key<this.rules.length && key>=this.rules.length) {
        return this.rules[key];
    } else {
        return null;
    }
};

/**
 * Field.prototype.deleteRule removes a Rule object from the given Field instance
 * @param  {Object} Object key is either String or an Integer.
 * @return {Field}   returns the field object for chainability
 */
Form.prototype.deleteRule = function(key) {
    if(key!==null && typeof(key)===String && isNaN(key)) {
        var item = null;
        this.rules.each(function(obj, index){
            if(value.id==key) {
                this.rules.remove(index);
            }
        });
        delete this.rulesMap[key];
    } else if(typeof(key)===Number && key<this.rules.length && key>=this.rules.length) {
        var prop = this.rules[key].id;
        this.rules.remove(key);
        delete this.rulesMap[prop];
    }
    return this;
};

/**
 * Form.prototype.validate Validates a form object.
 * @param  {boolean} deep   If deep is true, all elements (fieldSets and
 *                          fields are validated recursively too). otherwise only rules
 *                          directly added to the Form instance are vaidated.
 * @param  {boolean} lazy   If lazy is true, the validation stops at the first violation.
 * @return {boolean}        true if all validations succeed, otherwise false.
 */
Form.prototype.validate = function(deep, lazy) {
    var result = true, _lazy = lazy || false;
    for(var i=0;i<this.rules.length; i++) {
        result = result && this.rules[i].validate(null, this);
        if (_lazy && !result) return false;
    }
    if(deep===true) {
        for(var j=0;j<this.fieldSets.length;j++) {
            result = result && this.fieldSets[j].validate(null, this);
            if (_lazy && !result) return false;
        }
    }
    return result;
};



/**
 * FieldSet.prototype.validate Validates a fierldset object.
 * @param  {boolean} deep   If deep is true, all elements (incl. all
 *                          fields are validated recursively too). otherwise only rules
 *                          directly added to the FieldSet instance are vaidated.
 * @param  {boolean} lazy   If lazy is true, the validation stops at the first violation.
 * @return {boolean}        true if all validations succeed, otherwise false.
 */
FieldSet.prototype.validate = function(deep, lazy) {
    var result = true, _lazy = lazy || false;
    for(var i=0;i<this.rules.length; i++) {
        result = result && this.rules[i].validate(null, this);
        if (_lazy && !result) return false;
    }
    if(deep===true) {
        for(var j=0;j<this.fields.length;j++) {
            result = result && this.fields[j].validate(lazy);
            if (_lazy && !result) return false;
        }
    }
    return result;
};

/**
 * FieldSet.prototype.validate Validates a fierldset object.
 * @param  {boolean} deep   If deep is true, all elements (incl. all
 *                          fields are validated recursively too). otherwise only rules
 *                          directly added to the FieldSet instance are vaidated.
 * @param  {boolean} lazy   If lazy is true, the validation stops at the first violation.
 * @return {boolean}        true if all validations succeed, otherwise false.
 */
Field.prototype.validate = function(lazy) {
    var result = true, _lazy = lazy || false;
    for(var i=0;i<this.rules.length; i++) {
        result = result && this.rules[i].validate(this.value, this);
        if (_lazy && !result) return false;
    }
    return result;
};
