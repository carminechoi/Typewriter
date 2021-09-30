/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import './NotePad.css';

const NotePad = () => {
  const [textValue, setTextValue] = useState('');
  const [selectionStart, setSelectionStart] = useState(0);

  return (
    <div className="text-container">
      <textarea
        className="textArea"
        value={textValue}
        onChange={(e) => {
          setTextValue(e.target.value);
        }}
        onClick={(e) => {
          setSelectionStart(e.currentTarget.selectionStart);
          console.log(selectionStart);
        }}
        spellCheck="false"
      />
    </div>
  );
};

export default NotePad;
