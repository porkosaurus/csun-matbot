import React from 'react'

const chat = () => {
  return (
    <div>
    <h1>Ask the Chatbot</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your question"
        />
        <button type="submit">Submit</button>
      </form>
      {answer && (
        <div>
          <h2>Response:</h2>
          <p>{answer}</p>
        </div>
      )}
    </div>
  )
}

export default chat