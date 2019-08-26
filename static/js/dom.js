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
        button.classList.add('create-button');
        button.onclick = function () {



            dom.showModal('Create board');
            document.getElementById('form').addEventListener("submit", function (event) {
                dom.createBoard(document.getElementById('user-input').value);
                event.preventDefault();
                document.getElementById('modal-content').innerHTML = '';
                $('#modal').modal('hide');
            });
        };
        document.querySelector('#create-board-btn').appendChild(button);
    },

    addCard: function (boardId, input) {
        dataHandler.createNewCard(input, boardId, 0, dom.loadBoards);
    },

    createBoard: function (input) {
        dataHandler.createNewBoard(input, function (response) {
        dom.loadBoards()
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

    clickHandler: function (event) {
        if (event.target.closest('.board-toggle')) {
            let id = event.target.id.split('-')[2];
            document.getElementById(`toggle-icon-${id}`).classList.toggle("rotate180");
            let element = document.getElementById('columns-' + id);
            dom.toggleBoards(element);
        }
        if (event.target.classList.contains('board-add')) {
            let id = event.target.id.split('-')[2];
            dom.showModal("Add Card");
            document.getElementById('form').addEventListener("submit", function (event) {
                dom.addCard(id, document.getElementById('user-input').value);
                event.preventDefault();
                document.getElementById('modal-content').innerHTML = '';
                $('#modal').modal('hide');

            });

        }
    },

    init: function () {
        document.addEventListener('click', function (event) {
         dom.clickHandler(event);
        });
        this.createBoardBtn();

    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function(boards){
            dom.showBoards(boards);
        });
    },


    showBoard: function (board, callback) {

        let boardHtml = `
                <section id="board-${board.id}" class="board">
                <div class="board-header">
                    <span class="board-title">${board.title}</span>
                    <button id="add-card-${board.id}" class="board-add">Add Card</button>
                    <button id="toggle-board-${board.id}" class="board-toggle"><i id="toggle-icon-${board.id}" class="fas fa-chevron-down"></i></button>
                </div>
                <div id="columns-${board.id}" class="board-columns hide">
                      
                </div>
                </section>
                `;

        this._appendToElement(document.querySelector('#boards'), boardHtml);

        callback()
    },

    showCards: function (boardId, statusId) {

        dataHandler.getCardsByBoardId(boardId, statusId, function (cards) {
            for(let card of cards) {

                let cardHtml = `<div class="card">
                        <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                        <div class="card-title">${card.title}</div>
                    </div>`;

            dom._appendToElement(document.querySelector(`#board-${boardId}-col-${statusId}`), cardHtml)

            }

        });

    },

    showStatuses: function (boardId) {
        dataHandler.getStatusesByBoardId(boardId, function (statuses) {


            for(let status of statuses) {
                 let column = `
                    <div class="board-column">
                        <div class="board-column-title">${status.title}</div>
                        <div id="board-${boardId}-col-${status.id}" class="board-column-content"></div>
                    </div>`;

                dom._appendToElement(document.querySelector(`#columns-${boardId}`), column);
                dom.showCards(boardId, status.id)

            }
        })
    },

    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also
        document.getElementById('boards').remove();
        let boardList = '';

        const outerHtml = `
                <div id="boards" class="board-container">
                    
                </div>
            `;

        this._appendToElement(document.querySelector('body'), outerHtml);

        for(let board of boards){
            dom.showBoard(board,function () {
                dom.showStatuses(board.id, function () {

                })
            })
        }

    },

    toggleBoards: function (element) {
        element.classList.toggle('hide')
    },

    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
    },

    // here comes more features
};
