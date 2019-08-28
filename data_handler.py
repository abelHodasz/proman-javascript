import connection


def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    statuses = connection.get_statuses()
    return next((status['title'] for status in statuses if status['id'] == str(status_id)), 'Unknown')


def create_card(data):
    return connection.execute_dml_statement('INSERT INTO cards (board_id, title, status_id) '
                                            'VALUES (%(boardId)s, %(cardTitle)s, %(statusId)s)'
                                            'RETURNING id ', variables=data)[0]

def create_column(data):
    statusId = connection.execute_dml_statement('INSERT INTO statuses (title) '
                                            'VALUES (%(columnTitle)s)'
                                            'RETURNING id ', variables=data)[0]

    connection.execute_dml_statement("""INSERT INTO board_statuses VALUES (%(board_id)s, %(statusId)s)
                                        ;""", variables={'board_id': data['boardId'], 'statusId': statusId})

    return str(statusId)

def rename_column(data):
    return connection.execute_dml_statement("""UPDATE statuses SET title = %(newTitle)s WHERE id = %(statusId)s;""", variables=data)

def rename_card(data):
    return connection.execute_dml_statement("""UPDATE cards SET title = %(newTitle)s WHERE id = %(cardId)s;""", variables=data)

def get_statuses():
    return connection.execute_select('SELECT title FROM statuses;')

def get_statuses_by_board_id(board_id):
    return connection.execute_select("""SELECT * FROM statuses
                                        WHERE id IN (SELECT status_id FROM board_statuses
                                                    WHERE board_id = %(board_id)s)
                                        ORDER BY id""",
                                    variables={'board_id': board_id})

def get_cards(board_id, status_id):
    return connection.execute_select("""SELECT * FROM cards
                                    WHERE board_id = %(board_id)s AND status_id = %(status_id)s
                                    ORDER BY "order";
                                    """, variables={'board_id': board_id, 'status_id': status_id})


def get_boards():
    return connection.execute_select('SELECT * FROM boards;')


def create_board(title):
    board = connection.execute_dml_statement("""INSERT INTO boards (title) VALUES (%(title)s)
                                                RETURNING *;""", variables={'title': title})

    board = {'id': board[0], 'title': board[1] }

    for i in range(4):
        connection.execute_dml_statement("""INSERT INTO board_statuses VALUES (%(board_id)s, %(i)s)
                                        ;""", variables={'board_id': board['id'], 'i': i})
    return board


def get_card(card_id):
    return connection.execute_select("""
                                    SELECT * from cards
                                    WHERE id = %(card_id)s""", variables={'card_id': card_id})

def get_column(status_id):
    return connection.execute_select("""
                                    SELECT * from statuses
                                    WHERE id = %(status_id)s""", variables={'status_id': status_id})


def delete_board(board_id):
    return connection.execute_dml_statement("""
                                            DELETE FROM boards
                                            WHERE id = %(board_id)s
                                            """, variables={'board_id': board_id})

def delete_card(card_id):
    return connection.execute_dml_statement("""
                                            DELETE FROM cards
                                            WHERE id = %(card_id)s
                                            """, variables={'card_id': card_id})


def set_card_status(data):
    return connection.execute_dml_statement("""UPDATE cards SET status_id = %(statusId)s
                                            WHERE id = %(cardId)s
    """, variables=data)


def get_cards_for_board(board_id):
    connection.clear_cache()
    all_cards = connection.get_cards()
    matching_cards = []
    for card in all_cards:
        if card['board_id'] == str(board_id):
            card['status_id'] = get_card_status(card['status_id'])  # Set textual status for the card
            matching_cards.append(card)
    return matching_cards
