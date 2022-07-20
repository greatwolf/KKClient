/**
 ***IMPORTANT NOTICE***:
 *
 * KKClient requires an online RESTFUL data store for saving
 * and retrieving generated wallet metadata in order to operate.
 * The original client used blockcypher.com for this by supplying
 * KeepKey's own api token. However that api token no longer works.
 *
 * There are two options for solving this issue:
 *  - Create your own blockcypher api token at blockcypher.com.
 *  - Setup a google realtime database at firebaseio.com.
 */

export const APITOKENS =
{
  METADATA_API_TOKEN: "wXFsO4163LADxDCT3lqNs9hQjeiP6jZcmuf5T6ad",
  FIREBASE_ID: "keepkey-80386",
  EtherscanApiToken: ["RN6HBGBVWRTWK2Y8MNZEGBENTV5733QG3F"],
}

/**
 * Modify the above lines and set it to your new api token surrounded with double quotes.
 *
 * If 'FIREBASE_ID' is NOT set then api.blockcypher.com will be used and
 * METADATA_API_TOKEN must be a valid blockcypher token.
 *
 * If 'FIREBASE_ID' is set then firebaseio.com service is used as the
 * metadata store. METADATA_API_TOKEN must be set to the legacy secret for this database.
 * This can be found under console.firebase.google.com in 'Settings' -> 'Service accounts' tab.
 */
