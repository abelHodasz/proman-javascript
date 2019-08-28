// It uses data_handler.js to visualize elements
import {dataHandler} from "./data_handler.js";


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
        dataHandler.createNewCard(input, boardId, 0, function (cardId) {
            dom.showCard(cardId);
        });
    },

    addColumn: function (boardId, input) {
        dataHandler.createNewColumn(input, boardId, function (statusId) {
            dom.showColumn(boardId, statusId);
        });
    },

    createBoard: function (input) {
        dataHandler.createNewBoard(input, function (board) {
            dom.showBoard(board, function () {
                dom.showStatuses(board.id, function () {
                })
            })
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
        document.getElementById('user-input').focus()
    },

    clickHandler: function (event) {
        if (event.target.id !== 'colRenameInput') {
            try {
                let evt = new KeyboardEvent('keyup', {'keyCode': 27, 'which': 27});
                document.getElementById('colRenameInput').dispatchEvent(evt);
            } catch (error) {

            }
        }
        else if (event.target.id !== 'cardRenameInput') {
            try {
                let evt = new KeyboardEvent('keyup', {'keyCode': 27, 'which': 27});
                document.getElementById('cardRenameInput').dispatchEvent(evt);
            } catch (error) {

            }
        }

        if (event.target.closest('.board-toggle')) {
            let id = event.target.id.split('-')[2];
            document.getElementById(`toggle-icon-${id}`).classList.toggle("rotate180");
            let element = document.getElementById('columns-' + id);
            dom.toggleBoards(element);
        } else if (event.target.classList.contains('board-add')) {
            let id = event.target.id.split('-')[2];
            dom.showModal("Add Card");
            document.getElementById('form').addEventListener("submit", function (event) {
                dom.addCard(id, document.getElementById('user-input').value);
                event.preventDefault();
                document.getElementById('modal-content').innerHTML = '';
                $('#modal').modal('hide');
            });
        } else if (event.target.closest('.board-delete')) {
            let boardId = event.target.id.split('-')[2];
            dataHandler.deleteBoard(boardId, function () {
                document.getElementById(`board-${boardId}`).remove()
            })
        } else if (event.target.closest('.card-remove')) {
            let cardId = event.target.id.split('-')[2];
            dataHandler.deleteCard(cardId, function () {
                document.getElementById(`card-${cardId}`).remove()
            })
        } else if (event.target.closest('.column-add')) {
            let boardId = event.target.id.split('-')[2];
            dom.showModal("Add Column");
            document.getElementById('form').addEventListener("submit", function (event) {
                dom.addColumn(boardId, document.getElementById('user-input').value);
                event.preventDefault();
                document.getElementById('modal-content').innerHTML = '';
                $('#modal').modal('hide');
            });
        } else if (event.target.id.split('-')[0] === 'colTitle') {
            dom.renameColumn(event.target.id);
        } else if (event.target.id.split('-')[0] === 'cardTitle') {
            dom.renameCard(event.target.id)
        }
    },

    init: function () {
        document.addEventListener('click', function (event) {
            dom.clickHandler(event);
        });
        this.createBoardBtn();
    },

    renameColumn: function (id) {
        let statusId = id.split('-')[3];

        let inputHtml = `<input type="text" id="colRenameInput" minlength="1">`;

        let title = document.getElementById(id);
        let oldTitleHtml = title.innerHTML;
        title.innerHTML = inputHtml;

        let input = document.getElementById("colRenameInput");
        input.focus();
        input.addEventListener('keyup', function (event) {
            if (event.keyCode === 13) {
                dataHandler.renameColumn(statusId, input.value, function () {
                });
                title.innerText = input.value;
            } else if (event.keyCode === 27) {
                title.innerHTML = oldTitleHtml;
            }
        });

    },

    renameCard: function (id) {
        let cardId = id.split('-')[3];

        let inputHtml = `<input type="text" id="cardRenameInput" minlength="1">`;

        let title = document.getElementById(id);
        let oldTitleHtml = title.innerHTML;
        title.innerHTML = inputHtml;

        let input = document.getElementById("cardRenameInput");
        input.focus();
        input.addEventListener('keyup', function (event) {
            if (event.keyCode === 13) {
                dataHandler.renameCard(cardId, input.value, function () {
                });
                title.innerText = input.value;
            } else if (event.keyCode === 27) {
                title.innerHTML = oldTitleHtml;
            }
        });

    },

    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function (boards) {
            dom.showBoards(boards);
        });

    },

    loadDragula: function () {
        let cards = document.querySelectorAll('.board-column-content');
        let containersArray = Array.from(cards);
        let drag = dragula(containersArray);
        let cols = document.querySelectorAll('.board-columns');
        containersArray = Array.from(cols);
        let dragCols = dragula(containersArray, {
            moves: function (el, container, handle) {
                return handle.classList.contains('handle');
            },
            direction: 'horizontal'
        });

        drag.on('drop', (el, target, source, sibling) => {

            //console.log("el: ", el, "\ntarget:", target, "\nsource:", source, "\nsibling:", sibling);
            let cardId = el.id.split('-')[1];
            let statusId = source.id.split('-')[3];
            let newStatusId = target.id.split('-')[3];
            if (statusId !== newStatusId) {
                dataHandler.setCardStatus(cardId, newStatusId, () => {
                    console.log("changed card status");
                });
            }
        })
    },

    showBoard: function (board, callback) {

        let boardHtml = `
                <section id="board-${board.id}" class="board">
                <div class="board-header">
                    <span class="board-title">${board.title}</span>
                    <button id="add-card-${board.id}" class="board-add">Add Card</button>
                    <button id="add-column-${board.id}" class="column-add">Add Column</button>
                    <button id="delete-board-${board.id}" class="board-delete">Delete</button>
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
            for (let card of cards) {

                let cardHtml = `<div id="card-${card.id}" class="card">
                        <div class="card-remove"><i id="delete-card-${card.id}" class="fas fa-trash-alt"></i></div>
                        <div id="cardTitle-${boardId}-${statusId}-${card.id}" class="card-title">${card.title}</div>
                    </div>`;

                dom._appendToElement(document.querySelector(`#board-${boardId}-col-${statusId}`), cardHtml)
            }
            dom.loadDragula()
        });
    },

    showColumn: function (boardId, statusId) {
        dataHandler.getColumn(statusId, function (column) {
            let columnHtml = `
                    <div class="board-column">
                        <div id="colTitle-${boardId}-col-${statusId}" class="handle board-column-title">${column[0].title}</div>
                        <div id="board-${boardId}-col-${column[0].id}" class="board-column-content"></div>
                    </div>`;
            dom._appendToElement(document.querySelector(`#columns-${boardId}`), columnHtml);
        })
    },

    showCard: function (cardId) {
        dataHandler.getCard(cardId, function (card) {
            let cardHtml = `<div id="card-${cardId}" class="card">
                            <div class="card-remove"><i id="delete-card-${cardId}" class="fas fa-trash-alt"></i></div>
                            <div id="cardTitle-${boardId}-${statusId}-${card.id}" class="card-title">${card[0].title}</div>
                        </div>`;
            dom._appendToElement(document.querySelector(`#board-${card[0].board_id}-col-${card[0].status_id}`), cardHtml);

        });
    },

    showStatuses: function (boardId) {
        dataHandler.getStatusesByBoardId(boardId, function (statuses) {

            for (let status of statuses) {
                let column = `
                    <div class="board-column">
                        <div id="colTitle-${boardId}-col-${status.id}" class="handle board-column-title">${status.title}</div>
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

        for (let board of boards) {
            dom.showBoard(board, function () {
                dom.showStatuses(board.id, function () {

                })
            })
        }

    },

    toggleBoards: function (element) {
        element.classList.toggle('hide')
    }
};
