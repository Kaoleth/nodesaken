class XPPurchasable
{
	constructor(name)
	{
		this.name = name;
		this.xpLevels = 0;
		this.cpLevels = 0;
		this.min = 0;
		this.max = 5;
		this.xpCost = 0;
		this.useGroupReference = null;
	}
	
	set useGroup(useGroupReference)
	{
		this.useGroupReference = useGroupReference;
	}
	
	loadJSON(json)
	{
		this.xpLevels = json.xpLevels;
		this.cpLevels = json.cpLevels;
	}
	
	get cost()
	{
		return {
			cp:this.cpLevels,
			xp:this.xpLevels * this.xpCost
		};
	}
	
	get score()
	{
		return this.min + this.xpLevels + this.cpLevels;
	}
	
	set levels(data)
	{
		this.xpLevels = data.xpLevels;
		this.cpLevels = data.cpLevels;
	}
	
	/**
	 * Increases or reduces the number of levels bought with CP or XP (depending on what the current purchase mode is).
	 *
	 * @param The new level to set
	 * @returns {{cp: number, xp: number}} the number of CP and/or XP this purchase costs or refunds
	 */
	set level(level)
	{
		let score = this.min + this.xpLevels + this.cpLevels;
		
		/**
		 * If you're clicking the level you have, and the level you have is greater than your minimum score
		 * you're probably trying to reduce the current level by one
		 */
		if(level === score && level > this.min)
		{
			level = level - 1;
		}
		
		let cost = {cp:0, xp:0}, changeInScore = level - score;
		
		if(changeInScore == 0)
		{
			return cost;
		}
		
		if(changeInScore > 0)
		{
			// always spend CP before XP
			if(this.useGroup.cpRemaining > 0)
			{
			
			}
			else
			{
				let xpIncrease = (this.min + this.cpLevels),
					xpLevels = level - xpIncrease;
				
				cost.xp = (xpLevels - this.xpLevels) * this.xpCost;
				this.xpLevels = xpLevels;
			}
		}
		else
		{
			let reduction = Math.abs(changeInScore),
				tmp = {
					xpLevels:this.xpLevels,
					cpLevels:this.cpLevels
				};
			console.log('Reduce '+this.name+' by '+reduction+' levels');
			// reduce the XP levels first
			tmp.xpLevels -= reduction;
			if(tmp.xpLevels < 0)
			{
				tmp.cpLevels += tmp.xpLevels;
				tmp.xpLevels = 0;
			}
			cost.xp = (this.xpLevels - tmp.xpLevels) * this.xpCost;
			cost.cp = this.cpLevels - tmp.cpLevels;
			this.xpLevels = tmp.xpLevels;
			this.cpLevels = tmp.cpLevels;
		}
		
		return cost;
	}
}

module.exports = XPPurchasable;