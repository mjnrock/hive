export default class Dice {
	static random(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	static roll(x, y, z = 0) {
		let value = 0;
		for(let i = 0; i < x; i++) {
			value += Dice.random(1, y);
		}
		
		return value + z;
	}

	static coin() {
		return Dice.roll(1, 2) === 1 ? true : false;
	}

	static d2(z = 0) {
		return Dice.roll(1, 2) + z;
	}
	static d3(z = 0) {
		return Dice.roll(1, 3) + z;
	}
	static d4(z = 0) {
		return Dice.roll(1, 4) + z;
	}
	static d6(z = 0) {
		return Dice.roll(1, 6) + z;
	}
	static d10(z = 0) {
		return Dice.roll(1, 10) + z;
	}
	static d12(z = 0) {
		return Dice.roll(1, 12) + z;
	}
	static d20(z = 0) {
		return Dice.roll(1, 20) + z;
	}
	static d25(z = 0) {
		return Dice.roll(1, 25) + z;
	}
	static d50(z = 0) {
		return Dice.roll(1, 50) + z;
	}
	static d100(z = 0) {
		return Dice.roll(1, 100) + z;
	}

	static weighted(weights, values) {                
		const total = weights.agg((a, v) => a + v, 0);		
		const roll = Dice.random(1, total);
		
		let count = 0;
		for(let i = 0; i < weights.length; i++) {
			count += weights[ i ];
			
			if(roll <= count) {
				return values[ i ];
			}
		}
		
		return values[ values.length - 1 ];
	}
};