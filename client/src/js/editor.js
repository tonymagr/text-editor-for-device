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

      console.info('bdata', data);
      console.info('blocalData', localData);
      console.info({header});
      console.info('beditor', this.editor);

      this.editor.setValue(data || localData || header);
      // this.editor.setValue(header);
    });

    this.editor.on('change', () => {
      updatedContent = this.editor.getValue();
      localStorage.setItem('content', updatedContent);
    });

    // Save the content of the editor when the editor itself is loses focus
    this.editor.on('blur', () => {
      console.log('The editor has lost focus');
      console.info({updatedContent});
      if (updatedContent) {
        // putDb(localStorage.getItem('content'));
        putDb(0, updatedContent);
        updatedContent = '';
      }
    });
  }
}
