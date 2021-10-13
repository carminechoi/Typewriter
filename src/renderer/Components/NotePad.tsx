/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import CoordinateBar from './CoordinateBar';

import './NotePad.global.css';

const { ipcRenderer } = window.require('electron');

const NotePad = () => {
  const [textValue, setTextValue] = useState('');
  const [row, setRow] = useState(0);
  const [col, setCol] = useState(0);
  const [ctrlIsDown, setCtrlIsDown] = useState(false);

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
      ipcRenderer.send('keyPress', 'tab');
    } else if (e.code === 'Backspace' || e.code === 'Delete') {
      e.preventDefault();
    } else if (e.code === 'Enter') {
      ipcRenderer.send('keyPress', 'newLine');
    } else if (e.code === 'ControlLeft' || e.code === 'ControlRight') {
      setCtrlIsDown(true);
    } else if (
      String.fromCharCode(e.keyCode).match(/(\w|\s)/g) &&
      !ctrlIsDown
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
          onKeyUp={(e) => {
            if (e.code === 'ControlLeft' || e.code === 'ControlRight')
              setCtrlIsDown(false);
          }}
        />
      </div>
      <CoordinateBar row={row} col={col} />
    </div>
  );
};

export default NotePad;
