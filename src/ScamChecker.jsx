// import { useState } from 'react';

// function ScamChecker() {
//   const [messageText, setMessageText] = useState('');
//   const [urlText, setUrlText] = useState('');
//   const [imageFile, setImageFile] = useState(null);
//   const [result, setResult] = useState(null);
//   const [extractedText, setExtractedText] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   function resetOutputs() {
//     setResult(null);
//     setExtractedText(null);
//     setError(null);
//   }

//   function checkMessage() {
//     if (!messageText.trim()) return;
//     resetOutputs();
//     setLoading(true);
//     fetch('http://localhost:8080/api/messages/analyze', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ messageText })
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         setResult(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError('Failed to analyze message: ' + err.message);
//         setLoading(false);
//       });
//   }

//   function checkUrl() {
//     if (!urlText.trim()) return;
//     resetOutputs();
//     setLoading(true);
//     fetch('http://localhost:8080/api/messages/analyze-url', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ url: urlText })
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         setResult(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError('Failed to analyze URL: ' + err.message);
//         setLoading(false);
//       });
//   }

//   function checkImage() {
//     if (!imageFile) return;
//     resetOutputs();
//     setLoading(true);

//     const formData = new FormData();
//     formData.append('image', imageFile);

//     fetch('http://localhost:8080/api/messages/analyze-image', {
//       method: 'POST',
//       body: formData
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.error) {
//           setError(data.error);
//         } else {
//           setResult(data.analysis);
//           setExtractedText(data.extractedText);
//         }
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError('Failed to analyze image: ' + err.message);
//         setLoading(false);
//       });
//   }

//   function getRiskColor(riskLevel) {
//     switch (riskLevel) {
//       case 'CRITICAL': return '#d32f2f';
//       case 'HIGH': return '#f57c00';
//       case 'MEDIUM': return '#fbc02d';
//       case 'LOW': return '#388e3c';
//       default: return '#757575';
//     }
//   }

//   return (
//     <div style={{ border: '2px solid #1976d2', borderRadius: '8px', padding: '20px', marginBottom: '30px', backgroundColor: '#f0f7ff' }}>
//       <h2 style={{ marginTop: 0 }}>🔍 Is this a scam? Check a message, URL, or screenshot</h2>

//       <div style={{ marginBottom: '16px' }}>
//         <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Paste a suspicious message:</label>
//         <textarea
//           value={messageText}
//           onChange={(e) => setMessageText(e.target.value)}
//           rows={4}
//           style={{ width: '100%', padding: '8px', fontFamily: 'inherit' }}
//           placeholder="Paste an SMS, WhatsApp, or email message here..."
//         />
//         <button onClick={checkMessage} disabled={loading} style={{ marginTop: '8px', padding: '8px 16px' }}>
//           Analyze Message
//         </button>
//       </div>

//       <div style={{ marginBottom: '16px' }}>
//         <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Or enter a suspicious URL:</label>
//         <input
//           type="text"
//           value={urlText}
//           onChange={(e) => setUrlText(e.target.value)}
//           style={{ width: '100%', padding: '8px' }}
//           placeholder="https://..."
//         />
//         <button onClick={checkUrl} disabled={loading} style={{ marginTop: '8px', padding: '8px 16px' }}>
//           Analyze URL
//         </button>
//       </div>

//       <div style={{ marginBottom: '16px' }}>
//         <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Or upload a screenshot:</label>
//         <input
//           type="file"
//           accept="image/*"
//           onChange={(e) => setImageFile(e.target.files[0])}
//         />
//         <button onClick={checkImage} disabled={loading} style={{ marginTop: '8px', padding: '8px 16px', display: 'block' }}>
//           Analyze Screenshot
//         </button>
//       </div>

//       {loading && <p>Analyzing... this may take several seconds (running locally through the LLM).</p>}
//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       {extractedText && (
//         <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '4px', marginBottom: '10px', fontSize: '0.9em' }}>
//           <strong>Text extracted from image:</strong>
//           <p style={{ whiteSpace: 'pre-wrap' }}>{extractedText}</p>
//         </div>
//       )}

//       {result && (
//         <div
//           style={{
//             border: `2px solid ${getRiskColor(result.riskLevel)}`,
//             borderRadius: '8px',
//             padding: '16px',
//             backgroundColor: 'white'
//           }}
//         >
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             <h3 style={{ margin: 0 }}>{result.scam ? '🚨' : '✅'} {result.scamCategory}</h3>
//             <span
//               style={{
//                 backgroundColor: getRiskColor(result.riskLevel),
//                 color: 'white',
//                 padding: '4px 12px',
//                 borderRadius: '4px',
//                 fontWeight: 'bold'
//               }}
//             >
//               {result.riskLevel}
//             </span>
//           </div>
//           <p><strong>Risk Score:</strong> {result.riskScore} / 100</p>
//           {result.ruleIndicators && result.ruleIndicators.length > 0 && (
//             <div>
//               <strong>Indicators found:</strong>
//               <ul>
//                 {result.ruleIndicators.map((indicator, i) => (
//                   <li key={i}>{indicator}</li>
//                 ))}
//               </ul>
//             </div>
//           )}
//           <p><strong>Why:</strong> {result.llmExplanation}</p>
//           <p><strong>Recommendation:</strong> {result.recommendation}</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ScamChecker;