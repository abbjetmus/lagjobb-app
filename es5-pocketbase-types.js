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
  InterestRequests: "interestRequests",
  InterestRequestsJobsView: "interestRequestsJobsView",
  JobCategories: "jobCategories",
  JobSubcategories: "jobSubcategories",
  Jobs: "jobs",
  Users: "users",
};

// GroupsGroupTypeOptions enum as ES5 object
var GroupsGroupTypeOptions = {
  "Lag": "Lag",
  "Klass": "Klass",
  "Förening": "Förening",
  "Organisation": "Organisation",
};

// GroupsPublicationStatusOptions enum as ES5 object
var GroupsPublicationStatusOptions = {
  "Granskning": "Granskning",
  "Publicerad": "Publicerad",
  "Uppdatering": "Uppdatering",
  "Nekad": "Nekad",
};

// InterestRequestsStatusOptions enum as ES5 object
var InterestRequestsStatusOptions = {
  "Godkänd": "Godkänd",
  "Betald": "Betald",
  "Utförd": "Utförd",
  "Nekad": "Nekad",
  "Förfrågan": "Förfrågan",
};

// InterestRequestsJobsViewStatusOptions enum as ES5 object
var InterestRequestsJobsViewStatusOptions = {
  "Granskning": "Granskning",
  "Publicerad": "Publicerad",
  "Nekad": "Nekad",
  "Uppdatering": "Uppdatering",
};

// JobsPublicationStatusOptions enum as ES5 object
var JobsPublicationStatusOptions = {
  "Granskning": "Granskning",
  "Publicerad": "Publicerad",
  "Nekad": "Nekad",
  "Uppdatering": "Uppdatering",
};

// UsersUserAccountTypeOptions enum as ES5 object
var UsersUserAccountTypeOptions = {
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
  module.exports.GroupsPublicationStatusOptions = GroupsPublicationStatusOptions;
}
if (typeof global !== 'undefined') {
  global.PocketBaseTypes.GroupsPublicationStatusOptions = GroupsPublicationStatusOptions;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports.InterestRequestsStatusOptions = InterestRequestsStatusOptions;
}
if (typeof global !== 'undefined') {
  global.PocketBaseTypes.InterestRequestsStatusOptions = InterestRequestsStatusOptions;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports.InterestRequestsJobsViewStatusOptions = InterestRequestsJobsViewStatusOptions;
}
if (typeof global !== 'undefined') {
  global.PocketBaseTypes.InterestRequestsJobsViewStatusOptions = InterestRequestsJobsViewStatusOptions;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports.JobsPublicationStatusOptions = JobsPublicationStatusOptions;
}
if (typeof global !== 'undefined') {
  global.PocketBaseTypes.JobsPublicationStatusOptions = JobsPublicationStatusOptions;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports.UsersUserAccountTypeOptions = UsersUserAccountTypeOptions;
}
if (typeof global !== 'undefined') {
  global.PocketBaseTypes.UsersUserAccountTypeOptions = UsersUserAccountTypeOptions;
}

