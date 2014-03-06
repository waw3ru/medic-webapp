/**
 * Index all the values of keys in the default index
 * @param  {[array]} keys array of keys whose content will be added to the index
 * @return {[type]}      [description]
*/
 // Niether couchapp code share mode, nor kanso code share mode workes in the index function, so we have to put inner function here.

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

exports.addDefaultIndex = addDefaultIndex;

/**
 * add indexes (both default and field index) on a given document.
 * A key can be in both defaultKeys and skipKeys and it means that the default index will have the key value, but not in a feild index. field index means that you can search by field:value.
 *
 * @param {[array]} defaultKeys [values of default keys are added as default indexes]
 * @param {[array]} skipKeys    [values of skipKeys are not added to the index, other keys are added as field indexes]
 * @param {[object]} obj         [document or an object in a document]
 * @param {[object]} ret         [index document object]
 */
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

exports.addIndex = addIndex;

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

exports.addDistrictIndex = addDistrictIndex;

