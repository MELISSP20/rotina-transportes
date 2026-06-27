# Política de Segurança · Assignments

Site interno de operação Mercado Livre — Last Mile SSP·20 + SSP·51.

## Escopo

- Site 100% client-side hospedado no GitHub Pages
- Dados processados localmente no navegador do usuário
- Sincronização opcional via Firebase Realtime Database (REST)
- Nenhuma informação de cliente final, motorista ou pacote é transmitida ou armazenada

## Reportar vulnerabilidades

Em caso de identificar problema de segurança neste site, **não abra issue pública**.
Reporte diretamente para o administrador do repositório.

## Boas práticas adotadas

- Headers de segurança via meta tags (CSP, X-Frame-Options, Referrer-Policy)
- Robots: `noindex,nofollow` em todas as páginas + `robots.txt`
- HTTPS forçado via GitHub Pages
- Sanitização de nomes de arquivos importados pelo usuário (escape HTML)
- Senha de área restrita armazenada como hash SHA-256 (não em texto puro)

## Pontos de atenção pendentes

- [ ] Regras do Firebase Realtime DB devem restringir leitura/escrita
- [ ] Repositório pode ser tornado privado se necessário
- [ ] Tokens de API devem ser revogados periodicamente

## Histórico

- 2026-06-27: Auditoria inicial e correções de segurança aplicadas
