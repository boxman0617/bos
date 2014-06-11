/**
 * app.js
 *
 * This object controls the basic aspects of
 * all pages.
 *
 * @author Alan Tirado
 */

var App = {
  '_loadLength': 0,
  '_loaded': 0,
  '_loading': false,

  'init': function(jDepend) {

    this.startPageLoad();
    this.runjDepend(jDepend);
  },

  'runjDepend': function(jDepend) {
    this._loadLength = jDepend.length;
    for(var i in jDepend) {
      jDepend[i]();
      this._loaded++;
    }
    this.endPageLoad();
  },

  'startPageLoad': function() {
    var $pl = $('<div id="pageload"></div>');
    $pl.append($('<div class="pl-message">One moment please...</div>'));

    var $bars = $('<div class="pl-bars"></div>');
    var $bar1 = $('<div class="pl-bar pl-bar1 nodisplay"><div style="width: 0%;"></div></div>');
    var $bar2 = $('<div class="pl-bar pl-bar2 nodisplay"><div style="width: 0%;"></div></div>');
    var $bar3 = $('<div class="pl-bar pl-bar3 nodisplay"><div style="width: 0%;"></div></div>');

    $pl.append($bars);
    $bars.append($bar1, $bar2, $bar3);
    $('body').append($pl);

    this._loading = true;
    this.loading();
  },

  'loading': function() {
    if(this._loading) {
      var bars = [];
      for(var i = 1; i < 4; i++) {
        bars.push($('#pageload').find('.pl-bar'+i));
      }

      this.loadingBarAppear(bars, 0);
    }
  },

  'loadingBarAppear': function(bars, i) {
    var ref = this;
    bars[i].animate({
      'opacity': 1
    }, {
      'duration': 300,
      'complete': function() {
        bars[i].find('div').animate({
          'width': '100%'
        }, {
          'duration': 600,
          'complete': function() {
            i++;
            if(i < bars.length) {
              ref.loadingBarAppear(bars, i);
            } else {
              i--;
              ref.loadingBarDisappear(bars, i);
            }
          }
        });
      }
    });
  },

  'loadingBarDisappear': function(bars, i) {
    bars[i].animate({
      'opacity': 0
    }, {
      'duration': 500,
      'complete': function() {
        $(this).find('div').css({'width': '0%'});
      }
    });
    i--;
    if(i === -1) {
      i++;
      this.loadingBarAppear(bars, i);
    } else {
      this.loadingBarDisappear(bars, i);
    }
  },

  'endPageLoad': function() {
    this._loading = false;

    $('#pageload').animate({
      'opacity': 0
    }, {
      'duration': 1000,
      'complete': function() {
        $(this).remove();
      }
    });
  }
};