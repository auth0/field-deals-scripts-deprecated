module.exports = (entry) => `
db.tenants.update({_id: '${entry.tenant}', region: '${entry.region}'}, {
  $set: {
    'master_tenant': '${entry.master_tenant}',
    'subscription.type': 'custom_agreement',
    'subscription.category': 'startup',
    'subscription.billing_method': 'manual',
    'subscription.name': 'YCombinator',
    'subscription.plan': 'startup',
    'subscription.version': '4.0.22',
    'subscription.plan_version': 'v1.0.0',
    'logs.archive_days': 30,

    'subscription.users': { 'social': 500000, 'enterprise': 500000, 'employee': 0 },

    'subscription.features': {
      'user_database': {
        'max': 'Infinity'
      },
      'custom_database': {
        'max': 'Infinity'
      },
      'social_connections': {
        'max': 'Infinity'
      },
      'metadatas': {
        'max': 'Infinity'
      },
      'lock_mobile': {
        'max': 'Infinity'
      },
      'lock_web': {
        'max': 'Infinity'
      },
      'email_workflow': {
        'max': 'Infinity'
      },
      'rules': {
        'max': 'Infinity'
      },
      'passwordless_connections': {
        'max': 'Infinity'
      },
      'touchid': {
        'max': 'Infinity'
      },
      'user_management': {
        'max': 'Infinity'
      },
      'role_management': {
        'max': 'Infinity'
      },
      'custom_emails': {
        'max': 'Infinity'
      },
      'delegation_consumer': {
        'max': 'Infinity'
      },
      'link_accounts': {
        'max': 'Infinity'
      },
      'custom_email_provider': {
        'max': 'Infinity'
      },
      'ad_connector': {
        'max': 'Infinity'
      },
      'enterprise_connections': {
        'max': 'Infinity'
      },
      'sudo': {
        'max': 'Infinity'
      },
      'redirect_rule': {
        'max': 'Infinity'
      },
      'mfa': {
        'max': 'Infinity'
      },
      'impersonation': {
        'max': 'Infinity'
      },
      'password_complexity': {
        'max': 'Infinity'
      },
      'user_stores': {
        'max': 'Infinity'
      },
      'logs': {
        'max': 30
      },
      'webtask': {
        'max': 'Infinity'
      },
      'mfa_enterprise': {
        'max': 'Infinity'
      },
      'delegation': {
        'max': 'Infinity'
      },
      'db_migration': {
        'max': 'Infinity'
      },
      'fraud_protection': {
        'max': 'Infinity'
      }
    },
    'subscription.tax': 0,
    'subscription.recurrence': 'month',
    'subscription.cost': 0,
    'subscription.paymentDetails': {
      'total': 0,
      'totalInCents': 0,
      'subTotalBeforeTax': 0
    }
  },
  $unset: {
    'log': 1,
    'quota': 1,
    'features': 1,
    'subscription.details': 1,
    'subscription.is_free': 1
  }
});
`
