import React, { useState } from 'react';
import axios from 'axios';
import styles from '../css/main.css';

function Main() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [relatedKeywords, setRelatedKeywords] = useState([]);

  const clientId = 'P3nq6LUKrLz6LOPOVOMf';
  const clientSecret = 'f_078uxS96';

  let today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];


  const apiUrl = 'naver/v1/datalab/keywords';
  const relatedKeywordsApiUrl = 'naver/v1/search/related';
  
  const analyzeKeyword = async () => {
    try {
      const response = await axios.post(
        apiUrl,
        {
          startDate: firstDay,
          endDate: lastDay,
          timeUnit: 'month',
          keywordGroups: [
            {
              groupName: keyword,
              keywords: [keyword]
            }
          ]
        },
        {
          headers: {'X-Naver-Client-Id':clientId, 'X-Naver-Client-Secret': clientSecret}
        }
      );

      setResults(response.data.results[0].data);
      fetchRelatedKeywords(keyword);
    } catch (error) {
      console.error('API 요청 중 오류 발생:', error);
    // 여기에 사용자에게 보여줄 에러 처리를 추가하세요
    }
  };

  const fetchRelatedKeywords = async (keyword) => {
    try {
      const response = await axios.get(
        relatedKeywordsApiUrl,
        {
          params: {
            query: keyword
          },
          headers: {'X-Naver-Client-Id':clientId, 
                  'X-Naver-Client-Secret': clientSecret
          }
        }
      );

      setRelatedKeywords(response.data.items);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className={styles.App}>
      <h1 className={styles.title}>네이버 키워드 분석</h1>
      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder="키워드 입력"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className={styles.keywordInput}
        />
        <button onClick={analyzeKeyword} className={styles.analyzeButton}>분석</button>
      </div>
      <div className={styles.results}>
        <h2 className={styles.resultTitle}>분석 결과</h2>
        {results.map((data, index) => (
          <p key={index}>
            {data.period}: PC 검색량 - {data.ratio[0]}, 모바일 검색량 - {data.ratio[1]}
          </p>
        ))}
      </div>
      <div className={styles.relatedKeywords}>
        <h2 className={styles.relatedTitle}>연관 키워드</h2>
        <ul className={styles.keywordList}>
          {relatedKeywords.map((relatedKeyword, index) => (
            <li key={index} className={styles.keywordItem}>
              {relatedKeyword.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Main;