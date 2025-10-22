const fs = require('fs');
const path = require('path');

// Read the TypeScript types file
const tsFilePath = path.join(__dirname, '..', 'pocketbase-types.ts');
const jsFilePath = path.join(__dirname, '..', 'es5-pocketbase-types.js');

console.log('Converting TypeScript types to ES5-compatible JavaScript for PocketBase Goja engine...');

try {
  const tsContent = fs.readFileSync(tsFilePath, 'utf8');

  let jsContent = `/**
 * PocketBase Types - ES5 JavaScript Version
 * Converted from TypeScript for use in PocketBase Goja engine (ES5.1 compatible)
 * This file was automatically generated from pocketbase-types.ts
 */

`;

  // Extract Collections enum specially first
  const collectionsMatch = tsContent.match(/export enum Collections\s*{([^}]+)}/);
  if (collectionsMatch) {
    const collectionsBody = collectionsMatch[1];
    jsContent += `// Collections enum as ES5 object\n`;
    jsContent += `var Collections = {\n`;

    const collectionRegex = /(\w+)\s*=\s*"([^"]+)"/g;
    let collectionMatch;

    while ((collectionMatch = collectionRegex.exec(collectionsBody)) !== null) {
      jsContent += `  ${collectionMatch[1]}: "${collectionMatch[2]}",\n`;
    }

    jsContent += `};\n\n`;
  }

  // Extract and convert other enums to JavaScript objects
  const enumRegex = /export enum (\w+)\s*{([^}]+)}/g;
  let enumMatch;
  const processedEnums = new Set(['Collections']); // Skip Collections as we already processed it

  while ((enumMatch = enumRegex.exec(tsContent)) !== null) {
    const enumName = enumMatch[1];

    if (processedEnums.has(enumName)) {
      continue;
    }
    processedEnums.add(enumName);

    const enumBody = enumMatch[2];

    // Parse enum values
    const enumValues = {};
    const valueRegex = /"([^"]+)"\s*=\s*"([^"]+)"/g;
    let valueMatch;

    while ((valueMatch = valueRegex.exec(enumBody)) !== null) {
      enumValues[valueMatch[1]] = valueMatch[2];
    }

    // Generate ES5 JavaScript enum object
    jsContent += `// ${enumName} enum as ES5 object\n`;
    jsContent += `var ${enumName} = {\n`;

    for (var key in enumValues) {
      if (enumValues.hasOwnProperty(key)) {
        jsContent += `  "${key}": "${enumValues[key]}",\n`;
      }
    }

    jsContent += `};\n\n`;
  }

  // Add helper functions in ES5 style
  jsContent += `// Helper function to create a "typed" PocketBase instance
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
`;

  // Add all the enum exports at the end for easy access
  jsContent += `\n// Individual enum exports for convenience\n`;
  for (var enumName of processedEnums) {
    if (enumName !== 'Collections') {
      jsContent += `if (typeof module !== 'undefined' && module.exports) {\n`;
      jsContent += `  module.exports.${enumName} = ${enumName};\n`;
      jsContent += `}\n`;
      jsContent += `if (typeof global !== 'undefined') {\n`;
      jsContent += `  global.PocketBaseTypes.${enumName} = ${enumName};\n`;
      jsContent += `}\n\n`;
    }
  }

  // Write the JavaScript file
  fs.writeFileSync(jsFilePath, jsContent, 'utf8');

  console.log('✅ Successfully converted TypeScript types to ES5-compatible JavaScript!');
  console.log('📁 Output file: ' + jsFilePath);
  console.log('');
  console.log('Usage in PocketBase Goja engine:');
  console.log('');
  console.log('// Load the file in your PocketBase hook:');
  console.log('var types = require("./es5-pocketbase-types.js");');
  console.log('');
  console.log('// Or if loaded as global:');
  console.log('// Access via global.PocketBaseTypes');
  console.log('');
  console.log('// Usage examples:');
  console.log('var userCollection = types.Collections.Users;');
  console.log('var users = $app.dao().findRecordsByFilter(userCollection, "verified = true");');
  console.log('');
  console.log('// Using helper functions:');
  console.log('var collectionName = types.getCollectionName("Users");');
  console.log('var allCollections = types.getAllCollections();');

} catch (error) {
  console.error('❌ Error converting types:', error.message);
  process.exit(1);
}
