const sentence = "Saya sangat senang mengerjakan soal algoritma";

// convert sentence to array
const newSentece = sentence.split(' ');

// use sort with word length comparison, so longest word will be at the index 0
newSentece.sort((a, b) => b.length - a.length);

console.log(`${newSentece[0]}: ${newSentece[0].length} characters`);