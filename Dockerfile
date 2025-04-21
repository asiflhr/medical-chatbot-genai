# Use a Python base image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy requirements.txt
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy all project files
COPY . .

# Expose port 8080 (or 5000 if preferred)
EXPOSE 8080

# Run the app with gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "app:app"]