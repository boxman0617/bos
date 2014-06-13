/**
 * Matrices.js :: 
 */

function Matrices(tracking) {
	this._modalId = '#matrices-modal';
	this._tracking = tracking;

	this.init = function() {
		var $modal = $(this._modalId);
		var ref = this;
		
		$modal.find('.action-accept').on('click', function() {
			$modal.modal('hide');
			ref._tracking.acceptStage();
		});

		$modal.find('.action-reject').on('click', function() {
			$modal.modal('hide');
			ref._tracking.rejectStage();
		});

		$modal.modal();
	};

	// ##
	this.init();
};