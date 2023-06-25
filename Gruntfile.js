module.exports = function (grunt) {
  grunt.initConfig({
    clean: {
      dist: ["build"],
    },
    copy: {
      fonts: {
        expand: true,
        cwd: "node_modules/bootstrap-icons/font/fonts",
        src: ["*"],
        dest: "build/fonts",
      },
    },
    concat: {
      css: {
        options: {
          sourceMap: false,
        },
        src: [
          "src/css/bootstrap.css",
          "src/css/bootstrap-icon.css",
          "src/css/style.css",
          "src/css/custom.css",
        ],
        dest: "build/styles.css",
      },
      vendor: {
        src: [
          "node_modules/axios/dist/axios.js",
          "node_modules/dotenv/dist/main.js",
          "node_modules/bootstrap/dist/js/bootstrap.js",
        ],
        dest: "build/vendor.js",
      },
    },
    sass: {
      build: {
        options: {
          sourceMap: false, // Disable source maps for the sass task
        },
        files: [
          {
            src: "src/scss/style.scss",
            dest: "src/css/style.css",
          },
          {
            src: "node_modules/bootstrap/scss/bootstrap.scss",
            dest: "src/css/bootstrap.css",
          },
          {
            src: "./node_modules/bootstrap-icons/font/bootstrap-icons.scss",
            dest: "src/css/bootstrap-icon.css",
          },
        ],
      },
    },
    watch: {
      sass: {
        files: ["src/scss/**/*.scss"],
        tasks: ["sass"],
      },
      concat: {
        files: ["src/css/**/*.css"],
        tasks: ["concat"],
      },
      gruntfile: {
        files: ["Gruntfile.js"],
        tasks: ["concat", "sass"],
      },
    },
  });

  grunt.loadNpmTasks("grunt-contrib-sass");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-copy");

  grunt.registerTask("default", ["clean", "copy", "sass", "concat", "watch"]);
};
