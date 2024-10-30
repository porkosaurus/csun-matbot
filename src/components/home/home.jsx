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
        title: "Clubs Demonstration",
        content: `
    <p>That's wonderful that you're passionate about climate change and LGBTQ+ rights! There are a few really great student organizations on campus that I think you'd be interested in.</p>

    <h2>Climate Action</h2>
    <p>First, there's CSUN Act Now - they're a collaboration of students, faculty, and staff working to get the CSUN community involved in a variety of contemporary issues, including climate change. They put on interactive events, lectures, and other activities to help educate people and get them engaged in making meaningful change. You can find them online at <a href="csun.campuslabs.com/engage/organization/can">csun.campuslabs.com/engage/organization/can</a>.</p>

    <h2>LGBTQ+ Advocacy</h2>
    <p>There's also the Queer Coalition of Social Workers, which focuses on LGBTQ+ advocacy and issues. They host discussions, movie screenings, and other events to raise awareness and support the LGBTQ+ community on campus. You can reach out to them at <a href="mailto:qcswcsun@gmail.com">qcswcsun@gmail.com</a>.</p>

    <h2>Environmental Sustainability</h2>
    <p>Another club that might interest you is Sustainable Fashion - they're all about raising awareness of fast fashion's environmental impact and promoting more sustainable clothing options. They do things like thrift exchanges, documentary screenings, and lectures on the history of the fashion industry. You can find them at <a href="csun.campuslabs.com/engage/organization/csunsusfashionclub">csun.campuslabs.com/engage/organization/csunsusfashionclub</a>.</p>

    <p>Those are just a few of the great clubs I'd recommend based on your interests. I'd encourage you to check out their websites and social media to learn more, and feel free to reach out to them directly if you have any other questions! I'm always happy to provide more suggestions if you need them.</p>`
    },
    {
        title: "Course Recommendations",
        content: `
            <p>Since you're a freshman with a passion for playing the guitar and movies but haven't declared a major yet, here are some course recommendations that might interest you:</p>
            <ul>
                <li><strong>MUS 105. Understanding Music</strong> - An overview of Western music traditions, exploring musical styles, structures, and their connection with other art forms. This course could enhance your understanding of music and how it relates to your guitar playing.</li>
                <li><strong>MUS 107. Music Today</strong> - A survey of various music genres like rock, jazz, and pop, focusing on the impact of technology. This could be relevant to your interests in both music and film.</li>
                <li><strong>CTVA 210. Television-Film Aesthetics</strong> - Analyzes the art of television and film, which could provide valuable insights into the cinematic elements you're passionate about.</li>
                <li><strong>CTVA 215. Cult Film and Television</strong> - Explores "cult" films and TV, their unique aesthetics, and the role of audience reception. A great fit for your movie interests.</li>
            </ul>
            <p>These courses fulfill General Education requirements in the Arts (C1) area and align well with your interests in music and film.</p>
            <p>You might also explore courses like <strong>PHIL 165. Ethics for the 21st Century</strong> or <strong>PHIL 180. Human Nature and the Meaning of Life</strong>, which provide philosophical perspectives and could broaden your intellectual horizons.</p>
            <p>Feel free to adjust your selections based on your evolving interests as you continue your academic journey!</p>

`
    }
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

    // Handle predefined responses
    if (submissionCount < predefinedResponses.length) {
      await new Promise(resolve => setTimeout(resolve, 5500));
      
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
          <FontAwesomeIcon icon={faBars} color="#D22030" className="text-xl md:text-3xl" />
        </div>
        <h1 className="text-xl md:text-4xl font-semibold ml-4 md:ml-16 text-[#d22030]">MatBot</h1>
      </div>
  
      {/* Spacer to make room for the fixed header */}
      {/* We add this spacer to ensure the chat content isn't blocked by the header */}
      <div className="h-16 md:h-20"></div>
  
      {/* Chat container - Flexible height and scrolling */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 pb-24"
        style={{ maxHeight: 'calc(100vh - 10rem)', paddingTop: '4rem' }}  // Add paddingTop to push down content
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
          </div>
        </form>
      </div>
    </div>
  );  
};

export default Home;