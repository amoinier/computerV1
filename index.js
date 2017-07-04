main();

function main() {
	var disc;
	var equation = [];
	var reduc = "";
	var degree = [];
	var xValue;
	var result = 0;
	var a, b, c;

	equation = getArgv();
	degree = parseDegree(equation);

	for (var x = 0; x < degree[0].length; x++) {
		for (var j = 0; j < degree[1].length; j++) {
			if (degree[0][x].power == degree[1][j].power) {
				degree[0][x].equ = parseInt(degree[0][x].symbol+degree[0][x].equ) - parseInt(degree[1][j].symbol+degree[1][j].equ)
				degree[0][x].symbol = (degree[0][x].equ < 0 ? (degree[0][x].symbol == "+" ? "-" : "+") : degree[0][x].symbol)
				degree[0][x].equ *= -1;
				degree[1].splice(j, 1);
			}
		}
		reduc += degree[0][x].symbol + degree[0][x].equ + "*X^" + degree[0][x].power;
	}

	disc = calculateDiscr(degree);

	console.log("Sent form: " + equation[0] + "=" + equation[1]);
	console.log("Reduced form: " + reduc + "=0");
	console.log("Polynomial degree: " + (degree[0].length - 1));

	if (disc < 0) {
		console.log("Discriminant is strictly negative, No solution");
	}
	else if (disc == 0) {

		for (var x = 0; x < degree[0].length; x++) {
			if (degree[0][x].power == 2) {
				a = parseInt(degree[0][x].symbol + degree[0][x].equ);
			}
			if (degree[0][x].power == 1) {
				b = parseInt(degree[0][x].symbol + degree[0][x].equ);
			}
			if (degree[0][x].power == 0) {
				c = parseInt(degree[0][x].symbol + degree[0][x].equ);
			}
		}

		xValue = (b * -1) / (2 * a);
		console.log("Discriminant is equal to 0, there is one solution :" + xValue);
	}
	else {
		console.log("Discriminant is strictly positive, there are two solution :");
	}
	//console.log(degree);
}




function getArgv() {
	var equation = [];

	for (var x = 0; x < process.argv.length; x++) {
		if (process.argv[x].match(/[0-9X *+-\/=^]/g) && process.argv[x].match(/[0-9X *+-\/=^]/g).length == process.argv[x].length) {
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
		process.exit(0)
	}

	return equation;
}




function parseDegree(equation) {
	var degree = [];
	var array = [];
	var symbol = [];

	for (var x = 0; x < equation.length; x++) {
		symbol = equation[x].match(/[\+\-]/g)
		array = equation[x].split(/[\+\-]/g).filter(function(n){ return n })

		degree[x] = degree[x] || [];
		for (var j = 0; j < array.length; j++) {
			var index = equation[x][equation[x].indexOf(array[j]) - 1];

			degree[x].push({
				symbol: index && index.match(/[\-\+]/g) ? index : '+',
				power: parseInt(array[j].match(/X\^([0-9])/) ? array[j].match(/X\^([0-9])/)[1] : 0),
				equ: array[j].split('*X^')[0],
			})
		}
	}

	return degree;
}


function calculateDiscr(degree) {
	var a, b, c;

	for (var x = 0; x < degree[0].length; x++) {
		if (degree[0][x].power == 2) {
			a = parseInt(degree[0][x].symbol + degree[0][x].equ);
		}
		if (degree[0][x].power == 1) {
			b = parseInt(degree[0][x].symbol + degree[0][x].equ);
		}
		if (degree[0][x].power == 0) {
			c = parseInt(degree[0][x].symbol + degree[0][x].equ);
		}
	}

	return (b * b + (4 * a * c));
}
