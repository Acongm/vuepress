import fs from 'node:fs/promises';
import path from 'node:path';

const workspaceRoot = path.resolve(process.cwd());

const FHMI_ROOT = path.resolve(workspaceRoot, '.tmp/frontend-hard-mode-interview');
const RESUME_PATH = path.resolve(workspaceRoot, 'docs/job-description/高级前端面试题-基于简历.md');
const OUT_PATH = path.resolve(
  workspaceRoot,
  'docs/job-description/lib/11-frontend-hard-mode-interview-原题提取-基于简历.md',
);

const STOPWORDS = new Set(
  [
    'the',
    'and',
    'or',
    'a',
    'an',
    'to',
    'of',
    'in',
    'for',
    'on',
    'with',
    'as',
    'is',
    'are',
    'be',
    'this',
    'that',
    'it',
    'js',
    'ts',
    'css',
    'html',
    'api',
    'sdk',
  ].map((s) => s.toLowerCase()),
);

function isChineseToken(token) {
  return /[\u4e00-\u9fff]/.test(token);
}

function normalizeAsciiToken(token) {
  return token.toLowerCase();
}

function uniq(arr) {
  return [...new Set(arr)];
}

function extractInlineCodeTokens(text) {
  const out = [];
  const re = /`([^`]+)`/g;
  let m;
  while ((m = re.exec(text))) {
    const token = m[1].trim();
    if (!token) continue;
    out.push(token);
  }
  return out;
}

function extractChecklistKeywords(resumeText) {
  const lines = resumeText.split(/\r?\n/);
  const out = [];
  for (const line of lines) {
    // - [ ] Vue3 Composition API
    // - [x] ...
    const m = line.match(/^\s*-\s*\[[ xX]\]\s+(.+?)\s*$/);
    if (m) out.push(m[1].trim());
  }
  return uniq(out).filter(Boolean);
}

function seedKeywords(keywords, items, weight) {
  for (const raw of items) {
    const token = /[A-Za-z]/.test(raw) && !isChineseToken(raw) ? normalizeAsciiToken(raw) : raw;
    if (!token) continue;
    keywords.set(token, (keywords.get(token) || 0) + weight);
  }
}

function extractKeywordsFromResume(resumeText) {
  const keywords = new Map();

  // 0) Checklist skills are the most explicit signal
  seedKeywords(keywords, extractChecklistKeywords(resumeText), 200);

  // 1) Inline-code tokens are usually high-signal
  seedKeywords(keywords, extractInlineCodeTokens(resumeText), 60);

  // 2) Curated Chinese + mixed tokens that often appear in简历但不会被上面正则稳定抓到
  const curated = [
    '性能优化',
    '首屏',
    '白屏',
    '骨架屏',
    '监控',
    '埋点',
    '灰度',
    '回滚',
    '缓存',
    '协商缓存',
    '强缓存',
    'CDN',
    '低代码',
    '微前端',
    '虚拟滚动',
    '大屏',
    '报表',
    '定时任务',
    '导出',
    '权限',
    '工作流',
    '工单',
    '稳定性',
    '容灾',
    '压缩',
    '字体',
    '子集化',
    'Tree Shaking',
    'tree-shaking',
    'Webpack',
    'Vite',
    'Rollup',
    'qiankun',
    'Vue',
    'Vue3',
    'Pinia',
    'React',
    'Hooks',
    'TypeScript',
    'NestJS',
    'MongoDB',
    'Mongoose',
    'WebSocket',
    'ECharts',
    'PPT',
    'PDF',
    'DOCX',
    'puppeteer',
    'LCP',
    'FCP',
    'CLS',
    'TTI',
    'INP',
    'preload',
    'prefetch',
    'Brotli',
    'gzip',
    'WebP',
    'SSR',
    'SSG',
    'Schema',
    'JSON Schema',
  ];
  for (const t of curated) {
    const key = /[A-Za-z]/.test(t) && !isChineseToken(t) ? normalizeAsciiToken(t) : t;
    keywords.set(key, (keywords.get(key) || 0) + 999);
  }

  // 2.5) A small allowlist of generic-but-relevant tokens.
  // Avoid pulling in broad tokens like "javascript" which would match almost everything.
  const allowlist = [
    'http',
    'https',
    'tcp',
    'udp',
    'tls',
    'node',
    'typescript',
    'webpack',
    'vite',
    'rollup',
    'react',
    'vue',
    'qiankun',
    'docker',
    'eslint',
    'prettier',
    'commitlint',
    'mongodb',
    'mongoose',
    'websocket',
    'echarts',
    'schema',
  ];
  for (const a of allowlist) keywords.set(a, (keywords.get(a) || 0) + 40);

  // 3) Derived/synonyms to improve matching
  const derived = [];
  const rawKeys = [...keywords.keys()];
  for (const k of rawKeys) {
    const kl = isChineseToken(k) ? k : String(k).toLowerCase();
    if (kl === 'vue3') derived.push('vue');
    if (kl === 'pinia') derived.push('vue');
    if (kl === 'nestjs') derived.push('node');
    if (kl === 'mongoose') derived.push('mongo');
    if (kl === 'mongodb') derived.push('mongo');
    if (kl === 'websocket') derived.push('socket');
    if (kl === 'webpack') derived.push('bundle');
    if (kl === 'rollup') derived.push('tree');
    if (kl === 'lcp' || kl === 'cls' || kl === 'fcp' || kl === 'tti' || kl === 'inp') derived.push('性能');
    if (kl === 'tls') derived.push('https');
  }
  for (const d of uniq(derived)) {
    const key = /[A-Za-z]/.test(d) && !isChineseToken(d) ? normalizeAsciiToken(d) : d;
    keywords.set(key, (keywords.get(key) || 0) + 20);
  }

  // Final set includes curated Chinese tokens + all ascii seeds.
  const final = new Set();
  for (const [k] of keywords.entries()) {
    if (isChineseToken(k)) final.add(k);
    else final.add(k);
  }

  return final;
}

function normalizeTitleForDedup(title) {
  let s = String(title || '').trim();
  if (!s) return s;
  // Remove TOC numeric prefixes like "壹.5.2 ", "肆.1.1 ", "零.1.6 ", "贰.1.5 "
  s = s.replace(/^(零|壹|贰|叁|肆|伍|陆|柒|捌|玖|拾)\.[0-9.]+\s+/g, '');
  // Remove arabic numeric prefixes like "1.2.3 "
  s = s.replace(/^[0-9]+(\.[0-9]+)*\s+/g, '');
  // Normalize punctuation/spacing
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

async function walk(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === '.git' || ent.name === 'node_modules') continue;
      out.push(...(await walk(full)));
    } else {
      out.push(full);
    }
  }
  return out;
}

function isCandidateQuestionLine(line) {
  const s = stripUrlsAndLinkTargets(line).trim();
  if (!s) return false;
  if (s.startsWith('```') || s.startsWith('<!--') || s.startsWith('{%')) return false;

  const isHeading = s.startsWith('#');
  const isList = /^\s*(-|\*|\d+\.)\s+/.test(s);

  const looksLikeQ =
    /[?？]/.test(s) ||
    /^(\s*(Q|问|题)\d*[:：]?\s*)/i.test(s) ||
    /^(\s*(为什么|如何|怎么|是否|能否|哪些|区别|原理|机制|优缺点|对比))/i.test(s);

  // Avoid super long paragraphs
  if (s.length > 260) return false;

  // In content files we still prefer question-like lines,
  // but allow some short heading/list titles without question marks.
  if (looksLikeQ) return true;
  if ((isHeading || isList) && s.length <= 80) return true;
  return false;
}

