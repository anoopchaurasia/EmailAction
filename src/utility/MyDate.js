const months = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec"
  ];

Date.parseString = function(str){
    let [day, month, year, time, zone] =  str.split(" ").filter(x=>x.trim());
    return new Date(year, months.indexOf(month.toLowerCase()), day, ...time.split(":"), zone);
}

Date.dateView = function(date) {
  if(!date) return "";
  date = new Date(date);
  return date.toLocaleString()
}