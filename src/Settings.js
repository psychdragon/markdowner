import React, { useState } from 'react';

function Settings({ onDeepSeekApiKeyChange, onGeminiApiKeyChange }) {
  const [deepSeekApiKeyInput, setDeepSeekApiKeyInput] = useState('');
  const [storedDeepSeekApiKey, setStoredDeepSeekApiKey] = useState(localStorage.getItem('deepSeekApiKey') || '');

  const [geminiApiKeyInput, setGeminiApiKeyInput] = useState('');
  const [storedGeminiApiKey, setStoredGeminiApiKey] = useState(localStorage.getItem('geminiApiKey') || '');

  const handleSaveDeepSeek = () => {
    localStorage.setItem('deepSeekApiKey', deepSeekApiKeyInput);
    setStoredDeepSeekApiKey(deepSeekApiKeyInput);
    onDeepSeekApiKeyChange(deepSeekApiKeyInput);
    setDeepSeekApiKeyInput('');
    alert('DeepSeek API Key saved!');
  };

  const handleClearDeepSeek = () => {
    localStorage.removeItem('deepSeekApiKey');
    setStoredDeepSeekApiKey('');
    onDeepSeekApiKeyChange('');
    setDeepSeekApiKeyInput('');
    alert('DeepSeek API Key cleared!');
  };

  const handleSaveGemini = () => {
    localStorage.setItem('geminiApiKey', geminiApiKeyInput);
    setStoredGeminiApiKey(geminiApiKeyInput);
    onGeminiApiKeyChange(geminiApiKeyInput);
    setGeminiApiKeyInput('');
    alert('Gemini API Key saved!');
  };

  const handleClearGemini = () => {
    localStorage.removeItem('geminiApiKey');
    setStoredGeminiApiKey('');
    onGeminiApiKeyChange('');
    setGeminiApiKeyInput('');
    alert('Gemini API Key cleared!');
  };

  return (
    <div className="card p-3 mb-4">
      <h3>API Settings</h3>

      <div className="mb-3">
        <label htmlFor="deepSeekApiKey" className="form-label">DeepSeek-Reasoner API Key:</label>
        <input
          type="password"
          className="form-control"
          id="deepSeekApiKey"
          value={deepSeekApiKeyInput}
          onChange={(e) => setDeepSeekApiKeyInput(e.target.value)}
          placeholder="Enter your DeepSeek-Reasoner API Key"
        />
      </div>
      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-primary" onClick={handleSaveDeepSeek} disabled={!deepSeekApiKeyInput}>Save DeepSeek Key</button>
        <button className="btn btn-danger" onClick={handleClearDeepSeek} disabled={!storedDeepSeekApiKey}>Clear DeepSeek Key</button>
      </div>
      {storedDeepSeekApiKey && (
        <p className="mt-3 text-muted">
          Currently stored DeepSeek key: <code>{storedDeepSeekApiKey.substring(0, 4)}...{storedDeepSeekApiKey.substring(storedDeepSeekApiKey.length - 4)}</code>
        </p>
      )}

      <hr className="my-4" />

      <div className="mb-3">
        <label htmlFor="geminiApiKey" className="form-label">Gemini API Key:</label>
        <input
          type="password"
          className="form-control"
          id="geminiApiKey"
          value={geminiApiKeyInput}
          onChange={(e) => setGeminiApiKeyInput(e.target.value)}
          placeholder="Enter your Gemini API Key"
        />
      </div>
      <div className="d-flex justify-content-between">
        <button className="btn btn-primary" onClick={handleSaveGemini} disabled={!geminiApiKeyInput}>Save Gemini Key</button>
        <button className="btn btn-danger" onClick={handleClearGemini} disabled={!storedGeminiApiKey}>Clear Gemini Key</button>
      </div>
      {storedGeminiApiKey && (
        <p className="mt-3 text-muted">
          Currently stored Gemini key: <code>{storedGeminiApiKey.substring(0, 4)}...{storedGeminiApiKey.substring(storedGeminiApiKey.length - 4)}</code>
        </p>
      )}
    </div>
  );
}

export default Settings;
