function renderField(field) {
  const { name, label, type, required } = field
  const req = required ? ' required' : ''
  const safeLabel = String(label ?? name)
  if (!name || !type) throw new Error(`invalid field: ${JSON.stringify(field)}`)

  if (type === 'text') {
    return `<label>${safeLabel}<input name="${name}" type="text"${req}></label>`
  }
  if (type === 'number') {
    return `<label>${safeLabel}<input name="${name}" type="number"${req}></label>`
  }
  if (type === 'select') {
    const options = (field.options ?? [])
      .map((o) => `<option value="${o.value}">${o.label}</option>`)
      .join('')
    return `<label>${safeLabel}<select name="${name}"${req}>${options}</select></label>`
  }
  throw new Error(`unsupported type: ${type}`)
}

function renderForm(schema) {
  if (!schema || !Array.isArray(schema.fields)) throw new Error('schema.fields must be an array')
  const fieldsHtml = schema.fields.map(renderField).join('\n')
  return `<form>\n${fieldsHtml}\n</form>`
}

const schema = {
  fields: [
    { name: 'title', label: '标题', type: 'text', required: true },
    { name: 'age', label: '年龄', type: 'number', required: false },
    {
      name: 'level',
      label: '级别',
      type: 'select',
      required: true,
      options: [
        { label: 'P1', value: 'p1' },
        { label: 'P2', value: 'p2' }
      ]
    }
  ]
}

try {
  console.log(renderForm(schema))
} catch (e) {
  console.error('[render error]', e)
  process.exit(1)
}


