var DashTest = {
	'_files': [],
	'_stages': [
		'arrival', 'prep', 'validation', 'load', 'load-qa'
	],
	'_normalStatuses': [
		'failed', 'in_progress', 'completed'
	],
	'_qaStatuses': [
		'failed', 'validation', 'completed'
	],

	'init': function() {
		var numOfFiles = chance.integer({'min': 1, 'max': 20});

		for(var i = 0; i < numOfFiles; i++) {
			this._files.push({
				'name': chance.string({'length': 20, 'pool': 'abcdefghijklmnopqrstuvwxyz_-'}),
				'stage': this._stages[0],
				'status': this._normalStatuses[1]
			});
		}

		this.startTest();
	},

	'startTest': function() {
		this.loop();
	},

	'loop': function() {

		var ref = this;
		setTimeout(function() {
			ref.loop();
		}, chance.integer({'min': 1000, 'max': 5000}));
	}
};

function DashStage(stageClass, dash) {
	this._class = stageClass;
	this._dash = dash;

	this.init = function() {
		var ref = this;
		var $stage = $('#dash').find('.'+this._class);

		$stage.find('.status-first').on('click', function() {
			ref.openFailed();
		});

		var secondAction = null;
		if(this._class === 'dash-stage-validation' || this._class === 'dash-stage-load-qa') {
			secondAction = function() {
				ref.openValidation();
			};
		} else {
			secondAction = function() {
				ref.openInProgress();
			};
		}
		$stage.find('.status-second').on('click', secondAction);

		$stage.find('.status-third').on('click', function() {
			ref.openCompleted();
		});
	};

	this.openFailed = function() {
		var ref = this;
		var l = new LoadIndicator(this._class);

		// TEST
		setTimeout(function() {
			l.end();
			ref._dash
		}, 2000);
	};

	this.openValidation = function() {

	};

	this.openInProgress = function() {

	};

	this.openCompleted = function() {

	};

	// ##
	this.init();
}

var Dash = {
	'_started': false,
	'_stages': [
		'dash-stage-arrival',
		'dash-stage-prep',
		'dash-stage-validation',
		'dash-stage-load',
		'dash-stage-load-qa',
	],
	'_stageObjects': [],

	'init': function() {
		if($('#dash').length === 0) {
			return false;
		}

		this._started = true;
		
		$('.datatable').dataTable();
		this.buildStages();

		// TEST
		DashTest.init();
	},

	'buildStages': function() {
		for(var i in this._stages) {
			this._stageObjects.push(new DashStage(this._stages[i], this));
		}
	}
};