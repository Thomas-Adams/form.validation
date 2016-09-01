var formApp = angular.module('formApp', []);






formApp.controller('FormController', function($scope){

    $scope.form ={};
    $scope.fields = null;
    $scope.fieldMap = null;
    $scope.field = {};
    $scope.selectedFieldtype = null;

    $scope.fieldTypes =[{
        name : 'Text (single line)',
        tagName : 'input',
        type : 'text'
    },{
        name : 'Text (multiple lines)',
        tagName : 'textarea',
        type : null,
    },{
        name : 'Password',
        tagName : 'input',
        type : 'password'
    },{
        name : 'Email',
        tagName : 'input',
        type : 'email'
    },{
        name : 'Options (1 out of several options)',
        tagName : 'input',
        type : 'radio'
    },{
        name : 'Checkbox',
        tagName : 'input',
        type : 'checkbox'
    },{
        name : 'Date',
        tagName : 'input',
        type : 'date'
    },{
        name : 'Date and time',
        tagName : 'input',
        type : 'datetime'
    }, {
        name : 'Local date and time',
        tagName : 'input',
        type : 'datetime-local'
    },{
        name : 'Time',
        tagName : 'input',
        type : 'time'
    },{
        name : 'Month',
        tagName : 'input',
        type : 'month'
    },{
        name : 'Number',
        tagName : 'input',
        type : 'number'
    },{
        name : 'Range',
        tagName : 'input',
        type : 'range',
    },{
        name : 'File',
        tagName : 'input',
        type : 'file'
    },{
        name : 'Selection (single)',
        tagName : 'select',
        type : null,
        multiple : false
    },{
        name : 'Selection(multiple)',
        tagName : 'select',
        type : null,
        multiple : true
    }, {
        name : 'Phone',
        tagName : 'input',
        type : 'tel'
    },{
        name : 'Search',
        tagName : 'input',
        type : 'search'
    }, {
        name : 'URL',
        tagName : 'input',
        type : 'url'
    }];



    $scope.addField = function() {
        if(!$scope.fields) {
            $scope.fields = [];
            $scope.fieldMap = {};
        }
        $scope.fields.push($scope.field);
        $scope.fieldMap[$scope.field.name] = $scope.field;
        $scope.field = {};
        $scope.selectedFieldtype = null;
        console.log(JSON.stringify($scope.fields));
    };

    $scope.reset = function() {
        $scope.field = {};
        $scope.selectedFieldtype = null;
    };

    $scope.changeType = function() {
        if($scope.selectedFieldtype)
            $scope.field.type = $scope.selectedFieldtype;
    };

    $scope.extractRules = function() {



    };
});
