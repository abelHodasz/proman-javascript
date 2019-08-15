import connection


def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    statuses = connection.get_statuses()
    return next((status['title'] for status in statuses if status['id'] == str(status_id)), 'Unknown')

def get_statuses():
    return connection.execute_select('SELECT title FROM statuses;')


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
