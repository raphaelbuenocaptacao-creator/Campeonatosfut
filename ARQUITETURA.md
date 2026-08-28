# Campeonato Foot — Arquitetura de Produção

## Objetivo
Transformar o MVP atual em uma plataforma real de campeonatos de futebol mobile, com jogadores em cidades diferentes, partidas externas ao app e validação de resultados dentro da Sala CF.

## Fluxo oficial da partida
1. Jogador entra em torneio ou desafio.
2. Sistema cria uma `match_room` única.
3. Os dois jogadores fazem check-in.
4. IDs/nicks do jogo são liberados.
5. Os jogadores disputam a partida no eFootball/PES ou jogo homologado.
6. Cada jogador informa o placar e envia prova.
7. Backend compara os dois envios.
8. Placar espelhado e compatível: validação automática.
9. Placar conflitante: cria uma disputa e bloqueia o chaveamento.
10. Admin analisa provas e toma decisão.
11. Resultado final atualiza ranking, histórico e chaveamento.

## Entidades principais

### users
- id
- name
- nickname
- email
- birth_date
- city
- state
- game_id
- platform
- avatar_url
- role: player | moderator | admin
- fair_play_score
- rating
- status
- created_at

### tournaments
- id
- name
- format: knockout | groups | league
- game
- max_players
- entry_type
- entry_credits
- prize_credits
- starts_at
- status

### tournament_entries
- id
- tournament_id
- user_id
- seed
- status
- created_at

### match_rooms
- id
- room_code
- tournament_id nullable
- player_a_id
- player_b_id
- player_a_checkin_at
- player_b_checkin_at
- scheduled_at
- status
- round
- winner_id nullable
- created_at

### match_submissions
- id
- match_room_id
- user_id
- goals_for
- goals_against
- proof_url
- proof_type: image | video
- submitted_at
- device_fingerprint optional

### disputes
- id
- match_room_id
- reason
- status: pending | reviewing | resolved
- moderator_id
- decision
- notes
- created_at
- resolved_at

### match_events
Auditoria imutável de tudo que aconteceu na partida.
- id
- match_room_id
- actor_id
- type
- payload
- created_at

### wallets
Somente para créditos virtuais no MVP.
- id
- user_id
- balance
- updated_at

### wallet_transactions
- id
- wallet_id
- type: credit | debit
- amount
- reason
- reference_id
- created_at

## Regra de validação automática
Se A envia `3 x 2`, B precisa enviar `2 x 3`.

Pseudo-regra:

```
submissionA.goals_for === submissionB.goals_against
&& submissionA.goals_against === submissionB.goals_for
```

Se verdadeiro:
- match_room.status = validated
- winner_id calculado pelo placar
- chaveamento avança automaticamente
- rating e histórico são atualizados

Se falso:
- match_room.status = disputed
- criar registro em disputes
- nenhum jogador avança até decisão

## Provas
Mínimo recomendado:
- print da tela final para partidas comuns
- vídeo/gravação de tela para semifinais, finais ou partidas sinalizadas
- armazenar URL, tipo, tamanho e horário do upload
- preservar o arquivo original
- não permitir que um jogador visualize a prova do outro antes de enviar a própria

## Segurança e antifraude
- autenticação real
- sessão por dispositivo
- rate limit
- upload assinado
- hash do arquivo original
- log de auditoria
- bloqueio de edição depois do envio
- detecção de múltiplas contas
- histórico de punições
- fair play score
- denúncias
- moderação administrativa

## Chaveamento
O backend deve ser a única fonte da verdade. O frontend nunca decide quem avançou sozinho.

Estados sugeridos:
- scheduled
- checkin
- ready
- playing
- awaiting_results
- validating
- validated
- disputed
- cancelled
- walkover

## Stack sugerida
Frontend atual: PWA estática.
Backend recomendado: API + PostgreSQL + Storage.

O projeto pode ser conectado à AUREON BASE ou outro backend compatível, desde que tenha:
- Auth
- PostgreSQL
- Storage privado
- políticas por usuário
- logs
- funções/transações para validar resultados

## Dinheiro real
A arquitetura atual deve continuar com créditos virtuais. A ativação de depósito, saque, aposta ou prêmio em dinheiro real precisa ser tratada como um módulo separado, somente após validação jurídica, idade/KYC, antifraude, regras fiscais e uso de provedores autorizados.

## Próxima implementação
1. Login/cadastro real.
2. Banco com tabelas acima.
3. Storage privado para provas.
4. Sala CF criada pela API.
5. Realtime para check-in/status.
6. Função de validação automática.
7. Painel admin conectado às disputas.
8. Chaveamento automático.
9. Notificações push.
10. Métricas de retenção, partidas e fair play.
