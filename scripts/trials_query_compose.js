const data = require('../data/trials_requests');
const path = require('path');
const today = new Date();
const filename = `${today.toISOString().split('T')[0].replace(/-/g, '')}_1.js`;
const runFileName = path.resolve(process.cwd(), './run/trials_requests', filename);
const write = require('fs').writeFileSync;

const REGIONS_MAP = { us: 'default', 'default': 'default', eu: 'eu', au: 'au', pi: 'pi' };

const composeFindQuery = (entry) => {
  const _id = entry.tenant.split('@')[0];
  const region = REGIONS_MAP[entry.tenant.split('@')[1]];
  return { _id, region };
}

const queryCompose = ($find, date) => `
db.tenants.update({_id: '${$find._id}', region: '${$find.region}'}, {
  $set: {
    'subscription.trialDates.trialEnds': new ISODate('${date}')
  }
});
`;

const buildQuery = (entry, subscription) => {
  const $find = composeFindQuery(entry);
  return queryCompose($find, entry.extend_date);
}

const regionReducer = (result, update) => {
  result[update.region] = result[update.region] || [];
  result[update.region].push(update);
  return result;
}

const updatesPerRegion = data.map((entry) => {
  const query = buildQuery(entry);
  return Object.assign(composeFindQuery(entry), { query });
}).reduce(regionReducer, {});

const fileContent = Object.keys(updatesPerRegion).reduce((result, region) => {
  result += `\n\n// UPDATES FOR REGION ${region}\n\n`;
  // result += `// BACKUP QUERY: db.tenants.find(${updatesPerRegion[region].map((entry) => entry.tenant)})`
  result += updatesPerRegion[region].map((entry) => entry.query).join('');
  result += '\n'
  return result;
}, '');

write(runFileName, fileContent);
