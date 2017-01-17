module.exports = (entry) => `
db.tenants.update({_id: '${entry.tenant}', region: '${entry.region}'}, {
  $set: {
    'master_tenant': '${entry.master_tenant}',
    'subscription.type': 'custom_agreement',
    'subscription.category': 'oss',
    'subscription.billing_method': 'manual',
    'subscription.name': 'Open Source',
    'subscription.plan': 'oss',
    'subscription.version': '4.0.22',
    'subscription.plan_version': 'v1.0.0',
    'logs.archive_days': 30,

    'subscription.users': { 'social': 500000, 'enterprise': 500000, 'employee': 0 },

    'subscription.features': {
      'user_database': {
        'max': 'Infinity'
      },
      'social_connections': {
        'max': 'Infinity'
      },
      'passwordless_connections': {
        'max': 'Infinity'
      },
      'enterprise_connections': {
        'max': 'Infinity'
      },
      'custom_database': {
        'max': 'Infinity'
      },
      'logs': {
        'max': 30
      },
      'rules': {
        'max': 'Infinity'
      },
      'webtask': {
        'max': 'Infinity'
      },
      'impersonation': {
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
      'touchid': {
        'max': 'Infinity'
      },
      'email_workflow': {
        'max': 'Infinity'
      },
      'custom_email_provider': {
        'max': 'Infinity'
      },
      'custom_emails': {
        'max': 'Infinity'
      },
      'user_management': {
        'max': 'Infinity'
      },
      'role_management': {
        'max': 'Infinity'
      },
      'delegation_consumer': {
        'max': 'Infinity'
      },
      'link_accounts': {
        'max': 'Infinity'
      },
      'password_complexity': {
        'max': 'Infinity'
      },
      'mfa': {
        'max': 'Infinity'
      },
      'mfa_enterprise': {
        'max': 'Infinity'
      },
      'redirect_rule': {
        'max': 'Infinity'
      },
      'ad_connector': {
        'max': 'Infinity'
      },
      'sudo': {
        'max': 'Infinity'
      },
      'user_stores': {
        'max': 'Infinity'
      },
      'delegation': {
        'max': 'Infinity'
      },
      'db_migration': {
        'max': 'Infinity'
      },
      'sla': {
        'max': 'Infinity'
      },
      'premium_support': {
        'max': 'Infinity'
      },
      'soc2': {
        'max': 'Infinity'
      },
      'on_premises_deployment': {
        'max': 'Infinity'
      },
      'hipaa_baa': {
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
