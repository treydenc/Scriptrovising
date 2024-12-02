// src/components/AutoResizeTextArea.jsx
import React, { useEffect, useRef } from 'react';

const AutoResizeTextArea = ({ value, onChange, index, onDelete }) => {
  const textareaRef = useRef(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    // Reset height to auto first to get the correct scrollHeight
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  const handleChange = (e) => {
    onChange(index, e.target.value);
  };

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={handleChange}
      className="w-full text-md bg-transparent text-gray-200 leading-relaxed 
               focus:outline-none focus:bg-black/20 p-2 rounded resize-none 
               font-['Courier'] overflow-hidden"
      style={{ minHeight: '1.5em' }}
    />
  );
};

export default AutoResizeTextArea;