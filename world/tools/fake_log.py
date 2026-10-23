import argparse,json,random,sys
NAMES=['Pip','Lumo','Fen','Wisp','Dusk','Sable','Rook','Tamsin','Odo','Bram','Curd','Meeple']
INTERESTS=['beekeeping','jazz','deep-sea creatures','volcanoes','mushrooms','Japanese woodblock prints','chess openings','Formula 1','the Apollo program','Byzantine history','cheese making','board game design']
MODELS=['llada2.2-mini','dream-v0-instruct-7b','qwen3.5-9b','gemma-4-e4b']
STATES=['studying','playing','helping','serving_owner','resting']
TOOLS=['search','open_page','save_note','load_skill','ask_peer','answer']
def generate(seed,minutes):
 r=random.Random(seed); events=[]; nodes=[dict(node=f'node-{i+1:02}',name=n,model=MODELS[i//3],engine='diffusion' if i<6 else 'ar',interest=INTERESTS[i],space='cabin',library_pages=[30,100,200][i%3]) for i,n in enumerate(NAMES)]
 def emit(t,i,event,detail,**extra):
  events.append(dict(t=round(t,3),run=f'fake-{seed:03}',node=nodes[i]['node'] if i>=0 else 'sim',model=nodes[i]['model'] if i>=0 else 'sim',event=event,detail=detail,**extra))
 emit(0,-1,'roster',dict(nodes=nodes)); end=minutes*60
 for i in range(12):
  t=0; cycle=i
  while t<end:
   state=STATES[cycle%5]; detail=dict(state=state)
   if state=='playing': detail['partner']=nodes[i^1]['node']
   emit(t,i,'state',detail)
   for j,tool in enumerate({'studying':TOOLS[:4],'helping':['ask_peer'],'serving_owner':['answer'],'playing':['load_skill'],'resting':[]}[state]):
    if t+4+j*3<end: emit(t+4+j*3,i,'tool_call',dict(tool=tool,arg=INTERESTS[i]))
   if state in ['helping','serving_owner'] and t+16<end:
    to=(i+5)%12; mode=r.choice(['forward','text_help','canvas']); mid=f'{i}-{cycle}'; latency=r.randint(50,200)
    for at,src,dst,kind,declined in [(t+6,i,to,'request',False),(t+12,to,i,'reply',r.random()<.25)]:
     emit(at,src,'message_sent',dict(msg_id=mid,kind=kind,to=nodes[dst]['node'],mode=mode,**({'declined':declined} if kind=='reply' else {})),sim_latency_ms=latency)
     emit(at+latency/1000,dst,'message_received',dict(msg_id=mid,kind=kind,**{'from':nodes[src]['node']},mode=mode))
    emit(t+16,i,'answer',dict(question_id=mid,correct=r.choice([True,False])))
   t+=r.uniform(30,120); cycle+=1
 # A compact busy burst; the opening resting intervals provide quieter passages.
 for j in range(100):
  t=min(end*.4,120)+j*.08
  if t<end: emit(t,j%12,'tool_call',dict(tool=TOOLS[j%6],arg='Busy afternoon correspondence'))
 return sorted(events,key=lambda e:e['t'])
def check(path):
 errors=[]; previous=-1; roster=set()
 for number,line in enumerate(open(path,encoding='utf-8-sig'),1):
  try:
   e=json.loads(line); assert all(k in e for k in ['t','run','node','model','event','detail']),'missing envelope field'
   assert isinstance(e['t'],(int,float)) and e['t']>=previous,'timestamps must be sorted'; previous=e['t']; d=e['detail']; assert isinstance(d,dict),'detail must be an object'
   if number==1: assert e['event']=='roster','first event must be roster'
   if e['event']=='roster':
    for n in d['nodes']:
     assert all(k in n for k in ['node','name','model','engine','interest','space','library_pages']),'incomplete roster'
     assert n['engine'] in ['ar','diffusion']; assert isinstance(n['library_pages'],int) and n['library_pages']>=0
     assert n['node'] not in roster,'duplicate node'; roster.add(n['node'])
   elif e['event'] in ['state','tool_call','message_sent','message_received','answer']:
    assert e['node'] in roster,'unknown node'
    if e['event']=='state':
     assert d['state'] in STATES
     if d['state']=='playing': assert d['partner'] in roster
    if e['event']=='tool_call': assert d['tool'] in TOOLS and isinstance(d['arg'],str)
    if e['event'].startswith('message_'):
     assert d['kind'] in ['request','reply'] and d['mode'] in ['forward','text_help','canvas']; assert isinstance(d['msg_id'],str)
     assert d['to' if e['event']=='message_sent' else 'from'] in roster
     if 'declined' in d: assert isinstance(d['declined'],bool) and d['kind']=='reply'
    if e['event']=='answer':
     assert isinstance(d['question_id'],str)
     if 'correct' in d: assert isinstance(d['correct'],bool)
  except (ValueError,KeyError,AssertionError,TypeError) as ex: errors.append(f'line {number}: {ex or "invalid field value"}')
 if previous<0: errors.append('empty log')
 print('\n'.join(errors) if errors else 'OK'); return bool(errors)
if __name__=='__main__':
 p=argparse.ArgumentParser(); p.add_argument('--seed',type=int,default=1); p.add_argument('--minutes',type=float,default=10); p.add_argument('--check'); a=p.parse_args()
 if a.check: sys.exit(check(a.check))
 for e in generate(a.seed,a.minutes): print(json.dumps(e,separators=(',',':')))
