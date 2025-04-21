# medical-chatbot-genai

# How to run the project

### Steps:

## Step1.Clone the repository:

```bash
git clone https://github.com/asiflhr/medical-chatbot-genai.git
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
