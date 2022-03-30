import React, { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import configureCadence, { CADENCE_LANGUAGE_ID } from 'util/cadence';
import { EditorContainer } from './components';
import { useProject } from 'providers/Project/projectHooks';
import debounce from 'util/debounce';

const MONACO_CONTAINER_ID = 'monaco-container';

type EditorState = {
  model: any;
  viewState: any;
};

const EnhancedEditor = (props: any) => {
  const project = useProject();
  const cadenceInitiated = useRef(false);
  const editor = useRef(null);
  const editorOnChange = useRef(null);

  const lastEdit = useRef({
    type: 8,
    index: 8,
  });

  const [editorStates, setEditorStates] = useState({});

  const getOrCreateEditorState = (id: string, code: string): EditorState => {
    const existingState = editorStates[id];

    if (existingState !== undefined) {
      return existingState;
    }

    const newState = {
      model: monaco.editor.createModel(code, CADENCE_LANGUAGE_ID),
      viewState: null,
    };

    setEditorStates({
      ...editorStates,
      [id]: newState,
    });

    return newState;
  };
  const getActiveCode = () => {
    const { active } = project;
    const { accounts, scriptTemplates, transactionTemplates } = project.project;

    const { type, index } = active;
    let code, id;
    switch (type) {
      case 1:
        code = accounts[index].draftCode;
        id = accounts[index].id;
        break;
      case 2:
        code = transactionTemplates[index].script;
        id = transactionTemplates[index].id;
        break;
      case 3:
        code = scriptTemplates[index].script;
        id = scriptTemplates[index].id;
        break;
      default:
        code = 'not support type';
    }
    return [code, id];
  };

  // TODO: tie-in Monaco with project updates
  // TODO: tie-in language-client server with project updates
  // TODO: delay language client checks
  // TODO: add manual request to trigger check

  // Method to use, when model was changed
  const onChange = debounce((event) => {
    // TODO: figure out, why title for transactions and scripts is empty here...
    project.active.onChange(editor.current.getValue(), '-----', '', '');
  }, 150);

  useEffect(() => {
    if (cadenceInitiated.current === false) {
      console.log('Init Cadence');
      // Step1 - Configure global monaco to support Cadence
      configureCadence();
      cadenceInitiated.current = true;
    } else {
      console.log('No need :)');
    }
  }, []);

  useEffect(() => {
    console.log('Active item updated!');
    if (editor.current) {
      // Remove tracking of model updates to prevent re-rendering
      if (editorOnChange.current) {
        editorOnChange.current.dispose();
      }

      const [code, newId] = getActiveCode();
      const newState = getOrCreateEditorState(newId, code);

      console.log({ lastEdit: lastEdit.current });

      // Active editor changed
      // - Check if last changed is different from current
      console.log({
        lastT: lastEdit.current.type,
        lastI: lastEdit.current.index,
        activeT: project.active.type,
        activeI: project.active.index,
      });
      if (
        lastEdit.current.type == project.active.type &&
        lastEdit.current.index == project.active.index
      ) {
        editor.current.setModel(newState.model);
        editor.current.restoreViewState(newState.viewState);
        editor.current.focus();
        console.log('Same stuff, do nothing for now...');
      } else {
        console.log('-------------------->', 'Add new line at the end');
        // - Add new line at the end of the model
        newState.model.setValue(code + '\n');
        lastEdit.current = {
          type: project.active.type,
          index: project.active.index,
        };

        // - Mark last edited as type, index, edited = true
        editor.current.setModel(newState.model);
        editor.current.restoreViewState(newState.viewState);
        editor.current.focus();

        setTimeout(() => {
          newState.model.setValue(code);
          editor.current.setModel(newState.model);
          editor.current.restoreViewState(newState.viewState);
          editor.current.focus();
        }, 120);
      }

      editorOnChange.current = editor.current.onDidChangeModelContent(onChange);
    }
  }, [project.active, project.project.accounts]);

  const destroyEditor = () => {
    editor.current.dispose();
  };

  const initEditor = async () => {
    const container = document.getElementById(MONACO_CONTAINER_ID);
    editor.current = monaco.editor.create(container, {
      theme: 'vs-light',
      language: CADENCE_LANGUAGE_ID,
      minimap: {
        enabled: false,
      },
    });

    // Setup even listener when code is updated
    editorOnChange.current = editor.current.onDidChangeModelContent(onChange);

    const model = monaco.editor.createModel(
      'hello, world',
      CADENCE_LANGUAGE_ID,
    );
    const state: EditorState = {
      model,
      viewState: null,
    };
    editor.current.setModel(state.model);
    editor.current.restoreViewState(state.viewState);
    editor.current.focus();

    window.addEventListener('resize', () => {
      console.log('Resize Editor Layout');
      editor && editor.current.layout();
    });
  };

  useEffect(() => {
    // Drop returned Promise
    initEditor().then();

    return () => {
      if (editor) {
        destroyEditor();
      }
    };
  }, []);

  return <EditorContainer id={MONACO_CONTAINER_ID} />;
};

export default EnhancedEditor;
