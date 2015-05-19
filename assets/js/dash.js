'use strict';
/* global $, App, chance, LoadIndicator, moment, Matrices */

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
	'_dash': null,

	'init': function(dash) {
		if($('#dash').length === 0) {
			return false;
		}

		this._dash = dash;
		var numOfFiles = chance.integer({'min': 1, 'max': 100});

		for(var i = 0; i < numOfFiles; i++) {
			this._files.push({
				'name': chance.string({'length': 20, 'pool': 'abcdefghijklmnopqrstuvwxyz_-'})+'.txt',
				'stage': this._stages[0],
				'status': this._normalStatuses[1],
				'arrival': new Date(),
				'validation': null,
				'validation_decision': null,
				'load': null,
				'load_decision': null,
				'reverted': null
			});
		}

		this.startTest();
	},

	'startTest': function() {
		this._dash.stageChange(this._files);
		var ref = this;
		setTimeout(function() {
			ref.loop();
		}, 2000);
	},

	'loop': function() {
		var ref = this;

		this.moveAlong();

		setTimeout(function() {
			ref.loop();
		}, chance.integer({'min': 5000, 'max': 10000}));
	},

	'moveAlong': function() {
		for(var i in this._files) {
			// if file is in arrival, prep, or load
			if(this._files[i].stage === this._stages[0] || this._files[i].stage === this._stages[1] || this._files[i].stage === this._stages[3]) {
				if(this._files[i].status === this._normalStatuses[1]) {
					this.setStatus(i, this._normalStatuses[chance.integer({'min': 0, 'max': 2})]);

					if(this._files[i].status === this._normalStatuses[2]) {
						this.setStage(i, this._stages[parseInt(this._stages.indexOf(this._files[i].stage)) + 1]);
					}
				}
			}
		}
	},

	'setStatus': function(file_i, to) {
		if(this._files[file_i].status !== to) {
			this._files[file_i].status = to;
			this._dash.statusChange(this._files[file_i].stage, this._files);
		}
	},

	'setStage': function(file_i, to) {
		if(this._files[file_i].stage !== to) {
			this._files[file_i].stage = to;
			if(to === this._stages[2]) { // validation stage reached, add time
				this._files[file_i].validation = new Date();
			}
			if(to === this._stages[3]) { // load stage reached, add time
				this._files[file_i].load = new Date();
			}
			// if file is in validation or load qa
			if(this._files[file_i].stage === this._stages[2] || this._files[file_i].stage === this._stages[4]) {
				this._files[file_i].status = this._qaStatuses[1];
			} else {  // if file is in arrival, prep, or load
				this._files[file_i].status = this._normalStatuses[1];
			}
			this._dash.stageChange(this._files);
		}
	}
};

function DashStage(stageClass, dash) {
	this._class = stageClass;
	this._dash = dash;
	this._complete = 0;

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

	this.changeAmount = function(status, amount) {
		var $stage = $('#dash').find('.'+this._class);

		if(status === 'third') {
			this._complete += amount;
			amount = this._complete;
		}

		if(this._class !== 'dash-stage-validation' && this._class !== 'dash-stage-load-qa') {
			if(status === 'second') {
				var $progress = $stage.find('.status-second').find('.progress-spinner');
				if(amount > 0) {
					if($progress.hasClass('hidden')) {
						$progress.removeClass('hidden');
					}
				} else {
					if(!$progress.hasClass('hidden')) {
						$progress.addClass('hidden');
					}
				}
			}
		} else {
			if(status === 'second') {
				var $alert = $stage.find('.status-second').find('.progress-alert');
				if(amount > 0) {
					if($alert.hasClass('hidden')) {
						$alert.removeClass('hidden');
					}
				} else {
					if(!$alert.hasClass('hidden')) {
						$alert.addClass('hidden');
					}
				}
			}
		}

		$stage.find('.status-'+status).find('.number').text(amount);
	};

	this.openFailed = function() {
		var ref = this;
		var l = new LoadIndicator('.'+this._class);

		// TEST
		setTimeout(function() {
			l.end();
			ref._dash.reloadTableWith(DashTest._files, ref._class.replace('dash-stage-', ''), 'failed');
		}, 2000);
	};

	this.openValidation = function() {
		var ref = this;
		var l = new LoadIndicator('.'+this._class);

		// TEST
		setTimeout(function() {
			l.end();
			ref._dash.reloadTableWith(DashTest._files, ref._class.replace('dash-stage-', ''), 'validation');
		}, 2000);
	};

	this.openInProgress = function() {
		var ref = this;
		var l = new LoadIndicator('.'+this._class);

		// TEST
		setTimeout(function() {
			l.end();
			ref._dash.reloadTableWith(DashTest._files, ref._class.replace('dash-stage-', ''), 'in_progress');
		}, 2000);
	};

	this.openCompleted = function() {
		var ref = this;
		var l = new LoadIndicator('.'+this._class);

		// TEST
		setTimeout(function() {
			l.end();
			ref._dash.reloadTableWith(DashTest._files, ref._class.replace('dash-stage-', ''), 'completed');
		}, 2000);
	};

	// ##
	this.init();
}

