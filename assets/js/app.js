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
  '_io': null,
  '_next': null,

  'init': function(jDepend, io) {
    this._io = io;

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

  'ready': function(next) {
    this._next = next;
  },

  'endPageLoad': function() {
    var ref = this;
    this._loading = false;

    $('#pageload').animate({
      'opacity': 0
    }, {
      'duration': 1000,
      'complete': function() {
        $(this).remove();
        if(ref._next !== null) {
          ref._next();
        }
      }
    });
  }
};

$(function() {
  App.startPageLoad();
});