let XPPurchasable = require('./XPPurchasable');

class Merit extends XPPurchasable
{
	constructor(name, data)
	{
		super(name);
		this.xpCost = 1;
		this.levels = null;
		this.prerequisites = [];
		this.specific = false;
		this.multiple = false;
		this.effects = null;
		this.creationOnly = false;
		this.modifiers = [];
		this.exclusiveTo = null;
		this.venue = null;
		
		for (let i in data)
		{
			if (!this.hasOwnProperty(i))
			{
				console.log(i + ' not found for merit ' + this.name);
			}
			this[i] = data[i];
		}
	}
}


module.exports = Merit;