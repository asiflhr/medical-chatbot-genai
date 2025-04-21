// static/script.js
document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const chatBody = document.querySelector('.chat-body')
  const messageInput = document.querySelector('.message-input')
  const sendMessage = document.querySelector('#send-message')
  const fileInput = document.querySelector('#file-input')
  const fileUploadWrapper = document.querySelector('.file-upload-wrapper')
  const fileCancelButton = fileUploadWrapper.querySelector('#file-cancel')
  const chatbotToggler = document.querySelector('#chatbot-toggler')
  const closeChatbot = document.querySelector('#close-chatbot')
  const initialInputHeight = messageInput.scrollHeight

  // Toggle chat box
  chatbotToggler.addEventListener('click', () => {
    document.body.classList.toggle('show-chatbot')
  })

  closeChatbot.addEventListener('click', () => {
    document.body.classList.remove('show-chatbot')
  })

  // Handle outgoing message
  const handleOutgoingMessage = (e) => {
    e.preventDefault()
    const userMessage = messageInput.value.trim()
    if (!userMessage) return

    // Display user message
    const userMessageDiv = createMessageElement(
      `<div class="message-text">${userMessage}</div>`,
      'user-message'
    )
    chatBody.appendChild(userMessageDiv)
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: 'smooth' })

    // Clear input
    messageInput.value = ''
    messageInput.dispatchEvent(new Event('input'))
    fileUploadWrapper.classList.remove('file-uploaded')

    // Show thinking indicator
    const incomingMessageDiv = createMessageElement(
      `<img class="bot-avatar" src="static/robotic.png" alt="Chatbot Logo" width="50" height="50">
           <div class="message-text">
               <div class="thinking-indicator">
                   <div class="dot"></div>
                   <div class="dot"></div>
                   <div class="dot"></div>
               </div>
           </div>`,
      'bot-message',
      'thinking'
    )
    chatBody.appendChild(incomingMessageDiv)
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: 'smooth' })

    // Send message to Flask backend
    const formData = new FormData()
    formData.append('msg', userMessage)

    fetch('/get', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.text())
      .then((answer) => {
        // Remove thinking indicator
        incomingMessageDiv.classList.remove('thinking')
        const messageElement = incomingMessageDiv.querySelector('.message-text')
        messageElement.innerText = answer.trim()

        // Scroll to bottom
        chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: 'smooth' })
      })
      .catch((error) => {
        console.error('Error:', error)
        incomingMessageDiv.classList.remove('thinking')
        const messageElement = incomingMessageDiv.querySelector('.message-text')
        messageElement.innerText =
          'Sorry, something went wrong. Please try again.'
        messageElement.style.color = '#ff0000'
        chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: 'smooth' })
      })
  }

  // Create message element
  const createMessageElement = (content, ...classes) => {
    const div = document.createElement('div')
    div.classList.add('message', ...classes)
    div.innerHTML = content
    return div
  }

  // Adjust input field height
  messageInput.addEventListener('input', () => {
    messageInput.style.height = `${initialInputHeight}px`
    messageInput.style.height = `${messageInput.scrollHeight}px`
    document.querySelector('.chat-form').style.borderRadius =
      messageInput.scrollHeight > initialInputHeight ? '15px' : '32px'
  })

  // Handle Enter key press
  messageInput.addEventListener('keydown', (e) => {
    const userMessage = e.target.value.trim()
    if (
      e.key === 'Enter' &&
      !e.shiftKey &&
      userMessage &&
      window.innerWidth > 768
    ) {
      handleOutgoingMessage(e)
    }
  })

  // Handle file input change
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      fileInput.value = ''
      fileUploadWrapper.querySelector('img').src = e.target.result
      fileUploadWrapper.classList.add('file-uploaded')
      // Note: File data is not sent to backend unless app.py is modified
    }
    reader.readAsDataURL(file)
  })

  // Cancel file upload
  fileCancelButton.addEventListener('click', () => {
    fileUploadWrapper.classList.remove('file-uploaded')
  })

  // Handle file upload button
  document
    .querySelector('#file-upload')
    .addEventListener('click', () => fileInput.click())

  // Initialize emoji picker
  const picker = new EmojiMart.Picker({
    theme: 'light',
    skinTonePosition: 'none',
    previewPosition: 'none',
    onEmojiSelect: (emoji) => {
      const { selectionStart: start, selectionEnd: end } = messageInput
      messageInput.setRangeText(emoji.native, start, end, 'end')
      messageInput.focus()
      document.body.classList.remove('show-emoji-picker')
    },
    onClickOutside: (e) => {
      if (e.target.id === 'emoji-picker') {
        document.body.classList.toggle('show-emoji-picker')
      } else {
        document.body.classList.remove('show-emoji-picker')
      }
    },
  })
  document.querySelector('.chat-form').appendChild(picker)

  // Send message on button click
  sendMessage.addEventListener('click', (e) => handleOutgoingMessage(e))
})
