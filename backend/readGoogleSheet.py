import pandas as pd
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from oauth2client.service_account import ServiceAccountCredentials
def get_spreadsheet_service():
    service_key_file = 'master-plateau-431803-q3-6409b3901863.json'
    credentials = ServiceAccountCredentials.from_json_keyfile_name(
        service_key_file,
        scopes='https://www.googleapis.com/auth/spreadsheets',
    )
    service = build("sheets", "v4", credentials=credentials)
    return service.spreadsheets().values()

def get_sheet_values(service, spreadsheet_id, range_name):
    try:
        result = (
            service.get(spreadsheetId=spreadsheet_id, range=range_name)
            .execute()
        )
        return result.get("values", [])
    except HttpError as error:
        print(f"An error occurred: {error}")
        return error

def add_sheet_values(data, tag, header, sheet_values):
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
                'state': "",
                'status': "" ,
            })
    
    df = pd.DataFrame(sheet_values[1:], columns=header)
    prevDate = None
    for i in range(df.shape[0]):
        row = df.iloc[i, :]
        #Use previous date if current date is empty
        if i > 0:
            row['Date'] = row['Date'] or prevDate
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
        row['Type'] = row['Type'] if row['Type'] != 'Unknown' else ''

        row['Hand On']      = True if row['Hand On'] == 'Y' else False
        row['Correct Idea'] = True if row['Correct Idea'] == 'Y' else False
        row['Need Review']  = True if row['Need Review'] == 'Y' else False
        row['Completed count'] = int(row['Completed count']) if row['Completed count'] else 1
        
        try:
            #Add to data
            id = row['No']
            if not id in data:
                data[id] = {
                    'date': row['Date'],
                    'title': f"{row['No']}. {row['Name']}",
                    'difficulty': row['Level'],
                    'status': "",
                    'count': row['Completed count'],
                    'topics': [row['Type']] if row['Type'] else [],
                    'tags': [tag] if tag else [],
                    'comments': [],
                }
                data_item = data[id]
                #Add comments 
                add_comments(data_item, row)
                if len(data_item['comments']):
                    data_item['comments'][-1]['status'] = data_item['status']
                    data_item['comments'][-1]['state'] = row['Review Reason']
                data_item['status'] = get_status(data_item, row)
            else:
                #Update topics
                data_item = data[id]
                if row['Type'] and not row['Type'] in data_item['topics']:
                    data_item['topics'].append(row['Type'])
                #Update tags
                if tag and not tag in data_item['tags']:
                    data_item['tags'].append(tag)
                
                #Replace count, status, comments
                if row['Completed count'] > data_item['count']:
                    data_item['count'] = row['Completed count']
                    data_item['comments'] = []
                    add_comments(data_item, row)
                    if len(data_item['comments']):
                        data_item['comments'][-1]['status'] = data_item['status']
                        data_item['comments'][-1]['state'] = row['Review Reason']
                    data_item['status'] = get_status(data_item, row)
        except Exception as e:
            print(e)
            print(row)
            print('\nthis data\n',data_item)
            raise(e)

def getLeetcodeData():
    sheet_names = ['Random by topic', 'ZhiHu TimothyL 1st loop', 'ZhiHu TimothyL 2nd loop']
    spreadsheet_id = "1N7m-HNJV3ekZ4eDkWj4qicpgJvolFZulYmrhXUb4i3E"
    header = ['Date', 'No', 'Name', 'Level', 'Type', 'Hand On', 'Correct Idea', 'Need Review', 'Review Reason', 'Completed count', 'Remarks', 'Remarks1', 'Remarks2']
    service = get_spreadsheet_service()
    data = {}
    for sheet_name in sheet_names:
        vals = get_sheet_values(service, spreadsheet_id, f"'{sheet_name}'!A:M")
        tag = sheet_name if sheet_name != 'Random by topic' else ""
        add_sheet_values(data, tag, header, vals)
    return data

if __name__ == "__main__":
    data = getLeetcodeData()
    