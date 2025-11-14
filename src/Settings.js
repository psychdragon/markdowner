import React, { useState, useEffect } from 'react';

function Settings({ onApiKeyChange }) {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [storedApiKey, setStoredApiKey] = useState('');

  useEffect(() => {
    const key = localStorage.getItem('deepSeekApiKey');
    if (key) {
      setStoredApiKey(key);
      onApiKeyChange(key); // Notify parent component about the key
    }
  }, [onApiKeyChange]);

  const handleSave = () => {
    localStorage.setItem('deepSeekApiKey', apiKeyInput);
    setStoredApiKey(apiKeyInput);
    onApiKeyChange(apiKeyInput); // Notify parent component
    setApiKeyInput(''); // Clear input after saving
    alert('API Key saved!');
  };

  const handleClear = () => {
    localStorage.removeItem('deepSeekApiKey');
    setStoredApiKey('');
    onApiKeyChange(''); // Notify parent component
    setApiKeyInput(''); // Clear input
    alert('API Key cleared!');
  };

  return (
    <div className="card p-3 mb-4">
      <h3>DeepSeek-Reasoner API Settings</h3>
      <div className="mb-3">
        <label htmlFor="apiKey" className="form-label">API Key:</label>
        <input
          type="password"
          className="form-control"
          id="apiKey"
          value={apiKeyInput}
          onChange={(e) => setApiKeyInput(e.target.value)}
          placeholder="Enter your DeepSeek-Reasoner API Key"
        />
      </div>
      <div className="d-flex justify-content-between">
        <button className="btn btn-primary" onClick={handleSave} disabled={!apiKeyInput}>Save API Key</button>
        <button className="btn btn-danger" onClick={handleClear} disabled={!storedApiKey}>Clear API Key</button>
      </div>
      {storedApiKey && (
        <p className="mt-3 text-muted">
          Currently stored key: <code>{storedApiKey.substring(0, 4)}...{storedApiKey.substring(storedApiKey.length - 4)}</code>
        </p>
      )}
    </div>
  );
}

export default Settings;
