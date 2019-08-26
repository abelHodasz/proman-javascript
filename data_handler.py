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
    return connection.execute_dml_statement('INSERT INTO cards (board_id, title, status_id) VALUES (%(boardId)s, %(cardTitle)s, %(statusId)s)', variables=data)

def get_statuses():
    return connection.execute_select('SELECT title FROM statuses;')

def get_statuses_by_board_id(board_id):
    return connection.execute_select("""SELECT * FROM statuses
                                     WHERE id IN (SELECT status_id FROM board_statuses
                                                WHERE board_id = %(board_id)s) """,
                                    variables={'board_id': board_id})

def get_cards(board_id, status_id):
    return connection.execute_select("""SELECT title FROM cards
                                    WHERE board_id = %(board_id)s AND status_id = %(status_id)s
                                    ORDER BY "order";
                                    """, variables={'board_id': board_id, 'status_id': status_id})

def get_boards():
   return connection.execute_select('SELECT * FROM boards;')



def create_board(title):
    return connection.execute_dml_statement('INSERT INTO boards (title) VALUES (%(title)s);', variables={'title': title})



def get_cards_for_board(board_id):
    connection.clear_cache()
    all_cards = connection.get_cards()
    matching_cards = []
    for card in all_cards:
        if card['board_id'] == str(board_id):
            card['status_id'] = get_card_status(card['status_id'])  # Set textual status for the card
            matching_cards.append(card)
    return matching_cards
