/**
 * FileTracking.js ::
 */

function FileTracking(fileObject) {
	this._file = fileObject;
	this._modalId = '#trackorbackground-modal';
	this._trackingId = '#tracking-modal';
	this._stages = ['arrival', 'prep', 'validation', 'load', 'load-qa'];
	this._stage = 0;

	this._socket = null;

	this.init = function() {
		var ref = this;
		var $modal = $(this._modalId);
		$modal.find('.action-go').on('click', function() {
			ref.checkOptions();
		});
		$modal.find('.action-cancel').on('click', function() {
			ref.cancelLoad();
		});
		$modal.modal();
	};

	this.checkOptions = function() {
		var option = $(this._modalId).find('input[name=options]:checked').attr('id');
		this.cancelLoad();
		this[option]();
	};

	this.cancelLoad = function() {
		var $modal = $(this._modalId);
		$modal.find('.actions-go').unbind('click');
		$modal.find('.actions-cancel').unbind('click');
		$modal.modal('hide');
	};

	this.track = function() {
		var $track = $(this._trackingId);
		$track.find('.file-name').text(this._file._file.name);

		var $stage = this.getCurrentStageELM($track);
		$stage.addClass('active');
		$stage.addClass('running');

		var ref = this;
		this._socket = App._io.connect();
		this._socket.on('connect', function socketConnected() {
			console.log('Socket is working and connected!');
			ref._socket.on('message', function messageRecived(message) {
				if(message === 'success') {
					ref.stageSuccess();
				}
				else if(message === 'check') {
					ref.stageCheck();
				}
				else if(message === 'fail') {
					ref.stageFail();
				}
			});
		});

		this._socket.post('/file/start/tracking', {
			'file': this._file.name,
			'_csrf': $('meta[name=token]').attr("content")
		}, function(res) {
			console.log('Response: ', res);
		});

		// TESTING
		// var ref = this;
		// setTimeout(function() {
		// 	ref.stageSuccess();
		// 	setTimeout(function() {
		// 		ref.stageSuccess();
		// 		setTimeout(function() {
		// 			ref.stageCheck();
		// 		}, 2000);
		// 	}, 2000);
		// }, 2000);
		// /TESTING

		$track.modal({
			'backdrop': 'static',
			'keyboard': false
		});
	};

	this.getCurrentStageELM = function($file) {
		return $file.find('.file-stage-'+this._stages[this._stage]);
	};

	this.stageSuccess = function() {
		var $currStage = this.getCurrentStageELM($(this._trackingId));

		$currStage.removeClass('active');
		$currStage.removeClass('running');
		$currStage.addClass('success');
		this.nextStage();
	};

	this.stageFail = function() {
		var $currStage = this.getCurrentStageELM($(this._trackingId));

		$currStage.removeClass('active');
		$currStage.removeClass('running');
		$currStage.addClass('fail');
		this.endTracking();
	};

	this.stageCheck = function() {
		var $currStage = this.getCurrentStageELM($(this._trackingId));
		var ref = this;

		$currStage.removeClass('running');
		$currStage.addClass('check');
		var $actions = $currStage.find('.actions');
		$actions.find('.action-show').on('click', function() {
			new Matrices(ref);
		});
		$actions.find('.action-accept').on('click', function() {
			ref.acceptStage();
		});
		$actions.find('.action-reject').on('click', function() {
			ref.rejectStage();
		});
	};

	this.acceptStage = function() {
		var $currStage = this.getCurrentStageELM($(this._trackingId));

		$currStage.removeClass('check');
		$currStage.removeClass('active');
		$currStage.addClass('success');
		this.nextStage();

		this._socket.post('/file/accept/validation', {
			'file': this._file.name,
			'_csrf': $('meta[name=token]').attr("content")
		}, function(res) {
			console.log('Response: ', res);
		});

		// TESTING
		// var ref = this;
		// setTimeout(function() {
		// 	ref.stageSuccess();
		// 	setTimeout(function() {
		// 		ref.stageCheck();
		// 	}, 2000);
		// }, 2000);
		// /TESTING
	};

	this.rejectStage = function() {
		var $currStage = this.getCurrentStageELM($(this._trackingId));

		$currStage.removeClass('check');
		$currStage.addClass('fail');
		this.endTracking();
	};

	this.nextStage = function() {
		this._stage++;
		// if there is another stage
		if(this._stages.length > this._stage) {
			var $stage = this.getCurrentStageELM($(this._trackingId));
			$stage.addClass('active');
			$stage.addClass('running');
		} else { // if there is no more stages
			this.endTracking();
		}
	};

	this.endTracking = function() {
		var $footer = $(this._trackingId).find('.modal-footer');
		$footer.find('.action-cancel').css({
			'display': 'none'
		});
		var $done = $footer.find('.action-done');
		$done.css({
			'display': 'inline-block'
		});
		$done.on('click', function() {
			window.location = '/dash';
		});
	};

	this.background = function() {
		this._file.removeActions();
		this.cancelLoad();
	};

	// ##
	this.init();
}