function DashTableRow(file) {
	this._file = file;
	this._format = 'MMM DD, YYYY h:mm:ss a';

	this.memberName = function() {
		return 'Member ' + this._file.name.replace('.txt', '');
	};

    this.fileName = function() {
    	return this._file.name;
    };

    this.fileArrival = function() {
    	return (this._file.arrival === null) ? ' - ' : moment(this._file.arrival).format(this._format);
    };

    this.validation = function() {
    	return (this._file.validation === null) ? ' - ' : moment(this._file.validation).format(this._format);
    };

    this.validationQA = function() {
    	var validationQA = ' - ';
		if(this._file.stage === Dash._stages[2]) {
			if(this._file.validation_decision === null) {
				validationQA = '<div style="text-align: center;"><a href="javascript:void(0);" title="Accept" data-file="'+this._file.name+'" data-action="accept" data-stage="validation" class="btn btn-default btn-xs action"><i class="fa fa-check"></i></a>';
				validationQA += '<a href="javascript:void(0);" title="Reject" data-file="'+this._file.name+'" data-action="reject" data-stage="validation" class="btn btn-default btn-xs action"><i class="fa fa-times"></i></a>';
				validationQA += '<a href="javascript:void(0);" title="View Matrices" data-file="'+this._file.name+'" data-action="matrices" data-stage="validation" class="btn btn-default btn-xs action"><i class="fa fa-bar-chart-o"></i></a></div>';
			}
		}

		if(this._file.validation_decision !== null && validationQA === ' - ') {
			validationQA = moment(this._file.validation_decision).format(this._format);
		}

		return validationQA;
    };

    this.load = function() {
    	return (this._file.load === null) ? ' - ' : moment(this._file.load).format(this._format);
    };

    this.loadQA = function() {
    	var loadQA = ' - ';
		if(this._file.stage === Dash._stages[4]) {
			if(this._file.load_decision === null) {
				loadQA = '<div style="text-align: center;"><a href="javascript:void(0);" title="Accept" data-file="'+this._file.name+'" data-action="accept" data-stage="loadQA" class="btn btn-default btn-xs action"><i class="fa fa-check"></i></a>';
				loadQA += '<a href="javascript:void(0);" title="Reject" data-file="'+this._file.name+'" data-action="reject" data-stage="loadQA" class="btn btn-default btn-xs action"><i class="fa fa-times"></i></a>';
				loadQA += '<a href="javascript:void(0);" title="View Matrices" data-file="'+this._file.name+'" data-action="matrices" data-stage="loadQA" class="btn btn-default btn-xs action"><i class="fa fa-bar-chart-o"></i></a></div>';
			}
		}

		if(this._file.load_decision !== null && loadQA === ' - ') {
			loadQA = moment(this._file.load_decision).format(this._format);
		}

		return loadQA;
    };

    this.reverted = function() {
		return (this._file.reverted === null) ? ' - ' : moment(this._file.reverted).format(this._format);
    };

}

