/**
 * Intenção de busca na web em PT / EN / ES: verbos, frases com web/internet,
 * fontes ou informação atual.
 */
export enum WebSearchIntent {
  MinTextLength = 3,
}

export const WEB_SEARCH_INTENT_PATTERNS: readonly RegExp[] = [
  // Português
  /\b(pesquise|pesquisa|pesquisar|busque|buscar|procure|procurar)\b/i,
  /\b(na internet|na web|no google|em fontes|fontes confi[aá]veis|dados atualizados|informa[cç][oõ]es?\s+(atualizadas|recentes))\b/i,
  /\b(ultimas?\s+not[ií]cias|not[ií]cias\s+de\s+hoje)\b/i,
  // English
  /\b(search|search\s+for|look\s+up|google|browse\s+the\s+web|web\s+search|search\s+online|online\s+search)\b/i,
  /\b(on\s+the\s+web|on\s+the\s+internet|from\s+the\s+web|cite\s+sources|reliable\s+sources)\b/i,
  /\b(current\s+information|latest\s+news|up[\s-]to[\s-]date|what\s+('s|is)\s+the\s+latest)\b/i,
  // Español
  /\b(busca|buscar|busque|investiga|investigar|b[uú]squeda|googlear|googlea)\b/i,
  /\b(en\s+internet|en\s+la\s+web|en\s+google|fuentes\s+confiables|informaci[oó]n\s+actual)\b/i,
  /\b([uú]ltimas?\s+noticias|noticias\s+de\s+hoy)\b/i,
  // Multilíngue curto
  /\b(web\s+search|busca\s+web|pesquisa\s+web)\b/i,
];
