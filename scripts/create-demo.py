"""Original, non-sensitive demonstration content; never reads private sources."""
import json
els=[]
def base(t,x,y,w,h,color='#38473c',bg='transparent',level=0):
 i=len(els)+1
 e=dict(id=f'demo-{i}',type=t,x=x,y=y,width=w,height=h,angle=0,strokeColor=color,backgroundColor=bg,fillStyle='solid',strokeWidth=1.5,strokeStyle='solid',roughness=1.2,opacity=100,groupIds=[],frameId=None,roundness={'type':3} if t=='rectangle' else None,seed=i*13427,version=1,versionNonce=i*7447,isDeleted=False,boundElements=None,updated=1,link=None,locked=False,customData={'minZoom':level})
 els.append(e);return e
def text(s,x,y,size=22,color='#38473c',level=0):
 e=base('text',x,y,max(len(l) for l in s.split('\n'))*size*.56,len(s.split('\n'))*size*1.25,color,level=level)
 e.update(text=s,fontSize=size,fontFamily=1,textAlign='left',verticalAlign='top',containerId=None,originalText=s,autoResize=True,lineHeight=1.25)
def box(title,sub,x,y,w,h,bg):
 base('rectangle',x,y,w,h,bg=bg);text(title,x+24,y+22,30);text(sub,x+24,y+67,18,level=.7)
def arrow(x,y,dx,dy):
 e=base('arrow',x,y,abs(dx),abs(dy),'#839281');e.update(points=[[0,0],[dx*.5,dy*.45],[dx,dy]],lastCommittedPoint=None,startBinding=None,endBinding=None,startArrowhead=None,endArrowhead='arrow',elbowed=False)
arrow(310,230,180,-105);arrow(750,130,170,95);arrow(960,340,-180,180);arrow(480,560,-185,-190);arrow(350,290,175,55);arrow(750,360,180,-50)
box('Notice','Start with a good question',70,190,290,160,'#f7e9be')
box('Connect','Find the links between ideas',470,40,310,155,'#dfead9')
box('Try','Make a small experiment',920,190,290,160,'#e5e4f6')
box('Reflect','Keep what changes your mind',470,520,330,160,'#f4ddd1')
base('ellipse',490,265,290,175,bg='#f9f7ef');text('Learn in loops',525,320,30)
text('a question becomes a connection',400,-20,17,'#7b8377',.7)
text('01  Gather clues',88,385,20,'#6c5a32',1.15);text('Write one question.\nCollect a few observations.\nSeparate facts from guesses.',88,423,17,'#6c5a32',1.15)
text('02  Look for patterns',480,210,19,'#45604b',1.15)
text('03  Make it tangible',940,385,20,'#655c8c',1.15);text('Explain it in your own words.\nBuild a tiny example.\nSee what does not fit.',940,423,17,'#655c8c',1.15)
text('04  Revise the map',490,710,20,'#8b604e',1.15);text('Keep the useful connection. Let the rest change.',490,748,17,'#8b604e',1.15)
text('curiosity → understanding → new curiosity',425,475,17,'#7b8377',.7)
scene=dict(type='excalidraw',version=2,source='https://github.com/allaaaaan/knowledge-map',elements=els,appState={'viewBackgroundColor':'#faf9f5','gridSize':None},files={})
with open('public/map.excalidraw','w') as f:json.dump(scene,f,indent=2)
