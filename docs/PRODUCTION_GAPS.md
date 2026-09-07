# Production Gaps — AutoHub360 Platform V1

Registro central de tudo que está **pendente no mundo real** e **não deve ser inventado** no
código. Nada aqui é fabricado na plataforma; cada item bloqueia uma capacidade de produção.

## 1. Pagamentos (bloqueia checkout real)
| Item | Mercado | Impacto |
|---|---|---|
| Contratação de PSP (ex.: Mercado Pago / Pagar.me / Asaas / Stripe) com credenciais reais | BR | Checkout em modo **demonstração**; nenhum valor é cobrado |
| `PAYMENT_PROVIDER`, `PAYMENT_SECRET_KEY`, `PAYMENT_WEBHOOK_SECRET` em produção | BR/EU | Webhook sem verificação real de assinatura (adapter demo) |
| Adapters reais (Pix QR dinâmico, tokenização de cartão, estorno) | BR/EU | `DemoPaymentAdapter` responde pendente |

> Regra ativa no código: selos de pagamento só são anunciados como habilitados com provedor
> configurado; sem provedor, exibem aviso de prévia.

## 2. Supabase (bloqueia persistência real)
| Item | Impacto |
|---|---|
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` não configurada | Apps operam com catálogo embutido (seed) — browse/checkout funcionam, nada persiste |
| `SUPABASE_SERVICE_ROLE_KEY` não configurada (server) | Pedidos/agendamentos/leads não gravam no banco (resposta demo determinística) |
| Aplicar `supabase/migrations/*.sql` + `supabase/seed/seed.sql` no projeto `eivqvrfsreaopzlvhadu` | Banco ainda vazio por design — migrations prontas para `supabase db push` |

## 3. Logística / Fiscal
| Item | Mercado | Impacto |
|---|---|---|
| Contrato Correios / agregador (Melhor Envio, Frenet…) + `SHIPPING_API_KEY` | BR | Cotações de frete são determinísticas (demo) |
| Endereço completo do ponto de retirada em Anápolis + horários | BR | Retirada exibida apenas como cidade/região |
| Emissão de documentos fiscais (NF-e/NFS-e) — contador + certificado + integração | BR | Comprovantes são apenas e-mail; nada fiscal emitido |
| Transportadores/condições da Europa | EU | Checkout EU desativado até conclusão |

## 4. Jurídico — Brasil
| Item | Impacto |
|---|---|
| E-mail: caixas postais dos aliases (@autohub360.tech / @autohub360.store) não confirmadas | Formulários mencionam aliases; DNS/provedor de e-mail pendente |
| Adesão ao Consumidor.gov.br | Canal exibe apenas nota informativa (sem integração falsa) |
| Telefone fixo/SAC dedicado (além do WhatsApp fornecido) | — |

## 5. Jurídico — Europa / França (bloqueia operação EU)
| Item | Impacto |
|---|---|
| Sede social da Auto Lux Europe SAS (endereço completo) | `Mentions légales` marcado como pendente |
| Capital social e diretor de publicação | `Mentions légales` pendente |
| Médiateur de consommation designado/contratado | CGV EU pendente — bloqueador de produção |
| Meios de pagamento e transportadores UE | Checkout EU desativado em código (`checkoutEnabled: false`) |
| Política de cookies/consentimento revisada por jurídico EU | Componente existe; textos definitivos pendentes |

> Regra: **nenhum** desses dados foi inventado. A marca EU aparece como "operada por Auto Lux
> Europe SAS" com SIREN/RCS/TVA fornecidos; todo o resto fica `[PENDENTE]`.
> Livro de Reclamações Eletrônico (PT): não exibido — feature flag de mercado futura, só se
> houver operação registrada em Portugal.

## 6. Serviço local — Generoso Auto Center
| Item | Impacto |
|---|---|
| Endereço completo da oficina, horários e telefone próprio | Landing pages mostram apenas "Anápolis - GO" + agendamento via WhatsApp/pedido |
| CNPJ do parceiro (se aplicável em material conjunto) | Não inventado |

## 7. Marketing / Analytics
| Item | Impacto |
|---|---|
| `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_TIKTOK_PIXEL_ID` | Loaders prontos e consent-gated, mas inativos sem IDs |
| Handles sociais confirmados (Instagram/Facebook/YouTube atuais são placeholders centralizados em config) | Rodapé e /go podem exibir links incorretos até confirmação |
| Contas Vercel + domínios conectados | Ver `docs/VERCEL_DEPLOYMENT.md` |

## 8. Catálogo real
| Item | Impacto |
|---|---|
| 53 SKUs demo com nomes/marcas genéricas (NeonDrive, VisionOne…) | Vitrine realista porém fictícia — substituir por fornecedores reais |
| Fotos reais de produto | UI usa placeholders SVG consistentes por categoria |
| EANs reais, dimensões volumétricas reais | Campos prontos no schema |

## 9. Infraestrutura
| Item | Impacto |
|---|---|
| Token GitHub sem escopo `workflow` | Workflow de CI (`.github/workflows/ci.yml`) não pôde ser versionado no push — arquivo pronto para commit manual por quem tiver permissão (conteúdo documentado no relatório de entrega) |
| Item | Impacto |
|---|---|
| Rate limit em memória por instância | Trocar por Upstash/Redis em produção multi-instância |
| Service worker: estratégia simples cache-first | Revisar após padrões de uso reais |
