// matrix must be symmetrical or NxN
const matrix = [
  [1, 2, 0],
  [4, 5, 6],
  [7, 8, 9]
];

let sumDiagonal1 = 0;
let sumDiagonal2 = 0;
for (let col = 0; col < matrix.length; col++) {
  sumDiagonal1 += matrix[col][col]; // diagonal 1 from a matrix --> col = row with col from 0 to matrix length - 1
  sumDiagonal2 += matrix[col][matrix.length - col - 1]; // diagonal 2 from a matrix --> row = reverse order from col (ex: if col = 0, 1, 2 so row =  2, 1, 0)
}

const result = sumDiagonal1 - sumDiagonal2;

console.log(result);


