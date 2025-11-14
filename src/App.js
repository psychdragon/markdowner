import React, { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import './App.css';
import Settings from './Settings'; // Import the Settings component
import { Accordion } from 'react-bootstrap'; // Import Accordion from react-bootstrap

function App() {
  // Initialize API keys from localStorage directly
  const [deepSeekApiKey, setDeepSeekApiKey] = useState(() => localStorage.getItem('deepSeekApiKey') || '');
  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem('geminiApiKey') || '');

  const [markdown, setMarkdown] = useState('');
  const [editedMarkdown, setEditedMarkdown] = useState('');
  const [fileName, setFileName] = useState('No file selected');
  const [isEditing, setIsEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');

  // RAG specific states
  const [referenceUrlsInput, setReferenceUrlsInput] = useState('');
  const [referenceFiles, setReferenceFiles] = useState([]);
  const [retrievedContext, setRetrievedContext] = useState('');
  const [isRetrievingContext, setIsRetrievingContext] = useState(false);
  const [contextError, setContextError] = useState('');

  // AI Image Generation specific states
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageGenerationError, setImageGenerationError] = useState('');
  const [geminiTextResponse, setGeminiTextResponse] = useState(''); // To store text part of Gemini response

  // Accordion state
  const [activeAccordionKey, setActiveAccordionKey] = useState('0'); // Default to first item open

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

  // These handlers will now be passed directly to Settings
  // and Settings will handle saving to localStorage and calling these setters.
  // No need for useCallback here as they are just direct setters.

  const handleReferenceFileChange = (event) => {
    setReferenceFiles(Array.from(event.target.files));
  };

  const fetchContext = async () => {
    setIsRetrievingContext(true);
    setContextError('');
    let context = '';

    const urls = referenceUrlsInput.split('\n').map(url => url.trim()).filter(url => url !== '');
    for (const url of urls) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        context += `\n\n--- Content from ${url} ---\n${text}`;
      } catch (error) {
        console.error(`Failed to fetch URL ${url}:`, error);
        setContextError(prev => prev + `Failed to fetch ${url}: ${error.message}\n`);
      }
    }

    for (const file of referenceFiles) {
      try {
        const reader = new FileReader();
        const fileContent = await new Promise((resolve, reject) => {
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = (e) => reject(e);
          reader.readAsText(file);
        });
        context += `\n\n--- Content from ${file.name} ---\n${fileContent}`;
      } catch (error) {
        console.error(`Failed to read file ${file.name}:`, error);
        setContextError(prev => prev + `Failed to read ${file.name}: ${error.message}\n`);
      }
    }
    
    setRetrievedContext(context);
    setIsRetrievingContext(false);
    if (context.trim() === '' && contextError === '') {
      setContextError('No context retrieved. Please check URLs and files.');
    } else if (context.trim() !== '') {
      alert('Context retrieved successfully!');
    }
  };

  const generateMarkdown = async () => {
    if (!deepSeekApiKey) {
      setGenerationError('Please set your DeepSeek-Reasoner API Key in settings.');
      setShowSettings(true);
      return;
    }
    if (!aiPrompt.trim()) {
      setGenerationError('Please enter a prompt for AI generation.');
      return;
    }

    setIsGenerating(true);
    setGenerationError('');

    let fullPrompt = aiPrompt;
    if (retrievedContext.trim() !== '') {
      fullPrompt = `Based on the following context:\n\n${retrievedContext}\n\n---\n\n${aiPrompt}`;
    }

    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${deepSeekApiKey}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: "You are a helpful assistant that generates markdown." },
            { role: "user", content: fullPrompt }
          ],
          stream: false
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API error: ${response.statusText}`);
      }

      const data = await response.json();
      const generatedContent = data.choices[0].message.content;
      setMarkdown(generatedContent);
      setEditedMarkdown(generatedContent);
      setIsEditing(false);
      setFileName('generated.md');
    } catch (error) {
      console.error('Error generating markdown:', error);
      setGenerationError(`Failed to generate markdown: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateImage = async () => {
    if (!geminiApiKey) {
      setImageGenerationError('Please set your Gemini API Key in settings.');
      setShowSettings(true);
      return;
    }
    if (!imagePrompt.trim()) {
      setImageGenerationError('Please enter a prompt for AI image generation.');
      return;
    }

    setIsGeneratingImage(true);
    setImageGenerationError('');
    setGeneratedImageUrl(''); // Clear previous image
    setGeminiTextResponse(''); // Clear previous text response

    try {
      const modelName = 'gemini-2.0-flash-preview-image-generation';
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiApiKey}`;

      const requestBody = {
        "contents": [{"parts": [{"text": imagePrompt}]}],
        "generationConfig": {"responseModalities": ["TEXT", "IMAGE"]}
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: "Could not parse error JSON."}}));
        let errorMessage = `Error: ${response.status} ${response.statusText}`;
        if (errorData && errorData.error && errorData.error.message) {
            errorMessage += ` - ${errorData.error.message}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      let imageFound = false;
      let textResponseParts = [];

      if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts) {
          for (const part of data.candidates[0].content.parts) {
              if (part.inlineData && part.inlineData.data && part.inlineData.mimeType) {
                  const base64ImageDataString = part.inlineData.data;
                  const mimeTypeString = part.inlineData.mimeType;
                  setGeneratedImageUrl(`data:${mimeTypeString};base64,${base64ImageDataString}`);
                  imageFound = true;
              } else if (part.text) {
                  textResponseParts.push(part.text);
              }
          }
      }

      if (textResponseParts.length > 0) {
        setGeminiTextResponse(textResponseParts.join('\n'));
      }

      if (!imageFound) {
          setImageGenerationError('No image data found in the Gemini response.');
      }

    } catch (error) {
      console.error('Error generating image:', error);
      setImageGenerationError(`Failed to generate image: ${error.message}`);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="App container mt-4">
      <h1 className="mb-4">DraftoryAI Lite</h1>

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
        <Settings 
          onDeepSeekApiKeyChange={setDeepSeekApiKey} // Pass setter directly
          onGeminiApiKeyChange={setGeminiApiKey}     // Pass setter directly
        />
      )}

      <p className="text-muted">Selected file: {fileName}</p>

      <Accordion activeAccordionKey={activeAccordionKey} onSelect={(e) => setActiveAccordionKey(e)}>
        {/* Markdown Viewer Section */}
        <Accordion.Item eventKey="0">
          <Accordion.Header>Markdown Viewer</Accordion.Header>
          <Accordion.Body>
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
          </Accordion.Body>
        </Accordion.Item>

        {/* RAG Context Section */}
        <Accordion.Item eventKey="1">
          <Accordion.Header>RAG Context (URLs & Files)</Accordion.Header>
          <Accordion.Body>
            <div className="mb-3">
              <label htmlFor="referenceUrls" className="form-label">Reference URLs (one per line):</label>
              <textarea
                className="form-control"
                id="referenceUrls"
                rows="3"
                value={referenceUrlsInput}
                onChange={(e) => setReferenceUrlsInput(e.target.value)}
                placeholder="Enter URLs for context, one per line (e.g., https://example.com/article)"
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="referenceFiles" className="form-label">Upload Reference Files:</label>
              <input 
                type="file" 
                className="form-control"
                id="referenceFiles"
                multiple 
                onChange={handleReferenceFileChange} 
              />
              {referenceFiles.length > 0 && (
                <small className="text-muted">Selected files: {referenceFiles.map(f => f.name).join(', ')}</small>
              )}
            </div>
            <button 
              className="btn btn-primary"
              onClick={fetchContext} 
              disabled={isRetrievingContext || (referenceUrlsInput.trim() === '' && referenceFiles.length === 0)}
            >
              {isRetrievingContext ? 'Fetching Context...' : 'Fetch Context'}
            </button>
            {contextError && <p className="text-danger mt-2">{contextError}</p>}
            {retrievedContext.trim() !== '' && !contextError && (
              <p className="text-success mt-2">Context ready for AI generation.</p>
            )}
          </Accordion.Body>
        </Accordion.Item>

        {/* AI Prompting Section */}
        <Accordion.Item eventKey="2">
          <Accordion.Header>Generate Markdown with AI</Accordion.Header>
          <Accordion.Body>
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
          </Accordion.Body>
        </Accordion.Item>

        {/* AI Image Generation Section */}
        <Accordion.Item eventKey="3">
          <Accordion.Header>Generate Image with AI</Accordion.Header>
          <Accordion.Body>
            <div className="mb-3">
              <label htmlFor="imagePrompt" className="form-label">Image Prompt:</label>
              <textarea
                className="form-control"
                id="imagePrompt"
                rows="3"
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Enter your prompt for AI to generate an image (e.g., 'A futuristic city at sunset')."
              ></textarea>
            </div>
            <button 
              className="btn btn-success"
              onClick={generateImage} 
              disabled={isGeneratingImage || !imagePrompt.trim()}
            >
              {isGeneratingImage ? 'Generating Image...' : 'Generate Image'}
            </button>
            {imageGenerationError && <p className="text-danger mt-2">{imageGenerationError}</p>}
            {generatedImageUrl && (
              <div className="mt-3">
                <h5>Generated Image:</h5>
                <img src={generatedImageUrl} alt="Generated by AI" className="img-fluid" style={{ maxWidth: '512px', height: 'auto' }} />
              </div>
            )}
            {geminiTextResponse && (
              <div className="mt-3">
                <h5>Gemini Text Response:</h5>
                <p>{geminiTextResponse}</p>
              </div>
            )}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

export default App;