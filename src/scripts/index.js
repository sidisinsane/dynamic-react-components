const arr = [
  "foo",
  "bar",
  "foobar",
];

const result = arr.map((value, index) => {
  return `${index + 1}. is ${value}.`;
});

console.log(result);
console.log('ja');
