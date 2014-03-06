var _ = require('underscore'),
  fulltext = require('../lib/search_index.js'); //for nodeunit
// fulltext = require('lib/search_index'); //for web

exports['addDefaultIndex exposed'] = function(test) {
  test.ok(_.isFunction(fulltext.addDefaultIndex));
  test.equals(fulltext.addDefaultIndex.length, 3);
  test.done();
};



exports['addDefaultIndex for a message document'] = function(test) {
  //mock the index document function add
  Array.prototype.add = Array.prototype.push;
  var ret = [];
  var keys = ["sent_by", "name", "phone", "message", "non_exist_key"];
  var expected = [
    "admin",
    12345678,
    "admin",
    "Northern California",
    "James Smith",
    "+14081111111",
    "Kaiser",
    "Mary Joans",
    "+16402222222",
    "I want to test the message"
  ];
  fulltext.addDefaultIndex(keys, msg_doc, ret);
  test.deepEqual(ret, expected, "Actual result = " + ret.join());
  test.done();
  delete Array.prototype.add;
};

exports['addIndex exposed'] = function(test) {
  test.ok(_.isFunction(fulltext.addIndex));
  test.equals(fulltext.addIndex.length, 4);
  test.done();
};

exports['addIndex for a message document'] = function(test) {
  //mock the index document function add
  Array.prototype.add = Array.prototype.push;
  var ret = [];
  var defaultKeys = ["sent_by", "name", "phone", "message", "non_exist_key"];
  var skipKeys = ["_id", "sent_by", "uuid", "_rev", "form", "non_exist_key"];
  var expected = [
    "admin",
    12345678, 12345678, {
      field: "phone"
    },
    "admin",
    "+16402222222", {
      field: "to"
    },
    "Northern California", "Northern California", {
      field: "name"
    },
    "James Smith", "James Smith", {
      field: "name"
    },
    "+14081111111", "+14081111111", {
      field: "phone"
    },
    "district_hospital", {
      field: "type"
    },
    "Kaiser", "Kaiser", {
      field: "name"
    },
    "Mary Joans", "Mary Joans", {
      field: "name"
    },
    "+16402222222", "+16402222222", {
      field: "phone"
    },
    "health_center", {field: "type"},
    "I want to test the message", "I want to test the message", {
      field: "message"
    },
    "pending", {
      field: "state"
    },
    "data_record", {
      field: "type"
    },
    new Date(1392399620834), { field: 'reported_date', type: 'date' }
  ];

  fulltext.addIndex(defaultKeys, skipKeys, msg_doc, ret);
  test.deepEqual(ret, expected, "AddIndex results doesn't match");
  test.done();
  delete Array.prototype.add;
};

exports['addDistrictIndex exposed'] = function(test) {
  test.ok(_.isFunction(fulltext.addDistrictIndex));
  test.equals(fulltext.addDistrictIndex.length, 2);
  test.done();
};

exports['addDistrictIndex for a message document'] = function(test) {
  //mock the index document function add
  Array.prototype.add = Array.prototype.push;
  var ret = [];

  var expected = [
    "Northern California", {field: "district"},
    "bd01b10f-1312-71d2-f107ba7dfa0eff82", {field: "district"}
  ];


  msg_doc.related_entities = related_entities_clinic;
  fulltext.addDistrictIndex(msg_doc, ret);
  test.deepEqual(ret, expected, "Related Entities of Clinic: Actual result = " + ret.join());

  msg_doc.related_entities = related_entities_health_center;
  ret = [];
  fulltext.addDistrictIndex(msg_doc, ret);
  test.deepEqual(ret, expected, "Related Entities of Health Center: Actual result = " + ret.join());

  msg_doc.related_entities = related_entities_district_hospital;
  ret = [];
  fulltext.addDistrictIndex(msg_doc, ret);
  test.deepEqual(ret, expected, "Related Entities of District: Actual result = " + ret.join());

  test.done();
  delete Array.prototype.add;
  delete msg_doc.related_entities; //reset related entities
};

