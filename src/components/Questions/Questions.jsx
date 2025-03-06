import React, { useState, useEffect } from 'react';
import useStateRef from 'react-usestateref';
import './Questions.css';
import { getLearningPathById, saveLearningPath } from '../../utils/IndexedDB';

const Questions = () => {
  const [questins, setQuestins, questinsRef] = useStateRef([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [journeyId, setJourneyId] = useState(null); 

  const journeyIds = {
    journey1: '67b55f5e0df0410f9818c390',
    journey2: '67b6d0991b26d539aee27d41',
    journey3: '67bc3f09bc9d2df718040df4'
  };

  useEffect(() => {
    
    const fetchQuestions = async () => {
      if (dataFetched && journeyId) {
        setLoading(true);
        const url = `https://wkacf1hdj6.execute-api.ap-south-1.amazonaws.com/dev/lp-progress/v2?journey_id=${journeyId}&limit=5&offset=0`;
        const options = {
          method: 'GET',
          headers: {
           'Authorization': 'eyJraWQiOiJNcXVjZlMxTStZaEU5ZGxldHZvalwvQnNLSm13emhqNkt1UUZDd2FkTm1NZz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIwMWUzY2Q2YS05MDIxLTcwOWItYTI3Zi1kODExMGRlYzQ5ZGUiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiY3VzdG9tOmxhc3ROYW1lIjoiU3R1ZGVudCIsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5hcC1zb3V0aC0xLmFtYXpvbmF3cy5jb21cL2FwLXNvdXRoLTFfTWNSUktUdG8zIiwiY3VzdG9tOnVzZXJfaWQiOiI2NzA3NWFjZTY2Zjg1ZGZhOGIzMDg1ZDUiLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOnRydWUsImNvZ25pdG86dXNlcm5hbWUiOiI5ODc4IiwicHJlZmVycmVkX3VzZXJuYW1lIjoiOTg3ODY3MDYxNTAwMzJiZWQwYTI2Nzk1ZjJjNiIsImN1c3RvbTpGYWlsZWRMb2dpbkF0dGVtcHRzIjoiMCIsIm9yaWdpbl9qdGkiOiI4ZTJhMDllMi04NGYxLTRiNTYtYTNkNi0zNzE1M2FmZmZlMjgiLCJhdWQiOiI1bDk4aG5rZzhlMGk3MWYybmFxZXI2MDNzNyIsImN1c3RvbTpzY2hvb2xfaWQiOiI2NzA2MTUwMDMyYmVkMGEyNjc5NWYyYzYiLCJjdXN0b206c2VnbWVudCI6IlNjaG9vbFN0dWRlbnQiLCJldmVudF9pZCI6IjNiYzk2YTY0LWVmMDMtNDYzMC1iNWFjLWRkNTU1NDkwZjhlMCIsImN1c3RvbTpmaXJzdE5hbWUiOiJSYWdoYXZlbmRyYSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzQxMjQ5NTQ5LCJwaG9uZV9udW1iZXIiOiIrOTE5ODg2NTQzMjEwIiwiaWQiOiI2NzA3NWFjZTY2Zjg1ZGZhOGIzMDg1ZDUiLCJleHAiOjE3NDEyNTMxNDgsImlhdCI6MTc0MTI0OTU0OSwianRpIjoiZGE2NDg4OGYtYTcyZi00NTcxLThhMDQtMTdlMjQ5ZTE4MjE5IiwiZW1haWwiOiJyYWdoYXZlbmRyYS5rbnZAY29zY2hvb2wuYWkifQ.OuJsummLPpHE7rS-tiYulCpR_3NlxarROrgPBXEHPDs5sSmkzB4PDLPQdtXeCgemrNApn2z5sqOSW2qOwzyvFEwf7aPQSAxzNsaEI7jnmg9om9Ou6E3Y6Bxhng1dNfIz_G_mgJxLxZLo4Ra8rekJAScjv4z3szNGwrhLZDsCtBI32T-IPm2qBRoW4vi_COhj5VYCrHBx0alpOs6H9Dr9BXR27ezdl_Ny4wtNRQb55830-arxr19BwV__bCQygP-LaJEUFITpvNXy2-z9wLEqv0Q-p_lSOUpNwMjlc9nysH9tTdDNe3_wgesatoj0pmCnkPP1vi03EWXfOubK3TjnOw',
            'X-User-id': '67075ace66f85dfa8b3085d5',
          }
        };

        try {
          const response = await fetch(url, options);
          const result = await response.json();

          if (result && result.length > 0) {
            await saveLearningPath(journeyId, result[0].learning_path_journey[0].questions);

            const storedQuestions = await getLearningPathById(journeyId);
            if (storedQuestions.length > 0) {
              setQuestins(storedQuestions[0].learningPath);
            }
          }
        } catch (error) {
          console.error('Fetching error:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchQuestions();
  }, [journeyId]);

  const handleSelectJourney = (id) => {
    setJourneyId(id);
    setDataFetched(true);
  };

  console.log("questions",questinsRef.current)
  return (
    <div className='ma'>
      <div className='jrnys'>
        <button className='jrnys1' onClick={() => handleSelectJourney(journeyIds.journey1)}>
          Journey-1
        </button>
        <button className='jrnys2' onClick={() => handleSelectJourney(journeyIds.journey2)}>
          Journey-2
        </button>
        <button className='jrnys3' onClick={() => handleSelectJourney(journeyIds.journey3)}>
          Journey-3
        </button>
      </div>

      {loading ? <p>Loading questions...</p> : null}

      {questinsRef.current.map((q, index) => (
        <div key={index} className='m'>
          <div  className='mainq'>
             <h3 dangerouslySetInnerHTML={{ __html: q.question_details.question_layout }} />
          </div>
          <ul>
            {q.question_details.options_layout.map((option, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: option }} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Questions;
