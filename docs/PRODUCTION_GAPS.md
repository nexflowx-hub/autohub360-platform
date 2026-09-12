# Production Gaps — AutoHub360 Platform V1

Registro central de tudo que está **pendente no mundo real** e **não deve ser inventado** no
código. Nada aqui é fabricado na plataforma; cada item bloqueia uma capacidade de produção.

## 1. Pagamentos (bloqueia checkout real)
| Item | Mercado | Impacto |
|---|---|---|
| Contratação de PSP (ex.: Mercado Pago / Pagar.me / Asaas / Stripe) com credenciais reais | BR | Nenhum pagamento real deve ser capturado até a ativação |
| `PAYMENT_PROVIDER`, `PAYMENT_SECRET_KEY`, `PAYMENT_WEBHOOK_SECRET` em produção | BR/EU | Webhook sem verificação real de assinatura (adapter demo) |
| Adapters reais (Pix QR dinâmico, tokenização de cartão, estorno) | BR/EU | `DemoPaymentAdapter` responde pendente |

> Regra ativa no código: métodos de pagamento só são anunciados publicamente quando existe
> provedor configurado. Sem PSP ativo, a UI informa de forma neutra que as opções serão exibidas
> no checkout após a ativação.

## 2. Supabase (bloqueia persistência real)
| Item | Impacto |
|---|---|
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` não configurada | Apps operam com catálogo embutido (seed) — browse/checkout funcionam, nada persiste |
| `SUPABASE_SERVICE_ROLE_KEY` não configurada (server) | Pedidos/agendamentos/leads não gravam no banco (resposta demo determinística) |
| Aplicar `supabase/migrations/*.sql` + `supabase/seed/seed.sql` no projeto `eivqvrfsreaopzlvhadu` | Banco ainda vazio por design — migrations prontas para `supabase db push` |

## 3. Logística / Fiscal
| Item | Mercado | Impacto |
|---|---|---|
| Contrato Correios / agregador (Melhor Envio, Frenet…) + `SHIPPING_API_KEY` | BR | Cotações de frete permanecem determinísticas até integração real |
| Horários operacionais definitivos para loja/retirada | BR | Endereço está confirmado; horários devem ser publicados quando definidos |
| Emissão de documentos fiscais (NF-e/NFS-e) — contador + certificado + integração | BR | Comprovantes são apenas e-mail; integração fiscal ainda pendente |
| Transportadores/condições da Europa | EU | Checkout EU desativado até conclusão |

### Loja e endereço comercial confirmados — Brasil

**AutoHub360 Brasil**  
69.093.616 MICAELA GOMES DE JESUS · CNPJ 69.093.616/0001-50  
Avenida João Florentino, 9 - Q4 · Residencial Araguaia  
Anápolis - GO · CEP 75071-430 · Brasil

O endereço acima é a loja e o endereço comercial da operação brasileira. Não deve existir
referência pública a endereço anterior como matriz, sede ou ponto de venda.

## 4. Jurídico — Brasil
| Item | Impacto |
|---|---|
| E-mail: caixas postais dos aliases (@autohub360.tech / @autohub360.store) não confirmadas | Formulários mencionam aliases; DNS/provedor de e-mail pendente |
| Adesão ao Consumidor.gov.br | Canal exibe apenas nota informativa (sem integração falsa) |
| Telefone fixo/SAC dedicado (além do WhatsApp fornecido) | Opcional; WhatsApp permanece canal publicado |

## 5. Jurídico — Europa / França (bloqueia operação EU)
| Item | Impacto |
|---|---|
| Sede social da Auto Lux Europe SAS (endereço completo) | `Mentions légales` marcado como pendente |
| Capital social e diretor de publicação | `Mentions légales` pendente |
| Médiateur de consommation designado/contratado | CGV EU pendente — bloqueador de produção |
| Meios de pagamento e transportadores UE | Checkout EU desativado em código (`checkoutEnabled: false`) |
| Política de cookies/consentimento revisada por jurídico EU | Componente existe; textos definitivos pendentes |

> Regra: **nenhum** desses dados foi inventado. A marca EU aparece como "operada por Auto Lux
> Europe SAS" com SIREN/RCS/TVA fornecidos; a operação europeia é apresentada como independente
> das vendas da AutoHub360 Brasil. O checkout EU permanece desativado até a conclusão dos dados
> jurídicos, logísticos e de pagamento.

## 6. Serviço local — Generoso Auto Center
| Item | Impacto |
|---|---|
| Horários e telefone próprio do parceiro, se forem publicados | Agendamento permanece centralizado pelos canais AutoHub360 enquanto não confirmados |
| CNPJ do parceiro (se aplicável em material conjunto) | Não inventado |

## 7. Marketing / Analytics
| Item | Impacto |
|---|---|
| `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_TIKTOK_PIXEL_ID` | Loaders prontos e consent-gated, mas inativos sem IDs |
| YouTube/TikTok não confirmados | Permanecem ocultos até confirmação |
| Contas Vercel + domínios conectados | Ver `docs/VERCEL_DEPLOYMENT.md` |

Redes confirmadas em 2026-09-12:
- Instagram: **@autohub360.tech**
- Facebook: **@autohub360.tech**

## 8. Catálogo real / underwriting
| Item | Impacto |
|---|---|
| 53 SKUs seed com nomes/marcas genéricas (NeonDrive, VisionOne…) | Substituir progressivamente por produtos e fornecedores reais antes de escalar aquisição |
| Fotos reais de produto | UI ainda usa placeholders/ilustrações por categoria |
| EANs reais, dimensões volumétricas reais | Campos prontos no schema |
| Estoque, garantia contratual e disponibilidade comercial reais | Confirmar por SKU antes de anunciar como fato |

### Regra pública de underwriting

Enquanto os dados comerciais não forem comprovados, a UI **não deve** publicar:
- ratings ou quantidade de avaliações;
- selo "Mais vendido" ou alegações de preferência de clientes;
- `AggregateRating` em dados estruturados;
- parcelamento ou juros específicos sem PSP ativo;
- estoque "pronto para envio" baseado apenas no seed;
- prazo de garantia contratual baseado apenas no seed.

Esses campos podem permanecer internamente no modelo de catálogo para migração futura, mas só
devem voltar à apresentação pública quando sustentados por dados reais.

## 9. Infraestrutura
| Item | Impacto |
|---|---|
| Rate limit em memória por instância | Trocar por Upstash/Redis em produção multi-instância |
| Service worker: estratégia simples cache-first | Revisar após padrões de uso reais |
