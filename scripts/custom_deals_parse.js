// COPY THIS SCRIPT IN THE CONSOLE OF SALESFORCE PRINT VIEW OF THE TABLE
// IN ORDER TO GENERATE A JSON THAT CAN BE PARSED BY `./custom_deals_query_compose.js`
// !!!: MAKE SURE YOU PAST IT'S CONTENT IN `../data/custom_deals_requests.json`
//      BEFORE RUNNING THE QUERY COMPOSER

var TENANT_INDEX = 1;
var MASTER_TENANT_INDEX = 2;
var PLAN_INDEX = 3;
var UPDATE_PLAN_INDEX = 4;
var SOCIAL_USERS_INDEX = 5;
var UPDATE_SOCIAL_USERS_INDEX = 6;
var ENTERPRISE_USERS_INDEX = 7;
var UPDATE_ENTERPRISE_USERS_INDEX = 8;
var UPDATE_PLAN_INTERNAL_INDEX = 9;
var EMPLOYEE_USERS_INDEX = 10;
var UPDATE_EMPLOYEE_USERS_INDEX = 11;

var cleanupNaN = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (Number.isNaN(obj[key])) {
      delete obj[key]
    }
  });
  return obj;
};

var listOfUpdates = [].concat.apply([], document.querySelectorAll('tr.dataRow')).filter((tr) => {
  let th = tr.querySelectorAll('th')[0]
  return th.innerText === 'Pending'
}).map((tr) => {
  const tds = tr.querySelectorAll('td');
  const tenantName = tds[TENANT_INDEX].innerText;
  const tenant = tenantName.split('@')[0];
  const region = tenantName.split('@')[1];
  const master_tenant = tds[MASTER_TENANT_INDEX].innerText;
  const plan = tds[PLAN_INDEX].innerText.replace(/\s\(.*\)$/, '').replace(/\s/g, '').toLowerCase();
  const update_plan = tds[UPDATE_PLAN_INDEX].innerText.replace(/\s\(.*\)$/, '').replace(/\s/g, '').toLowerCase();

  const users = cleanupNaN({
    social: parseInt(tds[SOCIAL_USERS_INDEX].innerText.replace(/[^\w-_]/, '')),
    enterprise: parseInt(tds[ENTERPRISE_USERS_INDEX].innerText.replace(/[^\w-_]/, '')),
    employee: parseInt(tds[EMPLOYEE_USERS_INDEX].innerText.replace(/[^\w-_]/, ''))
  });

  const update_users = cleanupNaN({
    social: parseInt(tds[UPDATE_SOCIAL_USERS_INDEX].innerText.replace(/[^\w-_]/, '')),
    enterprise: parseInt(tds[UPDATE_ENTERPRISE_USERS_INDEX].innerText.replace(/[^\w-_]/, '')),
    employee: parseInt(tds[UPDATE_EMPLOYEE_USERS_INDEX].innerText.replace(/[^\w-_]/, ''))
  });

  if ('seek-support' === tenant) {
    console.log(tds);
  }
  return { tenant, region, master_tenant, plan, update_plan, users, update_users };
});

var string = JSON.stringify(listOfUpdates, null, 2);

var copyFromEl = document.createElement('textarea');
copyFromEl.value = string;
document.body.appendChild(copyFromEl);
copyFromEl.select();
document.execCommand('copy');
copyFromEl.parentNode.removeChild(copyFromEl);
