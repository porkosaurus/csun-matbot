import React, { useState, useRef, useEffect } from 'react';
import '../../App.css'
import csunlogo from '../../images/2560px-CSU_Northridge_logo.svg.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowPointer, faM } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import './home.css'
import loading from '../../images/writing-loading.gif'

const Home = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [chats, setChats] = useState([]);
  const [currentChatIndex, setCurrentChatIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('model1');
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [transcribedQuestion, setTranscribedQuestion] = useState('');
  const [disabled, setDisabled] = useState(true);

  
  useEffect(() => {
    createNewChat(); // Automatically create a new chat when the component mounts
  }, []);

  const switchChat = (chatIndex) => {
    setCurrentChatIndex(chatIndex);
  };
  

  const createNewChat = () => {
    const newChat = {
      id: Date.now(),
      question: '',
      answer: '',
      context: '',
      appendedResponses: '', // Add this property
    };
    setChats([...chats, newChat]);
    setCurrentChatIndex(chats.length);
  };

      // Add this function above your Home component
    const getLastQuestion = (appendedResponses) => {
      const questionRegex = /<strong>Question:<\/strong> (.*?)<\/p>/g;
      let lastQuestion = '';
      let match;

      while ((match = questionRegex.exec(appendedResponses)) !== null) {
        lastQuestion = match[1]; // Extract the question text
      }

      return lastQuestion || 'No question asked yet';
    };

    const handleSubmit = async (e) => {
      e.preventDefault(); // Prevent the default form submission behavior
    
      if (currentChatIndex === null || disabled) return; // Exit if no chat is selected or if the input is disabled
    
      setIsLoading(true); // Set loading state to true
    
      const currentChat = { ...chats[currentChatIndex] }; // Get a copy of the current chat
      const submittedQuestion = currentChat.question; // Get the question from the current chat
    
      // Clear the input field immediately after submitting
      currentChat.question = '';
      const updatedChats = [...chats];
      updatedChats[currentChatIndex] = currentChat;
      setChats(updatedChats);
    
      try {
        // Make a POST request to the server with the question and context
        const response = await fetch('https://chatbot-server-419523.wl.r.appspot.com/chatbot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question: submittedQuestion,
            context: currentChat.context,
            model: 'model2', // Use the selected model (hardcoded to 'model2' here)
          }),
        });
    
        const data = await response.json(); // Parse the JSON response
    
        // Update the context with the new question and answer
        let contextArray = currentChat.context.split('|').filter((item) => item.trim() !== '');
        contextArray.push(`Question: ${submittedQuestion} Answer: ${data.base_answer}`);
        if (contextArray.length > 3) {
          contextArray.shift(); // Remove the oldest context if there are more than 3
        }
        const newContext = contextArray.join(' | ');
    
        // Update the chat with the new response and context
        const newResponse = `
        <div class="response-container" data-base-answer="${data.base_answer}">
          <p class="mb-4 text-sm md:text-lg"><strong>Question:</strong> ${submittedQuestion}</p>
          <p class="text-sm md:text-lg"><strong>Answer:</strong> ${data.formatted_answer}</p>
          <div class="translation-controls">
            <select class="language-dropdown">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="it">Italian</option>
              <option value="ru">Russian</option>
              <option value="zh">Mandarin</option>
              <option value="ur">Urdu</option>
              <option value="ar">Arabic</option>
            </select>
            <button class="translate-button">Translate</button>
            <button class="read-aloud-button">Read Aloud</button>
            </div>
        </div>
      `;
    
        const updatedChat = {
          ...currentChat,
          answer: data.base_answer,
          context: newContext,
          appendedResponses: currentChat.appendedResponses + newResponse,
        };
        updatedChats[currentChatIndex] = updatedChat;
        setChats(updatedChats); // Update the state with the modified chat
    
        setIsLoading(false); // Set loading state to false
      } catch (error) {
        console.error('Error:', error);
        setIsLoading(false); // Set loading state to false in case of error
      }
    };
    
  
  const handleInputChange = (e) => {
    const updatedChats = [...chats];
    updatedChats[currentChatIndex] = { ...chats[currentChatIndex], question: e.target.value };
    setChats(updatedChats);
    setDisabled(e.target.value.trim() === ''); // Update disabled state based on input value
  };
  

  const getBaseAnswer = (responseElement) => {
    return responseElement.getAttribute('data-base-answer');
  };
  
  const handleTranslateClick = async (event) => {
    if (event.target.classList.contains('translate-button')) {
      const buttonElement = event.target;
      const responseContainer = buttonElement.closest('.response-container');
      const baseAnswer = responseContainer.getAttribute('data-base-answer');
      const language = responseContainer.querySelector('.language-dropdown').value;
  
      try {
        const response = await fetch('https://chatbot-server-419523.wl.r.appspot.com/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: baseAnswer,
            target_language: language,
          }),
        });
  
        const data = await response.json();
        responseContainer.setAttribute('data-base-answer', data.translated_text); // Update the data-base-answer attribute
        const answerElement = responseContainer.querySelector('.response');
        answerElement.innerHTML = `${data.translated_text}`;
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };
  
  
  const handleReadAloudClick = async (event) => {
    if (event.target.classList.contains('read-aloud-button')) {
      const buttonElement = event.target;
      const responseContainer = buttonElement.closest('.response-container');
      const text = responseContainer.getAttribute('data-base-answer');
      const language = responseContainer.querySelector('.language-dropdown').value;
  
      try {
        const response = await fetch('https://chatbot-server-419523.wl.r.appspot.com/read_aloud', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: text,
            language: language,
          }),
        });
  
        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        audio.play();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.start();

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop(); // Stop the MediaRecorder
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop()); // Stop the media stream
      setIsRecording(false);
  
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        audioChunksRef.current = [];
  
        try {
          const formData = new FormData();
          formData.append('audio', audioBlob);
  
          const response = await fetch('https://chatbot-server-419523.wl.r.appspot.com/speech_to_text', {
              method: 'POST',
              body: formData,
          });
  
          const data = await response.json();
          const transcription = data.transcriptions.join(' '); // Get the transcription
          console.log("Transcription:", transcription);
  
          // Set the question of the current chat to the transcribed text
          if (currentChatIndex !== null) {
            const updatedChats = [...chats];
            updatedChats[currentChatIndex].question = transcription;
            setChats(updatedChats);
          }
  
        } catch (error) {
          console.error('Error sending audio to server:', error);
        }
      };
    }
  };
  


  return (
    <div className='sm:h-screen h-screen w-screen flex'>
      <div className='w-[35%] md:w-[25%] bg-[#fff] h-full flex flex-col pt-8 items-center border-r-2 border-black'>
        <div className='w-full h-auto flex flex-col items-center'>
          <div className='flex justify-between w-full'>
            <h3 className='text-xl md:text-2xl self-start mr-2 ml-2 md:ml-8 text-black font-semibold mb-12 mt-1 md:mb-8'>Chats</h3>
            <FontAwesomeIcon onClick={createNewChat} icon={faPenToSquare} size="2x" color="#D22030" className='mr-12' />
          </div>
        <input type="text" className='w-[80%] p-2 border border-2 border-black rounded-md pl-4 mb-6' placeholder='Search your chats...' />
        </div>
        <div className='flex flex-col justify-start h-full items-center w-full'>
        {chats.map((chat, index) => (
    <div
      key={chat.id}
      className={`pl-6 pb-4 pt-4 w-[90%] md:w-[80%] mb-1 rounded-md border-1 border-black border ${currentChatIndex === index ? 'bg-[#f2f2f2] text-black' : 'bg-white text-black'} border-solid cursor-pointer`}
      onClick={() => switchChat(index)}
    >
      <p className='text-sm truncated-text'>{getLastQuestion(chat.appendedResponses) || "No question asked yet"}</p>
    </div>
  ))}
        </div>

      </div>
      <div className='w-[65%] md:w-[75%] bg-[#fff] flex flex-col pb-16'>
        <div className='h-[10vh] border-b-2 border-black flex w-full pl-8 pt-8 pb-8 bg-[#f2f2f2]' style={{ position: 'relative' }}>
            <img className='w-[50%] md:w-[30%]' src={csunlogo} alt="CSUN Logo" />
            <h1 className='text-center text-lg md:text-4xl font-semibold ml-4 md:ml-16'>MatBot</h1>
        </div>
        <div className='pt-12 h-[90vh]'>
        <div className='h-[60%] overflow-y-auto mt-12 pr-4 pl-4' onClick={(event) => {
          handleTranslateClick(event);
          handleReadAloudClick(event);
        }}>
          {currentChatIndex !== null && (
            <div dangerouslySetInnerHTML={{ __html: chats[currentChatIndex].appendedResponses }} />
          )}
          {isLoading && <img style={{ transform: 'scale(0.3)' }} src={loading} alt="Loading..." />}
        </div>

        <div className='h-[20%] pl-4 md:pl-16 flex justify-center items-end mb-16 fixed bottom-0 w-[60%]'>
        <form onSubmit={handleSubmit} className='h-[40%] w-[80%] md:w-[105%] flex'>
          <input
            className='bg-white pl-1 md:pl-4 block w-[100%] rounded-md border-0 py-4 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6'
            type="text"
            value={currentChatIndex !== null ? chats[currentChatIndex].question : ''}
            onChange={handleInputChange}
            placeholder="Enter your question"
          />
          <div className='bg-[#fff] rounded-lg ml-2 md:ml-2 pl-1 w-[10%] h-[100%] flex justify-center items-center'>
            <FontAwesomeIcon
              icon={faArrowPointer}
              size="2x"
              color={disabled ? '#D3D3D3' : '#D22030'} // Change color based on disabled state
              style={{ transform: 'rotate(350deg)' }}
              onClick={!disabled ? handleSubmit : null} // Only allow click if not disabled
            /> 
          </div>
        </form>
        <div className='mb-4 ml-4 md:ml-0'>
        <div>
          <button onClick={isRecording ? stopRecording : startRecording}>
            {isRecording ? <FontAwesomeIcon icon={faMicrophone} size='2x' color="#D22030" className='mt-4'/> : <FontAwesomeIcon icon={faMicrophone} size='2x' color='#000' className='mt-2.5'/>}
          </button>
        </div>
      </div>
      </div>

        </div>


      </div>
    </div>
  );
;
}
export default Home;
