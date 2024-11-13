import re
import datetime
import pandas as pd
from googleSheet import GoogleSheet

class LeetcodeSheet():
    def __init__(self):
        self.gs = GoogleSheet()
        self.spreadsheet_id = "1H5ddYZzaIGYpCuKEOeEHFxOoPXtIHErrhnXVGn-wGpA"
        self.sheet_id = 0
        self.sheet_name = "Sheet1"
        self.sheetvalues_df = None
        self.data = None
    
    def update_sheetvalues_as_df(self):
        header = ['Date', 'LastEdit', 'Title', 'Difficulty', 'Status', 'Count', 'Hint', 'Topics', 'Tags', 'Comments']
        sheet_values = self.gs.get_sheet_values(self.spreadsheet_id, self.sheet_name)
        sheet_values1 = [row[:9] + [row[9:]] for row in sheet_values[1:]]
        self.sheetvalues_df = pd.DataFrame(sheet_values1, columns=header)
    
    def get_data(self):
        def getComments(comments):
            if not comments: return []
            res = []
            for cmt_str in comments:
                s1, s2, s3 = re.split(r'(\[.*?\])', cmt_str, maxsplit=1) 
                res.append({
                    'date': s1,
                    'status': s2[1:-1],
                    'comment': s3
                })
            return res
            
        if self.data: return self.data
        self.update_sheetvalues_as_df()
        res = {}
        for index, row in self.sheetvalues_df.iterrows():
            id = row['Title'].split('.')[0]
            res[id] = {
                'date': row['Date'],
                'last_edit': str(datetime.datetime.strptime(row['LastEdit'], "%d/%m/%YT%H:%M").timestamp()),
                'title': row['Title'],
                'difficulty': row['Difficulty'],
                'status': row['Status'],
                'count': int(row['Count']),
                'hint': row['Hint'],
                'topics': [x.strip() for x in row['Topics'].split(',')] if isinstance(row['Topics'], str) and row['Topics'] else [],
                'tags': [x.strip() for x in row['Tags'].split(',')] if isinstance(row['Tags'], str) and row['Tags'] else [],
                'comments': getComments(row['Comments']),
            }
        self.data = res
        return self.data
        
    def update_row(self, entities:dict):
        def formulate(entity):
            last_edit = datetime.datetime.fromtimestamp(float(entity['last_edit'])).strftime("%d/%m/%YT%H:%M")
            cmds = [f"{cmd['date']}[{cmd['status']}]{cmd['comment']}" for cmd in entity['comments']]
            res = [entity['date'], last_edit, entity['title'], entity['difficulty'], entity['status'], entity['count'], entity['hint'], \
                ', '.join(entity['topics']), ', '.join(entity['tags'])] + cmds
            return res
        
        for key, val in entities.items():
            df = self.sheetvalues_df
            index = int(df.index[df['Title'] == val['title']][0]) + 1 if key in self.data else -1
            in_place = False if index == -1 or self.data[key]['last_edit'] != val['last_edit'] else True
            #Delete from sheet
            if index != -1:
                self.gs.delete_row(self.spreadsheet_id, self.sheet_id, index, index+1)
                
            # #Add to excel
            row = formulate(val)
            if not in_place:
                self.gs.append_row(self.spreadsheet_id, self.sheet_name, row)
            else:
                self.gs.insert_row(self.spreadsheet_id, f"{self.sheet_name}!{index}:{index+1}", row)
            
            #Add to data
            self.data[key] = val
            
            #Update df
            self.update_sheetvalues_as_df()
            
                
if __name__ == "__main__":
    lc = LeetcodeSheet()
    lc.get_data()