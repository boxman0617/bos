/**
 * LoadIndicator :: Keeps track of loading state of components
 *
 * This auto-starts the load screen
 *
 * example: var l = new LoadIndicator('#myComponent');
 * dependsOn: ['chance']
 */
'use strict';
/* global $, chance */
/* exported LoadIndicator */

function LoadIndicator(selector) {
  this._selector = selector;
  this._id = 'li-'+chance.hash({length: 25});
  this._loading = false;

  this.init = function() {
    var $li = $('<div id="'+this._id+'" class="loading-indicator"></div>');

    var $opcScreen = $('<div class="li-screen nodisplay"></div>');
    var $bars = $('<div class="li-bars"></div>');
    var $bar1 = $('<div class="li-bar li-bar1 nodisplay"><div style="width: 0%;"></div></div>');
    var $bar2 = $('<div class="li-bar li-bar2 nodisplay"><div style="width: 0%;"></div></div>');
    var $bar3 = $('<div class="li-bar li-bar3 nodisplay"><div style="width: 0%;"></div></div>');

    $li.append($opcScreen, $bars);
    $bars.append($bar1, $bar2, $bar3);

    $(this._selector).append($li);
    $opcScreen.animate({
      'opacity': 0.6
    });

    this._loading = true;
    this.loading();
  };

  this.loading = function() {
    if(this._loading) {
      var bars = [];
      for(var i = 1; i < 4; i++) {
        bars.push($('#'+this._id).find('.li-bar'+i));
      }

      this.loadingBarAppear(bars, 0);
    }
  };

  this.loadingBarAppear = function(bars, i) {
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
  };

  this.loadingBarDisappear = function(bars, i) {
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
  };

  this.end = function() {
    this._loading = false;

    $('#'+this._id).animate({
      'opacity': 0
    }, {
      'duration': 1000,
      'complete': function() {
        $(this).remove();
      }
    });
  };
  
  // ##
  this.init();
}