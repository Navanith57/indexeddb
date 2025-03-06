import React, { useState, useEffect } from 'react';
import useStateRef from 'react-usestateref';
import './Questions.css';
import { saveLearningPath } from '../../utils/IndexedDB';

const Questions = () => {
  const [questions, setQuestions, questionsRef] = useStateRef([]);
  const [loading, setLoading] = useState(false);
  const [journeyId, setJourneyId] = useState(null);

  const journeyIds = {
    journey1: '67b55f5e0df0410f9818c390',
    journey2: '67b6d0991b26d539aee27d41',
    journey3: '67bc3f09bc9d2df718040df4'
  };

  useEffect(() => {
    const fetchAndStoreQuestions = async () => {
      if (!journeyId) return;

      setLoading(true);
      const fetchedQuestions = await fetchAllQuestions(journeyId);

      if (fetchedQuestions.length > 0) {
        await saveLearningPath(journeyId, fetchedQuestions); 
      }

      setQuestions(fetchedQuestions);
      setLoading(false);
    };

    fetchAndStoreQuestions();
  }, [journeyId]);

  const fetchAllQuestions = async (journeyId) => {
    let offset = 0;
    let allQuestions = [];
    let hasMoreData = true;

    while (hasMoreData) {
      const url = `https://wkacf1hdj6.execute-api.ap-south-1.amazonaws.com/dev/lp-progress/v2?journey_id=${journeyId}&limit=5&offset=${offset}`;
      const options = {
        method: 'GET',
        headers: {
          'Authorization': 'eyJraWQiOiJNcXVjZlMxTStZaEU5ZGxldHZvalwvQnNLSm13emhqNkt1UUZDd2FkTm1NZz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIwMWUzY2Q2YS05MDIxLTcwOWItYTI3Zi1kODExMGRlYzQ5ZGUiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiY3VzdG9tOmxhc3ROYW1lIjoiU3R1ZGVudCIsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5hcC1zb3V0aC0xLmFtYXpvbmF3cy5jb21cL2FwLXNvdXRoLTFfTWNSUktUdG8zIiwiY3VzdG9tOnVzZXJfaWQiOiI2NzA3NWFjZTY2Zjg1ZGZhOGIzMDg1ZDUiLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOnRydWUsImNvZ25pdG86dXNlcm5hbWUiOiI5ODc4IiwicHJlZmVycmVkX3VzZXJuYW1lIjoiOTg3ODY3MDYxNTAwMzJiZWQwYTI2Nzk1ZjJjNiIsImN1c3RvbTpGYWlsZWRMb2dpbkF0dGVtcHRzIjoiMCIsIm9yaWdpbl9qdGkiOiI3YWJlYjM2My03ZGNhLTQ4ZDItOWNjMC0wZDZjMGM1MjA3MWUiLCJhdWQiOiI1bDk4aG5rZzhlMGk3MWYybmFxZXI2MDNzNyIsImN1c3RvbTpzY2hvb2xfaWQiOiI2NzA2MTUwMDMyYmVkMGEyNjc5NWYyYzYiLCJjdXN0b206c2VnbWVudCI6IlNjaG9vbFN0dWRlbnQiLCJldmVudF9pZCI6IjJkNDI1YjM3LTgzZGMtNGUzZS1iYmE3LTljNzhhMzEwNWFiOCIsImN1c3RvbTpmaXJzdE5hbWUiOiJSYWdoYXZlbmRyYSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzQxMjc4MzI2LCJwaG9uZV9udW1iZXIiOiIrOTE5ODg2NTQzMjEwIiwiaWQiOiI2NzA3NWFjZTY2Zjg1ZGZhOGIzMDg1ZDUiLCJleHAiOjE3NDEyODE5MjYsImlhdCI6MTc0MTI3ODMyNywianRpIjoiZWZjZWEyYjUtNjU0My00MWU0LWFmODQtMDA1ZWE5NGZkOWRkIiwiZW1haWwiOiJyYWdoYXZlbmRyYS5rbnZAY29zY2hvb2wuYWkifQ.l7VWbUst9YFOU2Y-UG_QDn3zFvoHbsQYIycBj7egUHI4DPzBsdEPr93PISUNKZ0aJtTQEyrj31L_M7-XZDvtvijmqhbylsRyJ3JAYSrxmmYc4SyY7_G2jMy64MIf_9rCkiQ6gSX1Sh50PsluqqfkMpvfBgZzhi8eaCIM3DdWyxF-MQ-b8FIA1WFX-kwdri8FbqD9aV-lPRJYdUk4nlqsWp9zrWGydI6M0G0q9B_D_VFR3qIs2U9gksBoNBbOjr79DTvX9YpwQKFO5f4Q-saOVr8QPxmrVQaH10FSyZAOh9iYGuIDGyOWq5ZEivD1qNxg3wG2f0oHWliEENQqCrXd0g',
          'X-User-id': '67075ace66f85dfa8b3085d5',
        }
      };

      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`API Error: ${response.status}`);

        const result = await response.json();
        console.log("API Response:", result);

        const questions = result?.[0]?.learning_path_journey?.[0]?.questions || [];

        if (questions.length === 0) {
          hasMoreData = false;
        } else {
          allQuestions = [...allQuestions, ...questions];
          offset += 1; 
        }
      } catch (error) {
        console.error('Fetching error:', error);
        hasMoreData = false;
      }
    }

    return allQuestions;
  };

  return (
    <div className='ma'>
      <div className='jrnys'>
        {Object.keys(journeyIds).map((key) => (
          <button key={key} className={`jrnys${key.slice(-1)}`} onClick={() => setJourneyId(journeyIds[key])}>
            {key.replace('journey', 'Journey-')}
          </button>
        ))}
      </div>

      {loading ? <p>Loading questions...</p> : null}

      {questionsRef.current.length > 0 ? (
        questionsRef.current.map((q, index) => (
          <div key={index} className='m'>
            <div className='mainq'>
              <h3 dangerouslySetInnerHTML={{ __html: q?.question_details?.question_layout }} />
            </div>
            <ul>
              {q?.question_details?.options_layout?.map((option, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: option }} />
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>No questions available.</p>
      )}
    </div>
  );
};

export default Questions;
