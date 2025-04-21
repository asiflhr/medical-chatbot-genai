from flask import Flask, render_template, jsonify, request
from src.helper import download_hugging_face_embeddings
from langchain_pinecone import PineconeVectorStore
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
from src.prompt import system_prompt
import os

app = Flask(__name__)

load_dotenv()

PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY")
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")

embeddings = download_hugging_face_embeddings()

index_name = "medibot"

docsearch = PineconeVectorStore.from_existing_index(
    index_name=index_name,
    embedding=embeddings
)

retriever = docsearch.as_retriever(search_type="similarity", search_kwargs={"k": 3})

# Initialize the Gemini model through LangChain
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0.4, google_api_key=GOOGLE_API_KEY)

# Create the prompt template
prompt = ChatPromptTemplate.from_template(system_prompt)

# Create the document chain
document_chain = create_stuff_documents_chain(llm=llm, prompt=prompt)

# Create the retrieval chain
retrieval_chain = create_retrieval_chain(retriever=retriever, combine_docs_chain=document_chain)

# Function to get answers
def get_medical_answer(question: str) -> str:
    response = retrieval_chain.invoke({
        "input": question,    # For the retriever
        "question": question  # For the prompt template
    })
    return response["answer"]

@app.route('/')
def index():
    return render_template('chat.html')

@app.route('/get', methods=["GET", "POST"])
def chat():
    msg = request.form['msg']
    print(f"Received message: {msg}")
    answer = get_medical_answer(msg)
    print(f"Generated answer: {answer}")
    return str(answer)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8080))  # Default to 8080
    app.run(host="0.0.0.0", port=port, debug=False)