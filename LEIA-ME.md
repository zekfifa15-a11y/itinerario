# İstanbul · A dois — versão 6 (offline de verdade)

Esta versão substitui a v5. O roteiro é o mesmo (14 dias, 58 lugares, PT/EN/TR, circuitos de 80 min, intervalo de segunda, chegada pelo IST), com:

- **Mapa de İstanbul que funciona sem internet**: ruas, nomes, metrô, bonde e balsas ficam salvos no celular (≈18 MB, baixados uma vez).
- **GPS funcionando em modo avião**: o ponto azul, a bússola e o "seguir minha posição" usam o GPS do próprio celular.
- **Rotas certinhas no mapa**: caminhadas reais pelas ruas (verde tracejado) e trajetos de transporte (roxo contínuo) desenhados sobre as linhas de verdade — T1, T5, M11, M2, balsas Karaköy ⇄ Kadıköy/Üsküdar, Kabataş → Büyükada e ônibus da orla.
- **"Ir agora" offline**: calcula no próprio celular a rota a pé da sua posição até o lugar (rede de calçadas do OpenStreetMap) e avisa quando você chegou.
- **Concluídos**: ao tocar em *Concluir*, o lugar sai da lista do dia e vai para a seção **Concluídos** (no dia, em Lugares e nos circuitos de 80 min). *Desfazer* devolve para o roteiro. O mesmo vale para os passos da chegada (21/10) e da partida (4/11).
- **Logo nova** (Torre de Galata num arco otomano, com o Bósforo) e visual novo, com modo escuro automático.
- **Não precisa mais de chave do Google nem de faturamento.** Os botões "Google Maps" continuam como atalho opcional quando houver internet.

Também foi corrigido: pouso no IST às **11:15** e volta em **4/11** (voo 20:35). O dia 3/11 ficou livre (terça sem aulas) e o 4/11 traz o passo a passo até o aeroporto.

## Novidades da versão 6.1 (11/10)

- **Todos os dias de aula vocês vão juntos para a faculdade.** Nos dias 23, 26, 28, 30/10 e 2/11 o passeio sai da própria faculdade quando a aula termina, e a primeira parada é sempre comida (Hafız Mustafa logo depois da faculdade, Roll Pastry & Pitta etc.).
- **Pelo menos 2h30 entre um lugar de comida e outro**: os horários se ajustam sozinhos.
- 22/10: saiu a Cisterna Basílica; entrou o Old Hipodrom depois da Mesquita Azul, e o ingresso combinado de Ayasofya + Mesquita Azul aparece no dia.
- 23/10: rota da faculdade até o Patriarcado de São Jorge (Fener), passando antes pelo Hafız Mustafa de Beyazıt.
- Viyana Kahvesi Galata duas vezes: domingo 25/10 à tarde e segunda 26/10 à noite.
- Roll Pastry & Pitta (o link que você mandou) na segunda 26/10, logo depois da aula.
- Botão **"Ver no Google · fotos e avaliações"** em todos os lugares.
- Chegada do IST ao Airbnb e volta ao IST (4/11), as duas de metrô, muito detalhadas: placas, máquina do Istanbulkart passo a passo, sentido certo de cada trem, nome de cada parada e o que fazer se passar do ponto.
- **Área privada com senha** nos dias 21, 22 e 28: o conteúdo que você pediu para proteger vai **criptografado** no site — quem abrir o GitHub não consegue ler sem a senha, e a senha não está escrita em nenhum arquivo. Depois de digitar a senha, ela vale até você fechar o app ou tocar em *Bloquear de novo* (em Guia).

## Novidades da versão 6.2 (11/10)

- **Hora de sair de casa em todos os trechos**: cada trecho mostra "Sair HH:MM → chega HH:MM", e ao abrir o trecho aparece o relógio de cada etapa (a pé até a estação, embarque, onde descer). Os horários usam o tempo real de cada rota (bonde, metrô, balsa, ônibus), não uma estimativa genérica.
- **Acordar e sair**: no topo de cada dia aparece "Acordar · Sair". Nos dias de aula cedo há o cartão *Ida para a faculdade* com a hora de sair, o bonde T1 e a chegada antes da aula.
- **Café da manhã**: nos dias sem aula de manhã o dia começa num café da manhã com nota 4,7 ou mais perto de casa ou do caminho; nos dias de aula, café em casa com a **lista de mercado** (dia 21 e Guia). Em *Lugares* há o filtro **Café da manhã**.
- **Almoços e jantares com nota alta** (4,7+) em Sultanahmet, Gülhane, Ortaköy e Kadıköy.
- **Istanbulkart**: o app calcula, com o seu roteiro, quanto carregar no aeroporto para os 7 primeiros dias e quanto recarregar depois (dia 21 e Guia).
- **Chegada**: diagrama com todas as estações do M11 e do M2 em ordem, onde embarcar, onde trocar e onde descer, com horário aproximado, e **mapinhas de cada etapa**. No mapa do dia 21 o trajeto do aeroporto aparece com o nome de cada estação.
- **Ida e volta separadas em todos os mapas**: cada linha corre do lado direito do sentido em que você anda, com setas; a volta tem outra cor (azul a pé, rosa no transporte).
- 23/10 sem museu (saiu o İstanbul Modern).

