if (stdinOrArgv().length == 0) {
	process.stdin.resume();
	process.stdin.setEncoding('utf8');

	var stdinEquation = [];

	process.stdin.on('data', function(chunk) {
		stdinEquation = chunk.split("\n");

		main(stdinEquation);
		process.stdin.pause();
	});

	process.stdin.on('end', function() {
	});
}
else {
	main();
}

function main(argv) {
	var equation = [];
	var reduc = "";
	var degree = [];
	var xValue;

	equation = getArgv(argv);
	degree = parseDegree(equation);

	for (var first in degree[0]) {
		for (var second in degree[1]) {
			if (degree[0][first].power == degree[1][second].power) {
				var save = parseFloat(degree[0][first].symbol+degree[0][first].equ);
				degree[0][first].equ = parseFloat(degree[0][first].symbol+degree[0][first].equ) - parseFloat(degree[1][second].symbol+degree[1][second].equ)

				if (degree[0][first].equ < 0) {
					degree[0][first].equ *= -1;
					degree[0][first].symbol = (save < 0 ? degree[0][first].symbol : (degree[0][first].symbol == "+" ? "-" : "+"))
				}
				delete degree[1][second]
			}
		}

	}

	degree = cleanDegree(degree);

	var countReduc = 0;
	for (var first in degree[0]) {
		if (parseFloat(degree[0][first].equ)) {
			reduc += ((countReduc && degree[0][first].equ) || degree[0][first].symbol == "-" ? degree[0][first].symbol + " " : "")
			reduc += (parseFloat(degree[0][first].equ) != 1 || first == 0 ? parseFloat(degree[0][first].equ) + " " : "");
			reduc += (degree[0][first].power >= 2 ? (parseFloat(degree[0][first].equ) == 1 ? "X^" : "* X^") + degree[0][first].power + " " : (degree[0][first].power == 1 ? (parseFloat(degree[0][first].equ) == 1 ? "X " : "* X ") : ""))
			countReduc++;
		}
	}

	console.log("Reduced form: " + (reduc == "" ? "0 " : reduc) + "= 0");
	console.log("Polynomial degree: " + getPolynomialDegree(degree));

	getResult(degree);
}

function stdinOrArgv() {
	var equation = [];

	for (var x = 0; x < process.argv.length; x++) {
		if (process.argv[x].match(/[0-9X *+-\/=^]/g) && process.argv[x].match(/[0-9X *+-\/=^]/g).length == process.argv[x].length) {
			equation.push(process.argv[x])
		}
	}

	return equation;
}


function getArgv(argv) {
	var equation = [];

	if (!argv) {
		argv = process.argv;
	}

	for (var x = 0; x < argv.length; x++) {
		if (argv[x].match(/[0-9X *+-\/=^]/g) && argv[x].match(/[0-9X *+-\/=^]/g).length == argv[x].length) {
			equation.push(argv[x])
		}
	}

	if (equation.length != 1) {
		console.log("Invalid or too mush parameters")
		process.exit(0)
	}

	equation = equation[0].replace(/\s/g, '').split('=');

	if (equation.length != 2 ) {
		console.log("Invalid")
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

		degree[x] = degree[x] || {};
		for (var j = 0; j < array.length; j++) {
			var index = equation[x][equation[x].indexOf(array[j]) - 1];

			degree[x][parseFloat(array[j].match(/X\^([0-9])/) ? array[j].match(/X\^([0-9])/)[1] : 0)] = {
				symbol: index && index.match(/[\-\+]/g) ? index : '+',
				power: parseFloat(array[j].match(/X\^([0-9])/) ? array[j].match(/X\^([0-9])/)[1] : 0),
				equ: (array[j].split('*X^').length >= 2 ? array[j].split('*X^')[0] : 1),
			}

			if (parseFloat(array[j]) == array[j]) {
				degree[x][0] = {
					symbol: "+",
					power: "0",
					equ: parseFloat(array[j]),
				}
			}

			if (array[j] == "X") {
				degree[x][1] = {
					symbol: "+",
					power: "1",
					equ: 1,
				}
			}
		}
	}

	if (!degree[0][0]) {
		degree[0][0] = {
			symbol: "+",
			power: 0,
			equ: 0
		}
	}

	if (degree[0][2] && !degree[0][1]) {
		degree[0][1] = {
			symbol: "+",
			power: 1,
			equ: 0
		}
	}

	return degree;
}