var msg_doc = {
  "kujua_message": true,
  "sent_by": "admin",
  "phone": 12345678,
  "tasks": [{
    "messages": [{
      "sent_by": "admin",
      "to": "+16402222222",
      "uuid": "de960e75-2d65-fed1-51485fca5e261bc5",
      "facility": {
        "parent": {
          "parent": {},
          "_id": "de960e75-2d65-fed1-51485fca5e1e40f6",
          "name": "Northern California",
          "contact": {
            "name": "James Smith",
            "phone": "+14081111111"
          },
          "type": "district_hospital",
          "_rev": "3-879e32cbd7ab090e8be89b4b54606cea"
        },
        "_id": "de960e75-2d65-fed1-51485fca5e1e5295",
        "name": "Kaiser",
        "phone": null,
        "message": function() {},
        "contact": {
          "name": "Mary Joans",
          "phone": "+16402222222"
        },
        "type": "health_center",
        "_rev": "4-4dfea43c03659bc97f6506b85e621c24"
      },
      "message": "I want to test the message"
    }],
    "state": "pending"
  }],
  "errors": [],
  "_id": "de960e752d65fed151485fca5e290f74",
  "form": null,
  "_rev": "1-1a495d19cc087dc0034d031647f02a53",
  "type": "data_record",
  "reported_date": 1392399620834
};

var related_entities_clinic = {
  "clinic": {
    "contactName": "Robert",
    "text": "Dublin, Robert, 4567843232",
    "name": "Dublin",
    "type": "clinic",
    "doc": {
      "parent": {
        "parent": {
          "parent": {},
          "_id": "bd01b10f-1312-71d2-f107ba7dfa0eff82",
          "name": "Northern California",
          "contact": {
            "name": "John Smith",
            "phone": "4081234567"
          },
          "type": "district_hospital",
          "_rev": "3-708072553a2f6a7d3549cbe777c40f11"
        },
        "_id": "bd01b10f-1312-71d2-f107ba7dfa285270",
        "name": "East Bay",
        "contact": {
          "name": "Mary Joans",
          "phone": "+123456789"
        },
        "type": "health_center",
        "_rev": "5-e9a7ad0fc8749464f30c2c23b14f5496"
      },
      "_id": "bd01b10f-1312-71d2-f107ba7dfa285e7e",
      "name": "Dublin",
      "contact": {
        "name": "Robert",
        "phone": "4567843232"
      },
      "type": "clinic",
      "_rev": "8-7716e70d67ef55953716a92f78c5d21c"
    },
    "id": "bd01b10f-1312-71d2-f107ba7dfa285e7e",
    "phone": "4567843232"
  }
};

var related_entities_health_center = {
  "health_center": {
    "contactName": "Mary Joans",
    "text": "East Bay, Mary Joans, +123456789",
    "name": "East Bay",
    "type": "health_center",
    "doc": {
      "parent": {
        "parent": {},
        "_id": "bd01b10f-1312-71d2-f107ba7dfa0eff82",
        "name": "Northern California",
        "contact": {
          "name": "John Smith",
          "phone": "4081234567"
        },
        "type": "district_hospital",
        "_rev": "3-708072553a2f6a7d3549cbe777c40f11"
      },
      "_id": "bd01b10f-1312-71d2-f107ba7dfa285270",
      "name": "East Bay",
      "contact": {
        "name": "Mary Joans",
        "phone": "+123456789"
      },
      "type": "health_center",
      "_rev": "5-e9a7ad0fc8749464f30c2c23b14f5496"
    },
    "id": "bd01b10f-1312-71d2-f107ba7dfa285270",
    "phone": "+123456789"
  }
};

var related_entities_district_hospital = {
  "district_hospital": {
    "contactName": "John Smith",
    "text": "Northern California, John Smith, 4081234567",
    "name": "Northern California",
    "type": "district_hospital",
    "doc": {
      "parent": {},
      "_id": "bd01b10f-1312-71d2-f107ba7dfa0eff82",
      "name": "Northern California",
      "contact": {
        "name": "John Smith",
        "phone": "4081234567"
      },
      "type": "district_hospital",
      "_rev": "3-708072553a2f6a7d3549cbe777c40f11"
    },
    "id": "bd01b10f-1312-71d2-f107ba7dfa0eff82",
    "phone": "4081234567"
  }
};
