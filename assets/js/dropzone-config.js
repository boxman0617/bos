/**
 * DropZoneConfig :: Requires dropsone.js before it
 * This will configure DropZone.js before running and
 * attach some event handlers
 */
var DropZoneConfig = {
	'_id': null,
	'_csrf': $('meta[name=token]').attr('content'),

	'init': function(id) {
		this._id = id;
		if($('#'+this._id).length > 0) {
			this.attachEvents();

			Dropzone.autoDiscover = false;

			var myDropzone = new Dropzone('#'+this._id);
		}
	},

	'attachEvents': function() {
		var ref = this;
		Dropzone.options[this._id] = {
			'acceptedFiles': 'text/plain',
			'maxFilesize': 2048,
			'init': function() {
				this.on('addedfile', function(file) {
					file.uid = chance.hash({length: 25});
					$('#'+ref._id).find('.dz-preview:last-child').attr('id', 'dz-' + file.uid);
				});

				this.on('sending', function(file, xhr, data) {
          data.append('_csrf', ref._csrf);
        });

				this.on('success', function(file, res) {
					ref.onSuccess(file, res);
				});
			}
		};
	},

	'onSuccess': function(file, res) {
		var $dz = $('#dz-'+file.uid);

		var $actions = $('<div class="dz-actions"></div>');
		var $start = $('<a class="btn btn-default">Start Load</a>');
		$actions.append($start);

		$dz.append($actions);
	}
};
