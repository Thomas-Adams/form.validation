;(function ( $ , window, document, undefined ) {

    //build up namespace
    if (!$.nostromo) {
        $.nostromo = {};
    }

    var pluginName = 'formValidation' ,base,
    defaults = {
        // returns after first validation rule violation,
        // otherwise validates all rules through
        'lazyValidation' : true,
        // validates each form element on the blur event, except
        // the whole form or group validations
        'validateOnBlur' : true,
        // Wether hidden typed elements are validated
        'validateHidden' : false,
        //callback function gets executed once the validation is done successfully
        'onValidateSuccessComplete' : null
    }, defaultErrorMessages = {
		
		'required' : 'The field is required and cannot be empty.',
		'pattern' : 'The field does not match the required pattern',
		'select' : 'You have to select at least one option.',
		'checked' : 'The field must checked.',
		'minmaxLength' : 'The field must be at least {0} and at most {1} characters long.',
		'minmax' : 'The value must be at least {0} and aat most {1}.',
		'email' : 'The field must be a valid email.',
		'datetime' : 'THe field must be a valid date/time.',
		'number' : 'The field must be a valid number.',
		'equalsTo' : 'The field must be equal to `{0}`.',
		'dependsOn' : 'The field deponds on the following fields : `{0}`.',
		'steps': 'The field does not match the required steps value of {0}.'
	};

	var getDefaultErrorMessages = function(rule, params) {
		var s = defaultErrorMessages[rule];
		if(params && params.length) {
			for(var i=0; i<params.length; i++) {
				s = s.replace('{' + i + '}',params[i]);
			}
		}
		return s;
	};

    //validation functions

    var validateNotBlank = function (value) {
        if (value==null || typeof(value)=='undefined') return false;
        return jQuery.trim(value)!=='';
    };

    var validateEmail = function ( value ) {
        var ATOM = "[a-z0-9!#$%&'*+/=?^_`{|}~-]";
        var DOMAIN = "(" + ATOM + "+(\\." + ATOM + "+)*";
        var IP_DOMAIN = "\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\]";
        var reg = new RegExp("^" + ATOM + "+(\\." + ATOM + "+)*@"+ DOMAIN+ "|"+ IP_DOMAIN+")$");

        if (value ==null || typeof(value)=='undefined' || value=='') {
            return true;
        } else {
            return reg.test(value);
        }
    };


    var validateLength = function (value, minLength, maxLength){
        if (value ==null || typeof(value)=='undefined' || value=='') {
            return true;
        }else{
            if (typeof(value)=="string") {
                var l = value.length;
                return (l>=minLength && l <=maxLength);
            } else {
                if (jQuery.isArray(value)==0) {
                    var l = value.length;
                    return (l>=minLength && l <=maxLength);
                } else {
                    throw 'Illegal argument, only strings and arrays are supported!';
                }
            }
        }
        return false;
    };


    var validatePattern = function (value,pattern, modifiers) {

        if (value ==null || typeof(value)=='undefined' || value=='') {
            return true;
        } else {
            var reg = modifiers?new RegExp(pattern, modifiers):new RegExp(pattern);
            return reg.test(value);
        }
    };


    var validateRange = function (value, min, max) {
        if (value ===null || typeof(value)==='undefined' ) return true;
        var n = parseFloat(value);
        return (n>=min && n<=max);
    };

    var validateSelect = function (value, elem, min, max) {
        if(!elem) {
            if (value==='-1' || value==='0') {
                return false;
            }
            return true;
        } else {
            var multiple = elem.getAttribute('multiple') ? true:false, selectedCount=0;
            for ( var i = 0, len = elem.options.length; i < len; i++ ) {
                if(elem.options[i].selected === true || elem.options[i].selected==='selected') {
                    selectedCount++;
                }
            }
            var minValue = min ? min : 0;
            var maxValue = max ? max : Number.MAX_VALUE;
            if((selectedCount>=min && selectedCount<=max && multiple===true)
                ||( multiple===false && selectedCount===1)){
                return true;
            }
            return false;
        }
    };

    /**
     * This function checks if within the denoted group at least <code>data-validation-group-min</code>
     * are not empty resp. blank (includes checked, selected attributes as well) and at most
     * <code>data-validation-group-max</code> elements are filled out, selected or checked.
     * A validation group name is denoted with the <code>data-validation-group</code>
     * attribute. The groupname must be unique, so far only one validation group per
     * HTML form tag (input, textarea, select) is allowed.
     * Along with the group name the attributes <code>data-validation-group-min</code>
     * and <code>data-validation-group-max</code> should be added as well. In case that one
     * these attributes is missing either Number.MIN_VALU or Number.MAX_VALUE serves as
     * corresponding default.
     * Note that <code>data-validation-group-max</code> and <code>data-validation-group-min</code>
     * should be added to each form element beloging to that specific group and they should also be
     * of the same value each time.
     * The function returns a
     * //TODO: Example code
     */
    var validateGroup = function() {

        //a map, resp associative array of all groups along with their elements
        var groupMap = {},
        //the group names as key of the map resp. associative array
        keys = [],
        //The minimum required elements
        minimums = [],
        //The maximum required elements
        maximums = [];

        //Filter all form elements, excluding those which are explicitly excluded
        //and initialize the groupMap, keys, minimums and maximums variables
        var elements = $('input, textarea, select').filter(function(index, elem){
            var group = elem.getAttribute('data-validation-group'),
                excluded = elem.getAttribute('data-validation-excluded') ? true: false;

            if (group!==null && group!=="" && typeof(group)!==undefined && excluded==false) {

                if(!groupMap[group]) {
                    var ga = [];
                    ga.push(elem);
                    groupMap[group] = ga;
                    keys.push(group);
                    var min =  elem.getAttribute('data-validation-group-min');
                    var minValue = isNaN(min) ? Number.MIN_VALUE : parseInt(min);
                    minimums.push(minValue);

                    var max =  elem.getAttribute('data-validation-group-max');
                    var maxValue = isNaN(max) ? Number.MAX_VALUE : parseInt(max);
                    maximums.push(minValue);

                } else {
                    //add element to the corresponding group
                    var ga = groupMap[group];
                    ga.push(elem);
                    groupMap[group] = ga;
                }
                return true;
            }
            return false;
        });
        var validGroups = {};
        $(keys).map(function(index, key) {
            var elems = groupMap[key], minimum = minimums[index], maximum = maximums[index];

            var validElements = $(elems).filter(function(index, elem) {
                return validateNotBlank(elem) || (elem.getAttribute('checked') ? true : false);
            });
            var s = validElements.size();
            if (s>=minimum && s<=maximum) {
                validGroups[keys] = true;
            } else {
                validGroups[keys] = false;
            }
        });
        return validGroups;
    };
    /**
     * Validates a single form element. Following attributes are included for the form validation:
     *
     * Validations attributes
     * <table>
     *
     * </table>
     */
    var validateElement = function( elem, options){
        var $elem = $(elem), validation=true;
            tagName = elem.tagName.toUpperCase(),
            elemName= elem.getAttribute('name'),
            isRequired = elem.getAttribute('required') ? true : false,
            type = tagName ==='INPUT' ? elem.getAttribute('type').toLowerCase() : tagName.toLowerCase(),
            isButton = type=='submit' || type=='button' || type=='image' ? true : false,
            pattern = elem.getAttribute('pattern'),
            modifiers = elem.getAttribute('data-validation-modifiers'),
            readOnly = elem.getAttribute('readonly') ? true : false,
            hidden = elem.getAttribute('hidden') ? true : false,
            checked = elem.getAttribute('checked') ? true : false,
            maxlength = elem.getAttribute('maxlength'),
            maxlengthValue = isNaN(maxlength)? INTEGER_MAX : parseInt(maxlength,10),
            minlength = elem.getAttribute('data-validation-minlength'),
            minlengthValue = isNaN(minlength)? -1 : parseInt(minlength,10),
            min = elem.getAttribute('min'),
            minValue = isNaN(min) ? Number.MIN_VALUE : parseFloat(min),
            max = elem.getAttribute('max'),
            maxValue = isNaN(max) ? Number.MAX_VALUE : parseFloat(max),
            step = elem.getAttribute('step'),
            stepValue = isNaN(max) ? "any" : parseFloat(step),
            list = elem.getAttribute('list'),
            format = elem.getAttribute('data-validation-format'),
            value = $elem.val(),
            equalsTo = elem.getAttribute('data-validation-equals-to'),
            dependsOn = elem.getAttribute('data-validation-depends-on'),
            dependsOnElements = dependsOn ? dependsOn.replace(/\\s/,'').split(',') : [];
            excluded = elem.getAttribute('data-validation-excluded') ? true: false,
            customFunction = elem.getAttribute('data-validation-custom'),
            customFunctionArguments = elem.getAttribute('data-validation-custom-args') ? elem.getAttribute('data-validation-custom-args').split(',') : null,
            remoteAjaxUrl = elem.getAttribute('data-validation-remote-url'),
            remoteAjaxArgs = elem.getAttribute('data-validation-remote-args'),
            remoteAjaxType = elem.getAttribute('data-validation-remote-type'),
            valid = true, notEmpty = validateNotBlank(value),
            requiredErrorMessage = elem.getAttribute('data-required-msg') || defaultErrorMessages['required'],
            patternErrorMessage = elem.getAttribute('data-pattern-msg') || defaultErrorMessages['pattern'],
            selectErrorMessage = elem.getAttribute('data-select-msg') || defaultErrorMessages['select'],
            checkedErrorMessage = elem.getAttribute('data-checked-msg') || defaultErrorMessages['checked'],
            emailErrorMessage = elem.getAttribute('data-email-msg') || defaultErrorMessages['email'],
            minmaxLengthErrorMessage = elem.getAttribute('data-minmaxlength-msg') || getDefaultErrorMessages('minmaxLength', [minlengthValue, maxlengthValue]),
            datetimeErrorMessage = elem.getAttribute('data-datetime-msg') || defaultErrorMessages['datetime'],
            numberErrorMessage = elem.getAttribute('data-number-msg') || defaultErrorMessages['number'],
            minmaxErrorMessage = elem.getAttribute('data-minmax-msg') || getDefaultErrorMessages('minmax', [minValue, maxValue]),
            equalsToErrorMessage = elem.getAttribute('data-equalsTo-msg') || getDefaultErrorMessages('equalsTo', [equalsTo]),
            dependsOnErrorMessage = elem.getAttribute('data-depends-on-msg') || getDefaultErrorMessages('dependsOn', [dependsOn]),
            stepsErrorMessage = elem.getAttribute('data-steps-msg') || getDefaultErrorMessages('steps', [stepValue]),
            customErrorMessage = elem.getAttribute('data-custom-msg'),
            remoteErrorMessage = elem.getAttribute('data-remote-msg'),
            errors = { 'valid' : true, 'name': elemName,  messages: [], rules : []};
            
            
            
            
            

        //either the field is not excluded and hidden and hidden fields are to be
        //validated or the field is not ecluded nor hidden nor is it a button
        if ((!excluded && hidden && options.validateHidden) || (!excluded  && !hidden && !isButton)) {

            //validate a custom function
            if(customFunction){
                //TODO: adapt the context, window to this or self or base.
                if( customFunctionArguments) {
                    valid = window[customFunction](value, customFunctionArguments);
                } else {
                    valid = window[customFunction](value);
                }
            }            
            errors.valid=errors.valid && valid;			
            if(valid===false) {
				errors.messages.push(customErrorMessage);							
			}
			validation=validation && valid;
            if(validation===false && this.lazyValidation) return errors;
            // validate required
            valid=true;
            if(isRequired) {
                valid = notEmpty;
            }
            errors.valid=errors.valid && valid;			
            if(valid===false) {
				errors.messages.push(requiredErrorMessage);							
			}
            validation=validation && valid;
            if(validation===false && this.lazyValidation) return errors;
            //validate select
            valid=true;
            if(notEmpty && tagName === 'SELECT') {
                valid = validateSelect(value);
            }
            errors.valid=errors.valid && valid;			
            if(valid===false) {
				errors.messages.push(selectErrorMessage);							
			}
			
            validation=validation && valid;
            if(validation===false && this.lazyValidation) return errors;
            //validate checkbox
            valid=true;
            if(type=='checkbox') {
                valid = checked;
            }
            errors.valid=errors.valid && valid;			
            if(valid===false) {
				errors.messages.push(checkedErrorMessage);							
			}
            validation=validation && valid;
            if(validation===false && this.lazyValidation) return errors;
            //validate email
            valid=true;
            if(notEmpty && type === 'email') {
                valid = validateEmail(value);
            }
            errors.valid=errors.valid && valid;			
            if(valid===false) {
				errors.messages.push(emailErrorMessage);							
			}
            validation=validation && valid;
            if(validation===false && this.lazyValidation) return errors;
            //validate minlength and maxlength
            valid=true;
            if(notEmpty && (!isNaN(minlengthValue) || !isNaN(maxlengthValue))) {
                valid = validateLength(value,minlengthValue ,maxlengthValue);
            }
            errors.valid=errors.valid && valid;			
            if(valid===false) {
				errors.messages.push(minmaxLengthErrorMessage);							
			}
            
            validation=validation && valid;
            if(validation===false && this.lazyValidation) return errors;
            //validate pattern
            valid=true;
            if(notEmpty && pattern) {
                valid = validatePattern(value, pattern, modifiers);
            }
            errors.valid=errors.valid && valid;			
            if(valid===false) {
				errors.messages.push(patternErrorMessage);							
			}            
            validation=validation && valid;
            if(validation===false && this.lazyValidation) return errors;
            //validate date, dateime, datetime-local or time
            valid=true;
            if(notEmpty && (type=='date' || type=='datetime' || type=='datetime-local' || type=='time')) {
                if(format) {
                    valid = moment(value,format).isValid();
                } else {
                    valid = moment(value).isValid();
                }
            }
            errors.valid=errors.valid && valid;			
            if(valid===false) {
				errors.messages.push(datetimeErrorMessage);							
			}            
            validation=validation && valid;
            if(validation===false && this.lazyValidation) return errors;
            //validate number
            valid=true;
            if(notEmpty && (type=='number')) {
                valid = !isNaN(parseFloat(value));
            }
            errors.valid=errors.valid && valid;			
            if(valid===false) {
				errors.messages.push(numberErrorMessage);							
			}
            validation=validation && valid;
            if(validation===false && this.lazyValidation) return errors;
            //validate min and max
            valid=true;
            if(notEmpty && type=='number' && (min || max) ) {
                valid = validateRange(value, minValue, maxValue);
            }
            errors.valid=errors.valid && valid;			
            if(valid===false) {
				errors.messages.push(minmaxErrorMessage);							
			}
			
            validation=validation && valid;
            if(validation===false && this.lazyValidation) return errors;
            //validate data-equals
            valid=true;
            if(equalsTo) {
                valid = (value == $(form).find(equalsTo).val());
            }
            errors.valid=errors.valid && valid;			
            if(valid===false) {
				errors.messages.push(equalsToErrorMessage);							
			}
            validation=validation && valid;
            if(validation===false && this.lazyValidation) return errors;
            //validate steps
            valid=true;
            if(!isNaN(stepValue)) {
                valid = (value % stepValue == 0);
            }
            errors.valid=errors.valid && valid;			
            if(valid===false) {
				errors.messages.push(stepsErrorMessage);							
			}
            validation=validation && valid;
            if(validation===false && this.lazyValidation) return errors;
			//validate depends on
			valid=true;
            if(dependsOnElements.length>0) {
                var v = true;
                for(var i=0;i<dependsOnElements.length;i++) {
                    v = v && ( validateNotBlank($(dependsOnElements[i]).val())
                        || $(dependsOnElements[i]).prop('checked')==true
                        || validateSelect($(dependsOnElements[i]).val()));
                }
                valid = v;
            }
            errors.valid=errors.valid && valid;			
            if(valid===false) {
				errors.messages.push(dependsOnErrorMessage);							
			}            
            validation=validation && valid;
            if(validation===false && this.lazyValidation) return errors;
        }
        return errors;
    };
    
    
    var hideErrors = function(element, options, errors) {
		alert('hide errors of ' + element.getAttribute('name'));
		var $el = $(element);
		$el.closest('div.form-group').removeClass('has-error');
		$el.closest('div.form-group').find('ul.error').empty();
	};
	
	
	var showErrors = function(element, options, errors) {
		alert('show errors of ' + element.getAttribute('name'));
		var $el = $(element);
		$el.closest('div.form-group').addClass('has-error');
		$el.closest('div.form-group').find('ul.error').empty();
		for (var i=0;i<errors.messages.length;i++) {
			$el.closest('div.form-group').find('ul.error').append('<li>' + errors.messages[i] +'</li>');
		}
	};

    var makeDirty = function(element, options) {

        $(elelemt).bind('blur', function(event){
            $(this).data('dirty',true);
        });
    };

    var isDirty = function(element) {
        var dirty = $(element).data('dirty')===true ?  true : false;
        return dirty;
    };

    var formIsDirty = function(elements, option) {
        //TODO: add logic for validation groups
        var dirty = true;
        $(elements).each(function(index, elem){
            if(elem.getAttribute('data-validation-excluded')) {
                //do nothing
                $(elem).removeData('dirty');
            } else {
                var d = isDirty(elem);
                dirty = dirty && d;
            }
        });
    };



    function Plugin( element, options ) {
        this.element = element;
        base = this;
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        base = this;

        // Access to jQuery and DOM versions of element
        base.$el = $(element);
        base.el = element;


        // jQuery has an extend method that merges the
        // contents of two or more objects, storing the
        // result in the first object. The first object
        // is generally empty because we don't want to alter
        // the default options for future instances of the plugin
        this.options = $.extend( {}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    };

    Plugin.prototype = {
		
		elements : [],
		
		errors : {},

        init : function(element, options ) {
			var self = this;
			if(this.options.validateOnBlur===true){	
				var errors = {};				
				$(':input',element).each(function(index, elem) {
					$(elem).bind('blur', function(evt) {							
						var result = validateElement(elem, options);
						if(result.valid===true) {
							hideErrors(elem, options,result);
							delete errors[elem.getAttribute('name')];							
						} else {
							showErrors(elem,options,result);
							self.errors[elem.getAttribute('name')]=result;
						}
					});
				});
			}			
        },
        
        validate : function(options) {
			var self = this;
			self.errors = {};
			$(':input', base.$el).each(function(index, elem) {
				var result = validateElement(elem, options);
				if(result.valid===true) {
					hideErrors(elem, options,result);
					delete self.errors[elem.getAttribute('name')];							
				} else {
					showErrors(elem,options,result);
					self.errors[elem.getAttribute('name')]=result;
				}
			});	
			
			if($.isEmptyObject(self.errors)) {
				if(self.options.onValidateSuccessComplete)
					self.options.onValidateSuccessComplete();
				else {
					base.$el.submit();
				}
			}					
		}
    };


    $.fn[pluginName] = function ( options ) {
        console.log(this);
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                new Plugin( this, options ));
            }
        });
    };

    console.log(this);
})(jQuery, window, document, undefined);
