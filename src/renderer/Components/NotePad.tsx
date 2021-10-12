/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import CoordinateBar from './CoordinateBar';

import './NotePad.global.css';

const { ipcRenderer } = window.require('electron');

const NotePad = () => {
  const [textValue, setTextValue] = useState('');
  const [row, setRow] = useState(0);
  const [col, setCol] = useState(0);

  const setRowAndCol = (selection: number) => {
    const substr = textValue.substring(0, selection).split('\n');
    setRow(substr.length);
    setCol(substr[substr.length - 1].length + 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.code === 'Tab') {
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;

      setTextValue(
        `${textValue.substring(0, start)}\t${textValue.substring(end)}`
      );
      e.currentTarget.selectionStart = start + 1;
      e.currentTarget.selectionEnd = start + 1;
    } else if (e.code === 'Backspace' || e.code === 'Delete') {
      e.preventDefault();
    } else if (e.code === 'Enter') {
      ipcRenderer.send('keyPress', 'newLine');
    } else if (
      e.key.length === 1 &&
      e.code !== 'Undo' &&
      e.code !== 'Copy' &&
      e.code !== 'Paste'
    ) {
      ipcRenderer.send('keyPress', 'character');
    }
  };

  return (
    <div>
      <div className="text-container">
        <textarea
          className="text-area"
          value={textValue}
          spellCheck="false"
          onChange={(e) => {
            setTextValue(e.target.value);
            setRowAndCol(e.currentTarget.selectionStart);
          }}
          onClick={(e) => {
            setRowAndCol(e.currentTarget.selectionStart);
          }}
          onKeyDown={(e) => {
            handleKeyDown(e);
            setRowAndCol(e.currentTarget.selectionStart);
          }}
        />
      </div>
      <CoordinateBar row={row} col={col} />
    </div>
  );
};

export default NotePad;
