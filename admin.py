from flask import Flask, render_template, request, redirect, url_for
# from flask_mysql import MySQL
from flask_mysqldb import MySQL
import mysql.connector
import logging

app = Flask(__name__, template_folder="templates")
app.config['MYSQL_HOST'] = 'localhost' 
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'lhagva1592'
app.config['MYSQL_DB'] = 'db_lab_10' 
# app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

mysql = MySQL(app)

def create_task(task_name, description, status, due_date):
    conn = mysql.connection
    cursor = conn.cursor()
    cursor.execute('INSERT INTO tasks (task_name, description, status, due_date) VALUES (%s, %s, %s, %s)',
                   (task_name, description, status, due_date))
    conn.commit()
    cursor.close()

def get_all_tasks():
    try:
        conn = mysql.connection
        if conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM tasks')
            tasks = cursor.fetchall()
            cursor.close()
            return tasks
        else:
            logging.error('MySQL connection is None')
            return []
    except Exception as e:
        logging.error(f'Error getting tasks: {e}')
        return []
    
# def get_all_tasks():
#     conn = mysql.connection
#     cursor = conn.cursor()
#     cursor.execute('SELECT * FROM tasks')
#     tasks = cursor.fetchall()
#     cursor.close()
#     return tasks

@app.route('/')
def login():
    return render_template('login.html')

valid_credentials = {
    "employee": "employee",
    "customer": "customer"
}

@app.route('/main', methods=['POST'])
def authenticate():
    username = request.form['username']
    password = request.form['password']
    login_type = request.form['login-type']

    if valid_credentials.get(login_type) == password:
        return redirect(url_for('index'))
    else:
        return redirect(url_for('login'))

@app.route('/index')
def index():
    tasks = get_all_tasks()
    return render_template('index.html', tasks=tasks)

if __name__ == '__main__':
    app.run(debug=True)
