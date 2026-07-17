(() => {
  const $ = (id) => document.getElementById(id)

  const postType = $('postType')
  const titleEl = $('title')
  const slugEl = $('slug')
  const dateEl = $('date')
  const layoutEl = $('layout')
  const isfeaturedEl = $('isfeatured')
  const tagsEl = $('tags')
  const tagOptions = $('tagOptions')
  const summaryEl = $('summary')
  const coverImagePathEl = $('coverImagePath')
  const coverImageFileEl = $('coverImageFile')
  const canonicalUrlEl = $('canonicalUrl')
  const editor = $('editor')
  const bodyImageFileEl = $('bodyImageFile')
  const statusEl = $('status')
  const draftToggleEl = $('draftToggle')
  const draftsListEl = $('draftsList')

  let layoutsByType = {}
  let slugManuallyEdited = false
  let currentSlug = null // set when a draft has been loaded, for overwrite-on-save

  function setStatus(msg, kind) {
    statusEl.textContent = msg
    statusEl.className = 'status' + (kind ? ' ' + kind : '')
  }

  function slugify(input) {
    return String(input)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 100)
  }

  function populateLayouts() {
    const info = layoutsByType[postType.value]
    layoutEl.innerHTML = ''
    info.options.forEach((opt) => {
      const o = document.createElement('option')
      o.value = opt
      o.textContent = opt
      layoutEl.appendChild(o)
    })
    layoutEl.value = info.default
  }

  async function loadMeta() {
    const res = await fetch('/api/meta')
    const data = await res.json()
    layoutsByType = data.layouts
    populateLayouts()
    dateEl.value = data.today
    tagOptions.innerHTML = data.tags.map((t) => `<option value="${t}">`).join('')
  }

  async function loadDrafts() {
    draftsListEl.innerHTML = '<li class="muted">Loading…</li>'
    const res = await fetch('/api/drafts')
    const { drafts } = await res.json()
    if (!drafts.length) {
      draftsListEl.innerHTML = '<li class="muted">No drafts yet</li>'
      return
    }
    draftsListEl.innerHTML = ''
    drafts.forEach((d) => {
      const li = document.createElement('li')
      li.innerHTML = `<span class="draft-type">${d.type}</span>${d.title}`
      li.addEventListener('click', () => loadDraft(d.type, d.slug))
      draftsListEl.appendChild(li)
    })
  }

  async function loadDraft(type, slug) {
    setStatus('Loading draft…')
    const res = await fetch(`/api/drafts/${type}/${slug}`)
    if (!res.ok) {
      setStatus('Could not load that draft', 'error')
      return
    }
    const data = await res.json()
    postType.value = data.type
    populateLayouts()
    const fm = data.frontmatter
    titleEl.value = fm.title || ''
    slugEl.value = data.slug
    slugManuallyEdited = true
    currentSlug = data.slug
    dateEl.value = fm.date ? String(fm.date).slice(0, 10) : ''
    layoutEl.value = fm.layout || layoutsByType[data.type].default
    isfeaturedEl.checked = !!fm.isfeatured
    tagsEl.value = Array.isArray(fm.tags) ? fm.tags.join(', ') : ''
    summaryEl.value = fm.summary || ''
    coverImagePathEl.value = Array.isArray(fm.images) && fm.images.length ? fm.images[0] : ''
    canonicalUrlEl.value = fm.canonicalUrl || ''
    draftToggleEl.checked = true
    editor.innerHTML = data.html || ''
    setStatus(`Loaded draft "${fm.title}"`, 'success')
  }

  function resetForm() {
    titleEl.value = ''
    slugEl.value = ''
    slugManuallyEdited = false
    currentSlug = null
    isfeaturedEl.checked = false
    tagsEl.value = ''
    summaryEl.value = ''
    coverImagePathEl.value = ''
    canonicalUrlEl.value = ''
    draftToggleEl.checked = true
    editor.innerHTML = ''
    dateEl.value = new Date().toISOString().slice(0, 10)
    populateLayouts()
    setStatus('')
  }

  titleEl.addEventListener('input', () => {
    if (!slugManuallyEdited) slugEl.value = slugify(titleEl.value)
  })
  slugEl.addEventListener('input', () => {
    slugManuallyEdited = true
  })
  postType.addEventListener('change', () => {
    populateLayouts()
  })
  $('newPostBtn').addEventListener('click', resetForm)

  // ---------- image upload helper ----------

  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  async function uploadImage(file) {
    const dataUrl = await fileToDataUrl(file)
    const res = await fetch('/api/upload-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: file.name, dataUrl }),
    })
    if (!res.ok) throw new Error('Upload failed')
    const data = await res.json()
    return data.path
  }

  $('coverImageBtn').addEventListener('click', () => coverImageFileEl.click())
  coverImageFileEl.addEventListener('change', async () => {
    const file = coverImageFileEl.files[0]
    if (!file) return
    setStatus('Uploading cover image…')
    try {
      coverImagePathEl.value = await uploadImage(file)
      setStatus('Cover image uploaded', 'success')
    } catch (e) {
      setStatus('Cover image upload failed', 'error')
    }
    coverImageFileEl.value = ''
  })

  // ---------- editor toolbar ----------

  editor.addEventListener('focus', saveSelection)
  editor.addEventListener('keyup', saveSelection)
  editor.addEventListener('mouseup', saveSelection)

  let savedRange = null
  function saveSelection() {
    const sel = window.getSelection()
    if (sel && sel.rangeCount && editor.contains(sel.anchorNode)) {
      savedRange = sel.getRangeAt(0)
    }
  }
  function restoreSelection() {
    editor.focus()
    if (savedRange) {
      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(savedRange)
    }
  }

  document.querySelectorAll('#toolbar button[data-cmd]').forEach((btn) => {
    btn.addEventListener('click', () => {
      restoreSelection()
      document.execCommand(btn.dataset.cmd, false, null)
    })
  })

  document.querySelectorAll('#toolbar button[data-block]').forEach((btn) => {
    btn.addEventListener('click', () => {
      restoreSelection()
      const tag = btn.dataset.block
      document.execCommand('formatBlock', false, tag === 'p' ? 'P' : tag.toUpperCase())
    })
  })

  $('codeInlineBtn').addEventListener('click', () => {
    restoreSelection()
    const sel = window.getSelection()
    const text = sel.toString() || 'code'
    document.execCommand('insertHTML', false, `<code>${escapeHtml(text)}</code>`)
  })

  $('codeBlockBtn').addEventListener('click', () => {
    restoreSelection()
    const sel = window.getSelection()
    const text = sel.toString() || 'code block'
    const lang = prompt('Language (optional, e.g. java, xml, js):', '') || ''
    const cls = lang.trim() ? ` class="language-${escapeHtml(lang.trim())}"` : ''
    document.execCommand(
      'insertHTML',
      false,
      `<pre><code${cls}>${escapeHtml(text)}</code></pre><p><br></p>`
    )
  })

  $('linkBtn').addEventListener('click', () => {
    const url = prompt('Link URL:')
    if (!url) return
    restoreSelection()
    document.execCommand('createLink', false, url)
  })

  $('hrBtn').addEventListener('click', () => {
    restoreSelection()
    document.execCommand('insertHTML', false, '<hr><p><br></p>')
  })

  $('imageBtn').addEventListener('click', () => {
    saveSelection()
    bodyImageFileEl.click()
  })
  bodyImageFileEl.addEventListener('change', async () => {
    const file = bodyImageFileEl.files[0]
    if (!file) return
    setStatus('Uploading image…')
    try {
      const imgPath = await uploadImage(file)
      restoreSelection()
      document.execCommand(
        'insertHTML',
        false,
        `<img src="${imgPath}" alt="${escapeHtml(file.name)}"><p><br></p>`
      )
      setStatus('Image inserted', 'success')
    } catch (e) {
      setStatus('Image upload failed', 'error')
    }
    bodyImageFileEl.value = ''
  })

  function escapeHtml(str) {
    const div = document.createElement('div')
    div.textContent = str
    return div.innerHTML
  }

  // ---------- save / publish ----------

  function collectFrontmatter() {
    return {
      title: titleEl.value.trim(),
      date: dateEl.value,
      tags: tagsEl.value
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      summary: summaryEl.value.trim(),
      images: coverImagePathEl.value.trim() ? [coverImagePathEl.value.trim()] : [],
      layout: layoutEl.value,
      isfeatured: isfeaturedEl.checked,
      canonicalUrl: canonicalUrlEl.value.trim(),
    }
  }

  async function save(publish) {
    if (!titleEl.value.trim()) {
      setStatus('Title is required', 'error')
      return
    }
    const body = {
      type: postType.value,
      slug: currentSlug,
      frontmatter: { ...collectFrontmatter(), draft: publish ? false : true },
      html: editor.innerHTML,
    }
    setStatus(publish ? 'Publishing…' : 'Saving draft…')
    try {
      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')
      currentSlug = publish ? null : data.slug
      slugEl.value = data.slug
      if (!publish) {
        setStatus(`Draft saved to ${data.filePath}`, 'success')
      } else if (data.git && data.git.ok && !data.git.skipped) {
        setStatus(`Published to ${data.filePath} — committed (${data.git.commit})`, 'success')
      } else if (data.git && data.git.ok && data.git.skipped) {
        setStatus(`Published to ${data.filePath} — ${data.git.reason}`, 'success')
      } else if (data.git && !data.git.ok) {
        setStatus(`Published to ${data.filePath}, but git commit failed: ${data.git.reason}`, 'error')
      } else {
        setStatus(`Published to ${data.filePath}`, 'success')
      }
      loadDrafts()
    } catch (e) {
      setStatus(e.message, 'error')
    }
  }

  $('saveBtn').addEventListener('click', () => save(false))
  $('publishBtn').addEventListener('click', () => {
    if (
      confirm(
        'Publish this post? It will be marked draft:false, committed to git locally (no push), and go live on next site build/deploy.'
      )
    ) {
      save(true)
    }
  })

  loadMeta()
  loadDrafts()
})()
