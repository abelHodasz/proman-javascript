from flask import Flask, render_template, url_for, request
from util import json_response

import data_handler

app = Flask(__name__)


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/get-boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return data_handler.get_boards()


@app.route("/create-board/<name>")
@json_response
def create_board(name):
    return data_handler.create_board(name)


@app.route("/get-cards/<int:board_id>")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return data_handler.get_cards_for_board(board_id)


@app.route("/get-statuses")
@json_response
def get_statuses():
    return data_handler.get_statuses()


@app.route("/create-card", methods=['POST'])
@json_response
def create_card():
    return data_handler.create_card(request.json)


@app.route("/create-column", methods=['POST'])
@json_response
def create_column():
    return data_handler.create_column(request.json)


@app.route("/rename-column", methods=['POST'])
@json_response
def rename_column():
    return data_handler.rename_column(request.json)


@app.route("/rename-card", methods=['POST'])
@json_response
def rename_card():
    return data_handler.rename_card(request.json)


@app.route("/status/<int:board_id>")
@json_response
def get_statuses_by_id(board_id):
    return data_handler.get_statuses_by_board_id(board_id)


@app.route("/cards/<int:board_id>/<int:status_id>")
@json_response
def get_cards(board_id, status_id):
    return data_handler.get_cards(board_id, status_id)


@app.route("/card/<int:card_id>")
@json_response
def get_card(card_id):
    return data_handler.get_card(card_id)


@app.route("/column/<int:status_id>")
@json_response
def get_column(status_id):
    return data_handler.get_column(status_id)


@app.route("/board/delete/<int:board_id>")
@json_response
def delete_board(board_id):
    return data_handler.delete_board(board_id)


@app.route("/card/delete/<int:card_id>")
@json_response
def delete_card(card_id):
    return data_handler.delete_card(card_id)


@app.route("/card/status", methods=['POST'])
@json_response
def set_card_status():
    data_handler.set_card_status(request.json)


@app.route("/boards/<int:board_id>/rename", methods=['POST'])
@json_response
def rename_board(board_id):
    data_handler.set_board_title(request.json)


@app.route("/boards/<int:board_id>")
@json_response
def get_board(board_id):
    data_handler.get_board_by_id(board_id)


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
