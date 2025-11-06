const fullPath = await import.meta.resolve("mathjs");
const path = fullPath?.match(/(\/node_modules.*)/)[0];
console.log(path);