function stripUrlsAndLinkTargets(input) {
  // Keep markdown link text, drop URL target: [text](url) -> text
  let s = input.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
  // Drop bare URLs
  s = s.replace(/https?:\/\/\S+/g, '');
  return s;
}

function scoreLineByKeywords(line, keywords) {
  const s = stripUrlsAndLinkTargets(line).trim();
  let score = 0;
  for (const kw of keywords) {
    if (isChineseToken(kw)) {
      if (s.includes(kw)) score += 2;
    } else {
      if (s.toLowerCase().includes(kw)) score += 1;
    }
  }
  return score;
}

function classify(lineLower) {
  const s = lineLower;
  if (s.includes('http') || s.includes('https') || s.includes('tls') || s.includes('tcp') || s.includes('udp')) {
    return '网络与协议（HTTP/TLS/TCP）';
  }
  if (s.includes('webpack') || s.includes('rollup') || s.includes('tree') || s.includes('bundle')) {
    return '构建与打包（Webpack/Rollup/Tree Shaking）';
  }
  if (s.includes('react') || s.includes('vue') || s.includes('hooks')) {
    return '框架（React/Vue）';
  }
  if (s.includes('reflow') || s.includes('repaint') || s.includes('v8') || s.includes('dom') || s.includes('shadow dom')) {
    return '浏览器与渲染（DOM/V8/重排重绘）';
  }
  if (s.includes('xss') || s.includes('csrf')) {
    return '安全（XSS/CSRF）';
  }
  if (s.includes('性能') || s.includes('lcp') || s.includes('cls') || s.includes('fcp') || s.includes('tti') || s.includes('inp')) {
    return '性能（指标/体验）';
  }
  return '其他（与你简历关键词匹配）';
}

