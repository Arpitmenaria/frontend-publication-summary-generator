import React from 'react';
import FileUpload from './components/FileUpload';
import './App.css'

function App() {
  return (
    <div>
      <h1 style={{ textAlign: 'center', marginTop: '20px' }}>Publication Summary Generator</h1>
      <FileUpload />
    </div>
  );
}

export default App;
