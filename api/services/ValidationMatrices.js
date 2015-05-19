exports.getMatrices = function() {
	var Chance = require('chance');
	var chance = new Chance();

	var items = chance.natural({'min': 1, 'max': 20});
	var acceptedItems = chance.natural({'min': 0, 'max': items});
	var errors = chance.natural({'min': 0, 'max': items});

	var data = {
		'REFORMATTER': {
			'Input': {
				'Records': items
			},
			'Accepted': {
				'Records': {
					'_number': acceptedItems,
					'Not Mapped to NextGen Codes': [
						{'Coded Fields': chance.natural({'min': 0, 'max': 30})},
						{'LOC LPO': chance.natural({'min': 0, 'max': 30})},
						{'PII EPMS': chance.natural({'min': 0, 'max': 30})},
						{'PII CTRY': chance.natural({'min': 0, 'max': 30})},
					]
				}
			}
		},
		'DE-DUP': {
			'Input': {
				'Records': items
			},
			'Accepted': {
				'Records': acceptedItems
			}
		},
		'VALIDATION': {
			'Input': {
				'_number': items,
				'Record Type': [
					{'Z': chance.natural({'min': 0, 'max': items})},
					{'A': chance.natural({'min': 0, 'max': items})},
					{'D': chance.natural({'min': 0, 'max': items})}
				],
				'Data Type': [],
				'Account': [
					{'Person Account Holders': chance.natural({'min': 0, 'max': items})},
					{'Recovery Report Data': chance.natural({'min': 0, 'max': items})}
				],
				'Account Type': [],
				'Account Status': [],
				'Payment Status': [],
				'Segment': [],
				'Borrower Inventory': [
					{'Accounts with 1 Borrower': chance.natural({'min': 0, 'max': items})}
				]
			},
			'Accepted': {
				'_number': items,
				'Recs Statistics': []
			},
			'Errors': {
				'Date Cross Field': {
					'_number': errors,
					'High Priority': [
						{'Account Open Date': errors}
					]
				}
			}
		}
	};

	var dataType1 = {};
	dataType1['DS ID '+chance.natural({'min': 1000, 'max': 2000})] = chance.natural({'min': 0, 'max': items});
	data.VALIDATION.Input['Data Type'].push(dataType1);
	data.VALIDATION.Input['Data Type'].push({'CCA': chance.natural({'min': 0, 'max': items})});
	
	var accountType = {};
	accountType[chance.character({'casing': 'upper', 'alpha': true})] = chance.natural({'min': 0, 'max': items});
	data.VALIDATION.Input['Account Type'].push(accountType);

	var accountStatus = {};
	accountStatus[chance.character({'casing': 'upper', 'alpha': true})] = chance.natural({'min': 0, 'max': items});
	data.VALIDATION.Input['Account Type'].push(accountStatus);

	var paymentStatus1 = {};
	paymentStatus1[chance.character({'casing': 'upper', 'alpha': true})] = chance.natural({'min': 0, 'max': items});
	var paymentStatus2 = {};
	paymentStatus2['Detail '+chance.natural({'min': 10, 'max': 99})] = chance.natural({'min': 0, 'max': items});
	data.VALIDATION.Input['Payment Status'].push(paymentStatus1);
	data.VALIDATION.Input['Payment Status'].push(paymentStatus2);

	var seg1 = {};
	seg1['Mandatory ID '+chance.word({'length': 3}).toUpperCase()] = chance.natural({'min': 0, 'max': items});
	data.VALIDATION.Input['Segment'].push(seg1);
	var seg2 = {};
	seg2['Mandatory ID '+chance.word({'length': 3}).toUpperCase()] = chance.natural({'min': 0, 'max': items});
	data.VALIDATION.Input['Segment'].push(seg2);
	var seg3 = {};
	seg3['Mandatory ID '+chance.word({'length': 3}).toUpperCase()] = chance.natural({'min': 0, 'max': items});
	data.VALIDATION.Input['Segment'].push(seg3);

	var seg4 = {};
	seg4['Optional ID '+chance.word({'length': 3}).toUpperCase()] = chance.natural({'min': 0, 'max': items});
	data.VALIDATION.Input['Segment'].push(seg4);
	var seg5 = {};
	seg5['Optional ID '+chance.word({'length': 3}).toUpperCase()] = chance.natural({'min': 0, 'max': items});
	data.VALIDATION.Input['Segment'].push(seg5);
	var seg6 = {};
	seg6['Optional ID '+chance.word({'length': 3}).toUpperCase()] = chance.natural({'min': 0, 'max': items});
	data.VALIDATION.Input['Segment'].push(seg6);
	var seg7 = {};
	seg7['Optional ID '+chance.word({'length': 3}).toUpperCase()] = chance.natural({'min': 0, 'max': items});
	data.VALIDATION.Input['Segment'].push(seg7);
	var seg8 = {};
	seg8['Optional ID '+chance.word({'length': 3}).toUpperCase()] = chance.natural({'min': 0, 'max': items});
	data.VALIDATION.Input['Segment'].push(seg8);


	var stat1 = {};
	stat1['Account Type '+chance.character({'casing': 'upper', 'alpha': true})] = chance.natural({'min': 0, 'max': items});
	var stat2 = {};
	stat2['Account Status '+chance.character({'casing': 'upper', 'alpha': true})] = chance.natural({'min': 0, 'max': items});
	var stat3 = {};
	stat3['Payment Status '+chance.character({'casing': 'upper', 'alpha': true})] = chance.natural({'min': 0, 'max': items});
	var stat4 = {};
	stat4['Payment Status '+chance.natural({'min': 10, 'max': 99})] = chance.natural({'min': 0, 'max': items});
	data.VALIDATION.Accepted['Recs Statistics'].push(stat1);
	data.VALIDATION.Accepted['Recs Statistics'].push(stat2);
	data.VALIDATION.Accepted['Recs Statistics'].push(stat3);
	data.VALIDATION.Accepted['Recs Statistics'].push(stat4);

	return data;
};