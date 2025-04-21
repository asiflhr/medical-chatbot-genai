# medical-chatbot-genai

# How to run the project

### Steps:

## Step1.Clone the repository:

```bash
git clone https://github.com/asiflhr/medical-chatbot-genai.git
```

## Set up the environment variables:

- Create a `.env` file in the root directory of the project.
- Add the following environment variables to the `.env` file:

```bash
PINECONE_API_KEY=your_pinecone_api_key
GOOGLE_API_KEY=your_google_api_key
```

## Step2. Create a virtual environment and activate it:

```bash
# Create virtual environment named medibot
python -m venv medibot

# Activate virtual environment
# On Windows:
medibot\Scripts\activate

# On macOS/Linux:
source medibot/bin/activate
```

## Step3.Install the requirements:

```bash
pip install -r requirements.txt
```

## Step4. Run 'store_index.py' to store the data in the Pinecone Vector Store:

```bash
python store_index.py
```

## Step5. Run the Flask app:

```bash
python app.py
```

## Step6. Open the chatbot in your browser:

```bash
http://localhost:8080
```
