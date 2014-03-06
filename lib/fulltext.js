exports.contacts = {
  index: function(doc) {
    if (doc && ~['clinic', 'health_center', 'district_hospital'].indexOf(doc.type)) {
      var ret = new Document(),
        district,
        facility,
        contact = doc.contact;

      ret.add(doc.name);

      if (contact && contact.phone) {
        ret.add(contact.phone);
      }

      if (contact && contact.name) {
        ret.add(contact.name);
      }

      if (contact && contact.rc_code) {
        ret.add(contact.rc_code);
      }

      if (doc.type === 'district_hospital') {
        ret.add(doc._id, {
          field: 'district'
        });
      } else if (doc.type === 'health_center') {
        district = doc.parent;

        if (district && district._id) {
          ret.add(district._id, {
            field: 'district'
          });
        }
      } else if (doc.type === 'clinic') {
        facility = doc.parent;
        if (facility && facility._id) {
          ret.add(facility._id, {
            field: 'facility'
          });

          district = facility.parent;
          if (district) {
            ret.add(district._id, {
              field: 'district'
            });
          }
        }
      }

      return ret;
    } else {
      return null;
    }
  }
};

exports.data_records = {
  index: function(doc) {

     // Niether couchapp code share mode, nor kanso code share mode workes in the index function, so we have to put inner function here. The add index function is manually copied from lib/search_index.js
     // !code lib/search_index.js
     // require('lib/search_index.js')
    function addIndex (defaultKeys, skipKeys, obj, ret) {
      for (var key in obj) {
        var value = obj[key];
        if (typeof value === "string" || typeof value === "number") {
          //add default index
          if (defaultKeys.indexOf(key) !== -1) {
            ret.add(value);
          }

          //add field index
          if (skipKeys.indexOf(key) === -1){ //no skip
            var options = {field: key};

            //normalize date field
            if (/_date$/.test(key)) {
              var date = new Date(value);
              if (date) {
                value = date;
                options.type = "date";
              } else {
                log.info('failed to parse date ' + key + ' on ' + doc._id);
              }
            }

            //normalize id feild. Just for backward compatibility. Seriously, who is going to remember UUID and search for it?
            if (key === '_id') {
              options.field = "uuid";
            }

            //add feild index
            ret.add(value, options);
          }
        } else if (typeof value === "object") { //arry or object
          addIndex(defaultKeys, skipKeys, value, ret);
        } else { //Number, Boolean, function
          //skip
        }
      }
    }

    function addDistrictIndex (doc, ret) {
      //search by district [district_hospital], facility [health_center] or clinic [clinic]
      var district;
      if (doc.related_entities.clinic) {
        if (doc.related_entities.clinic.doc && doc.related_entities.clinic.doc.parent && doc.related_entities.clinic.doc.parent.parent) {
          district = doc.related_entities.clinic.doc.parent.parent;
        }
      } else if (doc.related_entities.health_center) {
        if (doc.related_entities.health_center.doc && doc.related_entities.health_center.doc.parent) {
          district = doc.related_entities.health_center.doc.parent;
        }
      } else if (doc.related_entities.district_hospital) {
        if (doc.related_entities.district_hospital.doc) {
          district = doc.related_entities.district_hospital.doc;
        }
      }

      if (district) {
        ret.add (district.name, {field: 'district'});
        ret.add (district._id, {field: 'district'});
      }
    }

    if (doc && doc.type === 'data_record') {
      var defaultKeys = ["sent_by", "name", "phone", "message"];
      var skipKeys = ['type', 'form', 'from', '_rev', 'refid', 'id'];
      // backward compatibility: keys from the original default index
      defaultKeys.push("patient_id", "patient_name",
                "caregiver_name", "caregiver_phone");
      var ret = new Document();
      addIndex(defaultKeys, skipKeys, doc, ret);
      addDistrictIndex(doc, ret);
      return ret;
    } else {
      return null;
    }
  }
};


exports.data_records_array = {
  index: function(doc) {
     // Niether couchapp code share mode, nor kanso code share mode workes in the index function, so we have to put inner function here. The add index function is manually copied from lib/search_index.js
     // !code lib/search_index.js
     // require('lib/search_index.js')
    function addDefaultIndex (keys, obj, ret) {
      for (var key in obj) {
        var value = obj[key];
        if (typeof value === "string" || typeof value === "number") {
          if (keys.indexOf(key) !== -1) {
            ret.add(value);
          }
        } else if (typeof value === "object") { //arry or object
          addDefaultIndex(keys, value, ret);
        } else { //Number, Boolean, function
          //skip
        }
      }
    }

    if (doc && doc.type === 'data_record') {
      var keys = ["sent_by", "name", "phone", "message"];
      // keys from the original default index
      keys.push("patient_id", "patient_name",
                "caregiver_name", "caregiver_phone");
      var ret = [];
      for (var i=0; i<keys.length; i++) {
        ret[i] = new Document();
        addDefaultIndex([keys[i]], doc, ret[i]);
      }

      return ret;
    } else {
      return null;
    }
  }
};

exports.data_records_original = {
  index: function(doc) {

    if (doc && doc.type === 'data_record') {
      var ret = new Document();

      // defaults
      if (doc.patient_id) {
        ret.add(doc.patient_id);
      }
      if (doc.patient_name) {
        ret.add(doc.patient_name);
      }
      if (doc.caregiver_name) {
        ret.add(doc.caregiver_name);
      }
      if (doc.caregiver_phone) {
        ret.add(doc.caregiver_phone);
      }

      var skip = ['type', 'form', 'from', '_rev', 'refid', 'id'],
        date;

      // index form fields and _id
      for (var key in doc) {
        if (skip.indexOf(key) !== -1) {
          continue;
        }
        // if field key ends in _date, try to parse as date.
        if (/_date$/.test(key)) {
          date = new Date(doc[key]);
          if (date) {
            //log.info('adding date '+key);
            ret.add(date, {
              field: key,
              type: "date"
            });
          } else {
            log.info('failed to parse date ' + key + ' on ' + doc._id);
          }
        } else if (typeof doc[key] === 'string' ||
          typeof doc[key] === 'number') {
          if (key === '_id') {
            ret.add(doc[key], {
              field: 'uuid'
            });
          } else {
            ret.add(doc[key], {
              field: key
            });
          }
        }
      }

      // district is needed to verify search is authorized
      if (doc.related_entities.clinic &&
        doc.related_entities.clinic.parent &&
        doc.related_entities.clinic.parent.parent &&
        doc.related_entities.clinic.parent.parent._id) {
        ret.add(
          doc.related_entities.clinic.parent.parent._id, {
            field: 'district'
          });
      }
      return ret;
    } else {
      return null;
    }
  }
};
