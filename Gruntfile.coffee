module.exports = (grunt) ->
    grunt.registerTask 'build', ['coffee', 'requirejs']
    grunt.registerTask 'default', 'build'

    grunt.initConfig
        coffee:
            options:
                bare: true
            compile:
                expand: true
                flatten: true
                src: './src/*.coffee'
                dest: './build'
                ext: '.js'

        requirejs:
            options:
                baseUrl: './build'
                include: 'main'
                name: '../almond'

            compile:
                options:
                    optimize: 'none'
                    out: './helpscout.js'
                    wrap:
                        startFile: './lib/start.frag',
                        endFile: './lib/end.frag'
        watch:
            coffee:
                files: '<%= coffee.compile.src %>'
                tasks: ['coffee', 'requirejs']


    grunt.loadNpmTasks 'grunt-contrib-coffee'
    grunt.loadNpmTasks 'grunt-contrib-requirejs'
    grunt.loadNpmTasks 'grunt-contrib-watch'
