# **Product & Campaign Knowledge: FoccusBR Plataformas Elevatórias**

**Propósito:** Este documento fornece ao Video Agent e Image Agent todos os detalhes de produto, selling points, referências de visual assets e direção criativa de campanha necessários para geração de ads e conteúdo.

---

## **1. Visão Geral do Produto**

| Atributo | Detalhes |
| ----- | ----- |
| **Nome do Produto** | FoccusBR Plataformas Elevatórias |
| **Formato** | Venda nacional + Locação regional (Piracicaba/SP e região) |
| **Público-Alvo** | Indústrias, construtoras, empresas de eventos e montagem, locadores, revendedores |
| **Posicionamento** | Especialista em plataformas elevatórias com 21 anos de experiência — do varejo à frota |

---

## **2. Produtos e Features**

### **Produto Principal: Venda Nacional de Plataformas Elevatórias**

| Feature | Descrição |
| ----- | ----- |
| **Tesoura Elétrica** | Ideal para espaços internos — galpões, indústrias, obras cobertas. Altura de trabalho de 6 a 14m |
| **Articulada** | Alcance em locais de difícil acesso — obra externa, postes, fachadas |
| **Telescópica** | Grande altura de trabalho — torres, galpões industriais de grande porte |
| **Sobre Caminhão** | Mobilidade total — telecomunicações, energia elétrica, poda urbana |
| **Sobre Reboque** | Versátil e portátil — eventos, manutenção de médio porte |
| **Aranha/Spider** | Acesso em espaços impossíveis — museus, igrejas, locais sensíveis |
| **Frotas Fechadas** | Negociação de volume — locadores que querem vender estoque ou renovar frota |
| **MERCOSUL** | Compra e venda em todo o Cone Sul — expertise em comércio regional |

### **Produto Secundário: Locação em Piracicaba e Região**

| Feature | Descrição |
| ----- | ----- |
| **22 unidades próprias** | Estoque real disponível — sem intermediário, sem espera |
| **Tesoura Elétrica 6 a 14m** | Equipamentos para espaços internos — indústria, construção, manutenção |
| **Disponibilidade imediata** | Consulte o estoque disponível agora — entrega na região |
| **Atendimento local** | Base em Piracicaba — relacionamento direto, sem call center |

**Dica de escrita para agents:** Lidere com a especificação técnica e o número real, não com a feature abstrata.

* ✅ "22 plataformas tesoura de 6 a 14 metros disponíveis em Piracicaba. Locação imediata."
* ❌ "Temos um portfólio completo de equipamentos para diversas aplicações."

---

## **3. Key Selling Points**

| Selling Point | Ângulo |
| ----- | ----- |
| **21 anos de experiência** | Maurício Bonfiglio conhece o mercado por dentro — pequena, média e grande empresa, nacional e internacional |
| **Estoque próprio em Piracicaba** | 22 unidades reais — não é intermediário, não é catálogo. O equipamento está disponível agora |
| **Especialidade técnica** | Sabe qual equipamento é o certo para cada aplicação — tesoura vs articulada vs telescópica |
| **Atendimento nacional** | Vendas para todo o Brasil e MERCOSUL — relacionamento construído em Sudeste, Sul e Centro-Oeste |
| **Conteúdo gratuito** | Canal aberto — FoccusBR educa o mercado antes de vender |
| **Depoimentos reais** | Google Meu Negócio com histórico real de clientes atendidos — consulte |

**Ordem de prioridade para campanhas:**

1. Especificação técnica real (22 unidades, 6 a 14m, tesoura elétrica)
2. Experiência e relacionamento (21 anos, Sudeste/Sul/Centro-Oeste)
3. Disponibilidade concreta (estoque em Piracicaba, entrega na região)
4. Expertise de consultoria (qual equipamento para qual aplicação)

---

## **4. Visual Assets**

⚠️ **Video Agent note:** Todos os video ads são renderizados via **Remotion** (React-based video framework). Scenes devem ser construídas de **React components e SVGs** — sem raw footage ou live-action clips.

### **Static Assets (utilizáveis no Remotion via `staticFile()`)**

| Filename | Descrição | Melhor Uso |
| ----- | ----- | ----- |
| `tesoura_operacao.jpg/png` | Foto da tesoura elétrica em operação real | Hero scenes, demonstração de produto |
| `articulada_obra.jpg/png` | Articulada em uso em obra externa | Scenes de comparação tesoura vs articulada |
| `estoque_piracicaba.jpg/png` | Foto do estoque de equipamentos na base | Proof scenes, disponibilidade |
| `foccusbr_logo.png` | Logo FoccusBR com fundo laranja | End cards, watermarks, logo reveals |

**Notas de uso de assets:**

