/**
 * Editor toolbar with formatting buttons.
 * Returns HTML string and an attach function to bind events to TipTap editor.
 */

/**
 * Render toolbar HTML
 */
export function renderToolbar() {
  return `
    <div class="editor-toolbar" id="editor-toolbar">
      <button class="toolbar-btn" data-cmd="bold" title="Negrita (Ctrl+B)"><b>B</b></button>
      <button class="toolbar-btn" data-cmd="italic" title="Cursiva (Ctrl+I)"><i>I</i></button>
      <button class="toolbar-btn" data-cmd="strike" title="Tachado">S̶</button>
      <span class="toolbar-separator"></span>
      <button class="toolbar-btn" data-cmd="heading2" title="Título H2">H2</button>
      <button class="toolbar-btn" data-cmd="heading3" title="Título H3">H3</button>
      <button class="toolbar-btn" data-cmd="heading4" title="Título H4">H4</button>
      <span class="toolbar-separator"></span>
      <button class="toolbar-btn" data-cmd="bulletList" title="Lista">•</button>
      <button class="toolbar-btn" data-cmd="orderedList" title="Lista numerada">1.</button>
      <button class="toolbar-btn" data-cmd="blockquote" title="Cita">❝</button>
      <span class="toolbar-separator"></span>
      <button class="toolbar-btn" data-cmd="link" title="Enlace (Ctrl+K)">🔗</button>
      <button class="toolbar-btn" data-cmd="image" title="Imagen">🖼</button>
      <span class="toolbar-separator"></span>
      <button class="toolbar-btn" data-cmd="codeBlock" title="Bloque de código">&lt;/&gt;</button>
      <button class="toolbar-btn" data-cmd="horizontalRule" title="Línea horizontal">─</button>
      <span class="toolbar-separator"></span>
      <button class="toolbar-btn" data-cmd="undo" title="Deshacer (Ctrl+Z)">↩</button>
      <button class="toolbar-btn" data-cmd="redo" title="Rehacer (Ctrl+Shift+Z)">↪</button>
    </div>
  `;
}

/**
 * Attach toolbar button handlers to a TipTap editor instance.
 * Also updates active state on selection change.
 *
 * @param {import('@tiptap/core').Editor} editor
 * @param {Function} onImageClick - Callback when image button is clicked
 */
export function attachToolbar(editor, onImageClick) {
  const toolbar = document.getElementById('editor-toolbar');
  if (!toolbar) return;

  toolbar.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-cmd]');
    if (!btn) return;

    const cmd = btn.dataset.cmd;
    const chain = editor.chain().focus();

    switch (cmd) {
      case 'bold':
        chain.toggleBold().run();
        break;
      case 'italic':
        chain.toggleItalic().run();
        break;
      case 'strike':
        chain.toggleStrike().run();
        break;
      case 'heading2':
        chain.toggleHeading({ level: 2 }).run();
        break;
      case 'heading3':
        chain.toggleHeading({ level: 3 }).run();
        break;
      case 'heading4':
        chain.toggleHeading({ level: 4 }).run();
        break;
      case 'bulletList':
        chain.toggleBulletList().run();
        break;
      case 'orderedList':
        chain.toggleOrderedList().run();
        break;
      case 'blockquote':
        chain.toggleBlockquote().run();
        break;
      case 'codeBlock':
        chain.toggleCodeBlock().run();
        break;
      case 'horizontalRule':
        chain.setHorizontalRule().run();
        break;
      case 'undo':
        chain.undo().run();
        break;
      case 'redo':
        chain.redo().run();
        break;
      case 'link': {
        const url = prompt('URL del enlace:');
        if (url) {
          chain.setLink({ href: url, target: '_blank' }).run();
        } else if (url === '') {
          chain.unsetLink().run();
        }
        break;
      }
      case 'image':
        if (onImageClick) onImageClick();
        break;
    }
  });

  // Update active state on editor transaction
  editor.on('transaction', () => {
    toolbar.querySelectorAll('[data-cmd]').forEach(btn => {
      const cmd = btn.dataset.cmd;
      let isActive = false;

      switch (cmd) {
        case 'bold': isActive = editor.isActive('bold'); break;
        case 'italic': isActive = editor.isActive('italic'); break;
        case 'strike': isActive = editor.isActive('strike'); break;
        case 'heading2': isActive = editor.isActive('heading', { level: 2 }); break;
        case 'heading3': isActive = editor.isActive('heading', { level: 3 }); break;
        case 'heading4': isActive = editor.isActive('heading', { level: 4 }); break;
        case 'bulletList': isActive = editor.isActive('bulletList'); break;
        case 'orderedList': isActive = editor.isActive('orderedList'); break;
        case 'blockquote': isActive = editor.isActive('blockquote'); break;
        case 'codeBlock': isActive = editor.isActive('codeBlock'); break;
        case 'link': isActive = editor.isActive('link'); break;
      }

      btn.classList.toggle('toolbar-btn--active', isActive);
    });
  });
}
