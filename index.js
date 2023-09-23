const addDays = require("date-fns/addDays");
function result(days) {
  const newDate = addDays(new Date(2020, 07, 22), days);
  return `${newDate.getDate()}-${
    newDate.getMonth() + 1
  }-${newDate.getFullYear()}`;
}
console.log(result(10));
module.exports = result;
