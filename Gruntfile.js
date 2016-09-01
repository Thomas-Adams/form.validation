module.exports = function(grunt) {
    grunt.initConfig({
        clean: {
            build: ['./doc/jsdoc/*'],
            options: {
                force : true
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'public/_common/js/lib/forms.js']
        },
        jsdoc : {
            dist : {
                src: ['public/_common/js/lib/forms.js'],
                options: {
                    destination: 'doc/jsdoc',
                    template : 'node_modules/ink-docstrap/template',
                    configure : 'node_modules/ink-docstrap/template/jsdoc.conf.json'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsdoc');

    grunt.registerTask('default', ['clean:build','jshint', 'jsdoc']);
    grunt.registerTask('cleanit', ['clean:build']);
};
