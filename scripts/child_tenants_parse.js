// COPY THIS SCRIPT IN THE CONSOLE OF SALESFORCE PRINT VIEW OF THE TABLE
// IN ORDER TO GENERATE A JSON THAT CAN BE PARSED BY `./child_tenants_query_compose.js`
// !!!: MAKE SURE YOU PAST IT'S CONTENT IN `../data/child_tenants_requests.json`
//      BEFORE RUNNING THE QUERY COMPOSER

var string = JSON.stringify([].concat.apply([], document.querySelectorAll('tr.dataRow')).filter((tr) => {
  let th = tr.querySelectorAll('th')[0]
  return th.innerText === 'Pending'
}).map((tr) => {
  let tds = tr.querySelectorAll('td');
  const tenant = tds[1].innerText;
  const master_tenant = tds[2].innerText;
  const plan = tds[4].innerText.replace(/\s\(.*\)$/, '').replace(/\s/g, '');
  const users = { social: parseInt(tds[5].innerText) || 0, enterprise: parseInt(tds[6].innerText) || 0, employee: 0 };
  return { tenant, master_tenant, plan, users }
}), null, 2);

var copyFromEl = document.createElement('textarea');
copyFromEl.value = string;
document.body.appendChild(copyFromEl);
copyFromEl.select();
document.execCommand('copy');
copyFromEl.parentNode.removeChild(copyFromEl);
