/**
 * Matrices.js :: 
 */
'use strict';
/* global $, LoadIndicator */
/* exported Matrices */

function Matrices(tracking) {
	this._modalId = '#matrices-modal';
	this._tracking = tracking;
	this._objects = [];

	this.elem = null;
	this.stage = null;
	this.fileName = null;

	this.init = function() {
		var $modal = $(this._modalId);
		var ref = this;
		
		$modal.find('.action-accept').on('click', function() {
			$(this).unbind('click');
			$modal.modal('hide');
			ref._tracking.acceptStage(ref);
		});

		$modal.find('.action-reject').on('click', function() {
			$(this).unbind('click');
			$modal.modal('hide');
			ref._tracking.rejectStage(ref);
		});

		$modal.modal();

		var l = new LoadIndicator(this._modalId+' .modal-body');
		$.ajax({
		    'type': 'GET',
		    'url': '/matrices/validation',
		    'dataType': 'JSON',
		    'complete': function() {
		    	l.end();
		    },
		    'success': function(data) {
		    	for(var )
		    }
		});
	};

	// ##
	this.init();
}