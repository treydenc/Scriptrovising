// components/AutoResizeTextArea.js
import React, { useRef, useEffect } from 'react';

const AutoResizeTextArea = ({ value, onChange, onFocus, onBlur, index }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  const handleChange = (e) => {
    if (onChange) {
      onChange(index, e.target.value);
    }
  };

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={handleChange}
      onFocus={() => onFocus && onFocus()}
      onBlur={(e) => onBlur && onBlur(e.target.value)}
      className="w-full text-md bg-transparent text-gray-200 leading-relaxed focus:outline-none 
        focus:bg-black/20 p-2 rounded resize-none font-['Courier']"
      rows={1}
    />
  );
};

export default AutoResizeTextArea;