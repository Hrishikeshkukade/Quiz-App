import React from "react";
import { Card, Button } from "react-bootstrap";
import styles from "./QuizQuestionStyles";

const QuizQuestions = ({ quizData, userResponses, handleOptionClick, onClick }) => {
  return (
    <>
    <div>
      {quizData.length === 0 ? (
        <p>Loading questions...</p>
      ) : (
        <div>
          {quizData.map((question, questionIndex) => (
           
            <Card style={styles.card} key={questionIndex} className="mt-3">
              <Card.Body>
                <Card.Title>Question {questionIndex + 1}</Card.Title>
                <Card.Text>{question.question}</Card.Text>
                <ul className="list-group">
                  {question.incorrect_answers.map((option, optionIndex) => (
                    <li
                      style={styles.card}
                      key={optionIndex}
                      className={
                        userResponses[questionIndex] === option
                          ? "list-group-item list-group-item-success"
                          : "list-group-item"
                      }
                      onClick={() => handleOptionClick(questionIndex, option)}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          
          
          ))}
        </div>
      )}
    </div>
       <Button
       variant="success"
       className="mt-3"
       style={styles.button1}
       onClick={onClick}
     >
       Submit
     </Button>
    </>
  );
};

export default QuizQuestions;
