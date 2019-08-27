// this object contains the functions which handle the data and its reading/writing
// feel free to extend and change to fit your needs

// (watch out: when you would like to use a property/function of an object from the
// object itself then you must use the 'this' keyword before. For example: 'this._data' below)
export let dataHandler = {
    _data: {}, // it contains the boards and their cards and statuses. It is not called from outside.
    _api_get: function (url, callback) {
        // it is not called from outside
        // loads data from API, parses it and calls the callback with it

        fetch(url, {
            method: 'GET',
            credentials: 'same-origin'
        })
        .then(response => response.json())  // parse the response as JSON
        .then(json_response => callback(json_response));  // Call the `callback` with the returned object
    },
    _api_post: function (url, data, callback) {
        fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        })
        .then(response => response.json())  // parse the response as JSON
        .then(json_response => callback(json_response));  // Call the `callback` with the returned object
    },
    init: function () {
    },
    getBoards: function (callback) {
        // the boards are retrieved and then the callback function is called with the boards

        // Here we use an arrow function to keep the value of 'this' on dataHandler.
        //    if we would use function(){...} here, the value of 'this' would change.
        this._api_get('/get-boards', (response) => {
            this._data = response;
            callback(response);
        });
    },
    getBoard: function (boardId, callback) {
        // the board is retrieved and then the callback function is called with the board
    },
    getStatuses: function (callback) {
       this._api_get(`/get-statuses`, (response) => {
            callback(response);
        });
    },

    getStatusesByBoardId: function (boardID, callback){
        this._api_get(`/status/${boardID}`, (response) => {
            callback(response);
        });
    },

    getStatus: function (statusId, callback) {
        // the status is retrieved and then the callback function is called with the status
    },
    getCardsByBoardId: function (boardId, statusId, callback) {
        this._api_get(`/cards/${boardId}/${statusId}`, (response) => {
            callback(response);
        });
    },
    getCard: function (cardId, callback) {
        this._api_get(`/card/${cardId}`, (response) => {
            callback(response);});
    },
    getColumn: function (statusId, callback) {
        this._api_get(`/column/${statusId}`, (response) => {
            callback(response);});
    },

    createNewBoard: function (boardTitle, callback) {

        this._api_get(`/create-board/${boardTitle}`, (response) => {
            this._data = response;
            callback(response);
        });
    },
    createNewCard: function (cardTitle, boardId, statusId, callback) {
        let data = {cardTitle, boardId, statusId};
        this._api_post(`/create-card`, data,  (response) => {
            callback(response);
        });
    },
    createNewColumn: function (columnTitle, boardId, callback) {
        let data = {columnTitle, boardId};
        this._api_post(`/create-column`, data,  (response) => {
            callback(response);
        });
    }
    // here comes more features
};