function toWorkspaceRelative(p) {
  const rel = path.relative(workspaceRoot, p);
  return rel.split(path.sep).join('/');
}

function stripCodeFences(markdownText) {
  const lines = markdownText.split(/\r?\n/);
  const out = [];
  let inFence = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('```')) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    out.push(line);
  }
  return out.join('\n');
}

function extractOutlineFromMarkdown(markdownText, { maxItems = 14 } = {}) {
  const text = stripCodeFences(markdownText);
  const lines = text.split(/\r?\n/);
  const items = [];

  const looksLikeQuestion = (s) => {
    if (!s) return false;
    if (/[?？]/.test(s)) return true;
    if (/^(\s*(Q|问|题)\d*[:：]?\s*)/i.test(s)) return true;
    if (/^(\s*(为什么|如何|怎么|是否|能否|哪些|区别|原理|机制|优缺点|对比))/i.test(s)) return true;
    return false;
  };

  for (const raw of lines) {
    const line = stripUrlsAndLinkTargets(raw).trim();
    if (!line) continue;
    if (line.startsWith('<!--')) continue;
    if (/^!\[/.test(line)) continue; // image
    if (line.startsWith('>')) continue; // blockquote

    // Prefer headings
    const hm = line.match(/^(#{1,4})\s+(.+)$/);
    if (hm) {
      const level = hm[1].length;
      const title = hm[2].trim();
      if (!title) continue;
      // Drop obvious navigation/boilerplate headings
      if (/^(目录|Table of contents|参考|References|后记|附录)/i.test(title)) continue;
      items.push(`${'  '.repeat(Math.max(0, level - 1))}${title}`);
    } else {
      // Only include true question lines (avoid copying ordinary content)
      const strippedList = line.replace(/^(-|\*|\d+\.)\s+/, '').trim();
      if (!looksLikeQuestion(strippedList)) continue;
      if (strippedList.length > 120) continue;
      items.push(strippedList);
    }

    if (items.length >= maxItems) break;
  }

  // De-dup outline lines while preserving order
  const seen = new Set();
  const uniqItems = [];
  for (const it of items) {
    const key = it.replace(/\s+/g, ' ').trim();
    if (seen.has(key)) continue;
    seen.add(key);
    uniqItems.push(it);
  }

  return uniqItems;
}

function parseArgs(argv) {
  const args = {
    inline: 'outline', // 'outline' | 'full'
    maxOutlineItems: 14,
  };

  for (const raw of argv.slice(2)) {
    if (raw === '--full') args.inline = 'full';
    else if (raw.startsWith('--inline=')) args.inline = raw.slice('--inline='.length);
    else if (raw.startsWith('--maxOutlineItems=')) {
      const n = Number(raw.slice('--maxOutlineItems='.length));
      if (Number.isFinite(n) && n > 0) args.maxOutlineItems = n;
    }
  }

  if (args.inline !== 'outline' && args.inline !== 'full') args.inline = 'outline';
  return args;
}

function parseTocEntries(markdownText) {
  const lines = markdownText.split(/\r?\n/);
  const entries = [];

  // Supports:
  // - * [Title](path)
  // -   * [Title](path)
  // - * plain text title?
  const linkRe = /^\s*[*-]\s*\[([^\]]+?)\]\(([^)]+?)\)\s*$/;
  const listTextRe = /^\s*[*-]\s*(.+?)\s*$/;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    if (!raw.trim()) continue;
    const m = raw.match(linkRe);
    if (m) {
      const title = stripUrlsAndLinkTargets(m[1]).trim();
      const target = m[2].trim();
      entries.push({
        title,
        target,
        tocLineNumber: i + 1,
        raw: raw.trim(),
      });
      continue;
    }

    // Some TOC items are plain text (no link) but still questions.
    const t = raw.match(listTextRe);
    if (t) {
      const title = stripUrlsAndLinkTargets(t[1]).trim();
      if (!title) continue;
      // Heuristic: keep only question-like plain text items
      if (!/[?？]/.test(title) && !/^(为什么|如何|怎么|是否|能否|哪些|区别|原理|机制)/.test(title)) continue;
      entries.push({
        title,
        target: null,
        tocLineNumber: i + 1,
        raw: raw.trim(),
      });
    }
  }

  return entries;
}

