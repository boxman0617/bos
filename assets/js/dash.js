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
		this._dash = dash;
		var numOfFiles = chance.integer({'min': 1, 'max': 100});

		for(var i = 0; i < numOfFiles; i++) {
			this._files.push({
				'name': chance.string({'length': 20, 'pool': 'abcdefghijklmnopqrstuvwxyz_-'})+'.txt',
				'stage': this._stages[0],
				'status': this._normalStatuses[1]
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
			if(this._files[i].stage === this._stages[0] || this._files[i].stage === this._stages[1] || this._files[i].stage === this._stages[1]) {
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
			"language": {
            	"lengthMenu": "_MENU_"
        	}
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
						counts.second++;;
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
		var $table = $('.dash-table');
		for(var s in this._stages) {
			if($table.hasClass(this._stages[i])) {
				$table.removeClass(this._stages[i]);
			}
		}

		$table.addClass(stage);

		var dataTable = $('#dash-datatable').DataTable();
		dataTable.rows().remove();

		for(var i in files) {
			if(files[i].stage === stage && files[i].status === status) {
				dataTable.row.add([
					'Member ' + files[i].name.replace('.txt', ''),
					files[i].name,
					'<a href="javascript:void(0);" class="btn btn-default">Test</a>',
					' - ',
					' - ',
					' - ',
					' - ',
					' - '
				]);
			}
		}
		dataTable.draw();

		$table.slideDown();
	}

};