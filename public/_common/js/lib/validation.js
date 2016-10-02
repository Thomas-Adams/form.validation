/**
 * NOTE : the validation.js requires jQuery.js
 * Following feature are used form jQuery:
 * 
 * jQuery.trim()
 * jQuery.isArray()
 * jQuery(selector).is(":checked")
 * 
 * Also the library is not yet complete, there are still things that could be added.
 * Feel free to do so.
 * 
 * 
 * Email validation further details see in org.hibernate.validator library.
 * @see org.hibernate.validator.constraints.impl.EmailValidator 
 */
function validateEmail( value ) {
	var ATOM = "[a-z0-9!#$%&'*+/=?^_`{|}~-]";
	var DOMAIN = "(" + ATOM + "+(\\." + ATOM + "+)*";
	var IP_DOMAIN = "\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\]";
	//var reg = new RegExp("^" + ATOM + "+(\\." + ATOM + "+)*@"+ DOMAIN+ "|"+ IP_DOMAIN+")$");
    var reg = /^[\w.-]+@([0-9a-z][\w-]+\.)+[a-z]{2,4}$/i;
	if (value ==null || typeof(value)=="undefined" || value=="") {
		return true;
	} else {
		return reg.test(value);  
	}
};

function validateNotBlank(value) {
	if (value==null || typeof(value)=="undefined") return false;
	return jQuery.trim(value)!=""; 
};


function validateNotNull(value) {
	if (value==null || typeof(value)=="undefined") return false;
	return true; 
};

function validateNull(value) {
	if (value==null || typeof(value)=="undefined") return true;
	return false; 
};


function validateDecimalMax(value, decimalMax) {
	if (value==null || typeof(value)=="undefined") return true;
	var v = parseInt(value,10);
	var d = parseInt(decimalMax,10);
	return v<=d;
};

function validateDigits(value) {
	var pattern = /^\d+$/g;
	if (value ==null || typeof(value)=="undefined" || value=="") {
		return true;
	} else {
		return pattern.test(value);  
	}
};

function validateFuture(value, datetype) {
	if (value ==null || typeof(value)=="undefined" || value=="") {
		return true;
	} else {
		var now = new Date();
		var n;
		if (datetype ==null || typeof(datetype)=="undefined" || datetype=="" || datetype=="short") {
			//default short
			n = convertISODate(value);
		} else {
			//long
			n = convertISODateTime(value);
		}
		return n>now;
	}
};

function validatePast(value, datetype) {
	if (value ==null || typeof(value)=="undefined" || value=="") {
		return true;
	} else {
		var now = new Date();
		var n;
		if (datetype ==null || typeof(datetype)=="undefined" || datetype=="" || datetype=="short") {
			//default short
			n = convertISODate(value);
		} else {
			//long
			n = convertISODateTime(value);
		}
		return n<now;
	}
};

function validateLength(value, minLength, maxLength){
	if (value ==null || typeof(value)=="undefined" || value=="") {
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
				throw "Illegal argument, only strings and arrays are supported!";
			}
		}
	}
	return false;
};


function validateMax(value, max){
	if (value ==null || typeof(value)=="undefined" || value=="") {
		return true;
	} else {
		var v = parseFloat(value);
		var m = parseFloat(max);
		return v<=m;
	}
};

function validateMin(value, min){
	if (value ==null || typeof(value)=="undefined" || value=="") {
		return true;
	} else {
		var v = parseFloat(value);
		var m = parseFloat(min);
		return v>=m;
	}
};

function validateNotBlank(value) {
	if (value ==null || typeof(value)=="undefined" || value=="") {
		return false;
	} else {
		var reg =/^\s+$/g;
		return !reg.test(value);
	}
};

function validateNotEmpty(value) {
	if (value ==null || typeof(value)=="undefined") {
		return true;
	}else{
		if (jQuery.isArray(value)==true){
			return value.length>0;
		} else {
			if (typeof(value)=="string") {
				return value.length>0;
			} else {
				throw "Illegal argument, only strings and arrays are supported!";
			}
		}
	}
};


function validatePattern(value,pattern, modifiers) {

	if (value ==null || typeof(value)=="undefined" || value=="") {
		return true;
	} else {
		var reg = modifiers?new RegExp(pattern, modifiers):new RegExp(pattern);
		return reg.test(value);
	}
};


function validateSize(value, min, max) {
	if (value ==null || typeof(value)=="undefined" ) return true;
	if (jQuery.isArray(value)==true || typeof(value)=="string" ) {
		return min<= value.length && value.length<=max;
	} else {
		throw "Illegal argument, only strings and arrays are supported!";
	}
}


