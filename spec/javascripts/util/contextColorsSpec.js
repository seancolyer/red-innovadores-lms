(function() {

  define(['jquery', 'compiled/util/contextColors'], function($, contextColors) {
    var $fixtures;
    module('contextColors');
    $fixtures = $('#fixtures');
    /*
      ##
      # This creates a beautiful rainbow scatter plot.
      # Point is to see if the algorithm appears random.
      # Uncomment for the fun
      test 'manually sanity check', ->
        for i in [0..1000]
          d = $('<div/>')
          rgb = contextColors.codeToRGBs "course_#{i}"
          hue = contextColors.codeToHue "course_#{i}"
    
          d.css
            float: 'left'
            color: "rgb(#{rgb.text.join(',')})"
            background: "rgb(#{rgb.background.join(',')})"
            border: "solid 1px rgb(#{rgb.stroke.join(',')})"
            'font-size': 10
            margin: '1px'
            width: 5
            height: 5
            position: 'absolute'
            top: hue + 500
            left: i
    
          $fixtures.append d
    */

    test('codeToHue', function() {
      equal(contextColors.codeToHue('course_1'), 311);
      return equal(contextColors.codeToHue('course_2'), 239);
    });
    test('hueToRGBs', function() {
      return deepEqual(contextColors.hueToRGBs(311), {
        text: [102, 41, 91],
        stroke: [179, 54, 156],
        background: [246, 172, 232]
      });
    });
    test('codeToRGBs', function() {
      return deepEqual(contextColors.codeToRGBs('course_1'), {
        text: [102, 41, 91],
        stroke: [179, 54, 156],
        background: [246, 172, 232]
      });
    });
    return test('injectStyleSheet', function() {
      var $course1, $course2;
      contextColors.injectStyleSheet(['course_1', 'course_2']);
      $course1 = $('<div/>').addClass('contextCode-course_1').css({
        border: '1px solid'
      }).appendTo($fixtures).html("'sup");
      $course2 = $('<div/>').addClass('contextCode-course_2').css({
        border: '1px solid'
      }).appendTo($fixtures).html("'yo");
      equal($course1.css('color'), 'rgb(102, 41, 91)');
      equal($course1.css('background-color'), 'rgb(246, 172, 232)');
      equal($course2.css('color'), 'rgb(41, 42, 102)');
      return equal($course2.css('background-color'), 'rgb(172, 173, 246)');
    });
  });

}).call(this);
