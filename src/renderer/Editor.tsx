import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import { Editor, EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';

const MyEditor = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const logState = () => {
    // eslint-disable-next-line no-console
    console.log(editorState.toJS());
  };

  return (
    <div>
      <Editor editorState={editorState} onChange={setEditorState} />
      <input
        onClick={logState}
        style={styles.button}
        type="button"
        value="Log State"
      />
    </div>
  );
};

export default MyEditor;
