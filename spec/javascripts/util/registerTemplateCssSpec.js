(function() {

  define(['jquery', 'compiled/util/registerTemplateCss'], function($, registerTemplateCss) {
    var templateId, testColor, testRule, testTemplateId;
    testColor = 'rgb(255, 0, 0)';
    testRule = "body {color:" + testColor + ";}";
    testTemplateId = templateId = 'test_template_id';
    module('registerTemplateCss');
    test('should render correctly', function() {
      registerTemplateCss(testTemplateId, testRule);
      return equal($('body').css('color'), testColor);
    });
    test('should append <style> node to bottom of <head>', function() {
      registerTemplateCss(testTemplateId, testRule);
      return equal($('head style:last').text(), "/* From: " + testTemplateId + " */\n" + testRule);
    });
    return test('should remove all styles when you call clear()', function() {
      registerTemplateCss(testTemplateId, testRule);
      registerTemplateCss.clear();
      equal($('head style:last').text(), '');
      return ok($('body').css('color') !== testColor);
    });
  });

}).call(this);
