import psycopg2
from psycopg2 import sql
from psycopg2.extras import RealDictCursor
import json
import time
from googleSheet import get_discarded_data


class PostgreDB():
    def __init__(self, dbname, user, password, host='localhost', port='5432', autocommit=False) -> None:
        if not self._checkDatabaseExists(dbname, user, password, host, port):
            self._createDatabase(dbname, user, password, host, port)
            
        # Connect to database
        self.connection = psycopg2.connect(
            dbname=dbname,
            user=user,
            password=password,
            host=host,
            port=port
        )
        self.connection.autocommit = autocommit
        # Create a cursor
        self.cursor = self.connection.cursor(cursor_factory=RealDictCursor)
        self.table_name = 'problem'

    def _checkDatabaseExists(self, dbname, user, password, host, port):
        try:
            # Connect to PostgreSQL
            conn = psycopg2.connect(
                dbname='postgres',  # Connect to an existing database
                user=user,
                password=password,
                host=host,
                port=port
            )
            conn.autocommit = True  # Enable autocommit mode

            # Create a cursor
            cur = conn.cursor()

            # Check if the database exists
            cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (dbname,))
            exists = cur.fetchone() is not None

            # Close the cursor and connection
            cur.close()
            conn.close()
            return exists
        except psycopg2.Error as e:
            return False

    def _createDatabase(self, dbname, user, password, host, port):
        conn = psycopg2.connect(
            dbname='postgres',  # Connect to an default database
            user=user,
            password=password,
            host=host,
            port=port
        )
        conn.autocommit = True  # Enable autocommit mode
        cur = conn.cursor()
        # Create new database
        cur.execute(sql.SQL("CREATE DATABASE {};").format(sql.Identifier(dbname)))
        # Save (commit) the changes
        conn.commit()
        # Close the cursor and connection
        cur.close()
        conn.close()

    def close(self):
        # Save (commit) the changes
        self.connection.commit()
        self.cursor.close()
        self.connection.close()

    def createTables(self, schema_file='schema.sql'):
        # Create a tables
        with open(schema_file, 'r') as f:
            self.cursor.execute(f.read())
    
    def clearDatabase(self):
        self.cursor.execute("DROP SCHEMA public CASCADE;\
                            CREATE SCHEMA public;")
    
    def printTables(self):
        self.cursor.execute("SELECT table_name FROM information_schema.tables \
                            WHERE table_schema = 'public'")
        for table in self.cursor.fetchall():
            print(table)
        
    def clearTable(self):
        self.cursor.execute(f"TRUNCATE {self.table_name} CASCADE")
        
    def fetch_data_as_dict(self):
        # Query the database
        self.cursor.execute(f"SELECT * FROM {self.table_name}")
        # data = {row['id']:dict(row) for row in self.cursor.fetchall()}
        data = {}
        for row in self.cursor.fetchall():
            key, val = row['id'], dict(row)
            val['date'] = val['created'].strftime('%d/%m/%Y')
            val['last_edit'] = val['last_edit'].timestamp()
            del val['id']
            del val['created']
            data[key] = val
        return data

    def insert_entity(self, id, entity):
        # Insert a row of data
        created = entity['date']
        last_edit = entity['last_edit']
        title = entity['title'].replace("'","''")
        difficulty = entity['difficulty']
        status_ = entity['status']
        count = entity['count']
        hint = entity['hint'].replace("'","''")
        tags = f"ARRAY{entity['topics']}" if entity['topics'] else "ARRAY[]::TEXT[]"
        topics = f"ARRAY{entity['tags']}" if entity['tags'] else "ARRAY[]::TEXT[]"
        comments = json.dumps(entity['comments']).replace("'","''")
        try:
            self.cursor.execute(f"""INSERT INTO {self.table_name} (id, created, last_edit, title, difficulty, status_, count, hint, tags, topics, comments)
                                VALUES ({id}, TO_DATE('{created}', 'DD/MM/YYYY'), TO_TIMESTAMP({last_edit}), '{title}', '{difficulty}', '{status_}',
                                    {count}, '{hint}', {tags}, {topics}, '{comments}'::jsonb)""")
        except Exception as e:
            print(entity)
            raise e

if __name__ == "__main__":
    #Create leetcodeRecord database and transfer data from GoogleSpreadSheet to PostgreSQL
    db = PostgreDB('leetcodeRecord', 'postgres', '1')
    db.clearDatabase()
    db.createTables('./schema.sql')
    data = get_discarded_data()
    # cnt = 0
    for key,val in data.items():
        # cnt += 1
        # if cnt > 3: break
        db.insert_entity(int(key),val)
    # data = db.fetch_data_as_dict()
    # print(data)
    db.close()
    
# # Update the array
# cur.execute('''
#     UPDATE users
#     SET emails = %s
#     WHERE name = %s
# ''', (['alice@example.com', 'alice@hotmail.com'], 'Alice'))
