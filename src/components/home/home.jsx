import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowPointer, faBars, faMicrophone, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import matbot from '../../images/matbot-logo.png';
import loading from '../../images/writing-loading.gif';

const Home = () => {
  const [inputValue, setInputValue] = useState('');
  const [chats, setChats] = useState([]);
  const [currentChatIndex, setCurrentChatIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [marginTop, setMarginTop] = useState('2rem');
  const chatContainerRef = useRef(null);

  const suggestions = [
    "Where can I find a place to study?",
    "How to register for my classes",
    "What events are happening on campus"
  ];

  const predefinedResponses = [
    // ... (predefinedResponses content omitted for brevity)
  ];

  useEffect(() => {
    createNewChat();
  }, []);

  const createNewChat = () => {
    const newChat = {
      id: Date.now(),
      question: '',
      answer: '',
      context: '',
      appendedResponses: '',
    };
    setChats([...chats, newChat]);
    setCurrentChatIndex(chats.length);
    setInputValue('');
  };

  const switchChat = (chatIndex) => {
    setCurrentChatIndex(chatIndex);
    setInputValue('');
  };

  const getLastQuestion = (appendedResponses) => {
    const questionRegex = /<p class="chat-bubble chat-bubble-question.*?">(.*?)<\/p>/;
    const match = appendedResponses.match(questionRegex);
    return match ? match[1] : 'No question asked yet';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentChatIndex === null || disabled) return;

    setIsLoading(true);
    setMarginTop('0.5rem');

    const submittedQuestion = inputValue;
    setInputValue('');
    setDisabled(true);

    try {
      // Make a POST request to the Flask API
      const response = await fetch('https://00a5-130-166-1-214.ngrok-free.app/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: submittedQuestion,
          context: chats[currentChatIndex]?.context || '',
          model: 'model2',
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Construct the response HTML
        const newResponse = `
          <div class="response-container">
            <p class="chat-bubble chat-bubble-question mb-4 text-sm md:text-lg rounded-full text-white border-black">
              ${submittedQuestion}
            </p>
            <div class="chat-bubble chat-bubble-answer text-sm md:text-lg">
              ${data.formatted_answer}
            </div>
          </div>
        `;

        // Update the current chat with the new response
        const updatedChat = {
          ...chats[currentChatIndex],
          question: '',
          answer: data.formatted_answer,
          appendedResponses: (chats[currentChatIndex].appendedResponses || '') + newResponse,
        };

        const updatedChats = [...chats];
        updatedChats[currentChatIndex] = updatedChat;
        setChats(updatedChats);
      } else {
        console.error('Failed to fetch response from the server');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setDisabled(value.trim() === '');
  };

  // New: Voice Input Functionality
  const handleVoiceInput = () => {
    // Check if the browser supports the Speech Recognition API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser doesn't support speech recognition. Please try using Chrome.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log("Voice recognition started. Please speak...");
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("Recognized transcript:", transcript);
      // Set the recognized text into the input field and enable submission
      setInputValue(transcript);
      setDisabled(transcript.trim() === '');

      // For this demo, we immediately send the transcript to a dummy server link.
      // (Replace the URL with your actual endpoint later.)
      try {
        const response = await fetch('https://dummy-endpoint.com/voice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ voiceInput: transcript }),
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Response from voice endpoint:", data);
          // Optionally, you could process data here or even auto-submit the chat.
        } else {
          console.error("Failed to send voice input");
        }
      } catch (error) {
        console.error("Error sending voice input:", error);
      }
    };

    recognition.start();
  };

  const renderChatContent = () => {
    if (currentChatIndex !== null && chats[currentChatIndex] && chats[currentChatIndex].appendedResponses) {
      return (
        <div className="transition-all duration-300" style={{ marginTop }}>
          <div dangerouslySetInnerHTML={{ __html: chats[currentChatIndex].appendedResponses }} />
          {isLoading && (
            <div className="flex justify-center items-center mt-4">
              <img 
                src={loading} 
                alt="Loading..." 
                className="transform scale-30"
                style={{ transform: 'scale(0.3)' }}
              />
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col justify-center items-center">
        <img 
          src={matbot} 
          alt="MatBot Logo" 
          className="w-48 h-48 md:w-64 md:h-64 object-contain"
        />
        <div className="w-full flex flex-col items-center mt-8">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion}
              className="w-[65%] p-4 mb-4 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-all duration-300"
              style={{
                opacity: 0,
                animation: `fadeIn 0.5s ease-out ${index * 0.2}s forwards`
              }}
              onClick={() => {
                setInputValue(suggestion);
                setDisabled(false);
              }}
            >
              <p className="text-gray-600 text-center">{suggestion}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .chat-bubble-question {
            background-color: #D22030;
            padding: 1rem;
            margin-bottom: 1rem;
          }
          .chat-bubble-answer {
            background-color: #f2f2f2;
            padding: 1.5rem;
            border-radius: 1rem;
            margin-bottom: 2rem;
          }
          .chat-bubble-answer ul {
            margin-left: 1.5rem;
            margin-bottom: 1rem;
            list-style-type: disc;
          }
          .chat-bubble-answer li {
            margin-bottom: 0.5rem;
          }
          .chat-bubble-answer h3 {
            font-weight: bold;
            margin-top: 1rem;
            margin-bottom: 0.5rem;
          }
        `}
      </style>
  
      {/* Header - Fixed size and position */}
      <div className="fixed top-0 left-0 right-0 z-10 flex items-center border-b-2 border-black bg-[#f2f2f2] px-4 md:px-8 py-4 md:py-6 h-16 md:h-20">
        <div className="w-8 md:w-12">
          <FontAwesomeIcon icon={faBars} color="#D22030" className="text-xl md:text-3xl" />
        </div>
        <h1 className="text-xl md:text-4xl font-semibold ml-4 md:ml-16 text-[#d22030]">MatBot</h1>
      </div>
  
      {/* Spacer to make room for the fixed header */}
      <div className="h-16 md:h-20"></div>
  
      {/* Chat container - Flexible height and scrolling */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 pb-24"
        style={{ maxHeight: 'calc(100vh - 10rem)', paddingTop: '4rem' }}
      >
        {currentChatIndex !== null && chats[currentChatIndex] && chats[currentChatIndex].appendedResponses ? (
          <div className="transition-all duration-300 pt-4" style={{ marginTop }}>
            <div dangerouslySetInnerHTML={{ __html: chats[currentChatIndex].appendedResponses }} />
            {isLoading && (
              <div className="flex justify-center items-center mt-4">
                <img
                  src={loading}
                  alt="Loading..."
                  className="transform scale-30"
                  style={{ transform: 'scale(0.3)' }}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="min-h-0 h-full flex flex-col justify-start md:justify-center items-center pt-8 md:pt-0">
            <img
              src={matbot}
              alt="MatBot Logo"
              className="w-32 h-32 md:w-64 md:h-64 object-contain mb-8"
            />
            <div className="w-full flex flex-col items-center space-y-4 pb-20 md:pb-0">
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion}
                  className="w-[85%] md:w-[65%] p-3 md:p-4 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-all duration-300"
                  style={{
                    opacity: 0,
                    animation: `fadeIn 0.5s ease-out ${index * 0.2}s forwards`
                  }}
                  onClick={() => {
                    setInputValue(suggestion);
                    setDisabled(false);
                  }}
                >
                  <p className="text-gray-600 text-center text-sm md:text-base">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
  
      {/* Input container - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4">
        <form onSubmit={handleSubmit} className="flex max-w-5xl mx-auto">
          <input
            className="flex-1 bg-white pl-4 rounded-full border-0 py-3 md:py-4 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 text-base"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter your question"
          />
          <div className="ml-2 w-12 flex items-center justify-center">
            <FontAwesomeIcon
              icon={faArrowPointer}
              size="2x"
              color={disabled ? '#D3D3D3' : '#D22030'}
              style={{ transform: 'rotate(350deg)', cursor: disabled ? 'default' : 'pointer' }}
              onClick={!disabled ? handleSubmit : undefined}
            />
            {/* Update the microphone icon to trigger voice input */}
            <FontAwesomeIcon
              icon={faMicrophone}
              size="2x"
              color="#D22030"
              style={{ cursor: 'pointer', marginLeft: '0.5rem' }}
              onClick={handleVoiceInput}
            />
          </div>
        </form>
      </div>
    </div>
  );  
};

export default Home;
