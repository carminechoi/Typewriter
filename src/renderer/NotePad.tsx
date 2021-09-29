/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import 'draft-js/dist/Draft.css';
import './NotePad.css';

const NotePad = () => {
  const [textValue, setTextValue] = useState('');

  return (
    <div className="text-container">
      <textarea
        className="textArea"
        value={textValue}
        onChange={(e) => setTextValue(e.target.value)}
        spellCheck="false"
      />
    </div>
  );
};

export default NotePad;
