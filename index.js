var equation = [];
var symbol = [];
var array = [];
var degree = [];

for (var x = 0; x < process.argv.length; x++) {
	if (process.argv[x].match(/[0-9X *+-\/=^]/g).length == process.argv[x].length) {
		equation.push(process.argv[x])
	}
}

if (equation.length != 1) {
	console.log("Equation invalide ou trop d'equations en parametre")
	process.exit(0)
}

equation = equation[0].replace(/\s/g, '').split('=');

if (equation.length != 2 ) {
	console.log("Equation invalide")
}

for (var x = 0; x < equation.length; x++) {
	symbol = equation[x].match(/[\+\-]/g)
	array = equation[x].split(/[\+\-]/g).filter(function(n){ return n })

	degree[x] = degree[x] || [];
	for (var j = 0; j < array.length; j++) {
		degree[x].push({
			symbol: equation[x][equation[x].indexOf(array[j]) - 1] && equation[x][equation[x].indexOf(array[j]) - 1].match(/[\-\+]/g) ? equation[x][equation[x].indexOf(array[j]) - 1] : '+',
			power: parseInt(array[j].match(/X\^([0-9])/) ? array[j].match(/X\^([0-9])/)[1] : 0),
			equ: array[j].split('*X^')[0],
		})
	}
 }

console.log(degree);