function validateMinLength(value, min) {
	if (value ===null || typeof(value)==="undefined" || value==="" ) return true;
	if (jQuery.isArray(value)===true || typeof(value)==="string" ) {
		return min<= value.length;
	} else {
		throw "Illegal argument, only strings and arrays are supported!";
	}
}

function validateMaxLength(value, max) {
	if (value ===null || typeof(value)==="undefined" || value==="") return true;
	if (jQuery.isArray(value)===true || typeof(value)==="string" ) {
		return value.length<=max;
	} else {
		throw "Illegal argument, only strings and arrays are supported!";
	}
}

function validateRange(value, min, max) {
	if (value ===null || typeof(value)==="undefined" ) return true;
	var n = parseFloat(value);
	return (n>=min && n<=max);
}

function validateSelect(value) {
	if (value ===null || typeof(value)==="undefined" ) return false;
	if (value==="" || value==="-1" || value==="0") {
		return false;
	}
	return true;
}


function validateCheckBox(objId) {
	return jQuery("#" + objId).prop('checked');
}

function validateCheckBoxValue(objId) {
	return jQuery("#" + objId).val()=="1";
}


function convertISODateTime(datestring) {
	
	var year = parseInt( datestring.substr(0,4),10);
	var month = parseInt(datestring.substr(5,2),10);
	var day = parseInt(datestring.substr(8,2),10);
	var hour = parseInt(datestring.substr(11,2),10);
	var minute = parseInt(datestring.substr(14,2),10);
	var second = parseInt(datestring.substr(17,2),10);
	
	return new Date(year,month-1,day,hour,minute,second,0);
	
}

function convertISODate(datestring) {
	
	var year = parseInt( datestring.substr(0,4),10);
	var month = parseInt(datestring.substr(5,2),10);
	var day = parseInt(datestring.substr(8,2),10);
	
	return new Date(year,month-1,day);
	
}
var adjustMonths = function (year) {
	var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];					
	// Adjust for leap years
	if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
	{
		monthLength[1] = 29;
	}
	return monthLength;		
};
		
		
var checkMonthAndYearRange = function(year, month){
	if(year < 1000 || year > 3000 || month == 0 || month > 12)
	{
		return false;
	}		    
	return true;
};

function validateISODateTime(value) {
	if (value ===null || typeof(value)==="undefined" ) return true;
	var reg=/^[\d]{4,4}-(0[1-9]|1[12])-(0[1-9]|1\d|2\d|3[01]) (0[0-9]|1[0-9]|2[0123])\:([12345][0-9])\:([12345][0-9])$/;
	if(!reg.test(value)) {
		return false;
	}
	
	// Parse the date parts to integers
	var parts		= value.split(" ");
	var timeParts	= parts[1].split(":");
	var seconds 	= parseInt(timeParts[2],10);
	var minutes 	= parseInt(timeParts[1],10);
	var hours 		= parseInt(timeParts[0],10);
	var dateParts   = parts[0].split("-");
	var day     	= parseInt(dateParts[2], 10);
	var month   	= parseInt(dateParts[1], 10);
	var year    	= parseInt(dateParts[0], 10);
	
	// Check the ranges of month and year
	if(!checkMonthAndYearRange(year, month)) {				    	
		return false;
	}
	//check the time parts
	if(hours>23 || hours <0 || seconds<0 || seconds>59 || minutes<0 || minutes>59) {
		return false;
	}
	var monthLength = adjustMonths(year);		
	return (day > 0 && day <= monthLength[month - 1]);
}

function valdiateISODate(value) {
	if (value ===null || typeof(value)==="undefined" ) return true;
	var reg = /^[\d]{4,4}-(0[1-9]|1[12])-(0[1-9]|1\d|2\d|3[01])$/;
	
	if(!reg.test(value)) {
		return false;
	}
	// Parse the date parts to integers
	var parts   = value.split("-");
	var day     = parseInt(parts[2], 10);
	var month   = parseInt(parts[1], 10);
	var year    = parseInt(parts[0], 10);
	// Check the ranges of month and year
	if(!checkMonthAndYearRange(year, month)) {
		return false;
	}					
	var monthLength = adjustMonths(year);		
	return (day > 0 && day <= monthLength[month - 1]);									
}

function validateMobile(value) {
	if (value ===null || typeof(value)==="undefined" ) return true;
	var reg = /^1[0-9]{10,10}$/g;
	if(!reg.test(value)) {
		return false;
	}
	return true;
}

