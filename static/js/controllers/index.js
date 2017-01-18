(function () {

  'use strict';

  angular.module('inboxControllers', []);

  require('./inbox');

  require('./about');
  require('./analytics');
  require('./analytics-anc');
  require('./analytics-reporting');
  require('./analytics-reporting-detail');
  require('./analytics-targets');
  require('./check-date');
  require('./configuration');
  require('./configuration-export-audit-logs');
  require('./configuration-export-contacts');
  require('./configuration-export-feedback');
  require('./configuration-export-messages');
  require('./configuration-export-reports');
  require('./configuration-export-server-logs');
  require('./configuration-forms');
  require('./configuration-icons');
  require('./configuration-permissions');
  require('./configuration-settings-advanced');
  require('./configuration-settings-basic');
  require('./configuration-targets');
  require('./configuration-targets-edit.js');
  require('./configuration-translation-application');
  require('./configuration-translation-languages');
  require('./configuration-translation-messages');
  require('./configuration-user');
  require('./configuration-users');
  require('./contacts');
  require('./contacts-content');
  require('./contacts-edit');
  require('./contacts-report');
  require('./delete-doc-confirm');
  require('./delete-user');
  require('./edit-language');
  require('./edit-message-group');
  require('./edit-report');
  require('./edit-translation');
  require('./edit-translation-messages');
  require('./edit-user');
  require('./error');
  require('./feedback');
  require('./help');
  require('./home');
  require('./import-translation');
  require('./medic-reporter-modal');
  require('./messages');
  require('./messages-content');
  require('./navigation-confirm');
  require('./reports');
  require('./reports-add');
  require('./reports-content');
  require('./send-message');
  require('./tasks');
  require('./tasks-content');
  require('./theme');
  require('./tour-select');
  require('./user-language-modal');
  require('./version-update');

}());