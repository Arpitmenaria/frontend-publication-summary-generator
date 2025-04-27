import React, { useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false); // New state for success message

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSuccess(false); // Reset success message when choosing a new file
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const res = await axios.post('https://publication-summary-generator.onrender.com/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSummary(res.data.summary);
      setPublications(res.data.publications);
      setSuccess(true); // Set success after successful upload
    } catch (err) {
      console.error(err);
      setError('Error uploading file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSummary = () => {
    if (!summary) return;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Publication Summary', 20, 20);

    doc.setFontSize(12);
    doc.text(`Total Publications: ${summary.totalPublications}`, 20, 40);
    doc.text(`Journal Papers: ${summary.journalCount}`, 20, 50);
    doc.text(`Conference Papers: ${summary.conferenceCount}`, 20, 60);
    doc.text(`Year Range: ${summary.yearRange}`, 20, 70);

    doc.save('publication_summary.pdf');
  };

  return (
    <div className='upload-container'>
      <h2>Upload BibTeX File</h2>
      <input type="file" onChange={handleFileChange} accept=".bib" />
      <button onClick={handleUpload} className='upload-button'>
        Upload
      </button>

      {loading && <p>Uploading and processing file... ⏳</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>File uploaded and processed successfully! ✅</p>}

      {summary && (
        <div className='summary-box'>
          <h3>Publication Summary:</h3>
          <p><strong>Total Publications:</strong> {summary.totalPublications}</p>
          <p><strong>Journal Papers:</strong> {summary.journalCount}</p>
          <p><strong>Conference Papers:</strong> {summary.conferenceCount}</p>
          <p><strong>Year Range:</strong> {summary.yearRange}</p>

          <button onClick={handleDownloadSummary} className='download-button'>
            Download Summary (PDF)
          </button>
        </div>
      )}

      {publications.length > 0 && (
        <div className='publication-list'>
          <h3>Publication Details:</h3>
          <ul>
            {publications.map((pub, index) => (
              <li key={index} style={{ marginBottom: '8px' }}>
                <strong>{pub.entryTags?.title || 'No Title Available'}</strong> ({pub.entryTags?.year || 'No Year'})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
