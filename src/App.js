import React, { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import './App.css';
import Settings from './Settings'; // Import the Settings component

function App() {
  const [markdown, setMarkdown] = useState('');
  const [editedMarkdown, setEditedMarkdown] = useState('');
  const [fileName, setFileName] = useState('No file selected');
  const [isEditing, setIsEditing] = useState(false);
  const [deepSeekApiKey, setDeepSeekApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');

  useEffect(() => {
    setEditedMarkdown(markdown);
  }, [markdown]);

  const handleFileRead = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = (e.target.result);
        setMarkdown(text);
        setIsEditing(false); // Always go to preview mode after loading a new file
      };
      reader.readAsText(file);
    } else {
      setFileName('No file selected');
      setMarkdown('');
      setEditedMarkdown('');
      setIsEditing(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setMarkdown(editedMarkdown);
    setIsEditing(false);
    alert('Changes saved internally. Use the "Download" button to save to a file.');
  };

  const handleDownloadClick = () => {
    const element = document.createElement("a");
    const file = new Blob([markdown], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = fileName === 'No file selected' ? 'untitled.md' : fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleApiKeyChange = useCallback((key) => {
    setDeepSeekApiKey(key);
  }, []);

  const generateMarkdown = async () => {
    if (!deepSeekApiKey) {
      setGenerationError('Please set your DeepSeek-Reasoner API Key in settings.');
      setShowSettings(true); // Show settings if key is missing
      return;
    }
    if (!aiPrompt.trim()) {
      setGenerationError('Please enter a prompt for AI generation.');
      return;
    }

    setIsGenerating(true);
    setGenerationError('');

    try {
      // This is a placeholder for the actual DeepSeek-Reasoner API endpoint
      // You would replace this with the correct endpoint and request body
      // based on DeepSeek-Reasoner's documentation.
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', { // Placeholder URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${deepSeekApiKey}`
        },
        body: JSON.stringify({
          model: "deepseek-chat", // Or "deepseek-coder" or other DeepSeek model
          messages: [
            { role: "system", content: "You are a helpful assistant that generates markdown." },
            { role: "user", content: aiPrompt }
          ],
          stream: false
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API error: ${response.statusText}`);
      }

      const data = await response.json();
      // Assuming the API response structure has the generated content in data.choices[0].message.content
      const generatedContent = data.choices[0].message.content;
      setMarkdown(generatedContent);
      setEditedMarkdown(generatedContent);
      setIsEditing(false); // Show generated content in preview mode
      setFileName('generated.md'); // Update filename for generated content
    } catch (error) {
      console.error('Error generating markdown:', error);
      setGenerationError(`Failed to generate markdown: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="App container mt-4">
      <h1 className="mb-4">Simple Markdown Viewer</h1>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="input-group flex-grow-1 me-2">
          <input 
            type="file" 
            className="form-control" 
            id="markdownFile" 
            accept=".md" 
            onChange={handleFileRead} 
          />
          <label className="input-group-text" htmlFor="markdownFile">Upload Markdown File</label>
        </div>
        <button className="btn btn-secondary" onClick={() => setShowSettings(!showSettings)}>
          {showSettings ? 'Hide Settings' : 'Show Settings'}
        </button>
      </div>
      
      {showSettings && (
        <Settings onApiKeyChange={handleApiKeyChange} />
      )}

      <p className="text-muted">Selected file: {fileName}</p>

      {/* AI Prompting Section */}
      <div className="card p-3 mb-4">
        <h3>Generate Markdown with AI</h3>
        <div className="mb-3">
          <textarea
            className="form-control"
            rows="3"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="Enter your prompt for AI to generate markdown (e.g., 'Write a markdown document about the benefits of React hooks')."
          ></textarea>
        </div>
        <button 
          className="btn btn-success" 
          onClick={generateMarkdown} 
          disabled={isGenerating || !aiPrompt.trim()}
        >
          {isGenerating ? 'Generating...' : 'Generate Markdown'}
        </button>
        {generationError && <p className="text-danger mt-2">{generationError}</p>}
      </div>

      {markdown && (
        <div className="mb-3">
          {!isEditing ? (
            <button className="btn btn-primary me-2" onClick={handleEditClick}>Edit</button>
          ) : (
            <button className="btn btn-success me-2" onClick={handleSaveClick}>Save</button>
          )}
          <button className="btn btn-info" onClick={handleDownloadClick}>Download</button>
        </div>
      )}

      <div className="card p-3">
        {isEditing ? (
          <textarea
            className="form-control"
            rows="15"
            value={editedMarkdown}
            onChange={(e) => setEditedMarkdown(e.target.value)}
          ></textarea>
        ) : (
          <ReactMarkdown>{markdown}</ReactMarkdown>
        )}
      </div>
    </div>
  );
}

export default App;