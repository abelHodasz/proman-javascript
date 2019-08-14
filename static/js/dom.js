// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";

export let dom = {
    _appendToElement: function (elementToExtend, textToAppend, prepend = false) {
        // function to append new DOM elements (represented by a string) to an existing DOM element
        let fakeDiv = document.createElement('div');
        fakeDiv.innerHTML = textToAppend.trim();

        for (let childNode of fakeDiv.childNodes) {
            if (prepend) {
                elementToExtend.prependChild(childNode);
            } else {
                elementToExtend.appendChild(childNode);
            }
        }

        return elementToExtend.lastChild;
    },
    createBoardBtn: function () {
        let button = document.createElement('button');
        button.textContent = "Create board";
        button.onclick = function () {



            dom.showModal('Create board');
            document.getElementById('form').addEventListener("submit", function (event) {
                dom.createBoard(document.getElementById('user-input').value);
                event.preventDefault();
                document.getElementById('modal-content').innerHTML = '';
                $('#modal').modal('hide');
            });
        };
        document.querySelector('body').appendChild(button);
    },

    createBoard: function (input) {
        dataHandler.createNewBoard(input, function (response) {
            console.log(response)
        })
    },

    showModal: function (title) {
        let modal = `
            <div id="modal-header" class="modal-header">
                <h5 class="modal-title">${title}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form id="form">
                <div id="modal-body" class="modal-body">
                    <input type="text" id="user-input" required>
                </div>
                <div id="modal-footer" class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button id="create-btn" type="submit" class="btn btn-primary">Create</button>
                </div>
            </form>
            `;

        document.getElementById('modal-content').innerHTML = modal;

        $('#modal').modal('show');
    },
    init: function () {
        // This function should run once, when the page is loaded.
        this.createBoardBtn();

    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function(boards){
            dom.showBoards(boards);
        });
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also
        document.getElementById('boards').remove();
        let boardList = '';

        for(let board of boards){
            boardList += `
            <section class="board">
            <div class="board-header">
                <span class="board-title">${board.title}</span>
                <button class="board-add">Add Card</button>
                <button class="board-toggle"><i class="fas fa-chevron-down"></i></button>
            </div>
            </section>
            `;
        }

        const outerHtml = `
            <div class="board-container">
                ${boardList}
            </div>
        `;

        this._appendToElement(document.querySelector('body'), outerHtml);
    },
    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
    },
    // here comes more features
};