function validateCheckboxGroup(name, minChecked, maxChecked) {
	var checkboxes = document.getElementsByName(name);
	var numChecked = 0;
	for(var i=0;i<checkboxes.length;i++) {
		if(checkboxes[i].checked===true) {
			numChecked++;
		}
	}
	if(numChecked>=minChecked && numChecked<=maxChecked) return true;
	return false;
}


function validateInteger(value) {
	if (value ===null || typeof(value)==="undefined" ) return true;
	var reg = /\d+/;
	return reg.test(value);

}


/**
 * validate each form element 
*/
var validateForm = function () {
		var result = true;
		$(":text, :password, :checkbox, select, textarea").each(function(index, elem) {			
			var $elem = $(this);
			var r = validateElement(elem, $elem, true);
			result = result && r;			 
		});

		return result;
};


var errorClass = errorClass;
var hasErrorClass = 'has-error';
var formGroupClass = '.form-group';


var validateElement = function(elem, $elem, returnResult) {
		var result = true;
		var $this = $elem;




		if((elem.tagName==="INPUT" && elem.type!=="checkbox") || elem.tagName==="TEXTAREA") {
			if(elem.required || $(elem).prop("required")===true) {
				if (validateNotBlank(elem.value)===false) {
				    $(elem).addClass(errorClass).parents(formGroupClass).addClass(hasErrorClass);

					result = false;
				} else {
					$(elem).removeClass(errorClass).parents(formGroupClass).removeClass(hasErrorClass);					
				}

			}		
		}
		
		
		if(elem.tagName==="INPUT" && elem.type==="checkbox") {
			if(elem.required || $(elem).prop("required")===true) {
				if (validateCheckBox(elem.id)===false) {
					$(elem).addClass(errorClass).parents(formGroupClass).addClass(hasErrorClass);					
					result = false;
				} else {
					$(elem).removeClass(errorClass).parents(formGroupClass).removeClass(hasErrorClass);					
				}
			}
		}
		
		
		if(elem.tagName==="SELECT") {
			if(elem.required || $(elem).prop("required")===true) {

				if (validateSelect(elem.value) ===false) {					
					$(elem).next().find("button").addClass("btn-danger");
					$(elem).parent().addClass("error");
					result = false;
				} else {											
					$(elem).next().find("button").removeClass("btn-danger");
					$(elem).parent().removeClass("error");
				}
			}
		}
		
		
		if((elem.type==="email" || elem.name==="email")) {
            if(result){
                if (validateEmail(elem.value)===false) {
                    $(elem).addClass(errorClass).parents(formGroupClass).addClass(hasErrorClass);
                    result = false;
                } else {
                    $(elem).removeClass(errorClass).parents(formGroupClass).removeClass(hasErrorClass);
                }
            }

		}
		
		
		if(((elem.pattern && elem.pattern!=="" && elem.type!=="email" && elem.name!=="email") 
			|| ($(elem).prop("pattern") && $(elem).prop("pattern")!=="" && elem.type!=="email" && elem.name!=="email"  ))) {	
			
			if(elem.required || $(elem).prop("required")===true) {		
				if (validatePattern(elem.value,elem.pattern)===false || validateNotBlank(elem.value)===false) {
					$(elem).addClass(errorClass).parents(formGroupClass).addClass(hasErrorClass);					
					result = false;
				} else {
					$(elem).removeClass(errorClass).parents(formGroupClass).removeClass(hasErrorClass);;					
				}
			} else {
				if (validatePattern(elem.value,elem.pattern)===false) {
					$(elem).addClass(errorClass).parents(formGroupClass).addClass(hasErrorClass);					
					result = false;
				} else {
					$(elem).removeClass(errorClass).parents(formGroupClass).removeClass(hasErrorClass);;					
				}
			}
		}
				
		if((elem.maxlength && parseInt(elem.maxlength,10)>0))  {
			if (validateLength(elem.value,0,elem.maxlength)===false) {
				$(elem).addClass(errorClass).parents(formGroupClass).addClass(hasErrorClass);					
				result = false;
			} else {
				$(elem).removeClass(errorClass).parents(formGroupClass).removeClass(hasErrorClass);;					
			}

		}
		if(returnResult) 
			return result;
};



var validateForm = function () {
	var result = true;
	$(":text, :password, :checkbox, select, textarea").each(function(index, elem) {			
		var $elem = $(this);
		var r = validateElement(elem, $elem, true);
		result = result && r;			 
	});
	return result;
};


var validateFormDiv = function(formDivId) {
	var result = true;
	$("#" + formDivId).find(":text, :password, :checkbox, select, textarea").each(function(index, elem) {

		var $elem = $(this);
		var r = validateElement(elem, $elem, true);
		result = result && r;			 
	});
	return result;
};