* Fotos reais do estoque e dos equipamentos são os assets mais poderosos — mostram prova real
* Especificações técnicas em SVG sobrepostas nas fotos funcionam muito bem
* Na dúvida, **construa a scene em SVG** ao invés de depender de PNG — SVG escala limpo e cada elemento pode ser animado individualmente

---

## **5. Video Production Constraints (Remotion)**

| Constraint | Regra |
| ----- | ----- |
| **Rendering engine** | React components + SVG only |
| **Sem video footage** | Sem .mp4, sem live-action clips, sem stock video |
| **Sem CSS animations externas** | Toda animação via `useCurrentFrame()` + `interpolate()` |
| **Imagens** | Permitidas via `staticFile()` — fotos reais do equipamento |
| **Tipografia** | Load fonts via `@remotion/google-fonts`: Montserrat (display), Inter (body), Roboto Condensed (specs) |
| **Áudio** | Voiceover técnico opcional via component `<Audio>` do Remotion |
| **Composition sizes** | 1080×1350 (feed 4:5), 1080×1920 (Story/Reel), 1920×1080 (YouTube) |

---

## **6. Motion Style: Industrial Direto (Brand Adapted)**

Todos os video ads seguem um **estilo industrial, direto e técnico**, adaptado à identidade visual da FoccusBR. Pense composições com especificações técnicas em destaque, cortes limpos, e atmosfera de empresa sólida e confiável.

### **Core Style Principles**

