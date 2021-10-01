/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './NotePad.global.css';

const CoordinateBar = () => {
  return (
    <div className="coordinate-bar-row">
      <div className="coordinate-bar-element-col-first col-0" />
      <div className="coordinate-bar-element-col col-1">Ln 1, Col 14</div>
      <div className="coordinate-bar-element-col col-2 zoom">100%</div>
      <div className="coordinate-bar-element-col col-3 end-of-line">
        Windows(CRLF)
      </div>
      <div className="coordinate-bar-element-col col-4 encoding">UTF-8</div>
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
