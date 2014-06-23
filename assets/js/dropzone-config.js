/**
 * DropZoneConfig :: Requires dropsone.js before it
 * This will configure DropZone.js before running and
 * attach some event handlers
 *
 * dependsOn: ['dropzone.js', 'file.js']
 */
'use strict';
/* global $, chance, Dropzone, File */
/* exported DropZoneConfig */

var DropZoneConfig = {
	'_id': null,
	'_csrf': $('meta[name=token]').attr('content'),
	'_files': [],
	'_largeFile': 536870912,
	'_myDZ': null,

	'init': function(id) {
		this._id = id;
		if($('#'+this._id).length > 0) {
			this.attachEvents();

			Dropzone.autoDiscover = false;

			this._myDZ = new Dropzone('#'+this._id);
		}
	},

	'attachEvents': function() {
		var ref = this;
		Dropzone.options[this._id] = {
			'acceptedFiles': 'text/plain',
			'dictDefaultMessage': '<div class="dz-main-message">Drop files here to upload</div><div class="dz-secondary-message">(or click here)</div>',
			'maxFilesize': 2048,
			'init': function() {
				this.on('addedfile', function(file) {
					file.uid = chance.hash({length: 25});
					$('#'+ref._id).find('.dz-preview:last-child').attr('id', 'dz-' + file.uid);
				});

				this.on('sending', function(file, xhr, data) {
		          	data.append('_csrf', ref._csrf);
		        });

				this.on('success', function(file) {
					ref.onSuccess(file);
				});
			}
		};
	},

	'onSuccess': function(file) {
		new File(file);
	}
};