| Elemento | Direção |
| ----- | ----- |
| **Estilo de ilustração** | Tipografia como protagonista + foto real do equipamento; SVG shapes mínimas |
| **Paleta de cores** | Laranja industrial (#E85A00), preto técnico (#1A1A1A), branco limpo (#FFFFFF), cinza (#6B6B6B) |
| **Personagens** | Sem personagens ilustrados — o equipamento é o protagonista |
| **Animation feel** | Smooth ease-in-out; especificações aparecem uma por uma com spring sutil |
| **Transições** | Fade, slide ou wipe limpo — nunca hard cuts confusos |
| **Typography motion** | Texto anima per-word ou per-line; nunca aparece estaticamente |
| **Pacing** | Cada scene beat é 2–4 segundos; total ad 15–30 segundos |
| **Especificações** | Sempre em destaque — animam separadamente do corpo de texto |

### **Brand Color Palette para Vídeo**

| Cor | Hex | Uso |
| ----- | ----- | ----- |
| Foccus Orange | `#E85A00` | Backgrounds primários, CTAs, destaques, logo |
| Orange Light | `#FF7A2E` | Accent secundário, hover, elementos de suporte |
| Orange Dark | `#C44A00` | Versão escura, contraste, profundidade |
| Industrial Black | `#1A1A1A` | Backgrounds escuros, texto primário |
| Dark Gray | `#3A3A3A` | Backgrounds secundários escuros |
| Steel Gray | `#6B6B6B` | Labels, metadata, texto secundário |
| Clean White | `#FFFFFF` | Texto sobre fundo laranja ou preto, backgrounds claros |
| Light Gray | `#F2F2F2` | Backgrounds de cards, áreas de destaque |

---

## **7. Video Campaign Concepts**

### **Conceito 1 — "Qual Plataforma é a Certa?"**

**Logline:** Conteúdo educativo que diferencia tesoura de articulada — e posiciona a FoccusBR como especialista. **Duração:** 25 segundos | **Formato:** 1080×1350 (Feed 4:5)

| Scene | Frames (@ 30fps) | Descrição |
| ----- | ----- | ----- |
| **Hook** | 0–50 | Background Laranja; Montserrat Bold anima: "Tesoura ou Articulada?" em branco |
| **Tesoura** | 50–120 | Fundo branco; ícone SVG de tesoura; specs animam: "SOBE RETO · ATÉ 14M · ESPAÇO FECHADO" em Roboto Condensed laranja |
| **Articulada** | 120–190 | Transição slide; ícone SVG de articulada; specs: "ALCANÇA O IMPOSSÍVEL · OBRA EXTERNA · FACHADAS" |
| **FoccusBR** | 190–230 | Fundo Preto; "21 anos de experiência. A gente indica o certo pra você." em branco |
| **CTA** | 230–270 | Fundo Laranja; Montserrat Bold: "Consulte agora." Logo FoccusBR fade in |

* **CTA sugerido:** `Consulte agora.`
* **SVGs necessários:** ícone tesoura, ícone articulada, logo FoccusBR

---

### **Conceito 2 — "22 Unidades Disponíveis"**

**Logline:** Direto ao ponto — estoque real, disponibilidade imediata, Piracicaba. **Duração:** 15 segundos | **Formato:** 1080×1920 (Story/Reel)

| Scene | Frames (@ 30fps) | Descrição |
| ----- | ----- | ----- |
| **Número** | 0–45 | Background Laranja; número "22" em Montserrat ExtraBold branco anima com spring bounce |
| **Especificação** | 45–100 | Specs animam em Roboto Condensed branco: "PLATAFORMAS TESOURA · 6 A 14 METROS · PIRACICABA/SP" |
| **Prova** | 100–140 | Foto real do estoque slide-in; overlay: "ENTREGA IMEDIATA NA REGIÃO" |
| **CTA** | 140–180 | Fundo Preto; "Consulte disponibilidade." + ícone WhatsApp laranja |

* **CTA sugerido:** `Consulte disponibilidade.`
* **SVGs necessários:** número animado, specs overlay, ícone WhatsApp

---

### **Conceito 3 — "21 Anos de Mercado" (Credibilidade)**

**Logline:** Posicionamento de autoridade — Maurício Bonfiglio e a experiência que diferencia a FoccusBR. **Duração:** 30 segundos | **Formato:** 1080×1350 (Feed 4:5)

| Scene | Frames (@ 30fps) | Descrição |
| ----- | ----- | ----- |
| **Hook** | 0–40 | Fundo Preto; Montserrat: "No mercado de plataformas desde 2003." texto em branco, "2003" em laranja |
| **Trajetória** | 40–120 | Timeline SVG horizontal: pequena → média → grande empresa; nomes de segmentos em Roboto Condensed |
| **Hoje** | 120–190 | Fundo Laranja; "FoccusBR Plataformas Elevatórias" em branco; "Piracicaba · Brasil · MERCOSUL" em preto |
| **Prova** | 190–240 | 3 cards SVG animam staggered: "22 unidades próprias" · "Todo território nacional" · "Depoimentos no Google" |
| **CTA** | 240–300 | Fundo Preto; "A experiência que você precisa." Logo laranja fade in |

* **CTA sugerido:** `A experiência que você precisa.`
* **SVGs necessários:** timeline, cards de prova, logo

---

## **8. Campaign Do's & Don'ts**

| ✅ Faça | ❌ Não Faça |
| ----- | ----- |
| Lidere com especificação técnica real (metros, carga, tipo) | Abra com claim genérico tipo "a melhor empresa do setor" |
| Use foto real do equipamento em operação | Use stock photos de banco sem contexto industrial |
| Mencione números concretos: 22 unidades, 21 anos, 6 a 14m | Diga "vários equipamentos disponíveis" sem especificar |
| Use Montserrat Bold para headlines, Roboto Condensed para specs | Misture fontes ou use fontes genéricas (Arial, Calibri) |
| Paleta laranja + preto + branco — sem exceção | Introduza cores frias (azul, verde, roxo) sem aprovação |
| Termine com CTA claro: "Consulte", "Fale com a gente", WhatsApp | Termine sem próximo passo claro para o cliente |
| Tom prático e especialista — como Maurício explicando para o comprador | Tom corporativo vazio ou hype sem substância técnica |
| Fotos do estoque real em Piracicaba | Mockups ou imagens que não refletem o equipamento real |

---

## **9. Estrutura de Persuasão para Ads**

Baseado no perfil FoccusBR — use como template para qualquer ad copy ou voiceover:

```
1. Hook → especificação técnica real ou dado concreto (22 unidades, 14 metros, 21 anos)
2. Contexto de aplicação → onde esse equipamento resolve o problema (obra, galpão, fachada)
3. Diferencial técnico → tesoura vs articulada, elétrica vs diesel, altura vs alcance
4. Prova real → estoque próprio, depoimentos no Google, anos de mercado
5. Disponibilidade → locação em Piracicaba OU venda em todo o Brasil
6. Autoridade → 21 anos, Sudeste/Sul/Centro-Oeste, pequena a grande empresa
7. CTA direto → "Consulte disponibilidade", "Fale no WhatsApp", "Solicite orçamento"
```

---

## **10. Agent Reference Summary**

| Agent | Seções-Chave a Referenciar |
| ----- | ----- |
| **Video Agent (Remotion)** | Production Constraints · Motion Style · Video Campaign Concepts · Do's & Don'ts |
| **Image Agent** | Visual Assets · Product Features · Brand Color Palette · Estrutura de Persuasão |
| **Copy Agent** | Key Selling Points · Estrutura de Persuasão · Tone Calibration (platform_guidelines.md) |
| **Brand Creatives Skill** | FoccusBR Brand Identity · Platform Guidelines |

---

*Última atualização: Abril 2026 · Mantido por: Maurício Bonfiglio · FoccusBR Plataformas Elevatórias*
