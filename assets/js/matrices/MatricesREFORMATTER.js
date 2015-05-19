function MatricesREFORMATTER(selector) {
	this._selector = selector;
	this._order = 0;

	this.getOrder = function() {
		return this._order;
	};
};