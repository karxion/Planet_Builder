"use strict";

function editNotes(id, name) {
  // elements
  const notesLegend = ensureEl("notesLegend");
  const notesName = ensureEl("notesName");
  const notesSelect = ensureEl("notesSelect");
  const notesPin = ensureEl("notesPin");

  // update list of objects
  notesSelect.options.length = 0;
  notes.forEach(({id}) => notesSelect.options.add(new Option(id, id)));

  // update pin notes icon
  const notesArePinned = options.pinNotes;
  if (notesArePinned) notesPin.classList.add("pressed");
  else notesPin.classList.remove("pressed");

  // select an object
  if (notes.length || id) {
    if (!id) id = notes[0].id;
    let note = notes.find(note => note.id === id);
    if (!note) {
      if (!name) name = id;
      note = {id, name, legend: ""};
      notes.push(note);
      notesSelect.options.add(new Option(id, id));
    }

    notesSelect.value = id;
    setNoteInputs(note);
    initEditor();
    updateNotesBox(note);
  } else {
    // if notes array is empty
    notesName.value = "";
    notesLegend.innerHTML = "No notes added. Click on an element (e.g. label or marker) and add a free text note";
  }

  $("#notesEditor").dialog({
    title: "Notes Editor",
    width: svgWidth * 0.8,
    height: svgHeight * 0.75,
    position: {my: "center", at: "center", of: "svg"},
    close: removeEditor
  });

  if (modules.editNotes) return;
  modules.editNotes = true;

  // add listeners
  ensureEl("notesSelect").addEventListener("change", changeElement);
  ensureEl("notesName").addEventListener("input", changeName);
  ensureEl("notesLegend").addEventListener("blur", updateLegend);
  ensureEl("notesPin").addEventListener("click", toggleNotesPin);
  ensureEl("notesFocus").addEventListener("click", validateHighlightElement);
  ensureEl("notesGenerateWithAi").addEventListener("click", openAiGenerator);
  ensureEl("notesDownload").addEventListener("click", downloadLegends);
  ensureEl("notesUpload").addEventListener("click", () => legendsToLoad.click());
  ensureEl("legendsToLoad").addEventListener("change", function () {
    uploadFile(this, uploadLegends);
  });
  ensureEl("notesRemove").addEventListener("click", triggerNotesRemove);
  window.addEventListener("ui:language-changed", () => {
    if (!ensureEl("notesEditor").offsetParent) return;
    const note = notes.find(note => note.id === notesSelect.value);
    if (!note) return;
    const current = window.tinymce?.activeEditor?.getContent() ?? notesLegend.innerHTML;
    if (sanitizeNoteHtml(current) !== notesLegend.dataset.renderedLegend) return;
    setNoteInputs(note);
    if (window.tinymce?.activeEditor) {
      tinymce.activeEditor.setContent(notesLegend.innerHTML);
      notesLegend.dataset.renderedLegend = sanitizeNoteHtml(tinymce.activeEditor.getContent());
    }
  });

  function setNoteInputs(note) {
    const localized = window.localizedMapNote(note);
    notesName.value = localized.name;
    notesLegend.innerHTML = localized.legend;
    notesLegend.dataset.renderedLegend = sanitizeNoteHtml(localized.legend);
  }

  async function initEditor() {
    if (!window.tinymce) {
      const url = "https://azgaar.github.io/Fantasy-Map-Generator/libs/tinymce/tinymce.min.js";
      try {
        await import(url);
      } catch (error) {
        // error may be caused by failed request being cached, try again with random hash
        try {
          const hash = Math.random().toString(36).substring(2, 15);
          await import(`${url}#${hash}`);
        } catch (error) {
          console.error(error);
        }
      }
    }

    if (window.tinymce) {
      window.tinymce._setBaseUrl("https://azgaar.github.io/Fantasy-Map-Generator/libs/tinymce");
      tinymce.init({
        license_key: "gpl",
        selector: "#notesLegend",
        height: "90%",
        menubar: false,
        plugins: `autolink lists link charmap code fullscreen image link media table wordcount`,
        toolbar: `code | undo redo | removeformat | bold italic strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media table | fontselect fontsizeselect | blockquote hr charmap | print fullscreen`,
        media_alt_source: false,
        media_poster: false,
        browser_spellcheck: true,
        contextmenu: false,
        setup: editor => {
          editor.on("init", () => { notesLegend.dataset.renderedLegend = sanitizeNoteHtml(editor.getContent()); });
          editor.on("Change", updateLegend);
        }
      });
    }
  }

  function updateLegend() {
    const note = notes.find(note => note.id === notesSelect.value);
    if (!note) return tip("Note element is not found", true, "error", 4000);

    const isTinyEditorActive = window.tinymce?.activeEditor;
    const legend = window.stripDeorumContent(sanitizeNoteHtml(isTinyEditorActive ? tinymce.activeEditor.getContent() : notesLegend.innerHTML));
    if (legend !== notesLegend.dataset.renderedLegend) {
      note.legend = legend;
      notesLegend.dataset.renderedLegend = legend;
      window.dispatchEvent(new Event("project:changed"));
    }
    updateNotesBox(note);
  }

  function updateNotesBox(note) {
    window.renderMapNote(note);
  }

  function changeElement() {
    const note = notes.find(note => note.id === this.value);
    if (!note) return tip("Note element is not found", true, "error", 4000);

    setNoteInputs(note);
    const legend = notesLegend.innerHTML;
    updateNotesBox(note);

    if (window.tinymce?.activeEditor) {
      tinymce.activeEditor.setContent(legend);
      notesLegend.dataset.renderedLegend = sanitizeNoteHtml(tinymce.activeEditor.getContent());
    }
  }

  function changeName() {
    const note = notes.find(note => note.id === notesSelect.value);
    if (!note) return tip("Note element is not found", true, "error", 4000);

    if (note.name === this.value) return;
    note.name = this.value;
    window.dispatchEvent(new Event("project:changed"));
  }

  function validateHighlightElement() {
    const element = ensureEl(notesSelect.value);
    if (element) return highlightElement(element, 3);

    confirmationDialog({
      title: "Element not found",
      message: "Note element is not found. Would you like to remove the note?",
      confirm: "Remove",
      cancel: "Keep",
      onConfirm: removeLegend
    });
  }

  function openAiGenerator() {
    const note = notes.find(note => note.id === notesSelect.value);

    let prompt = `Respond with description. Use simple dry language. Invent facts, names and details. Split to paragraphs and format to HTML. Remove h tags, remove markdown.`;
    prompt += document.documentElement.lang === "en" ? " Write the description in English." : " 설명은 한국어로 작성해주세요.";
    if (note?.name) prompt += ` Name: ${note.name}.`;
    if (note?.legend) prompt += ` Data: ${note.legend}`;

    const onApply = result => {
      const legend = window.stripDeorumContent(sanitizeNoteHtml(result));
      notesLegend.innerHTML = legend;
      if (note) {
        note.legend = legend;
        updateNotesBox(note);
        if (window.tinymce) tinymce.activeEditor.setContent(note.legend);
        notesLegend.dataset.renderedLegend = legend;
        window.dispatchEvent(new Event("project:changed"));
      }
    };

    generateWithAi(prompt, onApply);
  }

  function downloadLegends() {
    const notesData = JSON.stringify(notes);
    const name = getFileName("Notes") + ".txt";
    downloadFile(notesData, name);
  }

  function uploadLegends(dataLoaded) {
    if (!dataLoaded) return tip("Cannot load the file. Please check the data format", false, "error");
    let imported;
    try {
      imported = window.sanitizeImportedNotes(JSON.parse(dataLoaded));
      if (!imported.length) throw new Error("Empty notes import");
      imported.forEach(note => { note.legend = window.stripDeorumContent(note.legend); });
    } catch {
      return tip("Cannot load the file. Please check the data format", false, "error");
    }
    notes = imported;
    window.dispatchEvent(new Event("project:changed"));
    notesSelect.options.length = 0;
    editNotes(notes[0]?.id, notes[0]?.name);
  }

  function triggerNotesRemove() {
    function removeLegend() {
      notes = notes.filter(({id}) => id !== notesSelect.value);
      window.dispatchEvent(new Event("project:changed"));

      if (!notes.length) {
        $("#notesEditor").dialog("close");
        return;
      }

      removeEditor();
      editNotes(notes[0].id, notes[0].name);
    }

    confirmationDialog({
      title: "Remove note",
      message: "Are you sure you want to remove the selected note? There is no way to undo this action",
      confirm: "Remove",
      onConfirm: removeLegend
    });
  }

  function toggleNotesPin() {
    options.pinNotes = !options.pinNotes;
    this.classList.toggle("pressed");
  }

  function removeEditor() {
    if (window.tinymce) tinymce.remove();
  }
}
