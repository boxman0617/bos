/**
 * app.js
 *
 * This object controls the basic aspects of
 * all pages.
 *
 * @author Alan Tirado
 */
'use strict';
/* global $ */

var App = {
  'dev': false,
  'test': false,

  '_loadLength': 0,
  '_loaded': 0,
  '_loading': false,
  '_io': null,
  '_next': null,

  '_smallDevice': false,
	'_smallDeviceWidth': 768,

  'init': function(jDepend, io) {
    this.IECompat();

  	if($(document).width() <= this._smallDeviceWidth) {
			this._smallDevice = true;
		}
    this._io = io;

    this.runjDepend(jDepend);
  },

  'IECompat': function() {
    if(!Array.prototype.indexOf)
    {
      Array.prototype.indexOf = function(elt /*, from*/)
      {
        var len = this.length >>> 0;

        var from = Number(arguments[1]) || 0;
        from = (from < 0)
             ? Math.ceil(from)
             : Math.floor(from);
        if(from < 0)
          from += len;

        for(; from < len; from++) {
          if(from in this &&
            this[from] === elt)
          return from;
        }
        return -1;
      };
    }

  },

  'createPageLoadingComponents': function() {
    var $load = $('<div id="pageload"></div>').append(
      $('<div class="pl-message">One moment please...</div>').append(
        $('<div class="pl-bar pl-bar1 nodisplay"><div style="width: 0%;"></div></div>'),
        $('<div class="pl-bar pl-bar2 nodisplay"><div style="width: 0%;"></div></div>'),
        $('<div class="pl-bar pl-bar3 nodisplay"><div style="width: 0%;"></div></div>')
      )
    );
    $('body').append($load);
  },

  'isSmallDevice': function() {
  	return this._smallDevice;
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