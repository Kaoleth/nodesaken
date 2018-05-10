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
	
	setLevel(level)
	{
		let score = this.min + this.xpLevels + this.cpLevels;
		
		// If you're clicking the level you have, and the level you have is greater than your minimum score
		// you're probably trying to reduce the current level by one
		if(level === score && level > this.min)
		{
			level = level - 1;
		}
		
		let changeInScore = level - score;
		
		if(changeInScore == 0)
		{
			return;
		}
		
		if(changeInScore > 0)
		{
			// always spend CP before XP
			let maxCPLeft = this.useGroupReference.cpRemaining;
			console.log(maxCPLeft, changeInScore);
			if(maxCPLeft > 0)
			{
				if(maxCPLeft >= changeInScore)
				{
					console.log('Buying '+changeInScore+' levels with CP');
					this.cpLevels += changeInScore;
				}
				else
				{
					console.log('Should be buying '+maxCPLeft+' levels with CP');
					let xpLevels = changeInScore - maxCPLeft;
					this.setLevel(score + maxCPLeft);
					this.setLevel(level);
				}
			}
			else
			{
				console.log('Buying '+changeInScore+' levels with XP');
				let xpIncrease = (this.min + this.cpLevels),
					xpLevels = level - xpIncrease;
				
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
			
			// reduce the XP levels first
			tmp.xpLevels -= reduction;
			if(tmp.xpLevels < 0)
			{
				tmp.cpLevels += tmp.xpLevels;
				tmp.xpLevels = 0;
			}
			this.xpLevels = tmp.xpLevels;
			this.cpLevels = tmp.cpLevels;
		}
	}
	
	/**
	 * Increases or reduces the number of levels bought with CP or XP (depending on what the current purchase mode is).
	 *
	 * @param The new level to set
	 */
	set level(level)
	{
		this.setLevel(level);
	}
}

module.exports = XPPurchasable;