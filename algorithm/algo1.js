const str = 'NEGIE1';

const result = str.substring(0, str.length - 1) // take string, except last one
  .split('') // convert to array
  .reverse() // reverse array
  .join('') // convert to string
  +
  str[str.length - 1]; // add num in the last position

console.log(result);