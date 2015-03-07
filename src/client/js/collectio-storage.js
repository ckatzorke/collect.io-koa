var collectioStorage = (function () {
    'use strict';

    var dbName = 'collect.io';

    var _getDB = function () {
        var dbDeferred = new Promise(function (resolve, reject) {
            var request = indexedDB.open(dbName, 1);

            request.onerror = function (event) {
                // Handle errors.
                reject(event.error);
            };
            request.onsuccess = function (event) {
                resolve(event.target.result);
            };
            request.onupgradeneeded = function (event) {
                var db = event.target.result;

                // Create an objectStore to hold information about our games. We're
                // going to use "id" as our key path because it's guaranteed to be
                // unique
                var objectStore = db.createObjectStore('games', {
                    keyPath: 'id'
                });

                // Create an index to search games by name. We may have duplicates
                // so we can't use a unique index.
                objectStore.createIndex('name', 'name', {
                    unique: false
                });

                // Use transaction oncomplete to make sure the objectStore creation is 
                // finished before adding data into it.
                objectStore.transaction.oncomplete = function (event) {
                    console.log('Finished creating collect.io db');
                };
                resolve(db);
            };
        });
        return dbDeferred;
    };
    
    /**
     * Adds or updates a game entry.
     * @param game the object to store, containes the id, the gamebomb details, and collectio metadata
     */
    var addGame = function (game) {
        // Store values in the newly created objectStore.
        _getDB().then(function (db) {
            var gameObjectStore = db.transaction('games', 'readwrite').objectStore('games');
            var request = gameObjectStore.add(game);
            request.onsuccess = function (event) {
                console.log('Entry added', game);
            };
        });
    };
    /**
     * Looks up the game with given id
     * @param id the id to look for
     * @return the stored object, if found, undefined if not found
     */
    var getGameById = function (id) {
        var gameDeferred = new Promise(function (resolve, reject) {
            _getDB().then(function (db) {
                var transaction = db.transaction(['games']);
                var objectStore = transaction.objectStore('games');
                var request = objectStore.get(id);
                request.onerror = function (event) {
                    // Handle errors!
                };
                request.onsuccess = function (event) {
                    resolve(request.result);
                };
            });
        });
        return gameDeferred;
    };

    var getAll = function () {
        var gamesDeferred = new Promise(function (resolve, reject) {
            _getDB().then(function (db) {
                var games = [];
                var objectStore = db.transaction('games').objectStore('games');
                objectStore.openCursor().onsuccess = function (event) {
                    var cursor = event.target.result;
                    if (cursor) {
                        games.push(cursor.value);
                        cursor.continue();
                    } else {
                        console.log('Got all games ', games.length);
                        resolve(games);
                    }
                };
            });
        });
        return gamesDeferred;
    };
    return {
        'add': addGame,
        'getGameById': getGameById,
        'getAll': getAll
    };
}());