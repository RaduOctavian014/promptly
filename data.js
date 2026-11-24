/* Promptly — datele aplicației: texte UI, componente System prompt, secțiuni Prompt, preseturi. */
(function () {
  const I18N = {
    ro: {
      system: 'System prompt', prompt: 'Prompt', components: 'Componente',
      presets: 'Presetări', copy: 'Copiază', copied: 'Copiat', preview: 'Previzualizare',
      plain: 'Simplu', md: 'Markdown', xml: 'XML',
      emptySys: 'Alege componente din listă și promptul apare aici.',
      emptyPrm: 'Completează un câmp și promptul apare aici.',
      emptyMain: 'Bifează din listă componentele de care ai nevoie.',
      chars: 'caractere', tokens: 'tokeni',
      copyLink: 'Copiază linkul', download: 'Descarcă .md', reset: 'Resetează',
      linkCopied: 'Link copiat', resetDone: 'Resetat', presetDone: 'Preset aplicat', undo: 'Anulează',
      addExample: 'Adaugă exemplu', example: 'Exemplu', inLabel: 'Intrare', outLabel: 'Ieșire',
      remove: 'Elimină', variable: 'Variabilă', varName: 'text',
      audience: 'Public', toneWord: 'Ton',
      conflict: 'Se contrazic', and: 'și',
      hintTask: 'Fără task, promptul nu cere nimic. Adaugă unul.',
      hintDone: 'Sugestie: adaugă o condiție de satisfacție, ca modelul să știe când e gata.',
      hintDelivery: 'Sugestie: spune cum vrei să primești rezultatul.',
      menu: 'Meniu', yourPrompt: 'Promptul tău',
      image: 'Diagrame', verify: 'Anti-halucinații',
      emptyImg: 'Descrie ce trebuie să arate vizualul și alege un tip: promptul apare aici.',
      emptyVer: 'Alege fraze din listă și blocul apare aici.',
      prose: 'Proză', list: 'Listă', para: 'Paragraf', copyOne: 'Copiază fraza',
      lbTitle: 'Titlu', lbLabels: 'Etichete exacte, în această ordine', lbData: 'Date de folosit exact',
      lbLayout: 'Structură', lbStyle: 'Stil', lbPalette: 'Paletă', lbBrand: 'culorile brandului',
      lbTextRules: 'Text și lizibilitate', lbRatio: 'Proporții', lbUse: 'Folosire', lbBg: 'Fundal',
      lbDeliv: 'Livrabil', lbAvoid: 'Evită',
      hintImgSubject: 'Spune ce trebuie să arate vizualul și ce decizie susține.',
      hintImgStyle: 'Alege un tip de vizual: flowchart, matrice, grafic, roadmap…',
      hintImgTip: 'Pentru text fără greșeli și editabil în PowerPoint, cere livrabilul ca .pptx, Mermaid sau SVG.',
      hintVerify: 'Lipește blocul la finalul promptului sau în system prompt.',
    },
    en: {
      system: 'System prompt', prompt: 'Prompt', components: 'Components',
      presets: 'Presets', copy: 'Copy', copied: 'Copied', preview: 'Preview',
      plain: 'Plain', md: 'Markdown', xml: 'XML',
      emptySys: 'Pick components from the list and your prompt shows up here.',
      emptyPrm: 'Fill in a field and your prompt shows up here.',
      emptyMain: 'Tick the components you need from the list.',
      chars: 'characters', tokens: 'tokens',
      copyLink: 'Copy link', download: 'Download .md', reset: 'Reset',
      linkCopied: 'Link copied', resetDone: 'Reset', presetDone: 'Preset applied', undo: 'Undo',
      addExample: 'Add example', example: 'Example', inLabel: 'Input', outLabel: 'Output',
      remove: 'Remove', variable: 'Variable', varName: 'text',
      audience: 'Audience', toneWord: 'Tone',
      conflict: 'Conflicting', and: 'and',
      hintTask: 'Without a task the prompt asks for nothing. Add one.',
      hintDone: 'Tip: add a success condition so the model knows when it is done.',
      hintDelivery: 'Tip: say how you want to receive the result.',
      menu: 'Menu', yourPrompt: 'Your prompt',
      image: 'Diagrams', verify: 'Anti-hallucination',
      emptyImg: 'Describe what the visual should show and pick a type: your prompt shows up here.',
      emptyVer: 'Pick phrases from the list and your block shows up here.',
      prose: 'Prose', list: 'List', para: 'Paragraph', copyOne: 'Copy phrase',
      lbTitle: 'Title', lbLabels: 'Exact labels, in this order', lbData: 'Data to use exactly',
      lbLayout: 'Layout', lbStyle: 'Style', lbPalette: 'Palette', lbBrand: 'brand colors',
      lbTextRules: 'Text and legibility', lbRatio: 'Aspect ratio', lbUse: 'Intended use', lbBg: 'Background',
      lbDeliv: 'Deliverable', lbAvoid: 'Avoid',
      hintImgSubject: 'Say what the visual should show and which decision it supports.',
      hintImgStyle: 'Pick a visual type: flowchart, matrix, chart, roadmap…',
      hintImgTip: 'For error-free, editable text in PowerPoint, ask for a .pptx, Mermaid or SVG deliverable.',
      hintVerify: 'Paste the block at the end of your prompt or into the system prompt.',
    },
  };

  /* ---------------------------------------------------------------
     SYSTEM PROMPT
     kind: text | single | multi | lines
  ---------------------------------------------------------------- */
  const SYS_PAGES = [
    {
      id: 'role', tag: 'role', label: { ro: 'Rol și mod', en: 'Role and mode' }, out: { ro: 'Rol', en: 'Role' },
      groups: [
        {
          id: 'role', kind: 'text', key: 'role',
          caption: { ro: 'Cine ești', en: 'Who it is' },
          ph: { ro: 'ex: un inginer software senior', en: 'e.g. a senior software engineer' },
          suggest: {
            ro: ['un asistent util și precis', 'un inginer software senior', 'un editor atent', 'un analist de date', 'un tutore răbdător', 'un partener de brainstorming'],
            en: ['a precise, helpful assistant', 'a senior software engineer', 'a careful editor', 'a data analyst', 'a patient tutor', 'a brainstorming partner'],
          },
        },
        {
          id: 'mode', kind: 'single', caption: { ro: 'Mod de lucru', en: 'Working mode' },
          items: [
            { id: 'coding', label: { ro: 'Cod', en: 'Coding' },
              line: { ro: 'Mod cod: scrie cod corect, idiomatic și minimal. Respectă convențiile codului existent. Nu adăuga funcționalități pe care nu le-am cerut.', en: "Coding mode: write correct, idiomatic, minimal code. Follow the conventions of the existing codebase. Don't add features nobody asked for." } },
            { id: 'research', label: { ro: 'Cercetare', en: 'Research' },
              line: { ro: 'Mod cercetare: separă faptele de interpretări, spune cât de solide sunt dovezile și semnalează ce lipsește sau e contestat.', en: 'Research mode: separate facts from interpretation, say how strong the evidence is, and flag what is missing or contested.' } },
            { id: 'writing', label: { ro: 'Scris', en: 'Writing' },
              line: { ro: 'Mod scris: păstrează vocea autorului, taie surplusul, preferă verbele concrete în locul abstracțiilor.', en: "Writing mode: keep the author's voice, cut excess, prefer concrete verbs over abstractions." } },
            { id: 'brainstorm', label: { ro: 'Brainstorming', en: 'Brainstorming' },
              line: { ro: 'Mod brainstorming: generează multe idei diverse, inclusiv neconvenționale, apoi grupează-le și spune-mi care sunt cele mai promițătoare.', en: 'Brainstorming mode: generate many varied ideas, including unconventional ones, then group them and tell me which are the most promising.' } },
            { id: 'tutor', label: { ro: 'Tutore', en: 'Tutor' },
              line: { ro: 'Mod tutore: explică de la simplu la complex, verifică înțelegerea cu o întrebare scurtă, folosește exemple concrete.', en: 'Tutor mode: explain from simple to complex, check understanding with one short question, use concrete examples.' } },
            { id: 'analysis', label: { ro: 'Analiză', en: 'Analysis' },
              line: { ro: 'Mod analiză: structurează problema, arată cifrele și presupunerile din spatele concluziilor, evidențiază riscurile.', en: 'Analysis mode: structure the problem, show the numbers and assumptions behind conclusions, highlight risks.' } },
          ],
        },
      ],
    },
    {
      id: 'tone', tag: 'tone', label: { ro: 'Ton', en: 'Tone' }, out: { ro: 'Ton', en: 'Tone' },
      groups: [
        {
          id: 'tone', kind: 'multi',
          items: [
            { id: 'blunt', label: { ro: 'Blunt', en: 'Blunt' },
              line: { ro: 'Fii direct și blunt. Spune adevărul clar, fără să-l îndulcești.', en: 'Be direct and blunt. State the truth plainly without softening it.' } },
            { id: 'nofluff', label: { ro: 'Fără bla-bla', en: 'No fluff' },
              line: { ro: 'Fără bla-bla: fără introduceri, fără formule de politețe, fără scuze.', en: 'No fluff: no intros, no pleasantries, no apologies.' } },
            { id: 'concise', label: { ro: 'Concis', en: 'Concise' },
              line: { ro: 'Fii concis: fiecare propoziție trebuie să aducă informație nouă.', en: 'Be concise: every sentence must carry new information.' } },
            { id: 'friendly', label: { ro: 'Prietenos', en: 'Friendly' },
              line: { ro: 'Ton cald și prietenos, ca de la un coleg priceput.', en: 'Warm, friendly tone, like a capable colleague.' } },
            { id: 'skeptical', label: { ro: 'Sceptic', en: 'Skeptical' },
              line: { ro: 'Fii sceptic: pune la îndoială premisele și cere dovezi înainte să accepți o afirmație.', en: 'Be skeptical: question premises and ask for evidence before accepting a claim.' } },
            { id: 'humor', label: { ro: 'Umor sec', en: 'Dry humor' },
              line: { ro: 'Umorul sec e binevenit, atâta timp cât nu strică claritatea.', en: "Dry humor is welcome, as long as it doesn't hurt clarity." } },
            { id: 'expert', label: { ro: 'Nivel expert', en: 'Expert level' },
              line: { ro: 'Presupune că vorbești cu un expert; sari peste noțiunile de bază.', en: "Assume you're talking to an expert; skip the basics." } },
            { id: 'simple', label: { ro: 'Pe înțelesul tuturor', en: 'Plain language' },
              line: { ro: 'Explică simplu, fără jargon; definește termenii tehnici când apar.', en: 'Explain simply, without jargon; define technical terms when they appear.' } },
          ],
        },
        {
          id: 'register', kind: 'single', caption: { ro: 'Registru', en: 'Register' },
          items: [
            { id: 'formal', label: { ro: 'Formal', en: 'Formal' }, line: { ro: 'Registru formal și profesionist.', en: 'Formal, professional register.' } },
            { id: 'casual', label: { ro: 'Casual', en: 'Casual' }, line: { ro: 'Registru relaxat, conversațional.', en: 'Relaxed, conversational register.' } },
          ],
        },
      ],
    },
    {
      id: 'format', tag: 'format', label: { ro: 'Format', en: 'Format' }, out: { ro: 'Format', en: 'Format' },
      groups: [
        {
          id: 'format', kind: 'multi', caption: { ro: 'Structură', en: 'Structure' },
          items: [
            { id: 'nopre', label: { ro: 'Fără preambul', en: 'No preamble' },
              line: { ro: 'Începe direct cu răspunsul. Fără introduceri de tipul „Desigur!” sau „Bună întrebare!”.', en: 'Start directly with the answer. No openers like “Sure!” or “Great question!”.' } },
            { id: 'nosum', label: { ro: 'Fără sumarizare', en: 'No summary' },
              line: { ro: 'Nu încheia cu rezumat, recapitulare sau concluzii care repetă ce ai spus deja.', en: "Don't end with a summary, recap, or conclusion that repeats what you already said." } },
            { id: 'nofollow', label: { ro: 'Fără întrebare la final', en: 'No closing question' },
              line: { ro: 'Nu încheia cu întrebări de tipul „Vrei să…?” și nu oferi ajutor suplimentar.', en: "Don't end with “Would you like…?” questions or offers of further help." } },
            { id: 'answerfirst', label: { ro: 'Concluzia întâi', en: 'Answer first' },
              line: { ro: 'Pune răspunsul sau concluzia în prima propoziție, apoi argumentele.', en: 'Put the answer or conclusion in the first sentence, then the reasoning.' } },
            { id: 'codefirst', label: { ro: 'Cod întâi', en: 'Code first' },
              line: { ro: 'Când răspunsul e cod, dă codul primul și explicația după, scurt.', en: 'When the answer is code, give the code first and a short explanation after.' } },
            { id: 'prose', label: { ro: 'Proză, nu liste', en: 'Prose over lists' },
              line: { ro: 'Preferă paragrafe scurte în locul listelor cu bullet-uri, cu excepția pașilor secvențiali.', en: 'Prefer short paragraphs over bullet lists, except for sequential steps.' } },
            { id: 'tables', label: { ro: 'Tabele la comparații', en: 'Tables for comparisons' },
              line: { ro: 'Folosește tabele când compari trei sau mai multe opțiuni pe mai multe criterii.', en: 'Use tables when comparing three or more options across several criteria.' } },
            { id: 'nomd', label: { ro: 'Fără markdown', en: 'No markdown' },
              line: { ro: 'Nu folosi markdown (fără titluri, bold sau tabele); scrie text simplu. Codul rămâne în blocuri de cod.', en: 'Do not use markdown (no headings, bold, or tables); write plain text. Code stays in code blocks.' } },
            { id: 'techen', label: { ro: 'Termeni tehnici în engleză', en: 'Technical terms in English' },
              line: { ro: 'Păstrează termenii tehnici în engleză; nu-i traduce.', en: "Keep technical terms in English; don't translate them." } },
          ],
        },
        {
          id: 'length', kind: 'single', caption: { ro: 'Lungime', en: 'Length' },
          items: [
            { id: 'short', label: { ro: 'Scurt', en: 'Short' }, line: { ro: 'Lungime implicită: scurtă, 1–3 propoziții, dacă nu cer mai mult.', en: 'Default length: short, 1–3 sentences, unless I ask for more.' } },
            { id: 'medium', label: { ro: 'Echilibrat', en: 'Balanced' }, line: { ro: 'Lungime implicită: cât e necesar, nimic în plus.', en: 'Default length: as long as needed, nothing more.' } },
            { id: 'long', label: { ro: 'Detaliat', en: 'Detailed' }, line: { ro: 'Fii amănunțit: acoperă cazurile limită și explică raționamentul.', en: 'Be thorough: cover edge cases and explain the reasoning.' } },
          ],
        },
        {
          id: 'emoji', kind: 'single', caption: { ro: 'Emoji', en: 'Emoji' },
          items: [
            { id: 'none', label: { ro: 'Fără emoji', en: 'No emoji' }, line: { ro: 'Nu folosi emoji.', en: "Don't use emoji." } },
            { id: 'few', label: { ro: 'Rar', en: 'Sparingly' }, line: { ro: 'Folosește emoji rar, doar când adaugă sens.', en: 'Use emoji sparingly, only when they add meaning.' } },
            { id: 'lots', label: { ro: 'Din plin', en: 'Freely' }, line: { ro: 'Folosește emoji liber, pentru ton și structură.', en: 'Use emoji freely for tone and structure.' } },
          ],
        },
        {
          id: 'lang', kind: 'single', caption: { ro: 'Limba răspunsului', en: 'Reply language' },
          items: [
            { id: 'user', label: { ro: 'Limba mea', en: 'My language' }, line: { ro: 'Răspunde în limba în care îți scriu.', en: 'Reply in the language I write in.' } },
            { id: 'ro', label: { ro: 'Română', en: 'Romanian' }, line: { ro: 'Răspunde mereu în limba română, cu diacritice corecte.', en: 'Always reply in Romanian, with correct diacritics.' } },
            { id: 'en', label: { ro: 'Engleză', en: 'English' }, line: { ro: 'Răspunde mereu în limba engleză.', en: 'Always reply in English.' } },
          ],
        },
      ],
    },
    {
      id: 'behavior', tag: 'behavior', label: { ro: 'Comportament', en: 'Behavior' }, out: { ro: 'Comportament', en: 'Behavior' },
      groups: [
        {
          id: 'behavior', kind: 'multi',
          items: [
            { id: 'ask', label: { ro: 'Întreabă doar dacă ești blocat', en: 'Ask only if blocked' },
              line: { ro: 'Pune întrebări de clarificare doar dacă lipsa informației face răspunsul imposibil; altfel fă o presupunere rezonabilă și spune-o.', en: 'Ask clarifying questions only when missing information makes an answer impossible; otherwise make a reasonable assumption and state it.' } },
            { id: 'noinvent', label: { ro: 'Nu inventa', en: "Don't make things up" },
              line: { ro: 'Dacă nu știi, spune „nu știu”. Nu fabrica fapte, citate, surse sau linkuri.', en: 'If you don\'t know, say “I don\'t know.” Never fabricate facts, quotes, sources, or links.' } },
            { id: 'pushback', label: { ro: 'Contrazice-mă', en: 'Push back' },
              line: { ro: 'Dacă greșesc sau planul meu are un defect, spune-mi direct, cu argumente, înainte să execuți.', en: "If I'm wrong or my plan has a flaw, tell me directly with reasons before executing." } },
            { id: 'noflatter', label: { ro: 'Fără lingușeli', en: 'No flattery' },
              line: { ro: 'Nu complimenta întrebările sau ideile mele. Nu fi de acord doar ca să-mi fie pe plac.', en: "Don't compliment my questions or ideas. Don't agree just to be agreeable." } },
            { id: 'confidence', label: { ro: 'Spune cât ești de sigur', en: 'State confidence' },
              line: { ro: 'Marchează incertitudinea: spune când ești sigur, când estimezi și când ghicești.', en: "Flag uncertainty: say when you're sure, when you're estimating, and when you're guessing." } },
            { id: 'assume', label: { ro: 'Presupuneri explicite', en: 'Explicit assumptions' },
              line: { ro: 'Enumeră presupunerile care influențează răspunsul.', en: 'List the assumptions that affect the answer.' } },
            { id: 'think', label: { ro: 'Gândește înainte', en: 'Think first' },
              line: { ro: 'Gândește problema cu atenție, pas cu pas, înainte să răspunzi.', en: 'Think the problem through step by step before answering.' } },
            { id: 'verify', label: { ro: 'Verifică-te', en: 'Check your work' },
              line: { ro: 'Înainte să răspunzi, verifică-ți munca: calcule, fapte, cod.', en: 'Before answering, check your work: math, facts, code.' } },
            { id: 'alts', label: { ro: 'Oferă alternative', en: 'Offer alternatives' },
              line: { ro: 'Când există o alternativă serioasă, menționeaz-o într-o propoziție.', en: 'When a serious alternative exists, mention it in one sentence.' } },
            { id: 'cite', label: { ro: 'Citează sursele', en: 'Cite sources' },
              line: { ro: 'Când afirmi ceva verificabil, numește sursa; dacă nu o ai, spune că nu o ai.', en: "When stating something verifiable, name the source; if you don't have one, say so." } },
          ],
        },
      ],
    },
    {
      id: 'limits', tag: 'limits', label: { ro: 'Filtre și limite', en: 'Filters and limits' }, out: { ro: 'Limite', en: 'Limits' },
      groups: [
        {
          id: 'limits', kind: 'multi',
          items: [
            { id: 'nodisc', label: { ro: 'Fără disclaimere', en: 'No disclaimers' },
              line: { ro: 'Fără avertismente sau disclaimere inutile.', en: 'No unnecessary warnings or disclaimers.' } },
            { id: 'nomoral', label: { ro: 'Fără moralizare', en: 'No moralizing' },
              line: { ro: 'Nu moraliza și nu ține lecții nesolicitate.', en: "Don't moralize or lecture unprompted." } },
            { id: 'noadvice', label: { ro: 'Fără sfaturi nesolicitate', en: 'No unsolicited advice' },
              line: { ro: 'Fă ce am cerut. Nu adăuga sfaturi sau extinderi pe care nu le-am cerut.', en: "Do what I asked. Don't add advice or extensions I didn't ask for." } },
            { id: 'ontopic', label: { ro: 'Rămâi pe subiect', en: 'Stay on topic' },
              line: { ro: 'Rămâi pe subiectul cerut; nu devia spre teme conexe.', en: "Stay on the requested topic; don't drift into related ones." } },
            { id: 'shortrefuse', label: { ro: 'Refuz scurt', en: 'Short refusals' },
              line: { ro: 'Dacă nu poți ajuta, spune-o într-o propoziție și oferă cea mai apropiată alternativă.', en: "If you can't help, say so in one sentence and offer the closest alternative." } },
            { id: 'noai', label: { ro: 'Fără „sunt un AI”', en: 'No “as an AI”' },
              line: { ro: 'Nu spune că ești un model AI decât dacă te întreb direct.', en: "Don't mention being an AI unless I ask directly." } },
            { id: 'nolinks', label: { ro: 'Fără linkuri nesigure', en: 'No shaky links' },
              line: { ro: 'Nu da linkuri decât dacă ești sigur că există.', en: "Don't give links unless you're certain they exist." } },
            { id: 'nocliches', label: { ro: 'Fără clișee AI', en: 'No AI clichés' },
              line: { ro: 'Evită formulările de umplutură: „în concluzie”, „merită menționat”, „în lumea de azi”.', en: 'Avoid filler phrases: “in conclusion,” “it\'s worth noting,” “in today\'s world.”' } },
            { id: 'pii', label: { ro: 'Fără date personale', en: 'No personal data' },
              line: { ro: 'Nu cere și nu repeta date personale sensibile.', en: "Don't ask for or repeat sensitive personal data." } },
          ],
        },
      ],
    },
    {
      id: 'extra', tag: 'extra', label: { ro: 'Instrucțiuni proprii', en: 'Custom instructions' }, out: { ro: 'Extra', en: 'Additional' },
      groups: [
        {
          id: 'custom', kind: 'lines', key: 'custom',
          ph: { ro: 'Câte o instrucțiune pe rând', en: 'One instruction per line' },
        },
      ],
    },
  ];

  /* Perechi care se bat cap în cap (ids de multi sau „grup=id” pentru single). */
  const CONFLICTS = [
    ['nomd', 'tables'],
    ['simple', 'expert'],
    ['concise', 'length=long'],
    ['nosum', 'length=long'],
  ];

  /* ---------------------------------------------------------------
     PROMPT NORMAL
     kind: line | area | examples | chips
  ---------------------------------------------------------------- */
  const PRM_SECTIONS = [
    {
      id: 'role', tag: 'role', kind: 'line',
      label: { ro: 'Rol', en: 'Role' }, out: { ro: 'Rol', en: 'Role' },
      ph: { ro: 'ex: un editor senior de text', en: 'e.g. a senior copy editor' },
      suggest: {
        ro: ['un editor senior', 'un inginer software senior', 'un analist de date', 'un expert în marketing', 'un coach de carieră', 'un jurnalist de investigație'],
        en: ['a senior editor', 'a senior software engineer', 'a data analyst', 'a marketing expert', 'a career coach', 'an investigative journalist'],
      },
    },
    {
      id: 'context', tag: 'context', kind: 'area',
      label: { ro: 'Context', en: 'Context' }, out: { ro: 'Context', en: 'Context' },
      ph: { ro: 'Situația, publicul, ce s-a încercat deja, de ce contează.', en: 'The situation, the audience, what was tried already, why it matters.' },
    },
    {
      id: 'input', tag: 'data', kind: 'area', vars: true,
      label: { ro: 'Date de intrare', en: 'Input data' }, out: { ro: 'Date', en: 'Data' },
      ph: { ro: 'Textul, codul sau datele cu care lucrează modelul.', en: 'The text, code or data the model works on.' },
    },
    {
      id: 'task', tag: 'task', kind: 'area', vars: true,
      label: { ro: 'Task', en: 'Task' }, out: { ro: 'Task', en: 'Task' },
      ph: { ro: 'Ce trebuie făcut, clar, începând cu un verb.', en: 'What needs doing, plainly, starting with a verb.' },
    },
    {
      id: 'examples', tag: 'examples', kind: 'examples',
      label: { ro: 'Exemple', en: 'Examples' }, out: { ro: 'Exemple', en: 'Examples' },
    },
    {
      id: 'constraints', tag: 'constraints', kind: 'chips',
      label: { ro: 'Constrângeri', en: 'Constraints' }, out: { ro: 'Constrângeri', en: 'Constraints' },
      ph: { ro: 'Alte reguli, câte una pe rând', en: 'Other rules, one per line' },
      chips: [
        { id: 'nojargon', label: { ro: 'Fără jargon', en: 'No jargon' }, line: { ro: 'Evită jargonul.', en: 'Avoid jargon.' } },
        { id: 'max150', label: { ro: 'Max. 150 de cuvinte', en: 'Max 150 words' }, line: { ro: 'Maximum 150 de cuvinte.', en: 'Maximum 150 words.' } },
        { id: 'onlygiven', label: { ro: 'Doar informațiile date', en: 'Only the given info' }, line: { ro: 'Folosește doar informațiile din context și din date; nu adăuga din cunoștințe proprii.', en: 'Use only the information in the context and data; do not add from your own knowledge.' } },
        { id: 'noinvent', label: { ro: 'Nu inventa', en: "Don't invent" }, line: { ro: 'Nu inventa fapte; dacă lipsește informația, spune asta.', en: "Don't invent facts; if information is missing, say so." } },
        { id: 'keepmeaning', label: { ro: 'Păstrează sensul', en: 'Keep the meaning' }, line: { ro: 'Păstrează sensul original.', en: 'Preserve the original meaning.' } },
        { id: 'nocliche', label: { ro: 'Fără clișee', en: 'No clichés' }, line: { ro: 'Evită clișeele și formulările de umplutură.', en: 'Avoid clichés and filler phrases.' } },
      ],
    },
    {
      id: 'format', tag: 'output_format', kind: 'chips',
      label: { ro: 'Format de ieșire', en: 'Output format' }, out: { ro: 'Format de ieșire', en: 'Output format' },
      ph: { ro: 'Alt format sau structură, câte una pe rând', en: 'Other format or structure, one per line' },
      chips: [
        { id: 'bullets', label: { ro: 'Listă cu bullet-uri', en: 'Bullet list' }, line: { ro: 'Răspunde ca listă cu bullet-uri.', en: 'Answer as a bullet list.' } },
        { id: 'numbered', label: { ro: 'Pași numerotați', en: 'Numbered steps' }, line: { ro: 'Prezintă răspunsul ca pași numerotați.', en: 'Present the answer as numbered steps.' } },
        { id: 'table', label: { ro: 'Tabel', en: 'Table' }, line: { ro: 'Prezintă răspunsul într-un tabel.', en: 'Present the answer in a table.' } },
        { id: 'json', label: { ro: 'JSON', en: 'JSON' }, line: { ro: 'Returnează doar JSON valid, fără text în jur.', en: 'Return only valid JSON, with no surrounding text.' } },
        { id: 'md', label: { ro: 'Markdown', en: 'Markdown' }, line: { ro: 'Folosește Markdown.', en: 'Use Markdown.' } },
        { id: 'code', label: { ro: 'Bloc de cod', en: 'Code block' }, line: { ro: 'Pune codul într-un bloc de cod.', en: 'Put the code in a code block.' } },
        { id: 'paras', label: { ro: 'Paragrafe scurte', en: 'Short paragraphs' }, line: { ro: 'Scrie paragrafe scurte, de 2–3 propoziții.', en: 'Write short paragraphs of 2–3 sentences.' } },
        { id: 'email', label: { ro: 'Email', en: 'Email' }, line: { ro: 'Scrie ca un email, cu subiect și semnătură.', en: 'Write it as an email, with a subject line and sign-off.' } },
      ],
    },
    {
      id: 'tone', tag: 'audience_tone', kind: 'chips', audience: true,
      label: { ro: 'Public și ton', en: 'Audience and tone' }, out: { ro: 'Public și ton', en: 'Audience and tone' },
      audiencePh: { ro: 'Public țintă, ex: manageri fără background tehnic', en: 'Target audience, e.g. managers with no technical background' },
      ph: { ro: 'Alte indicații de ton, câte una pe rând', en: 'Other tone notes, one per line' },
      chips: [
        { id: 'formal', label: { ro: 'Formal', en: 'Formal' }, line: { ro: 'formal', en: 'formal' } },
        { id: 'casual', label: { ro: 'Casual', en: 'Casual' }, line: { ro: 'casual', en: 'casual' } },
        { id: 'technical', label: { ro: 'Tehnic', en: 'Technical' }, line: { ro: 'tehnic', en: 'technical' } },
        { id: 'simple', label: { ro: 'Simplu', en: 'Simple' }, line: { ro: 'simplu', en: 'simple' } },
        { id: 'persuasive', label: { ro: 'Persuasiv', en: 'Persuasive' }, line: { ro: 'persuasiv', en: 'persuasive' } },
        { id: 'neutral', label: { ro: 'Neutru', en: 'Neutral' }, line: { ro: 'neutru', en: 'neutral' } },
        { id: 'empathic', label: { ro: 'Empatic', en: 'Empathetic' }, line: { ro: 'empatic', en: 'empathetic' } },
      ],
    },
    {
      id: 'done', tag: 'success_criteria', kind: 'chips',
      label: { ro: 'Condiție de satisfacție', en: 'Done when' }, out: { ro: 'Gata când', en: 'Done when' },
      ph: { ro: 'Când e răspunsul bun? Câte un criteriu pe rând', en: 'When is the answer good? One criterion per line' },
      chips: [
        { id: 'cover', label: { ro: 'Acoperă tot task-ul', en: 'Covers the whole task' }, line: { ro: 'Acoperă toate punctele din task.', en: 'Covers every point in the task.' } },
        { id: 'grounded', label: { ro: 'Susținut de context', en: 'Grounded in context' }, line: { ro: 'Fiecare afirmație se sprijină pe contextul dat.', en: 'Every claim is supported by the given context.' } },
        { id: 'ready', label: { ro: 'Folosibil fără editări', en: 'Usable as is' }, line: { ro: 'Rezultatul poate fi folosit fără editări.', en: 'The result can be used without edits.' } },
        { id: 'constraints', label: { ro: 'Respectă constrângerile', en: 'Meets constraints' }, line: { ro: 'Toate constrângerile sunt respectate.', en: 'All constraints are met.' } },
        { id: 'nonexpert', label: { ro: 'Înțeles de un nespecialist', en: 'Clear to a non-expert' }, line: { ro: 'Un nespecialist îl poate înțelege.', en: 'A non-specialist can understand it.' } },
      ],
    },
    {
      id: 'delivery', tag: 'delivery', kind: 'chips',
      label: { ro: 'Livrare', en: 'Delivery' }, out: { ro: 'Livrare', en: 'Delivery' },
      ph: { ro: 'Alte condiții de livrare, câte una pe rând', en: 'Other delivery conditions, one per line' },
      chips: [
        { id: 'final', label: { ro: 'Doar rezultatul final', en: 'Final result only' }, line: { ro: 'Livrează doar rezultatul final, fără explicații.', en: 'Deliver only the final result, no explanations.' } },
        { id: 'direct', label: { ro: 'Începe direct', en: 'Start directly' }, line: { ro: 'Începe direct cu răspunsul, fără introducere.', en: 'Start directly with the answer, no introduction.' } },
        { id: 'ask', label: { ro: 'Întreabă dacă lipsește ceva', en: 'Ask if something is missing' }, line: { ro: 'Dacă lipsesc informații esențiale, pune cel mult 3 întrebări înainte să începi.', en: 'If essential information is missing, ask at most 3 questions before you start.' } },
        { id: 'next', label: { ro: 'Încheie cu pași următori', en: 'End with next steps' }, line: { ro: 'Încheie cu 2–3 pași următori recomandați.', en: 'End with 2–3 recommended next steps.' } },
        { id: 'plan', label: { ro: 'Plan, apoi execuție', en: 'Plan first' }, line: { ro: 'Mai întâi propune un plan scurt și așteaptă confirmarea mea.', en: 'First propose a short plan and wait for my confirmation.' } },
        { id: 'variants', label: { ro: 'Trei variante', en: 'Three variants' }, line: { ro: 'Oferă 3 variante diferite.', en: 'Provide 3 different variants.' } },
      ],
    },
    {
      id: 'process', tag: 'process', kind: 'chips',
      label: { ro: 'Mod de lucru', en: 'Working method' }, out: { ro: 'Mod de lucru', en: 'Working method' },
      ph: { ro: 'Alți pași de urmat, câte unul pe rând', en: 'Other steps to follow, one per line' },
      chips: [
        { id: 'stepbystep', label: { ro: 'Gândește pas cu pas', en: 'Think step by step' }, line: { ro: 'Gândește pas cu pas înainte să răspunzi.', en: 'Think step by step before answering.' } },
        { id: 'verify', label: { ro: 'Verifică înainte de livrare', en: 'Check before delivering' }, line: { ro: 'Înainte să livrezi, verifică rezultatul față de condițiile de mai sus și corectează ce nu se potrivește.', en: 'Before delivering, check the result against the conditions above and fix whatever does not fit.' } },
        { id: 'assume', label: { ro: 'Spune presupunerile', en: 'State assumptions' }, line: { ro: 'Spune explicit presupunerile pe care le faci.', en: 'State explicitly the assumptions you make.' } },
        { id: 'uncertain', label: { ro: 'Marchează incertitudinea', en: 'Flag uncertainty' }, line: { ro: 'Marchează ce nu ești sigur.', en: "Flag what you're unsure about." } },
      ],
    },
  ];

  /* ---------------------------------------------------------------
     PRESETĂRI
  ---------------------------------------------------------------- */
  const SYS_PRESETS = [
    {
      id: 'blunt', name: { ro: 'Blunt și scurt', en: 'Blunt and short' },
      role: { ro: '', en: '' },
      picks: ['blunt', 'nofluff', 'concise', 'nopre', 'nosum', 'nofollow', 'noflatter', 'nodisc'],
      single: { length: 'short', emoji: 'none' },
    },
    {
      id: 'dev', name: { ro: 'Dev senior', en: 'Senior dev' },
      role: { ro: 'un inginer software senior', en: 'a senior software engineer' },
      picks: ['blunt', 'nopre', 'nosum', 'codefirst', 'noinvent', 'pushback', 'ask', 'noadvice', 'verify'],
      single: { mode: 'coding', emoji: 'none', length: 'medium' },
    },
    {
      id: 'research', name: { ro: 'Cercetător', en: 'Researcher' },
      role: { ro: 'un asistent de cercetare riguros', en: 'a rigorous research assistant' },
      picks: ['skeptical', 'answerfirst', 'confidence', 'cite', 'noinvent', 'assume', 'nocliches'],
      single: { mode: 'research', emoji: 'none', length: 'medium' },
    },
    {
      id: 'editor', name: { ro: 'Editor strict', en: 'Strict editor' },
      role: { ro: 'un editor atent', en: 'a careful editor' },
      picks: ['blunt', 'nopre', 'nosum', 'noflatter', 'nocliches', 'noadvice'],
      single: { mode: 'writing', emoji: 'none' },
    },
    {
      id: 'tutor', name: { ro: 'Tutore blând', en: 'Gentle tutor' },
      role: { ro: 'un tutore răbdător', en: 'a patient tutor' },
      picks: ['friendly', 'simple', 'nopre', 'alts'],
      single: { mode: 'tutor', emoji: 'few', length: 'medium' },
    },
  ];

  const PRM_PRESETS = [
    {
      id: 'summary', name: { ro: 'Rezumat', en: 'Summary' },
      on: ['role', 'input', 'task', 'constraints', 'format', 'done', 'delivery'],
      text: {
        ro: { role: 'un editor atent', input: '{{text}}', task: 'Rezumă textul din Date pentru cineva care are doar 30 de secunde.', done: 'Cele mai importante 3–5 idei sunt acoperite.' },
        en: { role: 'a careful editor', input: '{{text}}', task: 'Summarize the text in Data for someone who has only 30 seconds.', done: 'The 3–5 most important ideas are covered.' },
      },
      chips: { constraints: ['onlygiven', 'max150'], format: ['bullets'], done: ['grounded'], delivery: ['direct'] },
    },
    {
      id: 'review', name: { ro: 'Code review', en: 'Code review' },
      on: ['role', 'input', 'task', 'constraints', 'format', 'done', 'process'],
      text: {
        ro: {
          role: 'un inginer software senior care face code review', input: '{{cod}}',
          task: 'Fă code review pe codul din Date. Caută bug-uri, probleme de securitate și părți greu de întreținut.',
          constraints: 'Ordonează problemele după gravitate.\nPropune o corecție concretă pentru fiecare problemă.\nNu comenta stilul decât dacă afectează lizibilitatea.',
          done: 'Fiecare problemă are gravitate, locație și o corecție propusă.',
        },
        en: {
          role: 'a senior software engineer doing code review', input: '{{code}}',
          task: 'Review the code in Data. Look for bugs, security issues and hard-to-maintain parts.',
          constraints: 'Order the issues by severity.\nPropose a concrete fix for each issue.\nDo not comment on style unless it hurts readability.',
          done: 'Each issue has a severity, a location and a proposed fix.',
        },
      },
      chips: { format: ['numbered'], process: ['verify'] },
    },
    {
      id: 'email', name: { ro: 'Email profesional', en: 'Professional email' },
      on: ['role', 'context', 'task', 'tone', 'constraints', 'format', 'done', 'delivery'],
      text: {
        ro: {
          role: 'un asistent care scrie emailuri profesionale', context: 'Expeditor: {{eu}}. Situația: {{situația}}.',
          task: 'Scrie un email către {{destinatar}} despre {{subiect}}.', audience: '{{destinatar}}',
          constraints: 'Maximum 120 de cuvinte.', done: 'Cererea principală e clară din prima propoziție.',
        },
        en: {
          role: 'an assistant who writes professional emails', context: 'Sender: {{me}}. Situation: {{situation}}.',
          task: 'Write an email to {{recipient}} about {{subject}}.', audience: '{{recipient}}',
          constraints: 'Maximum 120 words.', done: 'The main request is clear from the first sentence.',
        },
      },
      chips: { tone: ['formal'], format: ['email'], delivery: ['variants'] },
    },
    {
      id: 'extract', name: { ro: 'Extragere în JSON', en: 'Extract to JSON' },
      on: ['role', 'input', 'task', 'constraints', 'format', 'done', 'delivery'],
      text: {
        ro: {
          role: 'un sistem de extragere de date', input: '{{text}}',
          task: 'Extrage din textul din Date: nume, dată și sumă. Dacă un câmp lipsește, pune null.',
          done: 'JSON-ul este valid și conține toate cheile.',
        },
        en: {
          role: 'a data extraction system', input: '{{text}}',
          task: 'Extract from the text in Data: name, date and amount. If a field is missing, use null.',
          done: 'The JSON is valid and contains all keys.',
        },
      },
      chips: { constraints: ['noinvent'], format: ['json'], delivery: ['final'] },
    },
  ];

  /* ---------------------------------------------------------------
     DIAGRAME ȘI VIZUALE DE BUSINESS (ChatGPT)
     mk: id, etichetă RO, etichetă EN, frază RO, frază EN
  ---------------------------------------------------------------- */
  const mk = (id, lr, le, nr, ne) => ({ id, label: { ro: lr, en: le }, line: { ro: nr, en: ne } });
  const items = rows => rows.map(r => mk(...r));
  const cap = (ro, en) => ({ ro, en });

  const IMG_PAGES = [
    {
      id: 'content', label: cap('Conținut', 'Content'),
      groups: [
        {
          id: 'subject', kind: 'area', key: 'subject', rows: 3,
          caption: cap('Ce trebuie să arate', 'What it should show'),
          ph: cap('ex: procesul de onboarding al unui client B2B, de la contract la prima factură', 'e.g. the onboarding process of a B2B customer, from contract to first invoice'),
          suggest: {
            ro: ['procesul de onboarding al unui client nou', 'analiza SWOT pentru lansarea unui produs', 'prioritizarea inițiativelor după impact și efort', 'evoluția veniturilor pe trimestre', 'structura unei echipe de produs', 'roadmap de produs pe 4 trimestre'],
            en: ['the onboarding process of a new customer', 'a SWOT analysis for a product launch', 'prioritizing initiatives by impact and effort', 'revenue evolution by quarter', 'the structure of a product team', 'a 4-quarter product roadmap'],
          },
        },
        {
          id: 'labels', kind: 'area', key: 'labels', rows: 4,
          caption: cap('Etichetele exacte, câte una pe rând, în ordine', 'Exact labels, one per line, in order'),
          ph: cap('Contract semnat\nCreare cont\nConfigurare\nPrima factură', 'Contract signed\nAccount creation\nSetup\nFirst invoice'),
        },
        {
          id: 'data', kind: 'area', key: 'data', rows: 2,
          caption: cap('Date pentru grafice, câte o valoare pe rând', 'Chart data, one value per line'),
          ph: cap('T1: 120.000 €\nT2: 150.000 €\nT3: 180.000 €', 'Q1: €120,000\nQ2: €150,000\nQ3: €180,000'),
        },
      ],
    },
    {
      id: 'type', label: cap('Tip de vizual', 'Visual type'),
      groups: [
        {
          id: 'vt_process', field: 'vtype', kind: 'single', caption: cap('Arată un proces', 'Show a process'),
          items: items([
            ['flowchart', 'Flowchart', 'Flowchart', 'o diagramă de flux (flowchart)', 'a flowchart'],
            ['swimlane', 'Swimlane', 'Swimlane', 'o diagramă swimlane, cu un culoar pentru fiecare rol sau echipă', 'a swimlane diagram with one lane per role or team'],
            ['funnel', 'Pâlnie', 'Funnel', 'o pâlnie (funnel) cu etape descrescătoare', 'a funnel diagram with narrowing stages'],
            ['journey', 'Customer journey', 'Customer journey', 'o hartă a călătoriei clientului (customer journey map)', 'a customer journey map'],
            ['cycle', 'Ciclu', 'Cycle', 'o diagramă circulară pentru un proces repetitiv', 'a circular diagram of a repeating cycle'],
            ['valuechain', 'Lanț valoric', 'Value chain', 'o diagramă de lanț valoric', 'a value chain diagram'],
          ]),
        },
        {
          id: 'vt_compare', field: 'vtype', kind: 'single', caption: cap('Compară și prioritizează', 'Compare and prioritize'),
          items: items([
            ['matrix', 'Matrice 2×2', '2×2 matrix', 'o matrice 2×2 cu patru cadrane etichetate', 'a 2×2 matrix with four labeled quadrants'],
            ['swot', 'SWOT', 'SWOT', 'o analiză SWOT în patru cadrane', 'a SWOT analysis in four quadrants'],
            ['table', 'Tabel comparativ', 'Comparison table', 'un tabel comparativ curat, cu opțiunile pe coloane și criteriile pe rânduri', 'a clean comparison table with options as columns and criteria as rows'],
            ['proscons', 'Pro / contra', 'Pros / cons', 'un vizual pro / contra, în două coloane', 'a two-column pros-and-cons visual'],
            ['venn', 'Venn', 'Venn', 'o diagramă Venn', 'a Venn diagram'],
            ['beforeafter', 'Înainte / după', 'Before / after', 'un vizual înainte / după, în două jumătăți', 'a before-and-after visual in two halves'],
            ['scorecard', 'Scorecard', 'Scorecard', 'un scorecard cu criterii și scoruri codate vizual (Harvey balls sau bare)', 'a scorecard with criteria and visually encoded scores (Harvey balls or bars)'],
          ]),
        },
        {
          id: 'vt_structure', field: 'vtype', kind: 'single', caption: cap('Structură și relații', 'Structure and relationships'),
          items: items([
            ['org', 'Organigramă', 'Org chart', 'o organigramă', 'an org chart'],
            ['tree', 'Arbore decizional', 'Decision tree', 'un arbore decizional', 'a decision tree'],
            ['mindmap', 'Hartă mentală', 'Mind map', 'o hartă mentală, cu ideea centrală și ramuri', 'a mind map with a central idea and branches'],
            ['arch', 'Arhitectură', 'Architecture', 'o diagramă de arhitectură de sistem, cu componente și conexiuni', 'a system architecture diagram with components and connections'],
            ['stake', 'Stakeholderi', 'Stakeholders', 'o hartă a stakeholderilor (influență vs. interes)', 'a stakeholder map (influence vs. interest)'],
            ['network', 'Rețea de relații', 'Relationship network', 'o diagramă a relațiilor dintre entități', 'a diagram of relationships between entities'],
            ['pyramid', 'Piramidă', 'Pyramid', 'o piramidă pe niveluri', 'a layered pyramid diagram'],
            ['canvas', 'Business Model Canvas', 'Business Model Canvas', 'un Business Model Canvas cu cele 9 blocuri', 'a Business Model Canvas with the 9 building blocks'],
            ['porter', '5 forțe (Porter)', 'Five forces', 'o diagramă cu cele 5 forțe ale lui Porter', "a Porter's Five Forces diagram"],
            ['stack', 'Straturi', 'Layer stack', 'o diagramă pe straturi (stack)', 'a layered stack diagram'],
          ]),
        },
        {
          id: 'vt_numbers', field: 'vtype', kind: 'single', caption: cap('Numere și evoluție', 'Numbers and trends'),
          items: items([
            ['bar', 'Bare', 'Bar chart', 'un grafic cu bare', 'a bar chart'],
            ['line', 'Linie', 'Line chart', 'un grafic cu linie, pentru evoluția în timp', 'a line chart showing change over time'],
            ['donut', 'Donut', 'Donut chart', 'un grafic donut, pentru părți dintr-un întreg', 'a donut chart showing parts of a whole'],
            ['stacked', 'Bare stivuite', 'Stacked bars', 'un grafic cu bare stivuite', 'a stacked bar chart'],
            ['waterfall', 'Waterfall', 'Waterfall', 'un grafic waterfall (punte) care arată cum se ajunge de la o valoare la alta', 'a waterfall chart showing how one value bridges to another'],
            ['scatter', 'Scatter / bubble', 'Scatter / bubble', 'un grafic scatter sau bubble', 'a scatter or bubble chart'],
            ['heatmap', 'Heatmap', 'Heatmap', 'un heatmap', 'a heatmap'],
            ['radar', 'Radar', 'Radar', 'un grafic radar', 'a radar chart'],
            ['kpi', 'Tablou KPI', 'KPI board', 'un tablou cu 4–6 KPI, fiecare cu valoare mare și variație', 'a board of 4–6 KPIs, each with a large value and a change indicator'],
          ]),
        },
        {
          id: 'vt_time', field: 'vtype', kind: 'single', caption: cap('Planifică în timp', 'Plan over time'),
          items: items([
            ['timeline', 'Timeline', 'Timeline', 'o axă cronologică (timeline)', 'a timeline'],
            ['gantt', 'Gantt', 'Gantt', 'o diagramă Gantt', 'a Gantt chart'],
            ['roadmap', 'Roadmap', 'Roadmap', 'un roadmap pe trimestre, cu fluxurile de lucru pe rânduri', 'a quarterly roadmap with workstreams as rows'],
            ['milestones', 'Jaloane', 'Milestones', 'o axă cu jaloane și date cheie', 'a milestone track with key dates'],
          ]),
        },
        {
          id: 'vt_slide', field: 'vtype', kind: 'single', caption: cap('Slide-uri gata făcute', 'Ready-made slides'),
          items: items([
            ['s_agenda', 'Agendă', 'Agenda', 'un slide de agendă, cu 4–5 puncte numerotate', 'an agenda slide with 4–5 numbered items'],
            ['s_three', '3 coloane', 'Three columns', 'un slide cu trei coloane egale, fiecare cu titlu, iconiță și două rânduri de text', 'a slide with three equal columns, each with a heading, an icon and two lines of text'],
            ['s_hero', 'Cifră mare', 'Big number', 'un slide cu o cifră mare în centru și o explicație scurtă dedesubt', 'a slide with one big number in the center and a short explanation beneath it'],
            ['s_exec', 'Rezumat executiv', 'Executive summary', 'un slide de rezumat executiv, cu concluzia sus și trei argumente dedesubt', 'an executive-summary slide with the conclusion on top and three supporting points below'],
            ['s_info', 'Infografic', 'Infographic', 'un infografic de business, cu secțiuni clare', 'a business infographic with clear sections'],
          ]),
        },
      ],
    },
    {
      id: 'layout', label: cap('Structură', 'Layout'),
      groups: [
        {
          id: 'flow', kind: 'single', caption: cap('Direcție', 'Direction'),
          items: items([
            ['ltr', 'Stânga → dreapta', 'Left → right', 'flux de la stânga la dreapta', 'left-to-right flow'],
            ['ttb', 'Sus → jos', 'Top → bottom', 'flux de sus în jos', 'top-to-bottom flow'],
            ['circ', 'Circular', 'Circular', 'dispunere circulară', 'circular layout'],
            ['radial', 'Radial', 'Radial', 'dispunere radială, cu ideea centrală la mijloc', 'radial layout with the central idea in the middle'],
            ['grid', 'Grilă', 'Grid', 'dispunere în grilă regulată', 'regular grid layout'],
          ]),
        },
        {
          id: 'density', kind: 'single', caption: cap('Densitate', 'Density'),
          items: items([
            ['airy', 'Aerisit', 'Airy', 'puține elemente, mult spațiu alb', 'few elements, generous white space'],
            ['balanced', 'Echilibrat', 'Balanced', 'densitate echilibrată', 'balanced density'],
            ['dense', 'Dens', 'Dense', 'dens, dar bine organizat, potrivit pentru un raport', 'dense but well organized, suitable for a report'],
          ]),
        },
        {
          id: 'elements', kind: 'multi', caption: cap('Elemente', 'Elements'),
          items: items([
            ['numbers', 'Pași numerotați', 'Numbered steps', 'pași numerotați', 'numbered steps'],
            ['arrows', 'Săgeți clare', 'Clear arrows', 'săgeți clare, cu direcție evidentă', 'clear arrows with an obvious direction'],
            ['ortho', 'Conectori drepți', 'Straight connectors', 'conectori ortogonali, fără linii care se încrucișează', 'orthogonal connectors with no crossing lines'],
            ['rounded', 'Colțuri rotunjite', 'Rounded corners', 'cutii cu colțuri rotunjite', 'rounded-corner boxes'],
            ['icons', 'Iconițe simple', 'Simple icons', 'iconițe liniare simple lângă etichete', 'simple line icons next to the labels'],
            ['category', 'Culori pe categorii', 'Color by category', 'elemente colorate pe categorii, cu legendă', 'elements color-coded by category, with a legend'],
            ['zones', 'Zone etichetate', 'Labeled zones', 'elemente înrudite grupate în zone etichetate', 'related elements grouped into labeled zones'],
            ['highlight', 'Ideea cheie evidențiată', 'Highlight key idea', 'un element cheie evidențiat vizual', 'one key element visually highlighted'],
            ['legend', 'Legendă', 'Legend', 'o legendă clară', 'a clear legend'],
            ['noshadow', 'Fără umbre', 'No shadows', 'fără umbre sau efecte 3D', 'no shadows or 3D effects'],
          ]),
        },
      ],
    },
    {
      id: 'style', label: cap('Stil și culori', 'Style and colors'),
      groups: [
        {
          id: 'vstyle', kind: 'single', caption: cap('Stil', 'Style'),
          items: items([
            ['corporate', 'Corporate curat', 'Clean corporate', 'în stil corporate curat și profesionist', 'in a clean, professional corporate style'],
            ['consulting', 'Stil consultanță', 'Consulting style', 'în stil de consultanță strategică: sobru, structurat, cu titlu-concluzie și mult spațiu alb', 'in a strategy-consulting style: sober, structured, with a takeaway title and plenty of white space'],
            ['minimal', 'Minimalist', 'Minimalist', 'minimalist, alb cu o singură culoare accent', 'minimalist, white with a single accent color'],
            ['flat', 'Flat vector', 'Flat vector', 'design vectorial plat', 'flat vector design'],
            ['iso', 'Izometric 3D', 'Isometric 3D', 'ilustrație izometrică 3D curată', 'clean isometric 3D illustration'],
            ['sketch', 'Schiță de tablă', 'Whiteboard sketch', 'aspect de schiță desenată cu markerul pe tablă albă', 'hand-drawn whiteboard marker sketch look'],
            ['blueprint', 'Tehnic', 'Technical', 'aspect tehnic, linii fine, ca o schemă de inginerie', 'technical look with fine lines, like an engineering schematic'],
            ['modern', 'Modern, gradient fin', 'Modern, soft gradient', 'modern, cu gradiente fine și colțuri rotunjite', 'modern, with subtle gradients and rounded corners'],
            ['infostyle', 'Infografic colorat', 'Colorful infographic', 'infografic colorat, cu iconițe simple', 'colorful infographic with simple icons'],
            ['printmono', 'Monocrom pentru print', 'Mono for print', 'monocrom, lizibil și la tipărire alb-negru', 'monochrome, legible in black-and-white print'],
            ['darkmode', 'Dark mode', 'Dark mode', 'pe fundal închis, ca un dashboard în dark mode', 'on a dark background, like a dark-mode dashboard'],
            ['sticky', 'Post-it-uri', 'Sticky notes', 'aspect de workshop, cu post-it-uri colorate', 'workshop look with colored sticky notes'],
          ]),
        },
        {
          id: 'vpalette', kind: 'single', caption: cap('Paletă', 'Palette'),
          items: items([
            ['blue', 'Albastru corporate', 'Corporate blue', 'paletă de albastruri corporate, cu un accent portocaliu', 'corporate blue palette with an orange accent'],
            ['green', 'Verde și gri', 'Green and gray', 'verde închis și gri cald', 'deep green and warm gray'],
            ['neutral', 'Gri + un accent', 'Gray + one accent', 'tonuri de gri cu o singură culoare accent', 'grayscale with a single accent color'],
            ['traffic', 'Semafor', 'Traffic light', 'verde, galben și roșu pentru stări (semafor)', 'green, amber and red for status (traffic-light)'],
            ['category', 'Categorii distincte', 'Distinct categories', 'o culoare distinctă, cu contrast bun, pentru fiecare categorie', 'a distinct, high-contrast color for each category'],
            ['pastel', 'Pastel', 'Pastel', 'culori pastel calme', 'calm pastel colors'],
            ['warm', 'Calde', 'Warm', 'paletă caldă', 'warm palette'],
            ['bw', 'Alb-negru', 'Black and white', 'alb-negru', 'black and white'],
          ]),
        },
        {
          id: 'brand', kind: 'text', key: 'brand',
          caption: cap('Culorile brandului (opțional)', 'Brand colors (optional)'),
          ph: cap('ex: #0F4C81, #F2A900', 'e.g. #0F4C81, #F2A900'),
        },
      ],
    },
    {
      id: 'text', label: cap('Text și lizibilitate', 'Text and legibility'),
      groups: [
        {
          id: 'title', kind: 'text', key: 'title', caption: cap('Titlul vizualului', 'Visual title'),
          ph: cap('ex: Onboarding-ul clientului durează 14 zile', 'e.g. Customer onboarding takes 14 days'),
        },
        {
          id: 'txtrules', kind: 'multi',
          items: items([
            ['exact', 'Doar textul dat', 'Only the given text', 'folosește exact etichetele date, fără text în plus și fără greșeli de ortografie', 'use exactly the labels provided, with no extra text and no spelling mistakes'],
            ['big', 'Text mare', 'Large text', 'text mare, lizibil la proiecție', 'large text, legible when projected'],
            ['short', 'Etichete scurte', 'Short labels', 'etichete de cel mult 5 cuvinte', 'labels of at most 5 words'],
            ['takeaway', 'Titlu-concluzie', 'Takeaway title', 'titlul formulează concluzia, nu doar subiectul', 'the title states the takeaway, not just the topic'],
            ['bignum', 'Cifre mari', 'Big numbers', 'cifrele cheie mari și îngroșate', 'key numbers large and bold'],
            ['source', 'Sursă în subsol', 'Source footer', 'o linie mică de sursă în subsol: [sursa]', 'a small source line in the footer: [source]'],
            ['sans', 'Font sans-serif', 'Sans-serif font', 'font sans-serif curat', 'clean sans-serif font'],
            ['contrast', 'Contrast mare', 'High contrast', 'contrast mare între text și fundal', 'high contrast between text and background'],
            ['titlespace', 'Loc pentru titlu', 'Space for title', 'spațiu liber sus pentru titlul slide-ului', 'empty space at the top for the slide title'],
            ['roomlater', 'Loc pentru text ulterior', 'Room for later text', 'o zonă liberă pentru text adăugat ulterior în PowerPoint', 'a clear area left free for text added later in PowerPoint'],
          ]),
        },
      ],
    },
    {
      id: 'format', label: cap('Format și livrare', 'Format and delivery'),
      groups: [
        {
          id: 'ratio', kind: 'single', caption: cap('Proporții · native: 1:1, 3:2, 2:3', 'Aspect ratio · native: 1:1, 3:2, 2:3'),
          items: items([
            ['wide', '16:9 slide', '16:9 slide', '16:9, format de slide', '16:9 slide format'],
            ['land', '3:2 orizontal', '3:2 landscape', '3:2, orizontal', '3:2 landscape'],
            ['port', '2:3 vertical', '2:3 portrait', '2:3, vertical (pagină de raport)', '2:3 portrait (report page)'],
            ['sq', '1:1 pătrat', '1:1 square', '1:1, pătrat', '1:1 square'],
          ]),
        },
        {
          id: 'use', kind: 'single', caption: cap('Folosire', 'Intended use'),
          items: items([
            ['slide', 'Slide PowerPoint', 'PowerPoint slide', 'slide de PowerPoint', 'a PowerPoint slide'],
            ['report', 'Pagină de raport', 'Report page', 'figură într-un raport', 'a figure in a report'],
            ['onepager', 'One-pager', 'One-pager', 'one-pager tipărit', 'printed one-pager'],
            ['linkedin', 'Postare LinkedIn', 'LinkedIn post', 'postare pentru LinkedIn', 'a LinkedIn post'],
            ['email', 'Email', 'Email', 'imagine într-un email către management', 'an image in an email to management'],
            ['workshop', 'Workshop', 'Workshop', 'material de workshop', 'workshop material'],
            ['dashboard', 'Dashboard', 'Dashboard', 'panou de tip dashboard', 'dashboard panel'],
          ]),
        },
        {
          id: 'bg', kind: 'single', caption: cap('Fundal', 'Background'),
          items: items([
            ['white', 'Alb', 'White', 'fundal alb curat', 'clean white background'],
            ['transp', 'Transparent', 'Transparent', 'fundal transparent', 'transparent background'],
            ['lightgray', 'Gri deschis', 'Light gray', 'fundal gri foarte deschis', 'very light gray background'],
            ['dark', 'Închis', 'Dark', 'fundal închis, unicolor', 'plain dark background'],
          ]),
        },
        {
          id: 'deliv', kind: 'single', caption: cap('Livrabil · pentru ceva editabil alege .pptx, Mermaid sau SVG', 'Deliverable · for something editable pick .pptx, Mermaid or SVG'),
          items: items([
            ['img', 'Imagine', 'Image', 'imagine de înaltă rezoluție', 'a high-resolution image'],
            ['pptx', 'Fișier .pptx', '.pptx file', 'fișier .pptx descărcabil, cu forme și text native, editabile în PowerPoint', 'a downloadable .pptx with native, editable shapes and text'],
            ['mermaid', 'Cod Mermaid', 'Mermaid code', 'cod Mermaid, ca să-l pot edita și randa', 'Mermaid code so I can edit and render it'],
            ['svg', 'Cod SVG', 'SVG code', 'cod SVG curat, editabil', 'clean, editable SVG code'],
            ['xlsx', 'Fișier .xlsx', '.xlsx file', 'fișier .xlsx cu datele și un grafic nativ', 'an .xlsx file with the data and a native chart'],
            ['mdtable', 'Tabel markdown', 'Markdown table', 'tabel în markdown, ca să-l pot lipi într-un document', 'a markdown table I can paste into a document'],
          ]),
        },
      ],
    },
    {
      id: 'avoid', label: cap('Evită', 'Avoid'),
      groups: [
        {
          id: 'avoid', kind: 'multi',
          items: items([
            ['av_invent', 'Elemente inventate', 'Invented content', 'cifre, etichete sau elemente care nu sunt în lista dată', 'numbers, labels or elements that are not in the list provided'],
            ['av_small', 'Text mic', 'Small text', 'text mic sau greu de citit', 'small or hard-to-read text'],
            ['av_cross', 'Linii care se încrucișează', 'Crossing lines', 'linii sau săgeți care se încrucișează sau se suprapun', 'crossing or overlapping lines and arrows'],
            ['av_ambig', 'Săgeți ambigue', 'Ambiguous arrows', 'săgeți fără direcție clară', 'arrows with unclear direction'],
            ['av_colors', 'Prea multe culori', 'Too many colors', 'mai mult de 4 culori', 'more than 4 colors'],
            ['av_3d', 'Umbre și 3D', 'Shadows and 3D', 'umbre, reflexii și efecte 3D', 'shadows, reflections and 3D effects'],
            ['av_gradient', 'Gradiente puternice', 'Heavy gradients', 'gradiente puternice', 'heavy gradients'],
            ['av_decor', 'Decor inutil', 'Needless decoration', 'decor inutil, poze stock sau persoane', 'needless decoration, stock photos or people'],
            ['av_logo', 'Logo-uri', 'Logos', 'logo-uri și mărci', 'brand logos or trademarks'],
            ['av_wm', 'Text în plus', 'Extra text', 'text suplimentar, watermark sau semnături', 'extra text, watermarks or signatures'],
          ]),
        },
        {
          id: 'avoidtxt', kind: 'area', key: 'avoid', rows: 1,
          ph: cap('Altceva de evitat, câte unul pe rând', 'Anything else to avoid, one per line'),
        },
      ],
    },
    {
      id: 'followup', label: cap('Retușuri', 'Follow-ups'),
      groups: [
        {
          id: 'followup', kind: 'phrases', copy: true,
          caption: cap('Trimite-le după prima versiune · click copiază', 'Send after the first version · click to copy'),
          items: [
            { id: 'd1', text: cap('Păstrează structura și etichetele, dar mărește textul ca să fie lizibil la proiecție.', 'Keep the structure and labels, but enlarge the text so it is legible when projected.') },
            { id: 'd2', text: cap('Schimbă culorile cu [#hex1, #hex2] și păstrează restul neschimbat.', 'Change the colors to [#hex1, #hex2] and keep everything else unchanged.') },
            { id: 'd3', text: cap('Adaugă un element nou între „[A]” și „[B]”, numit „[nume]”.', 'Add a new element between “[A]” and “[B]”, called “[name]”.') },
            { id: 'd4', text: cap('Elimină elementul „[nume]” și reorganizează restul fără goluri.', 'Remove the element “[name]” and rearrange the rest without gaps.') },
            { id: 'd5', text: cap('Redenumește eticheta „[vechi]” în „[nou]”; nu schimba nimic altceva.', 'Rename the label “[old]” to “[new]”; change nothing else.') },
            { id: 'd6', text: cap('Simplifică: păstrează cel mult 5 elemente și grupează restul în „Altele”.', 'Simplify: keep at most 5 elements and group the rest under “Other”.') },
            { id: 'd7', text: cap('Aliniază elementele, egalizează spațierea și elimină liniile care se încrucișează.', 'Align the elements, equalize the spacing and remove any crossing lines.') },
            { id: 'd8', text: cap('Verifică ortografia tuturor etichetelor și corectează orice literă greșită.', 'Check the spelling of every label and fix any wrong letter.') },
            { id: 'd9', text: cap('Dă-mi același vizual pe fundal transparent, în format 16:9.', 'Give me the same visual on a transparent background, in 16:9 format.') },
            { id: 'd10', text: cap('Redă acest vizual ca cod Mermaid, ca să-l pot edita.', 'Give me this visual as Mermaid code so I can edit it.') },
            { id: 'd11', text: cap('Refă-l ca slide PowerPoint (.pptx) cu forme și text native, editabile.', 'Rebuild it as a PowerPoint (.pptx) slide with native, editable shapes and text.') },
            { id: 'd12', text: cap('Scrie datele folosite într-un tabel, ca să verific cifrele din grafic.', 'Write the data you used in a table so I can check the numbers in the chart.') },
            { id: 'd13', text: cap('Adaugă o legendă și o linie de sursă în subsol: [sursa].', 'Add a legend and a source line in the footer: [source].') },
            { id: 'd14', text: cap('Reformulează titlul ca o concluzie, nu ca un subiect.', 'Rephrase the title as a takeaway, not a topic.') },
          ],
        },
      ],
    },
  ];

  const IMG_PRESETS = [
    {
      id: 'flow', name: cap('Flux de proces', 'Process flow'),
      text: {
        ro: { subject: 'procesul de onboarding al unui client B2B, de la contract la prima factură', labels: 'Contract semnat\nCreare cont\nConfigurare\nTraining\nPrima factură', data: '', title: 'Onboarding în 14 zile' },
        en: { subject: 'the onboarding process of a B2B customer, from contract to first invoice', labels: 'Contract signed\nAccount creation\nSetup\nTraining\nFirst invoice', data: '', title: 'Onboarding in 14 days' },
      },
      single: { vtype: 'flowchart', flow: 'ltr', density: 'airy', vstyle: 'corporate', vpalette: 'blue', ratio: 'wide', use: 'slide', bg: 'white', deliv: 'img' },
      picks: ['numbers', 'arrows', 'rounded', 'exact', 'big', 'titlespace', 'av_invent'],
    },
    {
      id: 'swot', name: cap('Analiză SWOT', 'SWOT analysis'),
      text: {
        ro: { subject: 'analiza SWOT pentru lansarea unei aplicații mobile de livrări', labels: 'Puncte forte\nPuncte slabe\nOportunități\nAmenințări', data: '', title: '' },
        en: { subject: 'a SWOT analysis for launching a mobile delivery app', labels: 'Strengths\nWeaknesses\nOpportunities\nThreats', data: '', title: '' },
      },
      single: { vtype: 'swot', density: 'balanced', vstyle: 'minimal', vpalette: 'neutral', ratio: 'land', use: 'report', bg: 'white', deliv: 'img' },
      picks: ['rounded', 'zones', 'exact', 'sans', 'av_invent', 'av_3d'],
    },
    {
      id: 'matrix', name: cap('Matrice 2×2', '2×2 matrix'),
      text: {
        ro: { subject: 'prioritizarea inițiativelor după impact și efort', labels: 'Impact mare, efort mic: Fă acum\nImpact mare, efort mare: Planifică\nImpact mic, efort mic: Poate\nImpact mic, efort mare: Evită', data: '', title: 'Începem cu inițiativele cu impact mare și efort mic' },
        en: { subject: 'prioritizing initiatives by impact and effort', labels: 'High impact, low effort: Do now\nHigh impact, high effort: Plan\nLow impact, low effort: Maybe\nLow impact, high effort: Avoid', data: '', title: 'We start with high-impact, low-effort initiatives' },
      },
      single: { vtype: 'matrix', vstyle: 'consulting', vpalette: 'neutral', ratio: 'wide', use: 'slide', bg: 'white', deliv: 'img' },
      picks: ['highlight', 'takeaway', 'exact', 'big', 'av_invent'],
    },
    {
      id: 'bar', name: cap('Grafic cu bare', 'Bar chart'),
      text: {
        ro: { subject: 'veniturile trimestriale în 2025', labels: '', data: 'T1: 120.000 €\nT2: 150.000 €\nT3: 180.000 €\nT4: 210.000 €', title: 'Veniturile au crescut cu 75% în 2025' },
        en: { subject: 'quarterly revenue in 2025', labels: '', data: 'Q1: €120,000\nQ2: €150,000\nQ3: €180,000\nQ4: €210,000', title: 'Revenue grew 75% in 2025' },
      },
      single: { vtype: 'bar', vstyle: 'consulting', vpalette: 'neutral', ratio: 'wide', use: 'slide', bg: 'white', deliv: 'img' },
      picks: ['highlight', 'takeaway', 'bignum', 'source', 'exact', 'av_invent', 'av_3d'],
    },
    {
      id: 'roadmap', name: cap('Roadmap de produs', 'Product roadmap'),
      text: {
        ro: { subject: 'roadmap de produs pe 4 trimestre', labels: 'T1: Lansare MVP\nT2: Integrări\nT3: Aplicația mobilă\nT4: Extindere internațională', data: '', title: '' },
        en: { subject: 'a 4-quarter product roadmap', labels: 'Q1: MVP launch\nQ2: Integrations\nQ3: Mobile app\nQ4: International expansion', data: '', title: '' },
      },
      single: { vtype: 'roadmap', flow: 'ltr', vstyle: 'modern', vpalette: 'category', ratio: 'wide', use: 'slide', bg: 'white', deliv: 'pptx' },
      picks: ['category', 'rounded', 'legend', 'exact', 'big', 'titlespace'],
    },
    {
      id: 'org', name: cap('Organigramă', 'Org chart'),
      text: {
        ro: { subject: 'structura unei echipe de produs', labels: 'Director produs\nManager produs\nLead design\nLead inginerie\n3 ingineri', data: '', title: '' },
        en: { subject: 'the structure of a product team', labels: 'Head of Product\nProduct Manager\nDesign Lead\nEngineering Lead\n3 Engineers', data: '', title: '' },
      },
      single: { vtype: 'org', flow: 'ttb', density: 'balanced', vstyle: 'corporate', vpalette: 'blue', ratio: 'land', use: 'report', bg: 'white', deliv: 'img' },
      picks: ['ortho', 'rounded', 'exact', 'short', 'av_cross'],
    },
    {
      id: 'funnel', name: cap('Pâlnie de vânzări', 'Sales funnel'),
      text: {
        ro: { subject: 'pâlnia de vânzări de la vizitatori la clienți', labels: 'Vizitatori: 10.000\nLeaduri: 1.200\nOferte: 300\nClienți: 60', data: '', title: 'Doar 0,6% din vizitatori devin clienți' },
        en: { subject: 'the sales funnel from visitors to customers', labels: 'Visitors: 10,000\nLeads: 1,200\nProposals: 300\nCustomers: 60', data: '', title: 'Only 0.6% of visitors become customers' },
      },
      single: { vtype: 'funnel', flow: 'ttb', vstyle: 'flat', vpalette: 'blue', ratio: 'wide', use: 'slide', bg: 'white', deliv: 'img' },
      picks: ['bignum', 'takeaway', 'exact', 'noshadow', 'av_invent'],
    },
  ];

  /* ---------------------------------------------------------------
     ANTI-HALUCINAȚII
     phrases: copy:false = se bifează și se combină; copy:true = se copiază una câte una
  ---------------------------------------------------------------- */
  const ph = (id, ro, en) => ({ id, text: { ro, en } });

  const VER_PAGES = [
    {
      id: 'ground', label: cap('Bază factuală', 'Grounding'),
      groups: [{
        id: 'ground', kind: 'phrases', copy: false, items: [
          ph('g1', 'Dacă nu ești sigur, spune „nu sunt sigur” în loc să ghicești.', "If you're not sure, say “I'm not sure” instead of guessing."),
          ph('g2', 'Răspunde doar pe baza informațiilor din textul de mai jos. Dacă răspunsul nu e acolo, spune că nu e acolo.', "Answer only from the information in the text below. If the answer isn't there, say it isn't there."),
          ph('g3', 'Nu inventa nume, date, cifre, citate, linkuri sau referințe bibliografice.', 'Do not invent names, dates, figures, quotes, links, or bibliographic references.'),
          ph('g4', 'Dacă întrebarea pornește de la o premisă falsă, corectează premisa înainte să răspunzi.', 'If the question rests on a false premise, correct the premise before answering.'),
          ph('g5', 'Dacă subiectul poate fi mai nou decât datele tale de antrenare, spune-mi asta în loc să presupui.', 'If the topic may be newer than your training data, tell me so instead of assuming.'),
          ph('g6', 'Dacă nu ai acces la internet sau la sursa respectivă, spune-o explicit; nu simula că ai verificat.', "If you can't browse or access that source, say so explicitly; don't pretend you checked."),
          ph('g7', 'Spune-mi ce nu știi și ce ar trebui verificat înainte să mă bazez pe răspuns.', "Tell me what you don't know and what I should verify before relying on this."),
          ph('g8', 'Dacă informația nu face parte din ce știi sigur, spune „nu știu”; nu completa golurile.', 'If the information isn\'t something you know reliably, say “I don\'t know”; don\'t fill the gaps.'),
        ],
      }],
    },
    {
      id: 'sources', label: cap('Surse', 'Sources'),
      groups: [{
        id: 'sources', kind: 'phrases', copy: false, items: [
          ph('s1', 'Pentru fiecare afirmație factuală, indică sursa. Dacă nu ai o sursă reală, marchează afirmația ca „fără sursă”.', 'For every factual claim, give the source. If you don\'t have a real source, mark the claim “unsourced”.'),
          ph('s2', 'Citează între ghilimele pasajul exact pe care te bazezi, apoi răspunde.', 'Quote the exact passage you rely on, in quotation marks, then answer.'),
          ph('s3', 'Nu da linkuri decât dacă ești sigur că există. Dacă menționezi o carte sau un articol, spune cât de sigur ești că există.', "Don't give links unless you're certain they exist. If you mention a book or article, say how sure you are it exists."),
          ph('s4', 'Separă clar ce citezi din sursă de ce deduci tu.', 'Clearly separate what you quote from the source from what you infer.'),
          ph('s5', 'La finalul fiecărei afirmații importante adaugă [sursă: …] sau [fără sursă].', 'At the end of each important claim, add [source: …] or [no source].'),
        ],
      }],
    },
    {
      id: 'conf', label: cap('Încredere', 'Confidence'),
      groups: [{
        id: 'conf', kind: 'phrases', copy: false, items: [
          ph('c1', 'Etichetează fiecare afirmație cu un nivel de încredere: sigur, probabil sau nesigur.', 'Label each claim with a confidence level: certain, likely, or uncertain.'),
          ph('c2', 'Dă un procent de încredere pentru răspunsul final și explică ce l-ar scădea.', 'Give a confidence percentage for the final answer and explain what would lower it.'),
          ph('c3', 'Marchează clar ce e fapt, ce e estimare și ce e presupunere.', 'Clearly mark what is fact, what is estimate, and what is assumption.'),
          ph('c4', 'Dacă există păreri diferite, prezintă-le pe toate; nu alege una în tăcere.', "If there are differing views, present them all; don't silently pick one."),
        ],
      }],
    },
    {
      id: 'numbers', label: cap('Cifre și cod', 'Numbers and code'),
      groups: [{
        id: 'numbers', kind: 'phrases', copy: false, items: [
          ph('n1', 'Arată calculul pas cu pas și verifică rezultatul printr-o a doua metodă.', 'Show the calculation step by step and check the result with a second method.'),
          ph('n2', 'Nu aproxima cifre pe care nu le ai. Dacă nu ai valoarea exactă, spune „nu am valoarea exactă”.', 'Don\'t approximate figures you don\'t have. If you lack the exact value, say “I don\'t have the exact value.”'),
          ph('n3', 'Pentru cod: nu inventa funcții, biblioteci sau parametri. Dacă nu ești sigur că există, spune asta și indică documentația unde pot verifica.', "For code: don't invent functions, libraries, or parameters. If you're unsure something exists, say so and point to the documentation where I can check."),
          ph('n4', 'Specifică versiunea limbajului sau a bibliotecii pentru care e valabil codul.', 'State the language or library version the code applies to.'),
          ph('n5', 'Nu atribui citate unor persoane decât dacă ești sigur de autor; altfel scrie „citat atribuit, neverificat”.', "Don't attribute quotes to people unless you're sure of the author; otherwise write “attributed quote, unverified.”"),
          ph('n6', 'Pentru date și ani: dacă nu ești sigur, dă un interval în loc de o dată exactă.', "For dates and years: if you're unsure, give a range instead of an exact date."),
        ],
      }],
    },
    {
      id: 'structure', label: cap('Structură', 'Structure'),
      groups: [{
        id: 'structure', kind: 'phrases', copy: false, items: [
          ph('f1', 'Împarte răspunsul în trei secțiuni: Fapte verificabile, Estimări, Ce nu știu.', "Split the answer into three sections: Verifiable facts, Estimates, What I don't know."),
          ph('f2', 'La final adaugă o listă „De verificat” cu afirmațiile pe care ar trebui să le confirm din alte surse.', 'At the end, add a “To verify” list with the claims I should confirm elsewhere.'),
          ph('f3', 'Prezintă afirmațiile într-un tabel cu coloanele: afirmație, sursă, nivel de încredere.', 'Present the claims in a table with columns: claim, source, confidence level.'),
        ],
      }],
    },
    {
      id: 'after', label: cap('După răspuns', 'After the answer'),
      groups: [{
        id: 'after', kind: 'phrases', copy: true,
        caption: cap('Trimite-le ca mesaj separat · click copiază', 'Send as a separate message · click to copy'),
        items: [
          ph('a1', 'Recitește răspunsul și marchează fiecare afirmație pe care nu o poți susține cu o sursă sigură.', "Reread your answer and flag every claim you can't back with a reliable source."),
          ph('a2', 'Ești sigur? Argumentează de ce da sau de ce nu, fără să te răzgândești doar pentru că am întrebat.', "Are you sure? Argue why or why not, without changing your mind just because I asked."),
          ph('a3', 'Generează 3 întrebări de verificare pentru afirmațiile cheie, răspunde-le separat, apoi corectează răspunsul inițial dacă apar contradicții.', 'Generate 3 verification questions for the key claims, answer them separately, then correct your original answer if contradictions appear.'),
          ph('a4', 'Argumentează împotriva propriului tău răspuns, apoi spune ce rămâne în picioare.', 'Argue against your own answer, then say what still stands.'),
          ph('a5', 'Refă răspunsul de la zero, fără să te uiți la cel anterior, și compară cele două versiuni.', 'Redo the answer from scratch without looking at the previous one, and compare the two versions.'),
          ph('a6', 'Listează presupunerile pe care te-ai bazat. Care dintre ele ar putea fi false?', 'List the assumptions you relied on. Which of them could be false?'),
          ph('a7', 'Care e cel mai slab punct al răspunsului tău?', 'What is the weakest point of your answer?'),
          ph('a8', 'Verifică-ți răspunsul pas cu pas și spune-mi dacă ai greșit ceva.', 'Check your answer step by step and tell me if you got anything wrong.'),
          ph('a9', 'Care afirmații din răspunsul tău ar trebui să le verific eu din altă sursă?', 'Which claims in your answer should I verify from another source?'),
        ],
      }],
    },
  ];

  const VER_PRESETS = [
    { id: 'strict', name: cap('Fapte stricte', 'Strict facts'), picks: ['g1', 'g3', 'g4', 'g8', 's1', 'c3'] },
    { id: 'given', name: cap('Doar din sursa dată', 'Only from the given source'), picks: ['g2', 's2', 's4', 'g8'] },
    { id: 'research', name: cap('Cercetare', 'Research'), picks: ['g5', 'g6', 's1', 's3', 'c1', 'c4', 'f2'] },
    { id: 'code', name: cap('Cod', 'Code'), picks: ['g1', 'g3', 'n3', 'n4'] },
    { id: 'numbers', name: cap('Cifre și date', 'Figures and dates'), picks: ['n1', 'n2', 'n6', 'c2'] },
  ];

  window.PROMPT_DATA = { I18N, SYS_PAGES, CONFLICTS, PRM_SECTIONS, SYS_PRESETS, PRM_PRESETS, IMG_PAGES, IMG_PRESETS, VER_PAGES, VER_PRESETS };
})();
