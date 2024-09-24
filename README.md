# leetcode_record

Website for visualize and review leetcode progress. **React** is used for frontend with **Flask** as backend.

## Install dependencies for React

1. Go to leetcode_recode folder
2. Install dependencies for React
```
yarn install
```

## Create virtual environment and install dependencies inside

1. Go to backend folder
```
cd backend
```

2. Create virtual environment and activate it
- For mac/unix users:
```
python3 -m venv env
source env/bin/activate
```
- For windows users:
```
py -m venv env
.\env\Scripts\activate
```

3. Install flask related packages
```
pip install flask python-dotenv
```

4. Install Google client library
```
pip install --upgrade google-api-python-client google-auth-httplib2 google-auth-oauthlib
```

## Run it

1. Start the backend in a terminal
```
yarn start-backend
```

2. Start the frontend in another terminal
```
yarn start
```
