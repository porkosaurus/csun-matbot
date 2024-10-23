import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowPointer, faBars, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
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
    {
        title: "SMART Lab Services",
        content: `
            <p>The SMART Lab at CSUN offers academic support and tutoring in the following subjects:</p>
            <ul>
                <li>Accounting</li>
                <li>American Sign Language (ASL)</li>
                <li>Chemistry</li>
                <li>Mathematics</li>
                <li>Physics</li>
                <li>Psychology</li>
                <li>Economics</li>
            </ul>
            <p>The SMART Lab provides both walk-in and appointment-based tutoring services, with tutors who are undergraduate and graduate students from various university disciplines.</p>
            <p>The lab offers:</p>
            <ul>
                <li>Supplemental Instruction (SI) for Math and Science courses with junior, senior, and graduate student leaders</li>
                <li>Group study sessions focused on understanding material and developing study strategies</li>
                <li>Support for note-taking and problem-solving skills</li>
                <li>Exam preparation assistance</li>
                <li>Matador Achievement Center free tutoring for all current student-athletes</li>
                <li>University Writing Center support with peer writing specialists and faculty writing consultants</li>
            </ul>`
    },
    {
        title: "Healthcare Services",
        content: `
            <h3>Klotz Student Health Center</h3>
            <ul>
                <li>Primary and specialty care services including:
                    <ul>
                        <li>Acupuncture</li>
                        <li>Chiropractic care</li>
                        <li>Nutrition counseling</li>
                        <li>Optometry</li>
                        <li>Physical therapy</li>
                        <li>Sexual/reproductive health</li>
                        <li>Sports medicine</li>
                    </ul>
                </li>
                <li>Staffed by physicians, nurse practitioners, and health educators</li>
                <li>Appointments: 818-677-3666, option 1</li>
                <li>After-hours care information available</li>
            </ul>

            <h3>University Counseling Services (UCS)</h3>
            <ul>
                <li>Free mental health services including:
                    <ul>
                        <li>Initial evaluations</li>
                        <li>Short-term counseling</li>
                        <li>Wellness workshops</li>
                        <li>Group treatment</li>
                        <li>Psychiatric services</li>
                        <li>Crisis/urgent care</li>
                    </ul>
                </li>
                <li>Confidential and accessible services including ASL support</li>
            </ul>

            <h3>Oasis Wellness Center</h3>
            <ul>
                <li>Located in the University Student Union (USU)</li>
                <li>Amenities include:
                    <ul>
                        <li>Nap pods</li>
                        <li>Massage/relaxation chairs</li>
                        <li>Guided meditation</li>
                        <li>Wellness classes/workshops</li>
                    </ul>
                </li>
            </ul>

            <h3>Additional Resources</h3>
            <ul>
                <li>Institute for Community Health and Wellbeing (HWB)</li>
                <li>YOU@CSUN online well-being platform</li>
            </ul>`
    },
    {
        title: "Gender-Inclusive Bathrooms",
        content: `
            <h3>University Student Union Locations</h3>
            <ul>
                <li>Sol Center (2nd floor) - 2 restrooms</li>
                <li>East Conference Center (1st and 2nd floors)</li>
            </ul>

            <h3>Campus Building Locations</h3>
            <ul>
                <li>Arbor Court (1st floor)</li>
                <li>Brown Center (1st floor)</li>
                <li>Chaparral Hall (2nd floor)</li>
                <li>Cypress Hall (1st and 2nd floors)</li>
                <li>Education Building (2nd floor)</li>
                <li>Eucalyptus Hall (basement)</li>
                <li>Extended University Commons (1st, 2nd, and 3rd floors)</li>
                <li>Intercollegiate Athletics Office (1st floor)</li>
                <li>Laurel Hall (1st floor)</li>
                <li>Maple Hall (1st, 2nd, and 3rd floors)</li>
                <li>Monterey Hall (1st, 2nd, and 3rd floors)</li>
                <li>Oasis Wellness Center (basement)</li>
                <li>University Library (1st floor)</li>
                <li>Santa Susana Hall (1st floor)</li>
                <li>Sierra Hall (1st floor)</li>
                <li>Sierra Tower (8th floor)</li>
                <li>Student Health Center (2nd floor)</li>
                <li>Sustainability Center/AS Recycling (1st floor)</li>
                <li>The Soraya (1st floor)</li>
            </ul>
            <p>For more information, contact the LGBTQ Advisory Board at lgbtqadvisory@csun.edu</p>`
    },
    {
        title: "Course Recommendations",
        content: `
            <h3>First Year Economics Major Schedule Example</h3>
            <p>Monday/Wednesday:</p>
            <ul>
                <li>MATH 103 Mathematical Methods for Business - 11:30am-12:45pm</li>
                <li>POLS 155 American Political Institutions - 10:00am-11:15am</li>
            </ul>
            <p>Tuesday/Thursday:</p>
            <ul>
                <li>ECON 160 Principles of Microeconomics - 11:30am-12:45pm</li>
                <li>ANTH 151 Introduction to Biological Anthropology - 1:00pm-2:15pm</li>
            </ul>

            <h3>Music and Film Interest Courses</h3>
            <ul>
                <li>MUS 105 Understanding Music - Overview of Western music traditions</li>
                <li>MUS 107 Music Today - Survey of various music genres including rock, jazz, and pop</li>
                <li>CTVA 210 Television-Film Aesthetics - Analysis of TV and film as communicative art forms</li>
                <li>CTVA 215 Cult Film and Television - Study of cult films and TV shows</li>
            </ul>

            <h3>Additional Recommended Courses</h3>
            <ul>
                <li>PHIL 165 Ethics for the 21st Century</li>
                <li>PHIL 180 Human Nature and the Meaning of Life</li>
                <li>ENGL 113B Approaches to University Writing B</li>
            </ul>`
    }
];

  useEffect(() => {
    createNewChat();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chats, isLoading]);

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

    // Handle predefined responses
    if (submissionCount < predefinedResponses.length) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = predefinedResponses[submissionCount];
      
      const newResponse = `
        <div class="response-container">
          <p class="chat-bubble chat-bubble-question mb-4 text-sm md:text-lg rounded-full text-white border-black">${submittedQuestion}</p>
          <div class="chat-bubble chat-bubble-answer text-sm md:text-lg">
            <h2 class="font-bold mb-4">${response.title}</h2>
            ${response.content}
          </div>
        </div>
      `;

      const updatedChat = {
        ...chats[currentChatIndex],
        question: '',
        answer: response.content,
        appendedResponses: (chats[currentChatIndex].appendedResponses || '') + newResponse,
      };

      const updatedChats = [...chats];
      updatedChats[currentChatIndex] = updatedChat;
      setChats(updatedChats);
      setSubmissionCount(prevCount => prevCount + 1);
    } else {
      try {
        const response = await fetch('https://chatbot-server-419523.wl.r.appspot.com/chatbot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question: submittedQuestion,
            context: chats[currentChatIndex].context,
            model: 'model2',
          }),
        });

        if (response.ok) {
          const data = await response.json();
          // Handle API response similarly to predefined responses
          const newResponse = `
            <div class="response-container">
              <p class="chat-bubble chat-bubble-question mb-4 text-sm md:text-lg rounded-full text-white border-black">${submittedQuestion}</p>
              <div class="chat-bubble chat-bubble-answer text-sm md:text-lg">${data.answer}</div>
            </div>
          `;

          const updatedChat = {
            ...chats[currentChatIndex],
            question: '',
            answer: data.answer,
            appendedResponses: (chats[currentChatIndex].appendedResponses || '') + newResponse,
          };

          const updatedChats = [...chats];
          updatedChats[currentChatIndex] = updatedChat;
          setChats(updatedChats);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
    
    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setDisabled(value.trim() === '');
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
          <FontAwesomeIcon icon={faBars} color="#D22030" className="text-xl md:text-3xl"/>
        </div>
        <h1 className="text-xl md:text-4xl font-semibold ml-4 md:ml-16 text-[#d22030]">MatBot</h1>
      </div>
  
      {/* Spacer to make room for the fixed header */}
      <div className="h-16 md:h-20"></div>
  
      {/* Chat container - Flexible height and scrolling */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 pb-24 flex flex-col justify-start items-center" // Ensure flex column for vertical alignment
      >
        <div className="mt-4 mb-8"> {/* Add margin to push logo down */}
          <img 
            src={matbot} 
            alt="MatBot Logo" 
            className="w-32 h-32 md:w-64 md:h-64 object-contain"
          />
        </div>
  
        {/* Only show this section if currentChatIndex is valid */}
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
          <div className="min-h-0 h-full flex flex-col justify-start items-center pt-4">
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
          </div>
        </form>
      </div>
    </div>
  );
  
  
};

export default Home;