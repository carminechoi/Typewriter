const { ipcRenderer } = window.require('electron');

const handleTab = (text: string, start: number, end: number) => {
  return `${text.substring(0, start)}\t${text.substring(end)}`;
};

const handleKeyDown = (
  e: React.KeyboardEvent<HTMLTextAreaElement>,
  textValue: string,
  ctrlIsDown: boolean
) => {
  const textIsSelected = window.getSelection()?.toString() !== '';
  const keyCode = e.key;
  let text = textValue;
  let isCtrlDown = ctrlIsDown;
  switch (keyCode) {
    case 'Tab': {
      text = handleTab(
        textValue,
        e.currentTarget.selectionStart,
        e.currentTarget.selectionEnd
      );
      ipcRenderer.send('app:keypress', 'tab');
      break;
    }
    case 'Enter': {
      if (!textIsSelected) ipcRenderer.send('app:keypress', 'newLine');
      break;
    }
    case 'Backspace':
    case 'Delete':
    case 'Fn': {
      e.preventDefault();
      break;
    }
    case 'Control': {
      isCtrlDown = true;
      break;
    }
    case 'z':
    case 'v': {
      if (isCtrlDown) e.preventDefault();
      break;
    }
    default:
  }
  return { textValue: text, ctrlIsDown: isCtrlDown };
};

export default handleKeyDown;
