/**
 * file.js :: Single Uploaded file object
 *
 * This will add state to an uploaded file
 *
 * type: Object
 * exampleUsage: var singleFile = new File(file);
 * dependsOn: ['LoadIndicator']
 */
'use strict';
/* global $, LoadIndicator, FileTracking */
/* exported File */

function File(file) {
	this._file = file;

	this.init = function() {
		var ref = this;
		var $dz = $('#dz-'+this._file.uid);

		var $actions = $('<div class="dz-actions"></div>');

		var $start = $('<a class="btn btn-default">Start Load</a>');
		$start.on('click', function() { ref.startLoad(); });
		var $schedule = $('<a class="btn btn-default">Schedule Load</a>');
		$schedule.on('click', function() { ref.scheduleLoad(); });
		var $cancel = $('<a class="btn btn-info">Cancel</a>');
		$cancel.on('click', function() { ref.cancelLoad(); });
		$actions.append($start, $schedule, $cancel);

		$dz.append($actions);
	};

	this.startLoad = function() {
		var ref = this;
		var l = new LoadIndicator('#dz-'+this._file.uid+' .dz-actions');
		$.ajax({
		    'type': 'POST',
		    'url': '/file/start/load',
		    'data': {
		        '_csrf': $('meta[name=token]').attr('content'),
		        'file': this._file.name
		    },
		    'dataType': 'JSON',
		    'complete': function() {
		    	l.end();
		    },
		    'success': function(data) {
		    	if(data.status === 'OK') {
		    		new FileTracking(ref);
		    	}
		    }
		});
	};

	this.scheduleLoad = function() {

	};

	this.cancelLoad = function() {

	};

	this.removeActions = function() {
		var $dz = $('#dz-'+this._file.uid);
		$dz.find('.dz-actions').remove();
	};

	// ##
	this.init();
}
