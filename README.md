# leetcode_record

Website for visualize and review leetcode progress. **React** is used for frontend with **Flask** as backend.  
***Overview:***
[![Video Title](https://github.com/ruby889/leetcode_record/blob/main/images/overview.jpg)](https://youtu.be/rooFXgYY6HA)
https://youtu.be/rooFXgYY6HA

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
pip install -U flask flask-cors python-dotenv
```

4. Install Google client library

```
pip install --upgrade google-api-python-client google-auth-httplib2 google-auth-oauthlib oauth2client
```

4. Install other required packages

```
pip install pandas
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
