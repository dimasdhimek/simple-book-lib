let input = ['xc', 'dz', 'bbb', 'dz'];
const query = ['bbb', 'ac', 'dz'];

const output = Array(query.length).fill(0);

// search input in query
for (const item of input) {
  let currentIndex = query.indexOf(item);
  if (currentIndex >= 0) {
    output[currentIndex]++;
  }
}

console.log(output);
