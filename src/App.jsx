import React, { useState, useRef, useEffect } from 'react';

// Main App Component
export default function App() {
  // State to hold the SVG code from the textarea
  const [svgCode, setSvgCode] = useState('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-arrow-down-circle"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="m8 12 4 4 4-4"/></svg>');
  
  // State for any error messages
  const [error, setError] = useState('');

  // State to trigger the automatic download on paste
  const [downloadOnPaste, setDownloadOnPaste] = useState(false);

  // Ref for the hidden anchor tag to trigger download
  const downloadLinkRef = useRef(null);

  // --- Handlers ---

  /**
   * Handles changes in the textarea, updating the svgCode state.
   * @param {React.ChangeEvent<HTMLTextAreaElement>} e - The event object.
   */
  const handleCodeChange = (e) => {
    setError(''); // Clear any previous errors
    setSvgCode(e.target.value);
  };

  /**
   * Sets a flag to true when the user pastes content.
   * This will be used by the useEffect hook to trigger a download.
   */
  const handlePaste = () => {
    setDownloadOnPaste(true);
  };

  /**
   * Triggers the download of the SVG file.
   */
  const handleDownload = () => {
    // Basic validation: check if the code is empty or doesn't look like an SVG.
    if (!svgCode.trim() || !svgCode.trim().startsWith('<svg')) {
      setError('Please enter valid SVG code starting with <svg>.');
      return;
    }
    
    setError('');

    // Create a Blob from the SVG string. A Blob is a file-like object of immutable, raw data.
    const blob = new Blob([svgCode], { type: 'image/svg+xml' });

    // Create a URL for the Blob object.
    const url = URL.createObjectURL(blob);

    // Use the ref to trigger the download
    if (downloadLinkRef.current) {
        downloadLinkRef.current.href = url;
        // Suggest a filename for the download
        downloadLinkRef.current.download = 'icon.svg';
        downloadLinkRef.current.click();
    }

    // Release the created URL to free up memory.
    URL.revokeObjectURL(url);
  };

  // --- Effects ---

  /**
   * This effect runs when the component mounts or when svgCode/downloadOnPaste state changes.
   * It handles the automatic download functionality after a paste event.
   */
  useEffect(() => {
    // If the downloadOnPaste flag is set, it means a paste just happened.
    if (downloadOnPaste) {
      // We use a short timeout to ensure the 'svgCode' state has been updated
      // from the paste event before we try to download it.
      setTimeout(() => {
        if (svgCode.trim().startsWith('<svg')) {
          handleDownload();
        } else {
          setError('Pasted content is not valid SVG code.');
        }
        // Reset the flag so it doesn't download again on subsequent renders
        setDownloadOnPaste(false);
      }, 100); // 100ms delay is usually enough
    }
  }, [svgCode, downloadOnPaste, handleDownload]); // Dependencies for the effect

  // --- Render ---

  return (
    // Main container with custom font and dark theme. Adjusted for full-screen layout.
    <div style={{ fontFamily: 'Inter, sans-serif' }} className="bg-gray-900 text-white min-h-screen w-full flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full h-full flex flex-col">
        {/* Header Section */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-cyan-400">SVG Icon Downloader</h1>
          <p className="text-lg text-gray-400 mt-2">Paste your SVG code to auto-download, or use the button.</p>
        </header>

        {/* Main Content: Editor and Preview */}
        <main className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          
          {/* Left Side: Code Editor */}
          <div className="flex flex-col gap-4">
            <label htmlFor="svg-code-input" className="text-sm font-medium text-gray-300">SVG Code Input</label>
            <textarea
              id="svg-code-input"
              value={svgCode}
              onChange={handleCodeChange}
              onPaste={handlePaste} // This triggers the auto-download flow
              placeholder="<svg>...</svg>"
              className="w-full flex-grow p-4 bg-gray-800 border-2 border-gray-700 rounded-lg text-gray-200 font-mono text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 resize-none"
            />
            <button
              onClick={handleDownload}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-400 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Manual Download
            </button>
            {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
          </div>

          {/* Right Side: Live Preview */}
          <div className="flex flex-col gap-4">
             <label className="text-sm font-medium text-gray-300">Live Preview</label>
             <div className="w-full h-full min-h-[300px] p-4 bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center">
               <div
                 className="text-white"
                 dangerouslySetInnerHTML={{ __html: svgCode }}
               />
             </div>
          </div>
        </main>
        
        {/* Footer Section */}
        <footer className="w-full text-center py-4 mt-auto">
            <p className="text-gray-500 text-sm">
                Made with ❤️ by <a href="https://shahrukh-react.netlify.app/ms-tools-hub.html" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Mohd Shahrukh</a>
            </p>
        </footer>
      </div>
      
      {/* Hidden anchor tag for triggering the download */}
      <a ref={downloadLinkRef} className="hidden"></a>
    </div>
  );
}
