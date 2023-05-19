const couchbase = require('couchbase');
const RepositoryError = require('../exceptions/repositoryError');
const connectionManager = require('./connectionManager')

/**
 * From Lab04: K/V operations
 * Finds a playlist based on the key but returns result as a
 * JSON string
 * 
 * @param {string} key The key for the document to return
 * @returns {JSON} The document for the specified key
 * @throws {RepositoryError} if something failed during the Couchbase call
 */
async function findById(key) {
    const cluster = await connectionManager.couchbaseConnect();
    const bucket = connectionManager.getBucket(process.env.BUCKET_NAME);
    const scope = connectionManager.getScope(process.env.SCOPE_NAME);
    const collection = scope.collection(process.env.PLAYLIST_COLLECTION_NAME);

    // TODO: Implement this method to use the key to obtain a document and return it.
    try {
        const result = await collection.get(key);
        console.log('Found document:', result.content)
        return result.content;
    //        Be sure to handle exceptions and throw RepositoryException
    } catch (err) {
        console.error(err);
        if (err instanceof couchbase.DocumentNotFoundError) {
            throw new RepositoryError(`Failed to load playlist for key: ${key}`)
        }
        throw err;
    }
}

/**
 * From Lab04: K/V operations
 * Creates a new playlist from the playlist object provided 
 * 
 * @param {JSON} playlist 
 * @returns {string} The key for the created document
 * @throws {RepositoryError} If something fails during the Couchbase call
 */
async function create (playlist) {
    const cluster = await connectionManager.couchbaseConnect();
    const bucket = connectionManager.getBucket(process.env.BUCKET_NAME);
    const scope = connectionManager.getScope(process.env.SCOPE_NAME);
    const collection = scope.collection(process.env.PLAYLIST_COLLECTION_NAME);

    const key = playlist.id;
    // TODO: Implement this method to insert a new document. Use the getKey() method to generate the necessary key.
    try {
        await collection.insert(key, playlist);
        console.log('Inserted document successfully');
        return key;
    //        Be sure to handle exceptions and throw RepositoryException
    } catch (err) {
        console.error(err);
        if (err instanceof couchbase.DocumentExistsError) {
            throw new RepositoryError(`Document already exists for playlistId: ${key}`)
        }
        throw err;
    }
}

/**
 * From Lab04: K/V operations 
 * Removes an entry for the specified key.
 * 
 * @param {string} key 
 * @throws {RepositoryError} If something fails during the Couchbase call
 */
async function remove (key) {
    // TODO: Implement this method to remove a document based on the provided key.
    cluster = await connectionManager.couchbaseConnect();
    bucket = connectionManager.getBucket(process.env.BUCKET_NAME);
    scope = connectionManager.getScope(process.env.SCOPE_NAME);
    // And select the collection
    const collection = scope.collection(process.env.PLAYLIST_COLLECTION_NAME);
    try {
        await collection.remove(key);
    //        Be sure to handle exceptions and throw RepositoryException
    } catch (err) {
        console.error(err);
        if (err instanceof couchbase.DocumentNotFoundError) {
            throw new RepositoryError(`Document not found for key: ${key}`)
        }
        throw err;
    }
}

/**
 * From Lab04: K/V operations
 * Updates the entry specified by the key using the supplied JSON document
 * 
 * @param {string} key 
 * @param {JSON} playlist 
 * @returns {JSON} Updated playlist
 */
async function update (key, playlist) {
    // TODO: Implement this method to update an existing document. 
    if (key != playlist.id) {
        throw new RepositoryError("Key and type/id of document don't match");
    }
    // Initialize the cluster, bucket and scope
    cluster = await connectionManager.couchbaseConnect();
    bucket = connectionManager.getBucket(process.env.BUCKET_NAME);
    scope = connectionManager.getScope(process.env.SCOPE_NAME);
    // And select the collection
    const collection = scope.collection(process.env.PLAYLIST_COLLECTION_NAME);
    try {
        await collection.replace(key, playlist);
        return playlist;
    //        Be sure to handle exceptions and throw RepositoryException
    } catch (err) {
        console.error(err);
        if (err instanceof couchbase.DocumentNotFoundError) {
            throw new RepositoryError(`Document not found for key: ${key}`)
        }
        throw err;
    }
}

/**
 * From Lab04: K/V operations
 * Depending on the current presence of the specified key in the database, either insert or
 * update the entry.
 * 
 * @param {string} key 
 * @param {JSON} playlist 
 * @returns {JSON} Returns the updated or inserted value
 * @throws {RepositoryError} Thrown for errors occurring in this method, either from
 * missing pre-dependencies or from errors while calling Couchbase.
 */
async function insertOrUpdate (key, playlist) {
    if (key != playlist.id) {
        throw new RepositoryError("Key and type/id of document don't match");
    }
    // TODO: Implement this method to insert or update a document. 
    //        Be sure to handle exceptions and throw RepositoryException

}

/**
 * Export the defined public methods
 */
// Key/Value methods
exports.findById = findById;
exports.create = create;
exports.remove = remove;
exports.update = update;
exports.insertOrUpdate = insertOrUpdate;
