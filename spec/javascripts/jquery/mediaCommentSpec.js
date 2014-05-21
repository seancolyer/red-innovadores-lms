(function() {

  require(['jquery', 'compiled/jquery/mediaComment'], function($) {
    var mockServerResponse,
      _this = this;
    module('mediaComment', {
      setup: function() {
        this.server = sinon.fakeServer.create();
        window.INST.kalturaSettings = "settings set";
        this.$video = $('<div id="video">');
        return $('#fixtures').append(this.$video);
      },
      teardown: function() {
        window.INST.kalturaSettings = null;
        this.server.restore();
        return this.$video.remove();
      }
    });
    mockServerResponse = function(server, id) {
      return server.respond('GET', "/media_objects/" + id + "/info", [
        200, {
          'Content-Type': 'application/json'
        }, JSON.stringify({
          "media_sources": [
            {
              "content_type": "flv",
              "url": "http://some_flash_url.com"
            }, {
              "content_type": "mp4",
              "url": "http://some_mp4_url.com"
            }
          ]
        })
      ]);
    };
    test("video player is displayed inline", function() {
      var id, video_tag_exists;
      id = 10;
      this.$video.mediaComment('show_inline', id);
      mockServerResponse(this.server, id);
      video_tag_exists = this.$video.find('video').length === 1;
      return ok(video_tag_exists, 'There should be a video tag');
    });
    return test("video player includes url sources provided by the server", function() {
      var id;
      id = 10;
      this.$video.mediaComment('show_inline', id);
      mockServerResponse(this.server, id);
      equal(this.$video.find('source[type=flv]').attr('src'), "http://some_flash_url.com", "Video contains the flash source");
      return equal(this.$video.find('source[type=mp4]').attr('src'), "http://some_mp4_url.com", "Video contains the mp4 source");
    });
  });

}).call(this);
