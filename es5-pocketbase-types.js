/**
 * PocketBase Types - ES5 JavaScript Version
 * Converted from TypeScript for use in PocketBase Goja engine (ES5.1 compatible)
 * This file was automatically generated from pocketbase-types.ts
 */

// Collections enum as ES5 object
var Collections = {
  Authorigins: "_authOrigins",
  Externalauths: "_externalAuths",
  Mfas: "_mfas",
  Otps: "_otps",
  Superusers: "_superusers",
  Cities: "cities",
  Counties: "counties",
  Groups: "groups",
  JobCategories: "jobCategories",
  JobLocations: "jobLocations",
  JobSubcategories: "jobSubcategories",
  Jobs: "jobs",
  Users: "users",
};

// GroupsGroupTypeOptions enum as ES5 object
var GroupsGroupTypeOptions = {
  "Skolklass": "Skolklass",
  "Sportförening": "Sportförening",
};

// JobsStatusOptions enum as ES5 object
var JobsStatusOptions = {
  "Klar": "Klar",
};

// UsersUserTypeOptions enum as ES5 object
var UsersUserTypeOptions = {
  "Uppdragsgivare": "Uppdragsgivare",
  "Uppdragsutförare": "Uppdragsutförare",
};

// Helper function to create a "typed" PocketBase instance
function createTypedPocketBase(pb) {
  return pb;
}

// Collection names reference (same as Collections)
var COLLECTION_NAMES = Collections;

// Utility functions for working with collections
function getCollectionName(collectionKey) {
  return Collections[collectionKey] || collectionKey;
}

function getAllCollections() {
  var collections = [];
  for (var key in Collections) {
    if (Collections.hasOwnProperty(key)) {
      collections.push(Collections[key]);
    }
  }
  return collections;
}

// Export object for module systems that support it
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Collections: Collections,
    createTypedPocketBase: createTypedPocketBase,
    COLLECTION_NAMES: COLLECTION_NAMES,
    getCollectionName: getCollectionName,
    getAllCollections: getAllCollections
  };
}

// Global assignment for direct script inclusion
if (typeof global !== 'undefined') {
  global.PocketBaseTypes = {
    Collections: Collections,
    createTypedPocketBase: createTypedPocketBase,
    COLLECTION_NAMES: COLLECTION_NAMES,
    getCollectionName: getCollectionName,
    getAllCollections: getAllCollections
  };
}

// Individual enum exports for convenience
if (typeof module !== 'undefined' && module.exports) {
  module.exports.GroupsGroupTypeOptions = GroupsGroupTypeOptions;
}
if (typeof global !== 'undefined') {
  global.PocketBaseTypes.GroupsGroupTypeOptions = GroupsGroupTypeOptions;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports.JobsStatusOptions = JobsStatusOptions;
}
if (typeof global !== 'undefined') {
  global.PocketBaseTypes.JobsStatusOptions = JobsStatusOptions;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports.UsersUserTypeOptions = UsersUserTypeOptions;
}
if (typeof global !== 'undefined') {
  global.PocketBaseTypes.UsersUserTypeOptions = UsersUserTypeOptions;
}

