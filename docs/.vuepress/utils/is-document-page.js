export function isDocumentPage(page) {
  if (!page?.path) {
    return false
  }

  if (page.frontmatter?.home) {
    return false
  }

  if (page.path === '/' || page.path.endsWith('/index.html')) {
    return false
  }

  return true
}
