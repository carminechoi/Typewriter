/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import handleKeyDown from 'renderer/Helpers/NotePad-helpers';
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

  useEffect(() => {
    // Anything in here is fired on component mount.
    ipcRenderer.once('app:open-text-reply', (_event, args) => {
      setTextValue(args);
    });

    ipcRenderer.once('app:save-text-request', (event) => {
      event.sender.send('app:save-text-reply', textValue);
    });

    return function cleanup() {
      // Anything in here is fired on component unmount.
      ipcRenderer.removeAllListeners('app:open-text-reply');
      ipcRenderer.removeAllListeners('app:save-text-request');
    };
  }, [textValue]);

  return (
    <div>
      <div className="text-container">
        <textarea
          className="text-area"
          value={textValue}
          spellCheck="false"
          onChange={(e) => {
            ipcRenderer.send('app:keypress', 'character');
            setTextValue(e.target.value.toString());
            setRowAndCol(e.currentTarget.selectionStart);
            console.log(`onChange: ${textValue}`);
          }}
          onClick={(e) => {
            setRowAndCol(e.currentTarget.selectionStart);
          }}
          onKeyDown={(e) => {
            const handleResult = handleKeyDown(e, textValue, ctrlIsDown);
            setTextValue(handleResult.textValue);
            setCtrlIsDown(handleResult.ctrlIsDown);
            setRowAndCol(e.currentTarget.selectionStart);
          }}
          onKeyUp={(e) => {
            if (e.key === 'Control') setCtrlIsDown(false);
          }}
        />
      </div>
      <CoordinateBar row={row} col={col} />
    </div>
  );
};

export default NotePad;
