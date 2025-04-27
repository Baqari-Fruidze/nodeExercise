const date = new Date(); // Create a new Date object with the current date
const year = date.getFullYear(); // Get the current year (e.g., 2025)
const month = date.getMonth() + 1;
const day = date.getDate();

console.log(year, month, day);
console.log(typeof month);
