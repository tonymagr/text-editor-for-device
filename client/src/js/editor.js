// Import methods to save and get data from the indexedDB database in './database.js'
import { getDb, putDb } from './database';
import { header } from './header';

let updatedContent;

export default class {
  constructor() {
    const localData = localStorage.getItem('content');

    // check if CodeMirror is loaded
    if (typeof CodeMirror === 'undefined') {
      throw new Error('CodeMirror is not loaded');
    }

    this.editor = CodeMirror(document.querySelector('#main'), {
      value: '',
      mode: 'javascript',
      theme: 'monokai',
      lineNumbers: true,
      lineWrapping: true,
      autofocus: true,
      indentUnit: 2,
      tabSize: 2,
    });

    // When the editor is ready, set the value to whatever is stored in indexeddb.
    // Fall back to localStorage if nothing is stored in indexeddb, and if neither is available, set the value to header.
    getDb(0).then((data) => {
      console.info('Loaded data from IndexedDB, injecting into editor');
      console.log('data', data);
      this.editor.setValue(data.text || localData || header);
      // Position cursor at end of last line
      this.editor.setCursor({line: this.editor.lineCount()});
    });

    this.editor.on('change', () => {
      updatedContent = this.editor.getValue();
      // Check if header is displayed and not initial editor data load. 
      // If so, remove header for text entry. (Header length with line feeds is 169.)
      if (updatedContent.slice(0, 169) === header) {
        if (updatedContent.length !== 169) {
          updatedContent = updatedContent.slice(169);
          this.editor.setValue(updatedContent);
          this.editor.setCursor({line: 1, ch: (updatedContent.length + 1)});
          localStorage.setItem('content', updatedContent);
        }
      } else {
        localStorage.setItem('content', updatedContent);
      }
    });

    // Save the content of the editor when the editor itself is loses focus
    this.editor.on('blur', () => {
      console.log('The editor has lost focus');
      console.info({updatedContent});
      // Do not save header to IndexedDB - having header be just for display when starting new
      if (updatedContent.slice(0, 169) !== header) {
        putDb(0, updatedContent);
      }
    });
  }
}