function classifyByTarget(target, titleLower) {
  const t = target || '';
  if (t.startsWith('1/')) {
    if (titleLower.includes('http') || titleLower.includes('https') || titleLower.includes('tls') || titleLower.includes('tcp') || titleLower.includes('udp')) {
      return '网络与协议（HTTP/TLS/TCP）';
    }
    if (titleLower.includes('xss') || titleLower.includes('csrf')) {
      return '安全（XSS/CSRF）';
    }
    if (titleLower.includes('v8') || titleLower.includes('dom') || titleLower.includes('shadow') || titleLower.includes('reflow') || titleLower.includes('repaint')) {
      return '浏览器与渲染（DOM/V8/重排重绘）';
    }
    return 'JavaScript/浏览器基础';
  }
  if (t.startsWith('3/')) return '框架（React/Vue）';
  if (t.startsWith('4/')) return '构建与工具（Webpack/工程化）';
  if (t.startsWith('5/') || t.startsWith('6/') || t.startsWith('7/')) return '设计与范式（SOLID/设计模式）';
  if (t.startsWith('2/')) return '算法与数据结构';
  if (t.startsWith('0/')) return '面试准备/软技能';
  return '其他';
}

async function main() {
  const args = parseArgs(process.argv);

  // Guard
  try {
    await fs.access(FHMI_ROOT);
  } catch {
    throw new Error(`找不到仓库目录：${FHMI_ROOT}`);
  }

  const resumeText = await fs.readFile(RESUME_PATH, 'utf8');
  const keywords = extractKeywordsFromResume(resumeText);

  // Primary source of "original questions" is the TOC (SUMMARY).
  const summaryPath = path.join(FHMI_ROOT, 'SUMMARY.md');
  const summaryText = await fs.readFile(summaryPath, 'utf8');
  const tocEntries = parseTocEntries(summaryText);

  // Dedup by (title + target)
  const uniqKey = (e) => `${e.title}@@${e.target || ''}`;
  const uniqToc = new Map();
  for (const e of tocEntries) {
    if (!e.title) continue;
    if (!uniqToc.has(uniqKey(e))) uniqToc.set(uniqKey(e), e);
  }

  const hits = [];
  for (const e of uniqToc.values()) {
    const title = e.title.trim();
    const titleScore = scoreLineByKeywords(title, keywords);

    // If title doesn't match, allow file-content match (useful when标题偏概念而简历关键词在正文里出现)
    // but keep it scoped to chapters likely relevant to your resume.
    let contentScore = 0;
    let targetFileAbs = null;
    if (e.target && !/^https?:\/\//.test(e.target)) {
      targetFileAbs = path.resolve(FHMI_ROOT, e.target);
      const targetPrefix = e.target.split('/')[0];
      const allowContentMatch =
        titleScore > 0 ||
        e.target.startsWith('1/1.4') ||
        e.target.startsWith('1/1.5') ||
        targetPrefix === '3' ||
        targetPrefix === '4';
      if (allowContentMatch) {
        try {
          const body = await fs.readFile(targetFileAbs, 'utf8');
          // Only score the first ~200 lines to keep it fast and question-focused
          const head = body.split(/\r?\n/).slice(0, 220).join('\n');
          contentScore = scoreLineByKeywords(head, keywords);
        } catch {
          // ignore missing
        }
      }
    }

    const score = Math.max(titleScore * 2, contentScore);
    if (score <= 0) continue;

    hits.push({
      file: targetFileAbs || summaryPath,
      lineNumber: e.tocLineNumber,
      text: title,
      score,
      target: e.target,
    });
  }

  // De-dup by normalized text (keep best-scored instance)
  const bestByText = new Map();
  for (const h of hits) {
    const norm = normalizeTitleForDedup(
      h.text
        .replace(/^[\[【(（]?\s*/, '')
        .replace(/[\]】)）]?\s*$/, '')
        .trim(),
    );
    const prev = bestByText.get(norm);
    if (!prev || h.score > prev.score) bestByText.set(norm, h);
  }

  const unique = [...bestByText.values()].sort((a, b) => b.score - a.score);

  // Group
  const groups = new Map();
  for (const h of unique) {
    const grp = classifyByTarget(h.target, h.text.toLowerCase());
    if (!groups.has(grp)) groups.set(grp, []);
    groups.get(grp).push(h);
  }

  const orderedGroupNames = [
    '网络与协议（HTTP/TLS/TCP）',
    '构建与工具（Webpack/工程化）',
    '框架（React/Vue）',
    '浏览器与渲染（DOM/V8/重排重绘）',
    '安全（XSS/CSRF）',
    'JavaScript/浏览器基础',
    '设计与范式（SOLID/设计模式）',
    '算法与数据结构',
    '面试准备/软技能',
    '其他',
  ];

  let out = '';
  out += '# frontend-hard-mode-interview 原题提取（基于简历）\n\n';
  out += '> 生成方式：以 `.tmp/frontend-hard-mode-interview/SUMMARY.md`（目录原题/标题）为数据源，再用你的简历题库文件中的关键词做匹配筛选。\n';
  out += '> 输出内容包含源文件完整原文。\n\n';

  out += `- 源仓库目录：.tmp/frontend-hard-mode-interview\n`;
  out += `- 关键词来源：docs/job-description/高级前端面试题-基于简历.md\n`;
  out += `- 命中条数：${unique.length}\n\n`;

  for (const name of orderedGroupNames) {
    const items = groups.get(name) || [];
    if (items.length === 0) continue;
    out += `## ${name}\n\n`;

    const top = items.slice(0, 80);
    for (const it of top) {
      const rel = it.target ? toWorkspaceRelative(path.resolve(FHMI_ROOT, it.target)) : toWorkspaceRelative(it.file);
      out += `- ${it.text}\n`;
      out += `  - 来源：${`[${rel}](${rel})`}\n`;

      // Inline content: always embed full source markdown (user requested)
      if (it.target) {
        try {
          const sourceText = await fs.readFile(path.resolve(FHMI_ROOT, it.target), 'utf8');
          out += `\n---\n\n`;
          out += sourceText.replace(/\r?\n/g, '\n');
          if (!sourceText.endsWith('\n')) out += '\n';
          out += '\n';
        } catch {
          // ignore
        }
      }
    }

    if (items.length > top.length) {
      out += `\n> 该分类仅展示前 ${top.length} 条，剩余 ${items.length - top.length} 条可按需再展开。\n\n`;
    } else {
      out += '\n';
    }
  }

  await fs.mkdir(path.dirname(OUT_PATH), { recursive: true });
  await fs.writeFile(OUT_PATH, out, 'utf8');

  console.log(`Wrote: ${toWorkspaceRelative(OUT_PATH)} (items=${unique.length})`);
}

main().catch((err) => {
  console.error(err?.stack || String(err));
  process.exitCode = 1;
});
