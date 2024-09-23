// Question.jsx

import React, { useState } from 'react';

const Question = ({ question, onAnswer, selectedAnswers = [] }) => {
  const [selectedOption, setSelectedOption] = useState(selectedAnswers);

  const handleOptionChange = (option) => {
    if (question.type === 'multiple') {
      let updatedSelections;
      if (selectedOption.includes(option)) {
        updatedSelections = selectedOption.filter((item) => item !== option);
      } else {
        updatedSelections = [...selectedOption, option];
      }
      setSelectedOption(updatedSelections);
      onAnswer(question.id, updatedSelections);
    } else {
      setSelectedOption(option);
      onAnswer(question.id, option);
    }
  };

  // Divide options into two columns
  const midIndex = Math.ceil(question.options.length / 2);
  const firstColumnOptions = question.options.slice(0, midIndex);
  const secondColumnOptions = question.options.slice(midIndex);

  return (
    <div className="question">
      <h2>{question.questionText}</h2>
      <div className="options-container">
        <div className="options-column">
          {firstColumnOptions.map((option) => (
            <label key={option} className="option-label">
              <input
                type={question.type === 'multiple' ? 'checkbox' : 'radio'}
                name={question.id}
                value={option}
                checked={
                  question.type === 'multiple'
                    ? selectedOption.includes(option)
                    : selectedOption === option
                }
                onChange={() => handleOptionChange(option)}
              />
              <span className="custom-checkbox"></span>
              {option}
            </label>
          ))}
        </div>
        <div className="options-column">
          {secondColumnOptions.map((option) => (
            <label key={option} className="option-label">
              <input
                type={question.type === 'multiple' ? 'checkbox' : 'radio'}
                name={question.id}
                value={option}
                checked={
                  question.type === 'multiple'
                    ? selectedOption.includes(option)
                    : selectedOption === option
                }
                onChange={() => handleOptionChange(option)}
              />
              <span className="custom-checkbox"></span>
              {option}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Question;
