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
        'validateHidden' : false
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
     * should be added to each orm element beloging to that specific group and they should also be
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
        var $elem = $(elem),
            tagName = elem.tagName.toUpperCase(),
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
            valid = true, notEmpty = validateNotBlank(value);

        //either the field is not excluded and hidden and hidden fields are to be
        //validated or the field is not ecluded nor hidden nor is it a button
        if ((!excluded && hidden && options.validateHidden) || (!excluded  && !hidden && !isButton)) {

            //validate a custom function
            if(customFunction){
                //TODO: adapt the context, window to this or self or base.
                if( customFunctionArguments) {
                    valid = valid && window[customFunction](value, customFunctionArguments);
                } else {
                    valid = valid && window[customFunction](value);
                }
            }
            if(valid===false && this.lazyValidation) return valid;
            // validate required
            if(isRequired) {
                valid = valid && notEmpty;
            }
            if(valid===false && this.lazyValidation) return valid;
            //validate select
            if(notEmpty && tagName === 'SELECT') {
                valid = valid && validateSelect(value);
            }
            if(valid===false && this.lazyValidation) return valid;
            //validate checkbox
            if(type=='checkbox') {
                valid = valid && checked;
            }
            if(valid===false && this.lazyValidation) return valid;
            //validate email
            if(notEmpty && type === 'email') {
                valid = valid && validateEmail(value);
            }
            if(valid===false && this.lazyValidation) return valid;
            //validate minlength and maxlength
            if(notEmpty) {
                valid = valid && validateLength(value,minLengthValue ,maxlengthValue);
            }
            if(valid===false && this.lazyValidation) return valid;
            //validate pattern
            if(notEmpty && pattern) {
                valid = valid && validatePattern(value, pattern, modifiers);
            }
            if(valid===false && this.lazyValidation) return valid;
            //validate date, dateime, datetime-local or time
            if(notEmpty && (type=='date' || type=='datetime' || type=='datetime-local' || type=='time')) {
                if(format) {
                    valid = valid && moment(value,format).isValid();
                } else {
                    valid = valid && moment(value).isValid();
                }
            }
            if(valid===false && this.lazyValidation) return valid;
            //validate number
            if(notEmpty && (type=='number')) {
                valid = valid && !isNaN(parseFloat(value));
            }
            if(valid===false && this.lazyValidation) return valid;
            //validate min and max
            if(notEmpty && type=='number' && (min || max) ) {
                valid = valid && validateRange(value, minValue, maxValue);
            }
            if(valid===false && this.lazyValidation) return valid;
            //validate checkbox
            if(type=='checkbox') {
                valid = valid && checked;
            }
            if(valid===false && this.lazyValidation) return valid;
            //validate data-equals
            if(equalsTo) {
                valid = valid && (value == $(form).find(equalsTo).val());
            }
            if(valid===false && this.lazyValidation) return valid;
            //validate steps
            if(!isNaN(stepValue)) {
                valid = valid && (value % stepValue == 0);
            }
            if(valid===false && this.lazyValidation) return valid;

            if(dependsOnElements.length>0) {
                var v = true;
                for(var i=0;i<dependsOnElements.length;i++) {
                    v = v && ( validateNotBlank($(dependsOnElements[i]).val())
                        || $(dependsOnElements[i]).prop('checked')==true
                        || validateSelect($(dependsOnElements[i]).val());
                }
                valid = valid && v;
            }
            if(valid===false && this.lazyValidation) return valid;
        }
        return valid;
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

        init : function(element, options ) {

        }
    };






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