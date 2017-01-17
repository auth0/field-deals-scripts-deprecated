// COPY THIS SCRIPT IN THE CONSOLE OF SALESFORCE PRINT VIEW OF THE TABLE
// IN ORDER TO GENERATE A JSON THAT CAN BE PARSED BY `./trials_query_compose.js`
// !!!: MAKE SURE YOU PAST IT'S CONTENT IN `../data/trials_requests.json`
//      BEFORE RUNNING THE QUERY COMPOSER

var string = JSON.stringify([].concat.apply([], document.querySelectorAll('tr.dataRow')).filter((tr) => {
  let th = tr.querySelectorAll('th')[0]
  return th.innerText === 'Pending'
}).map((tr) => {
  let tds = tr.querySelectorAll('td.dataCell');
  const tenant = tds[0].innerText;
  const date_parts = tds[1].innerText.split('/');
  const date = new Date(`${date_parts[2]}-${date_parts[0]}-${date_parts[1]}`);
  const extend_date = `${date.toISOString().split('T')[0]}`;
  return { tenant, extend_date }
}), null, 2);


var copyFromEl = document.createElement('textarea');
copyFromEl.value = string;
document.body.appendChild(copyFromEl);
copyFromEl.select();
document.execCommand('copy');
copyFromEl.parentNode.removeChild(copyFromEl);
