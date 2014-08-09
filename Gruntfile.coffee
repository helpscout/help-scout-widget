module.exports = (grunt) ->
    grunt.registerTask 'build', ['coffee', 'stylus', 'requirejs']
    grunt.registerTask 'default', 'build'

    grunt.initConfig
        coffee:
            compile:
                bare: true
                expand: true
                flatten: true
                src: './src/**/*.coffee'
                dest: './build'
                ext: '.js'

        stylus:
            compile:
                expand: false
                src: './src/**/*.styl'
                dest: './helpscout.css'

        requirejs:
            options:
                baseUrl: './build'
                include: 'main'
                optimize: 'none'
                wrap:
                    startFile: './lib/start.frag',
                    endFile: './lib/end.frag'

            standalone:
                options:
                    name: '../almond'
                    out: './helpscout.js'

            amd:
                options:
                    out: './helpscout-amd.js'

        watch:
            coffee:
                files: '<%= coffee.compile.src %>'
                tasks: ['coffee', 'requirejs']
            stylus:
                files: '<%= stylus.compile.src %>'
                tasks: ['stylus']


    grunt.loadNpmTasks 'grunt-contrib-coffee'
    grunt.loadNpmTasks 'grunt-contrib-stylus'
    grunt.loadNpmTasks 'grunt-contrib-requirejs'
    grunt.loadNpmTasks 'grunt-contrib-watch'
