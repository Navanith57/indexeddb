import React, { useState, useEffect } from 'react';
import './Questions.css';
import { getLearningPath, saveLearningPath } from '../../utils/IndexedDB';

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [loading, setLoading] = useState(false);

  const journey_id = '67b55f5e0df0410f9818c390';

  useEffect(() => {
    const fetchQuestions = async () => {
      if (dataFetched) {
        setLoading(true);
        const url = `https://wkacf1hdj6.execute-api.ap-south-1.amazonaws.com/dev/lp-progress/v2?journey_id=${journey_id}&limit=5&offset=1`;
        const options = {
          method: 'GET',
          headers: {
            'Authorization': 'eyJraWQiOiJNcXVjZlMxTStZaEU5ZGxldHZvalwvQnNLSm13emhqNkt1UUZDd2FkTm1NZz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIwMWUzY2Q2YS05MDIxLTcwOWItYTI3Zi1kODExMGRlYzQ5ZGUiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiY3VzdG9tOmxhc3ROYW1lIjoiU3R1ZGVudCIsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5hcC1zb3V0aC0xLmFtYXpvbmF3cy5jb21cL2FwLXNvdXRoLTFfTWNSUktUdG8zIiwiY3VzdG9tOnVzZXJfaWQiOiI2NzA3NWFjZTY2Zjg1ZGZhOGIzMDg1ZDUiLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOnRydWUsImNvZ25pdG86dXNlcm5hbWUiOiI5ODc4IiwicHJlZmVycmVkX3VzZXJuYW1lIjoiOTg3ODY3MDYxNTAwMzJiZWQwYTI2Nzk1ZjJjNiIsImN1c3RvbTpGYWlsZWRMb2dpbkF0dGVtcHRzIjoiMCIsIm9yaWdpbl9qdGkiOiI3Y2ZhMTM2YS04NTUwLTQ0M2UtOTk1OC1kNThmMDM0ZjUwZjIiLCJhdWQiOiI1bDk4aG5rZzhlMGk3MWYybmFxZXI2MDNzNyIsImN1c3RvbTpzY2hvb2xfaWQiOiI2NzA2MTUwMDMyYmVkMGEyNjc5NWYyYzYiLCJjdXN0b206c2VnbWVudCI6IlNjaG9vbFN0dWRlbnQiLCJldmVudF9pZCI6IjQ0Y2Y4N2IyLWE4ZDMtNGMyZC1iMWY4LWMxMTcwYTI2Nzc5NSIsImN1c3RvbTpmaXJzdE5hbWUiOiJSYWdoYXZlbmRyYSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzQxMTY4NDY5LCJwaG9uZV9udW1iZXIiOiIrOTE5ODg2NTQzMjEwIiwiaWQiOiI2NzA3NWFjZTY2Zjg1ZGZhOGIzMDg1ZDUiLCJleHAiOjE3NDExNzU3MjgsImlhdCI6MTc0MTE3MjEyOSwianRpIjoiYmZjOGRlMGUtNjc0NS00ZGRlLTgxZTEtM2E2MDVjOTdlNDM5IiwiZW1haWwiOiJyYWdoYXZlbmRyYS5rbnZAY29zY2hvb2wuYWkifQ.U9XUKKL7SSrEhcRVV8XySv3r9XBwKso2doV2p4JVC3CIXKP6J3bjGnDbXe1ZLoDV1tNz2DcV2LpNIGJ0Hjk2oNQVXGVSa_-z7r2_RLS2NseT_5bQB1RKFZovTJXlgFDkP2stkSDYSkuK_9K1ikLkxKrAdzOPjepjHWUwLjGooXQTSDoYbI249Wigif_B3B_z3JdOJIJQVdeBrstyoAFUMoN-YzKhIqSjpEYtF0c_ZB0z3EOf39A4csiFve3lcpqUqNxLWCjDUlAgx1DnRI1o1NDTOCvg009tCnNMa53kXz6dtytovcaqUC_-jC7Qea4gGkkEtH5uNsIStOvttn7-6w',
            'X-User-id': '67075ace66f85dfa8b3085d5',
          }
        };

        try {
          const response = await fetch(url, options);
          const result = await response.json();
          if (result && result.length > 0) {
            setQuestions(result);
          
            await saveLearningPath(journey_id,result);
          }
        } catch (error) {
          console.error('Fetching error:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchQuestions();
  }, [dataFetched]);
  console.log(questions);
  const handleSelectJourney = async (id) => {
    setDataFetched(true);
    setTimeout(async () => {
      const storedQuestions = await getLearningPath();
      if (storedQuestions.length > 0) {
        setQuestions(storedQuestions[0].learning_path);
      } else {
        console.warn(' No saved questions found in IndexedDB!');
      }
    }, 3000);
  };
  console.log(questions);
  return (
    <div className='ma'>
      <div className='jrnys'>
        <button className='jrnys1' onClick={() => handleSelectJourney(journey_id)}>
          Journey-1
        </button>
        <li className='jrnys2'>Journey-2</li>
        <li className='jrnys3'>Journey-3</li>
      </div>
      {loading ? (
        <p>Loading questions...</p>
      ) : (
        null
      )}
{/* 
    {questions.length > 0 &&
        questions.map((q, index) => (
          <div key={index} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}>
            <h3 dangerouslySetInnerHTML={{ __html: q.question_details.question_layout }} />
            <ul>
              {q.question_details.options_layout.map((option, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: option }} />
              ))}
            </ul>
          </div>
        ))} */}
    </div>
  );
};

export default Questions;