## Novidades da versão 6.3 (14/10)

- **Mapas sempre arrastáveis**: o mapa grande responde a arrastar e pinçar em qualquer tela, e arrastar desliga o "seguir minha posição" para o GPS não puxar o mapa de volta. Os mapinhas da chegada (dia 21) viram um mapa de verdade ao tocar — dá para arrastar e dar zoom ali mesmo, ou abrir em tela cheia.
- Ajustes de roteiro: compras na İstiklal e almoço de folhas de uva no azeite em 3/11, Çiya Sofrası em Kadıköy em 31/10, Eminönü mais enxuto em 2/11.

## Atualizar o seu site no GitHub Pages

1. Extraia o ZIP. Dentro da pasta `istanbul-a-dois-v6` estão `index.html`, `sw.js`, `app.js`, `data.js` e as pastas `img`, `map`, `fonts`, `icons`, `vendor`.
2. No seu repositório (`istanbul-a-dois`), apague a pasta antiga **`assets`** e os arquivos antigos `icon-180.png`, `icon-192.png`, `icon-512.png` e `maps-config.json` (não são mais usados). Pode apagar também os `REVISAO-*.md` e o `LEIA-ME-GITHUB-PAGES.md` antigos.
3. **Add file → Upload files** e arraste **o conteúdo** da pasta `istanbul-a-dois-v6` (não a pasta em si). São menos de 100 arquivos e nenhum passa de 25 MB, então cabe num envio só. Se o navegador reclamar, envie primeiro tudo menos `img`, e depois a pasta `img`.
4. **Commit changes**. Em 1–2 minutos o endereço `https://SEU_USUARIO.github.io/istanbul-a-dois/` mostra a versão nova.

As marcações que você já fez na v5 (visitados, lixeira, lugares adicionados) são trazidas automaticamente na primeira abertura, no mesmo aparelho e no mesmo endereço.

## Deixar pronto para usar sem internet

1. No iPhone, abra o endereço no **Safari** com internet → **Compartilhar → Adicionar à Tela de Início**.
2. **Abra pelo ícone novo** (o app instalado tem armazenamento próprio, separado do Safari) e espere o selo no topo mostrar **"Mapa offline ✓"**. Em *Guia → Mapa offline de İstanbul* aparecem os três arquivos com ✓.
3. Teste: ative o **modo avião**, feche e abra o app. Roteiro, fotos, mapa, rotas e GPS devem continuar funcionando. Em *Ajustes → Privacidade → Serviços de Localização*, deixe o Safari/app com permissão de localização.

Se a v5 já estava na Tela de Início, **apague o ícone antigo e adicione de novo** para aparecer a logo nova — faça isso antes de marcar lugares, porque no iPhone apagar o ícone apaga os dados guardados nele.

No Android: Chrome → ⋮ → **Instalar app**, e o mesmo teste.

## O que funciona offline e o que precisa de internet

| Funciona sem internet | Precisa de internet |
| --- | --- |
| Roteiro, horários, Concluídos, lixeira, lugares adicionados | Abrir o Google Maps (botões "Google") |
| Mapa de İstanbul (centro detalhado; arredores e aeroporto em escala de cidade) | Horários em tempo real de metrô, ônibus e balsa |
| GPS, bússola e "seguir minha posição" | Links de fontes, reservas e ingressos |
| Rotas planejadas do roteiro (a pé e transporte) | Atualizar o app quando houver versão nova |
| "Ir agora" a pé, calculado no celular (Fatih, Beyoğlu, Beşiktaş, Üsküdar, Kadıköy) | |

Limites honestos: as linhas de transporte mostram **o caminho**, não o horário — confira a frequência no dia, como antes. Fora da área central (por exemplo em Büyükada ou no aeroporto) o "Ir agora" usa a rota planejada ou uma linha reta indicativa. Os horários de saída são calculados pelo trajeto e incluem alguns minutos para achar a plataforma; em hora de pico saia um pouco antes.

## Dicas de uso

- **Toque longo no mapa** cria um ponto seu (por exemplo, um café que a Zeynep indicou) e o coloca no dia escolhido.
- Em cada parada: *Concluir*, *Mapa* e *Ir agora*. Tocar no cartão abre horário, preço, reserva e fontes.
- Toque num trecho entre duas paradas para ver o passo a passo (linha, sentido, número de paradas) e abri-lo no mapa.
- *Guia → Seus dados neste aparelho* permite zerar os concluídos ou tudo.

## Privacidade

O repositório e o site do GitHub Pages são **públicos**. Esta versão não contém localizadores, PINs, telefones nem códigos de reserva — mantenha esses dados só no manual de viagem privado. As suas marcações ficam apenas no celular.

## Créditos

Mapa © colaboradores do OpenStreetMap · tiles OpenFreeMap/OpenMapTiles · rotas a pé pré-calculadas com OSRM (FOSSGIS) · renderização MapLibre GL · fotos do Wikimedia Commons e dos próprios estabelecimentos (créditos completos em *Guia → Créditos*).
