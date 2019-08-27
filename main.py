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
    return  data_handler.create_card(request.json)


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


@app.route("/card/status", methods = ['POST'])
@json_response
def set_card_status():
    data_handler.set_card_status(request.json)


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
