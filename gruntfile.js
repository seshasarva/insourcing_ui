module.exports = function ( grunt ) {
    grunt.loadNpmTasks( 'grunt-war' );

    var taskConfig = {
        war: {
            target: {
                options: {
                    war_verbose: true,
                    war_dist_folder: 'warFile',           // Folder path seperator added at runtime. 
                    war_name: 'hrbc',            // .war will be appended if omitted 
                    webxml_welcome: 'index.html',
                    webxml_display_name: 'hrbc'
                },
                files: [
                    {
                        expand: true,
                        cwd: 'dist',
                        src: ['**'],
                        dest: ''
                    }
                ]
            }
        }
    };

    grunt.initConfig( taskConfig );
};