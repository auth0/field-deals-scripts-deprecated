const data = require('../data/custom_deals_requests');
const path = require('path');
const today = new Date();
const filename = `${today.toISOString().split('T')[0].replace(/-/g, '')}_1.js`;
const runFileName = path.resolve(process.cwd(), './run/custom_deals_requests', filename);
const write = require('fs').writeFileSync;

const USERS = { employee: 0, social: 0, enterprise: 0 };
const REGIONS_MAP = { us: 'default', 'default': 'default', eu: 'eu', au: 'au', pi: 'pi' };
const TEMPLATES = {
  oss: require('./helpers/oss_plan_template'),
  startup: require('./helpers/startup_plan_template'),
  ycombinator: require('./helpers/ycombinator_plan_template'),
  platinum: require('./helpers/platinum_plan_template'),
  enterprise: require('./helpers/enterprise_plan_template')
};

const manualFilter = (opts) => (entry) => {
  const planUpdate = (entry.plan !== entry.update_plan);
  const validPlan = !!TEMPLATES[entry.update_plan];
  const nonPI = entry.region !== 'pi';
  const canCompose = planUpdate && validPlan && nonPI;

  if (!canCompose && opts && opts.warn) {
    console.warn('Cannot compose entry %j', entry);
  }
  return canCompose;
};

const composeQuery = (entry) => {
  entry.update_users = Object.assign({}, USERS, entry.users, entry.update_users);
  entry.region = REGIONS_MAP[entry.region];
  return TEMPLATES[entry.update_plan](entry);
};

const composeFindQuery = (entry) => {
  return { _id: entry.tenant, region: REGIONS_MAP[entry.region] };
};

const regionReducer = (result, update) => {
  result[update.region] = result[update.region] || [];
  result[update.region].push(update);
  return result;
};

const updatesPerRegion = data.filter(manualFilter({ warn: true })).map((entry) => {
  const query = composeQuery(entry);
  const $find = composeFindQuery(entry);
  return Object.assign($find, { query });
}).reduce(regionReducer, {});

const fileContent = Object.keys(updatesPerRegion).reduce((result, region) => {
  const tenants = JSON.stringify(updatesPerRegion[region].map((entry) => entry._id));
  result += `\n\n// UPDATES FOR REGION ${region}\n`;
  result += `// BACKUP QUERY: db.tenants.find({ _id: { $in: ${tenants} }})\n\n`;
  result += updatesPerRegion[region].map((entry) => entry.query).join('');
  result += '\n';
  return result;
}, '');

write(runFileName, fileContent);