var Dash = {
	'_started': false,
	'_stages': [
		'arrival', 'prep', 'validation', 'load', 'load-qa',
	],
	'_stageObjects': [],

	'init': function() {
		if($('#dash').length === 0) {
			return false;
		}

		this._started = true;

		$('#dash-datatable').dataTable({
			'language': {
            	'lengthMenu': '_MENU_'
        	},
        	columns: [
		        { data: 'memberName' },
		        { data: 'fileName' },
		        { data: 'fileArrival' },
		        { data: 'validation' },
		        { data: 'validationQA' },
		        { data: 'load' },
		        { data: 'loadQA' },
		        { data: 'reverted' }
		    ]
		});
		var $filter = $('.dataTables_wrapper').find('.dataTables_filter');
		$filter.parent().prev().addClass('col-md-10');
		$filter.parent().addClass('col-md-2');
		var $input = $filter.find('input[type="search"]').clone(true);
		$input.attr('placeholder', 'Search');
		$filter.find('label').remove();
		$filter.append(
			$('<div class="input-group"></div>').append(
				$('<span class="input-group-addon"><i class="fa fa-search"></i></span>'),
				$input
			)
		);
		var $page = $('.dataTables_wrapper').find('.dataTables_paginate');
		$page.find('.pagination').addClass('pagination-sm');

		$('#dash-datatable').wrap('<div class="table-responsive"></div>');

		var $info = $('.dataTables_wrapper').find('.dataTables_info');
		$info.parent().next().addClass('col-md-6').removeClass('col-xs-6');
		$info.parent().addClass('col-md-6').removeClass('col-xs-6');

		this.buildStages();
	},

	'buildStages': function() {
		for(var i in this._stages) {
			this._stageObjects.push(new DashStage('dash-stage-'+this._stages[i], this));
		}
	},

	'statusChange': function(stage, files) {
		var n = this._stages.indexOf(stage);

		var counts = {'first': 0, 'second': 0, 'third': 0};
		for(var i = 0; i < files.length; i++) {
			if(files[i].stage === stage) {
				switch(files[i].status) {
					case 'failed':
						counts.first++;
						break;
					case 'completed':
						counts.third++;
						break;
					case 'validation':
					case 'in_progress':
						counts.second++;
						break;
				}
			}
		}
		this._stageObjects[n].changeAmount('first', counts.first);
		this._stageObjects[n].changeAmount('second', counts.second);
		this._stageObjects[n].changeAmount('third', counts.third);
	},

	'stageChange': function(files) {
		for(var i in this._stages) {
			this.statusChange(this._stages[i], files);
		}
	},

	'reloadTableWith': function(files, stage, status) {
		var $table = $('.dash-table');
		var ref = this;

		// if table is visible, close it, fill it, then open it
		if($table.css('display') === 'block') {
			$table.slideUp(400, function() {
				ref._reloadTable(files, stage, status);
			});
		} else {
			this._reloadTable(files, stage, status);
		}
	},

	'_reloadTable': function(files, stage, status) {
		var ref = this;
		var $table = $('.dash-table');
		for(var s in this._stages) {
			if($table.hasClass(this._stages[s])) {
				$table.removeClass(this._stages[s]);
			}
		}

		$table.addClass(stage);

		var dataTable = $('#dash-datatable').DataTable();
		dataTable.rows().remove();

		for(var i in files) {
			if(files[i].stage === stage && files[i].status === status) {
				dataTable.row.add(new DashTableRow(files[i]));
			}
		}
		dataTable.draw();

		$table.find('table tbody').on('click', 'a.action', function() {
			ref._tableActions[$(this).attr('data-stage')+'_'+$(this).attr('data-action')]($(this).attr('data-file'), this);
		});

		$table.slideDown(function() {
			if(App.isSmallDevice()) {
				$(document).scrollTo($table, 800);
			}
		});
	},

	'_tableActions': {
		'validation_accept': function(fileName, elem) {
			var $cont = $(elem).parent();
			$cont.empty();
			$cont.append($('<span class="label label-success">Accepted</span>'));
			for(var i in DashTest._files) {
				if(DashTest._files[i].name === fileName) {
					DashTest.setStatus(i, DashTest._qaStatuses[2]);
					DashTest.setStage(i, Dash._stages[parseInt(Dash._stages.indexOf(DashTest._files[i].stage)) + 1]);
					DashTest._files[i].validation_decision = new Date();
					return true;
				}
			}
		},

		'validation_reject': function(fileName, elem) {
			var $cont = $(elem).parent();
			$cont.empty();
			$cont.append($('<span class="label label-danger">Rejected</span>'));
			for(var i in DashTest._files) {
				if(DashTest._files[i].name === fileName) {
					DashTest.setStatus(i, DashTest._qaStatuses[0]);
					DashTest._files[i].validation_decision = new Date();
					return true;
				}
			}
		},

		'validation_matrices': function(fileName, elem) {
			var $modal = $('#matrices-modal');
			$modal.find('.file-name').text(fileName);

			var m = new Matrices(this);
			m.elem = elem;
			m.fileName = fileName;
			m.stage = 'validation';
		},

		'loadQA_accept': function(fileName, elem) {
			var $cont = $(elem).parent();
			$cont.empty();
			$cont.append($('<span class="label label-success">Accepted</span>'));
			for(var i in DashTest._files) {
				if(DashTest._files[i].name === fileName) {
					DashTest.setStatus(i, DashTest._qaStatuses[2]);
					DashTest._files[i].load_decision = new Date();
					return true;
				}
			}
		},

		'loadQA_reject': function(fileName, elem) {
			var $cont = $(elem).parent();
			$cont.empty();
			$cont.append($('<span class="label label-danger">Rejected</span>'));
			for(var i in DashTest._files) {
				if(DashTest._files[i].name === fileName) {
					DashTest.setStatus(i, DashTest._qaStatuses[0]);
					DashTest._files[i].load_decision = new Date();
					DashTest._files[i].reverted = new Date();
					return true;
				}
			}
		},

		'loadQA_matrices': function(fileName, elem) {
			var $modal = $('#matrices-modal');
			$modal.find('.file-name').text(fileName);

			var m = new Matrices(this);
			m.elem = elem;
			m.fileName = fileName;
			m.stage = 'loadQA';
		},

		'acceptStage': function(m) {
			this[m.stage+'_accept'](m.fileName, m.elem);
		},

		'rejectStage': function(m) {
			this[m.stage+'_reject'](m.fileName, m.elem);
		}
	}

};
