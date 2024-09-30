const fs = require("fs");

// Function to decode the y value from different bases
const decodeValue = (base, value) => {
  return parseInt(value, base);
};

// Function to parse JSON input
const parseInput = (filename) => {
  const data = fs.readFileSync(filename);
  const jsonData = JSON.parse(data);

  const n = jsonData.keys.n;
  const k = jsonData.keys.k;

  // Extract points (x, y)
  const points = Object.keys(jsonData)
    .filter((key) => key !== "keys")
    .map((key) => {
      const x = parseInt(key);
      const base = parseInt(jsonData[key].base);
      const y = decodeValue(base, jsonData[key].value);
      return { x, y };
    });

  return { points, n, k };
};

// Function to calculate the Lagrange basis polynomial
const lagrangeBasis = (points, xi) => {
  const k = points.length;
  return points.map((_, i) => {
    let result = 1;
    for (let j = 0; j < k; j++) {
      if (i !== j) {
        result *= (xi - points[j].x) / (points[i].x - points[j].x);
      }
    }
    return result;
  });
};

// Function to find the constant term 'c' using Lagrange Interpolation
const findConstantTerm = (points) => {
  const k = points.length;
  const basis = lagrangeBasis(points, 0);
  let constant = 0;

  for (let i = 0; i < k; i++) {
    constant += points[i].y * basis[i];
  }

  return constant;
};

// Function to check if a point lies on the polynomial
const isPointOnPolynomial = (coefficients, x, y) => {
  let calculatedY = 0;
  for (let i = 0; i < coefficients.length; i++) {
    calculatedY += coefficients[i] * Math.pow(x, i);
  }
  return Math.abs(calculatedY - y) < 1e-6; // Tolerance for floating point errors
};

// Function to compute polynomial coefficients using the selected points
const computeCoefficients = (points) => {
  const k = points.length;
  const matrix = [];
  const vector = [];

  for (let i = 0; i < k; i++) {
    const row = [];
    for (let j = 0; j < k; j++) {
      row.push(Math.pow(points[i].x, j));
    }
    matrix.push(row);
    vector.push(points[i].y);
  }

  // Solve the linear system matrix * coefficients = vector
  // We can use Gaussian elimination or any linear algebra library
  // For simplicity, we'll use a basic implementation here

  // Augmented matrix
  for (let i = 0; i < k; i++) {
    matrix[i].push(vector[i]);
  }

  // Gaussian elimination
  for (let i = 0; i < k; i++) {
    // Make the diagonal contain all ones
    let divisor = matrix[i][i];
    for (let j = 0; j < k + 1; j++) {
      matrix[i][j] /= divisor;
    }

    // Make the elements below the pivot zeros
    for (let m = i + 1; m < k; m++) {
      let factor = matrix[m][i];
      for (let n = 0; n < k + 1; n++) {
        matrix[m][n] -= factor * matrix[i][n];
      }
    }
  }

  // Back substitution
  const coefficients = new Array(k).fill(0);
  for (let i = k - 1; i >= 0; i--) {
    coefficients[i] = matrix[i][k];
    for (let j = i + 1; j < k; j++) {
      coefficients[i] -= matrix[i][j] * coefficients[j];
    }
  }

  return coefficients;
};

// Main function
const main = () => {
  const { points, n, k } = parseInput("input2.json"); //file path of json input

  // Ensure we have at least k points to solve the polynomial
  if (points.length < k) {
    console.log("Not enough points to solve the polynomial.");
    return;
  }

  // Try all combinations of k points to find the correct polynomial and imposter points
  const combinations = getCombinations(points, k);
  let secret = null;
  let correctCoefficients = null;
  let imposterPoints = [];

  for (let combo of combinations) {
    try {
      // Compute polynomial coefficients with selected points
      const coefficients = computeCoefficients(combo);

      // Check remaining points
      const remainingPoints = points.filter((p) => !combo.includes(p));
      const imposters = [];
      let allValid = true;

      for (let p of remainingPoints) {
        if (!isPointOnPolynomial(coefficients, p.x, p.y)) {
          imposters.push(p);
        }
      }

      // If imposters are within allowed limit (0 to 3), we accept this polynomial
      if (imposters.length <= 3) {
        secret = coefficients[0]; // The constant term 'c'
        correctCoefficients = coefficients;
        imposterPoints = imposters;
        break;
      }
    } catch (error) {
      // Handle any errors in computation
      continue;
    }
  }

  if (secret !== null) {
    console.log(`The secret constant 'c' is: ${secret}`);
    if (imposterPoints.length > 0) {
      console.log("Imposter Points:");
      imposterPoints.forEach((p) => {
        console.log(`x: ${p.x}, y: ${p.y}`);
      });
    } else {
      console.log("No imposter points found.");
    }
  } else {
    console.log("Could not find a valid polynomial with the given points.");
  }
};

// Helper function to generate all combinations of k elements from the array
const getCombinations = (array, k) => {
  const combinations = [];
  const combination = [];

  function recurse(start) {
    if (combination.length === k) {
      combinations.push(combination.slice());
      return;
    }
    for (let i = start; i < array.length; i++) {
      combination.push(array[i]);
      recurse(i + 1);
      combination.pop();
    }
  }

  recurse(0);
  return combinations;
};

// Run the main function
main();
