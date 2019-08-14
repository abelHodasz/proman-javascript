import connection


def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    statuses = connection.get_statuses()
    return next((status['title'] for status in statuses if status['id'] == str(status_id)), 'Unknown')


@connection.connection_handler
def get_boards(cursor):
    cursor.execute("""
                    SELECT title FROM boards;
                    """)

    data = cursor.fetchall()
    return data


@connection.connection_handler
def create_board(cursor, title):
    cursor.execute("""
                    INSERT INTO boards (title) 
                    VALUES (%(title)s);
                    """,
                   {'title': title})


def get_cards_for_board(board_id):
    connection.clear_cache()
    all_cards = connection.get_cards()
    matching_cards = []
    for card in all_cards:
        if card['board_id'] == str(board_id):
            card['status_id'] = get_card_status(card['status_id'])  # Set textual status for the card
            matching_cards.append(card)
    return matching_cards
