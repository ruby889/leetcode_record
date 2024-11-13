import json
import datetime
import pandas as pd
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from oauth2client.service_account import ServiceAccountCredentials

class GoogleSheet:
    def __init__(self):
        with open('config.json', 'r') as file:
            config = json.load(file)
        service_key_file = config['service_key_file']
        self.spreadsheets_service = self.get_spreadsheet_service(service_key_file)
        self.spreadsheets_values = self.spreadsheets_service.values()
        self.data = None
        
    def get_spreadsheet_service(self, service_key_file):
        credentials = ServiceAccountCredentials.from_json_keyfile_name(
            service_key_file,
            scopes='https://www.googleapis.com/auth/spreadsheets',
        )
        service = build("sheets", "v4", credentials=credentials)
        return service.spreadsheets()

    def get_sheet_values(self, spreadsheet_id, range_name):
        try:
            result = (
                self.spreadsheets_values.get(spreadsheetId=spreadsheet_id, range=range_name)
                .execute()
            )
            return result.get("values", [])
        except HttpError as error:
            print(f"An error occurred: {error}")
            return error
        
    def clear_sheet(self, spreadsheet_id, range_name):
        self.spreadsheets_values.clear(
            spreadsheetId=spreadsheet_id,
            range=range_name
        ).execute()
        
    def update_sheet(self, data, spreadsheet_id, range_name):
        resource = {
            "values": data
        }
        self.clear_sheet(spreadsheet_id, range_name)
        self.spreadsheets_values.append(
            spreadsheetId=spreadsheet_id,
            range=range_name,
            valueInputOption='RAW',
            body=resource
        ).execute()
        
    def delete_row(self, spreadsheet_id, sheet_id, start_index, end_index):
        request_body = {
            "requests": [
                {
                    "deleteDimension": {
                        "range": {
                            "sheetId": sheet_id,
                            "dimension": "ROWS",
                            "startIndex": start_index,
                            "endIndex": end_index
                        }
                    }
                }
            ]
        }
        return self.spreadsheets_service.batchUpdate(spreadsheetId=spreadsheet_id, body=request_body).execute()
    
    def append_row(self, spreadsheet_id, sheet_range, row_val):
        body = {'values': [row_val]}
        self.spreadsheets_values.append(spreadsheetId=spreadsheet_id, range=sheet_range, 
                                        valueInputOption="RAW", body=body).execute()
        
    def insert_row(self, spreadsheet_id, sheet_range, row_val):
        body = {'values': [row_val]}
        self.spreadsheets_values.update(spreadsheetId=spreadsheet_id, range=sheet_range, valueInputOption="RAW", body=body).execute()
        
