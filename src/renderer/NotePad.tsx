/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './NotePad.global.css';

const CoordinateBar = () => {
  return (
    <div className="coordinate-bar">
      <div />
      <div />
      <div />
      <div />
      <div />
    </div>
  );
};

const NotePad = () => {
  const [textValue, setTextValue] = useState('');
  const [selectionStart, setSelectionStart] = useState(0);

  return (
    <div>
      <div className="text-container">
        <textarea
          className="text-area"
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
      <CoordinateBar />
    </div>
  );
};

export default NotePad;
