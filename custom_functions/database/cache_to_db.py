import sqlite3
import os

def create_database():
    # Using with statement to manage the connection and cursor
    with sqlite3.connect(f'{os.getcwd()}/databases/sql/key_cache.db') as conn:
        cursor = conn.cursor()
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS licenses (
            SERVICE TEXT,
            PSSH TEXT,
            KID TEXT PRIMARY KEY,
            Key TEXT,
            License_URL TEXT,
            Headers TEXT,
            Cookies TEXT,
            Data TEXT
        )
        ''')

def cache_to_db(service: str = None, pssh: str = None, kid: str = None, key: str = None, license_url: str = None, headers: str = None, cookies: str = None, data: str = None):
    with sqlite3.connect(f'{os.getcwd()}/databases/sql/key_cache.db') as conn:
        cursor = conn.cursor()

        # Check if the record with the given KID already exists
        cursor.execute('''SELECT 1 FROM licenses WHERE KID = ?''', (kid,))
        existing_record = cursor.fetchone()

        # Insert or replace the record
        cursor.execute('''
        INSERT OR REPLACE INTO licenses (SERVICE, PSSH, KID, Key, License_URL, Headers, Cookies, Data)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (service, pssh, kid, key, license_url, headers, cookies, data))

        # If the record was existing and updated, return True (updated), else return False (added)
        return True if existing_record else False

def search_by_pssh_or_kid(search_filter):
    # Using with statement to automatically close the connection
    with sqlite3.connect(f'{os.getcwd()}/databases/sql/key_cache.db') as conn:
        cursor = conn.cursor()

        # Initialize a set to store unique matching records
        results = set()

        # Search for records where PSSH contains the search_filter
        cursor.execute('''
        SELECT * FROM licenses WHERE PSSH LIKE ?
        ''', ('%' + search_filter + '%',))
        rows = cursor.fetchall()
        for row in rows:
            results.add((row[1], row[2], row[3]))  # (PSSH, KID, Key)

        # Search for records where KID contains the search_filter
        cursor.execute('''
        SELECT * FROM licenses WHERE KID LIKE ?
        ''', ('%' + search_filter + '%',))
        rows = cursor.fetchall()
        for row in rows:
            results.add((row[1], row[2], row[3]))  # (PSSH, KID, Key)

        # Convert the set of results to a list of dictionaries for output
        final_results = [{'PSSH': result[0], 'KID': result[1], 'Key': result[2]} for result in results]

    return final_results[:20]

def get_key_by_kid_and_service(kid, service):
    # Using 'with' to automatically close the connection when done
    with sqlite3.connect(f'{os.getcwd()}/databases/sql/key_cache.db') as conn:
        cursor = conn.cursor()

        # Query to search by KID and SERVICE
        cursor.execute('''
        SELECT Key FROM licenses WHERE KID = ? AND SERVICE = ?
        ''', (kid, service))

        # Fetch the result
        result = cursor.fetchone()

        # Check if a result was found
        return result[0] if result else None  # The 'Key' is the first (and only) column returned in the result

def get_kid_key_dict(service_name):
    # Using with statement to automatically manage the connection and cursor
    with sqlite3.connect(f'{os.getcwd()}/databases/sql/key_cache.db') as conn:
        cursor = conn.cursor()

        # Query to fetch KID and Key for the selected service
        cursor.execute('''
        SELECT KID, Key FROM licenses WHERE SERVICE = ?
        ''', (service_name,))

        # Fetch all results and create the dictionary
        kid_key_dict = {row[0]: row[1] for row in cursor.fetchall()}

    return kid_key_dict

def get_unique_services():
    # Using with statement to automatically manage the connection and cursor
    with sqlite3.connect(f'{os.getcwd()}/databases/sql/key_cache.db') as conn:
        cursor = conn.cursor()

        # Query to get distinct services from the 'licenses' table
        cursor.execute('SELECT DISTINCT SERVICE FROM licenses')

        # Fetch all results and extract the unique services
        services = cursor.fetchall()

        # Extract the service names from the tuple list
        unique_services = [service[0] for service in services]

    return unique_services

def key_count():
    # Using with statement to automatically manage the connection and cursor
    with sqlite3.connect(f'{os.getcwd()}/databases/sql/key_cache.db') as conn:
        cursor = conn.cursor()

        # Count the number of KID entries in the licenses table
        cursor.execute('SELECT COUNT(KID) FROM licenses')
        count = cursor.fetchone()[0]  # Fetch the result and get the count

    return count