def format_discarded_data_sheet(data, tag, header, sheet_values):
    def compare_date(d1, d2):
        d1_list = d1.split('/')
        d2_list = d2.split('/')
        for i in range(2, -1, -1):
            if d1_list[i] == d2_list[i]: continue
            return int(d1_list[i]) > int(d2_list[i])
        return True
        
    def get_status(data_item, row):
        if not row['Correct Idea'] or not row['Hand On']:
            status = 'Read'
        elif row['Need Review']:
            status = 'Tried'
        elif (data_item['count'] - len(data_item['comments'])) < 3:
            status = 'Solved'
        else:
            status = 'Mastered'
        return status
    
    def add_comments(data_item, row):
        for hea in ['Remarks', 'Remarks1', 'Remarks2']:
            if not row[hea]: continue
            data_item['comments'].append(
                {
                'date': "",
                'comment': row[hea],
                'status': "" ,
            })
    
    df = pd.DataFrame(sheet_values[1:], columns=header)
    prevDate = None
    for df_i in range(df.shape[0]):
        row = df.iloc[df_i, :]
        #Use previous date if current date is empty
        if df_i > 0:
            row['Date'] = row['Date'] or prevDate
            #Convert from single digit to double digit
            row['Date'] = datetime.datetime.strptime(row['Date'], "%d/%m/%Y").strftime("%d/%m/%Y")
        prevDate = row['Date']
        
        #Convert type
        type_conversion = {
            1: 'Array',
            2: 'LinkedList',
            3: 'Stacks and Queues',
            4: 'Tree and Graphs',
            5: 'Hashset',
            6: 'Binary',
            7: 'Math and logic puzzle',
            8: 'Recurrsion and DP',
            9: 'Sorting and Searching',
            10: ''
        }
        if row['Type'].isdigit():
            row['Type'] = type_conversion[int(row['Type'])]
        row['Type'] = row['Type'] if row['Type'] != 'unknown' else ''

        row['Hand On']      = True if row['Hand On'] == 'Y' else False
        row['Correct Idea'] = True if row['Correct Idea'] else row['Hand On']
        row['Need Review']  = True if row['Need Review'] == 'Y' else False
        row['Completed count'] = int(row['Completed count']) if row['Completed count'] else 1
        row['Review Reason'] = "" if not row['Review Reason'] else row['Review Reason']
        
        try:
            #Add to data
            id = row['No']
            if not id in data:
                data[id] = {
                    'date': row['Date'],
                    'last_edit': str(datetime.datetime.strptime(row['Date']+f"T{df_i//60}:{df_i%60}", "%d/%m/%YT%H:%M").timestamp()),
                    'title': f"{row['No']}. {row['Name']}",
                    'difficulty': row['Level'],
                    'status': "",
                    'count': row['Completed count'],
                    'hint': row['Review Reason'],
                    'topics': [row['Type']] if row['Type'] else [],
                    'tags': [tag] if tag else [],
                    'comments': [],
                }
                data_item = data[id]
                #Add comments 
                add_comments(data_item, row)
                if len(data_item['comments']):
                    data_item['comments'][-1]['date'] = data_item['date']
                    data_item['comments'][-1]['status'] = data_item['status']
                data_item['status'] = get_status(data_item, row)
            else:
                #Update topics
                data_item = data[id]
                data_item['last_edit'] = str(datetime.datetime.strptime(data_item['date']+f"T{df_i//60}:{df_i%60}", "%d/%m/%YT%H:%M").timestamp())
                if row['Type'] and not row['Type'] in data_item['topics']:
                    data_item['topics'].append(row['Type'])
                #Update tags
                if tag and not tag in data_item['tags']:
                    data_item['tags'].append(tag)
                
                #Replace count, status, comments
                if row['Completed count'] > data_item['count'] or compare_date(row['Date'], data_item['date']):
                    prev_cmt_date = []
                    for i, cmt in enumerate(data_item['comments']):
                        if cmt['date']:
                            prev_cmt_date.append([i, cmt['date']])
                    data_item['count'] = row['Completed count']
                    data_item['date'] = row['Date']
                    data_item['last_edit'] = str(datetime.datetime.strptime(row['Date']+f"T{df_i//60}:{df_i%60}", "%d/%m/%YT%H:%M").timestamp())
                    data_item['hint'] = row['Review Reason']
                    data_item['comments'] = []
                    add_comments(data_item, row)
                    for i, prev_date in prev_cmt_date:
                        if i < len(data_item['comments']):
                            data_item['comments'][i]['date'] = prev_date
                    if len(data_item['comments']):
                        data_item['comments'][-1]['date'] = data_item['date']
                        data_item['comments'][-1]['status'] = data_item['status']
                    data_item['status'] = get_status(data_item, row)
            if 'ZhiHu TimothyL 2nd loop' in data[id]['tags'] and 'ZhiHu TimothyL 1st loop' not in data[id]['tags']:
                data[id]['tags'].append('ZhiHu TimothyL 1st loop')
        except Exception as e:
            print(e)
            print(row)
            print('\nthis data\n',data_item)
            raise(e)

def get_discarded_data():
    gs = GoogleSheet()
    spreadsheet_id = "1N7m-HNJV3ekZ4eDkWj4qicpgJvolFZulYmrhXUb4i3E"
    sheet_names = ['Random by topic', 'ZhiHu TimothyL 1st loop', 'ZhiHu TimothyL 2nd loop']
    header = ['Date', 'No', 'Name', 'Level', 'Type', 'Hand On', 'Correct Idea', 'Need Review', 'Review Reason', 'Completed count', 'Remarks', 'Remarks1', 'Remarks2']
    tags = [sheet_name if sheet_name != 'Random by topic' else "" for sheet_name in sheet_names]
    data = {}
    for i, sheet_name in enumerate(sheet_names):
        vals = gs.get_sheet_values(spreadsheet_id, f"'{sheet_name}'!A:M")
        format_discarded_data_sheet(data, tags[i], header, vals)
    return data

def add_to_new_excel_sheet(data):
    gs = GoogleSheet()
    spreadsheet_id = "1H5ddYZzaIGYpCuKEOeEHFxOoPXtIHErrhnXVGn-wGpA"
    header = ['Date', 'LastEdit', 'Title', 'Difficulty', 'Status', 'Count', 'Hint', 'Topics', 'Tags', 'Comments']
    sheet_data = [header]
    sorted_keys = sorted(data.keys(), key=lambda x, data=data: data[x]['last_edit'])
    for key in sorted_keys:
        val = data[key]
        last_edit = datetime.datetime.fromtimestamp(float(val['last_edit'])).strftime("%d/%m/%YT%H:%M")
        cmds = [f"{cmd['date']}[{cmd['status']}]{cmd['comment']}" for cmd in val['comments']]
        sheet_data.append([val['date'], last_edit, val['title'], val['difficulty'], val['status'], val['count'], val['hint'], \
            ', '.join(val['topics']), ', '.join(val['tags'])] + cmds)
    gs.update_sheet(sheet_data, spreadsheet_id, "Sheet1")
    
if __name__ == "__main__":
    data = get_discarded_data()
    add_to_new_excel_sheet(data)
    