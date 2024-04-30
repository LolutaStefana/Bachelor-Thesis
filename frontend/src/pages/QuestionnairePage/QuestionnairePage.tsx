import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './questionnairepage.css'; 
import { Button } from '@mui/material';

interface Question {
  id: number;
  text: string;
  category: string;  
}

const questions: Question[] = [
  { id: 1, text: "How often do you feel overwhelmed by sadness?", category: "depression" },
  { id: 2, text: "Do you find it difficult to concentrate on tasks?", category: "anxiety" },
  { id: 3, text: "How often do you feel fatigued or low energy?", category: "general_wellbeing" },
  { id: 4, text: "How often do you feel nervous or on edge?", category: "anxiety" },
  { id: 5, text: "How often do you feel afraid or anxious about the future?", category: "anxiety" },
  { id: 6, text: "How often do you find yourself worrying about things?", category: "anxiety" },
  { id: 7, text: "Do you avoid certain situations due to fear or anxiety?", category: "phobias" },
  { id: 8, text: "Do you experience sudden episodes of intense fear or panic?", category: "panic_disorder" },
  { id: 9, text: "Do you feel detached or estranged from other people?", category: "ptsd" },
  { id: 10, text: "Do you have recurrent thoughts or images that refuse to go away?", category: "ocd" },
  { id: 11, text: "Do you feel the need to perform certain rituals repeatedly?", category: "ocd" },
  { id: 12, text: "Do you feel irritable or angry without obvious reasons?", category: "mood_swings" },
  { id: 13, text: "Do you engage in behavior that could be harmful to you or others?", category: "impulse_control" },
  { id: 14, text: "Do you find it difficult to manage responsibilities at work or home?", category: "stress" },
  { id: 15, text: "Do you have difficulty making decisions?", category: "depression" },
  { id: 16, text: "Do you have trouble remembering things?", category: "depression" },
  { id: 17, text: "Do you often feel guilty or worthless?", category: "depression" },
  { id: 18, text: "Do you often feel hopeless?", category: "depression" },
  { id: 19, text: "Do you experience mood swings that affect your work?", category: "bipolar_disorder" },
  { id: 20, text: "Do you have periods of hyperactivity followed by lethargy?", category: "bipolar_disorder" },
  { id: 21, text: "Do you have difficulty understanding social cues?", category: "autism_spectrum" },
  { id: 22, text: "Do you feel uncomfortable in social situations?", category: "social_anxiety" },
  { id: 23, text: "Do you avoid social interactions?", category: "social_anxiety" },
  { id: 24, text: "Do you feel excessive fear about a specific object or situation?", category: "phobias" },
  { id: 25, text: "Do you experience flashbacks to traumatic events?", category: "ptsd" },
  { id: 26, text: "Do you avoid places that remind you of past traumas?", category: "ptsd" },
  { id: 27, text: "Do you feel a lack of interest in activities you once enjoyed?", category: "depression" },
  { id: 28, text: "Do you consume alcohol or drugs more than you should?", category: "substance_use" },
  { id: 29, text: "Do you often eat in response to emotional stress?", category: "eating_disorders" },
  { id: 30, text: "Do you obsess over your weight and body image?", category: "eating_disorders" },
  { id: 31, text: "Do you often feel aggressive or hostile?", category: "anger_management" },
  { id: 32, text: "Do you have difficulty relaxing?", category: "stress" },
  { id: 33, text: "Do you suffer from chronic pain without a medical diagnosis?", category: "psychosomatic" },
  { id: 34, text: "Do you often feel misunderstood by others?", category: "personality_disorders" },
  { id: 35, text: "Do you find that your relationships are often turbulent?", category: "relationship_issues" },
  { id: 36, text: "Do you have thoughts that you would be better off dead?", category: "depression" },
  { id: 37, text: "Do you often feel restless or unable to sit still?", category: "anxiety" },
  { id: 38, text: "Do you experience periods of intense activity or thinking?", category: "bipolar_disorder" },
  { id: 39, text: "Do you often feel paranoid or suspicious without reason?", category: "paranoia" },
  { id: 40, text: "Do you have difficulty sleeping or experience disturbed sleep?", category: "sleep_quality" },
  { id: 41, text: "Do you experience significant mood improvements after sleep deprivation?", category: "bipolar_disorder" },
  { id: 42, text: "Do you have frequent nightmares or disturbing dreams?", category: "ptsd" },
  { id: 43, text: "Do you find it difficult to trust others?", category: "trust_issues" },
];

type AnswersState = {
  [key: number]: number;
};

const QuestionnairePage = () => {
    const [answers, setAnswers] = useState<AnswersState>({});
    const navigate = useNavigate();
  
    const handleAnswerChange = (questionId: number, value: number) => {
      setAnswers(prev => ({ ...prev, [questionId]: value }));
    };
  
    const handleSubmit = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/evaluate-responses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers })
        });
  
        if (!response.ok) {
          throw new Error('Failed to submit questionnaire.');
        }
  
        const result = await response.json();
        console.log(result);
        navigate('/results-page');
      } catch (error) {
        console.error('Error submitting questionnaire:', error);
      }
    };
  
    return (
      <div className="questionnaire-container">
        {questions.map(question => (
          <div key={question.id} className="question-block">
            <p className="question-text">{question.text}</p>
            <div className="answer-options">
              {['Never', 'Rarely', 'Sometimes', 'Often', 'Always'].map((option, index) => (
                <label key={index}>
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={index + 1}
                    onChange={() => handleAnswerChange(question.id, index + 1)}
                    checked={answers[question.id] === index + 1}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}
        <Button variant="contained" onClick={handleSubmit} className="submit-button">Submit</Button>
      </div>
    );
  };
  
  export default QuestionnairePage;
