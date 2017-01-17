"use strict";
const pricing = require('pricing-formula');
const data = require('../data/child_tenants_requests');
const path = require('path');
const today = new Date();
const filename = `${today.toISOString().split('T')[0].replace(/-/g, '')}_1.js`;
const runFileName = path.resolve(process.cwd(), './run/child_tenants_requests', filename);
const write = require('fs').writeFileSync;
const $unset = { "features": 1, "quota": 1, "subscription.details": 1, "subscription.is_free": 1 };

const REGIONS_MAP = { us: 'default', 'default': 'default', eu: 'eu', au: 'au', pi: 'pi' };

const paymentDetailsReducer = (result, key) => {
  result[key] = 0;
  return result;
}

const composeSubscription = (entry) => {
  let subscription = null;

  try {
    subscription = pricing.resolve(entry.plan, entry.users, 'month', 0);
    subscription.paymentDetails = Object.keys(subscription.paymentDetails).reduce(paymentDetailsReducer, {});
    subscription.cost = 0;
  } catch (err) {
    console.warn('Cannot compose entry %j.', entry);
    console.warn('    > %s', err);
  }
  return subscription;
}

const composeSetQuery = (entry, subscription) => {
  const master_tenant = entry.master_tenant;
  const $setSubscription = Object.keys(subscription).reduce((result, key) => {
    result[`subscription.${key}`] = subscription[key];
    return result;
  }, {})

  return Object.assign({ master_tenant }, $setSubscription);
}

const composeFindQuery = (entry) => {
  const _id = entry.tenant.split('@')[0];
  const region = REGIONS_MAP[entry.tenant.split('@')[1]];
  return { _id, region };
}

const queryCompose = ($find, $set) => {
  const updateString = JSON.stringify({ $set, $unset }, null, 2);

  return `db.tenants.update({_id: '${$find._id}', region: '${$find.region}'}, ${updateString});`;
}

const buildQuery = (entry, subscription) => {
  const $set = composeSetQuery(entry, subscription);
  const $find = composeFindQuery(entry);
  return queryCompose($find, $set);
}

const regionReducer = (result, update) => {
  result[update.region] = result[update.region] || [];
  result[update.region].push(update);
  return result;
}

const updatesPerRegion = data.map((entry) => {
  const subscription = composeSubscription(entry);
  if (!subscription) {
    return;
  }
  const query = buildQuery(entry, subscription);
  return Object.assign(composeFindQuery(entry), { query });
}).filter((q) => !!q).reduce(regionReducer, {});

const fileContent = Object.keys(updatesPerRegion).reduce((result, region) => {
  const tenants = JSON.stringify(updatesPerRegion[region].map((entry) => entry._id));
  result += `\n\n// UPDATES FOR REGION ${region}\n`;
  result += `// BACKUP QUERY: db.tenants.find({ _id: { $in: ${tenants} }})\n\n`;
  result += updatesPerRegion[region].map((entry) => entry.query).join('\n\n');
  return result;
}, '');

write(runFileName, fileContent);