function calculateDiscr(degree, abc) {
	return (abc.b * abc.b - (4 * abc.a * abc.c));
}


function getABC(degree) {
	var a, b, c;

	a = parseFloat(degree[0][2].symbol + degree[0][2].equ);
	b = parseFloat(degree[0][1].symbol + degree[0][1].equ);
	c = parseFloat(degree[0][0].symbol + degree[0][0].equ);

	return ({
		a: a,
		b: b,
		c: c,
	});
}

function getPolynomialDegree(degree) {
	var poly = 0;
	var keys = Object.keys(degree[0]);

	for (var x = 0; x < keys.length; x++) {
		if (keys[x] > poly && degree[0][keys[x]].equ > 0) {
			poly = keys[x];
		}
	}

	return poly;
}

function getResult(degree) {
	var disc;
	var abc;


	if (getPolynomialDegree(degree) == 2) {
		abc = getABC(degree);
		disc = calculateDiscr(degree, abc);
		console.log("Discriminant is equal to: " + disc);

		if (disc < 0) {
			xValue = ["(" + parseFloat(abc.b * -1) + " - i * " + (parseInt(sqrt(disc) * 100) / 100) + ") / " + parseFloat(2 * abc.a), "(" + parseFloat(abc.b * -1) + " + i * " + (parseInt(sqrt(disc) * 100) / 100) + ") / " + parseFloat(2 * abc.a)]
			console.log("Discriminant is strictly negative, there are 2 complexes solutions: " + xValue.join(" ; "));
		}
		else if (disc == 0) {

			xValue = (abc.b * -1) / (2 * abc.a);
			if (((xValue % 1) + "").length > 4) {
				xValue = parseFloat(abc.b * -1) + " / " + parseFloat(2 * abc.a)
			}

			console.log("Discriminant is equal to 0, there is one solution: " + xValue);
		}
		else {

			xValue = [(((abc.b * -1) - (parseInt(sqrt(disc) * 100) / 100)) / (2 * abc.a)), (((abc.b * -1) + (parseInt(sqrt(disc) * 100) / 100)) / (2 * abc.a))]
			if (((xValue[0] % 1) + "").length > 4) {
				xValue[0] = (((abc.b * -1) - (parseInt(sqrt(disc) * 100) / 100)) + " / " + (2 * abc.a))
			}

			if (((xValue[1] % 1) + "").length > 4) {
				xValue[1] = (parseInt(((abc.b * -1) + (parseInt(sqrt(disc) * 100) / 100)) * 100) / 100 + " / " + (2 * abc.a))
			}
			console.log("Discriminant is strictly positive, there are two solution: " + xValue.join(" ; "));

		}
	}
	else if (getPolynomialDegree(degree) == 1) {
		var a = parseFloat(degree[0][1].symbol + degree[0][1].equ);
		var b = parseFloat(degree[0][0].symbol + degree[0][0].equ) * -1;

		if (b && a) {
			xValue = (b/a);

			if (((xValue % 1) + "").length > 4) {
				xValue = b + " / " + a;
			}
		}
		else if (!b && a)
			xValue = 0;
		else if (!a && b)
			xValue = ("No solution");
		else
			xValue = "All numbers";

		console.log("There is one solution: " + xValue);
		process.exit(1)
	}
	else if (getPolynomialDegree(degree) == 0) {
		if (degree[0][0].equ != 0) {
			console.log("The polynomial degree is 0, the solution is impossible");
		}
		else {
			console.log("The polynomial degree is 0, the solution is all reals numbers");
		}
		process.exit(1)
	}
	else {
		console.log("The polynomial degree is stricly greater than 2, I can't solve.");
		process.exit(1)
	}
}

function cleanDegree(degree) {
	var keys = Object.keys(degree[1]);

	if (keys.length != 0) {
		for (var x = 0; x < keys.length; x++) {
			degree[0][keys] = degree[1][keys];
			degree[0][keys].symbol = (degree[0][keys].symbol == "+" ? "-" : "+");
			delete degree[1][keys]
		}
	}

	return degree;
}


function sqrt(int) {
	var index = 0;

	if (int < 0)
		int *= -1;

	while(index * index < int) {
		index += 0.0001;
	}

	return index;
}
