# Shamir's Secret Sharing Algorithm (Simplified)

## Overview
This project implements a simplified version of Shamir's Secret Sharing algorithm in JavaScript. The goal is to solve for the constant term (c) of a polynomial based on provided points in a specific format. Additionally, the project identifies "imposter points" that do not lie on the curve of the polynomial.

## Features
- **Decodes Points:** Handles points where the `y` values are provided in various bases (e.g., base 10, 16, 12).
- **Lagrange Interpolation:** Uses Lagrange interpolation to solve for the constant term `c` of a polynomial.
- **Imposter Points Detection:** Identifies and reports imposter points, which are points that do not fit the polynomial.

## Input Format
The input is provided in JSON format and consists of a number of roots (x, y pairs). The JSON structure includes the following fields:

- `n`: Number of roots provided.
- `k`: Minimum number of roots required to solve for the coefficients of the polynomial (k = m + 1, where m is the degree of the polynomial).
- Each root contains a base for the `y` value, which needs to be decoded.

### Example Input
```json
{
  "keys": {
      "n": 4,
      "k": 3
  },
  "1": {
      "base": "10",
      "value": "4"
  },
  "2": {
      "base": "2",
      "value": "111"
  },
  "3": {
      "base": "10",
      "value": "12"
  },
  "6": {
      "base": "4",
      "value": "213"
  }
}
```
## Example Output
```yaml
#For first test case : 
The secret constant 'c' is: 28735619723864
No imposter points found.

#For second test case : 
The secret constant 'c' is: 28735619723864
Imposter Points:
    x: 7
    y: 28859585857715

