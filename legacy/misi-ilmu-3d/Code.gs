/** Misi Ilmu 3D | safiq creates | Apps Script sahaja.
 * Run setupSystem sekali, kemudian deploy Web app: Execute as Me / Anyone.
 * PIN pertama: 123. Guru boleh menukarnya dalam dashboard.
 */
const APP={NAME:'Misi Ilmu 3D',VERSION:'3.0.0'};
function setupSystem(){
 const active=Session.getActiveUser().getEmail(),effective=Session.getEffectiveUser().getEmail();
 if(!active||active!==effective)throw Error("Jalankan setupSystem dalam editor Apps Script menggunakan akaun pemilik projek.");
 const lock=LockService.getScriptLock();lock.waitLock(20000);
 try{
  const p=PropertiesService.getScriptProperties();
  let id=p.getProperty('SPREADSHEET_ID');const ss=id?SpreadsheetApp.openById(id):SpreadsheetApp.create(APP.NAME+' — PBD');
  if(!id)p.setProperty('SPREADSHEET_ID',ss.getId());
  [['Settings',['Key','Value']],['QuizQuestions',['ID','Question JSON']],['Sessions',['ID','Code','Title','Class','Status','Attempts','Created','Snapshot JSON']],['Results',['ID','Timestamp','Session ID','Code','Name','Class','Score','First correct','QuizQuestions','Hints','Seconds','Shots','Correct shots','Evidence JSON','Teacher note','Follow up']]].forEach(([name,headers])=>{
   const s=ss.getSheetByName(name)||ss.insertSheet(name);if(!s.getLastRow()){s.appendRow(headers);s.setFrozenRows(1);s.getRange(1,1,1,headers.length).setBackground('#102b4f').setFontColor('#ffffff').setFontWeight('bold');}
  });
  if(!p.getProperty('ADMIN_SECRET'))p.setProperty('ADMIN_SECRET',Utilities.getUuid()+Utilities.getUuid());
  if(!p.getProperty('PIN_SALT')){p.setProperty('PIN_SALT',Utilities.getUuid());p.setProperty('PIN_HASH',pinHash_('123'));}
  if(!p.getProperty('RUN_SECRET'))p.setProperty('RUN_SECRET',Utilities.getUuid()+Utilities.getUuid());
  const q=ss.getSheetByName('QuizQuestions');if(q.getLastRow()<2){const seed=seedQuestions_();q.getRange(2,1,seed.length,2).setValues(seed.map(x=>[x.bankId,JSON.stringify(x)]));}
  if(!getSetting_('SCHOOL_NAME'))setSetting_('SCHOOL_NAME','Sekolah Saya');
  if(!getSetting_('QUIZ_BANK_REV'))setSetting_('QUIZ_BANK_REV',Utilities.getUuid());
  console.log(JSON.stringify({spreadsheetUrl:ss.getUrl(),next:'Deploy Web app: Me / Anyone. Buka URL /exec. Dashboard: ?page=teacher. PIN pertama 123; setup semula tidak menukar PIN.'}));
 }finally{lock.releaseLock();}
}
function doGet(e){
 const teacher=e&&e.parameter&&e.parameter.page==='teacher';
 const t=HtmlService.createTemplateFromFile(teacher?'Admin':'Index');t.appName=APP.NAME;t.appVersion=APP.VERSION;t.webAppUrl=ScriptApp.getService().getUrl()||'';
 return t.evaluate().setTitle(APP.NAME+(teacher?' · Dashboard Guru':'')).addMetaTag('viewport','width=device-width, initial-scale=1, viewport-fit=cover');
}
function db_(){const id=PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');if(!id)throw Error('Jalankan setupSystem dahulu.');return SpreadsheetApp.openById(id);}
function rows_(name){const s=db_().getSheetByName(name);return s.getLastRow()>1?s.getRange(2,1,s.getLastRow()-1,s.getLastColumn()).getValues():[];}
function getSetting_(key){const r=rows_('Settings').find(r=>r[0]===key);return r?String(r[1]):'';}
function setSetting_(key,value){const s=db_().getSheetByName('Settings'),r=rows_('Settings'),i=r.findIndex(r=>r[0]===key);if(i<0)s.appendRow([key,cell_(value)]);else s.getRange(i+2,2).setValue(cell_(value));}
function cell_(x){const s=String(x==null?'':x);return /^[=+@\-\t\r\n]/.test(s)?"'"+s:s;}
function text_(x,max,required){if(typeof x!=='string'||x.length>max||(required&&!x.trim()))throw Error('Teks kosong atau terlalu panjang.');return x.trim();}
function int_(x,min,max){if(!Number.isInteger(x)||x<min||x>max)throw Error('Nilai nombor tidak sah.');return x;}
function pinHash_(pin){const salt=PropertiesService.getScriptProperties().getProperty('PIN_SALT');return Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(String(pin),salt));}
function sign_(payload,key){const body=Utilities.base64EncodeWebSafe(JSON.stringify(payload));const secret=PropertiesService.getScriptProperties().getProperty(key);return body+'.'+Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(body,secret));}
function verify_(token,key){try{
 if(typeof token!=='string'||token.length>4000)throw Error();const bits=token.split('.');if(bits.length!==2)throw Error();
 const secret=PropertiesService.getScriptProperties().getProperty(key);if(!secret)throw Error();
 const sig=Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(bits[0],secret));if(sig!==bits[1])throw Error();
 const obj=JSON.parse(Utilities.newBlob(Utilities.base64DecodeWebSafe(bits[0])).getDataAsString());if(!Number.isFinite(obj.exp)||obj.exp<Date.now())throw Error();return obj;
 }catch(e){throw Error('Sesi tamat atau tidak sah. Log masuk / mula semula.');}}
function admin_(token){const d=verify_(token,'ADMIN_SECRET');if(d.role!=='teacher')throw Error('Akses guru sahaja.');}
function adminLogin(pin){
 const lock=LockService.getScriptLock();lock.waitLock(10000);
 try{const cache=CacheService.getScriptCache(),fails=Number(cache.get('loginFails')||0);if(fails>=10)throw Error('Terlalu banyak cubaan PIN. Cuba lagi dalam 60 saat.');
 const hash=PropertiesService.getScriptProperties().getProperty('PIN_HASH');if(!hash)throw Error('Jalankan setupSystem dahulu.');
 if(pinHash_(String(pin||''))!==hash){cache.put('loginFails',String(fails+1),60);throw Error('PIN tidak betul.');}
 cache.remove('loginFails');return {token:sign_({role:'teacher',exp:Date.now()+8*3600000},'ADMIN_SECRET'),dashboard:dashboard_()};
 }finally{lock.releaseLock();}
}
function changeAdminPin(token,pin){admin_(token);if(!/^\d{3,10}$/.test(String(pin)))throw Error('Gunakan PIN 3 hingga 10 digit.');const p=PropertiesService.getScriptProperties();p.setProperty('PIN_HASH',pinHash_(pin));p.setProperty('ADMIN_SECRET',Utilities.getUuid()+Utilities.getUuid());return {token:sign_({role:'teacher',exp:Date.now()+8*3600000},'ADMIN_SECRET')};}
function updateSettings(token,school){admin_(token);setSetting_('SCHOOL_NAME',text_(school,100,true));return dashboard_();}
function bank_(){return rows_('QuizQuestions').map(r=>JSON.parse(r[1]));}
function getQuestionBank(token){admin_(token);return {questions:bank_(),revision:getSetting_('QUIZ_BANK_REV')};}
function validateQuestion_(q){
 if(!q||!/^Q-[a-zA-Z0-9-]{1,70}$/.test(q.bankId))throw Error('ID soalan tidak sah.');
 const out={bankId:q.bankId,type:'choice',enabled:q.enabled!==false};
 out.subject=text_(q.subject,70,true);out.topic=text_(q.topic||'',90,false);
 out.title=text_(q.title||out.topic||out.subject,100,true);
 out.instruction=text_(q.instruction,400,true);
 out.standard=text_(q.standard||'',100,false);
 out.evidence=text_(q.evidence||'Menjawab soalan berkaitan '+out.topic,180,false);
 out.hint=text_(q.hint||'',250,false);out.explanation=text_(q.explanation||'',400,false);
 if(!Array.isArray(q.choices)||q.choices.length<2||q.choices.length>4)throw Error('Sediakan 2 hingga 4 pilihan jawapan.');
 out.choices=q.choices.map(c=>text_(c,140,true));
 if(new Set(out.choices).size!==out.choices.length)throw Error('Setiap pilihan jawapan mesti berbeza.');
 out.correct=text_(q.correct,140,true);if(!out.choices.includes(out.correct))throw Error('Pilih satu jawapan betul daripada senarai pilihan.');
 if(JSON.stringify(out).length>2300)throw Error('Soalan terlalu panjang. Ringkaskan teks.');return out;
}
function saveQuestion(token,q,revision){admin_(token);const valid=validateQuestion_(q);const lock=LockService.getScriptLock();lock.waitLock(15000);try{
 if(revision!==getSetting_('QUIZ_BANK_REV'))throw Error('Bank soalan sudah berubah. Muat semula dahulu.');
 const s=db_().getSheetByName('QuizQuestions'),rows=rows_('QuizQuestions'),i=rows.findIndex(r=>r[0]===valid.bankId);if(i<0){if(rows.length>=200)throw Error('Maksimum 200 soalan.');s.appendRow([valid.bankId,JSON.stringify(valid)]);}else s.getRange(i+2,2).setValue(JSON.stringify(valid));
 setSetting_('QUIZ_BANK_REV',Utilities.getUuid());return getQuestionBank(token);
 }finally{lock.releaseLock();}}
function shuffle_(list){const a=list.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function createSession(token,form){
 admin_(token);
 const title=text_(form.title,100,true),cls=text_(form.className||'All classes',40,true),count=int_(Number(form.questionCount),1,50),attempts=int_(Number(form.attemptsAllowed),1,5);
 const subject=text_(form.subject||'',70,false),topic=text_(form.topic||'',90,false);
 const lock=LockService.getScriptLock();lock.waitLock(15000);try{
 const pool=bank_().filter(q=>q.enabled!==false&&(!subject||q.subject===subject)&&(!topic||q.topic===topic));
 if(pool.length<count)throw Error('Hanya '+pool.length+' soalan aktif sepadan. Kurangkan bilangan soalan atau tambah soalan dahulu.');
 const qs=shuffle_(pool).slice(0,count).map(validateQuestion_);
 const snapshot=JSON.stringify(qs);if(snapshot.length>48000)throw Error('Set soalan terlalu panjang. Kurangkan bilangan soalan untuk sesi ini.');
 const rows=rows_('Sessions');let code;do{code=String(Math.floor(100000+Math.random()*900000));}while(rows.some(r=>String(r[1])===code));
 db_().getSheetByName('Sessions').appendRow([Utilities.getUuid(),code,cell_(title),cell_(cls),'OPEN',attempts,new Date().toISOString(),snapshot]);
 return {code,dashboard:dashboard_()};
 }finally{lock.releaseLock();}
}
function session_(code){if(!/^\d{4,6}$/.test(String(code)))throw Error('Kod sesi tidak sah.');const row=rows_('Sessions').find(r=>String(r[1])===String(code));if(!row||row[4]!=='OPEN')throw Error('Kod sesi tidak aktif. Minta kod daripada cikgu.');return row;}
function publicSession_(r){const questions=JSON.parse(r[7]);if(questions.some(q=>!q.subject||q.type!=='choice'))throw Error('Ini sesi versi lama. Cipta sesi baharu dalam Misi Ilmu 3D.');return {active:true,id:r[0],code:String(r[1]),title:r[2],className:r[3],attemptsAllowed:Number(r[5]),questionCount:questions.length,questions};}
function getClassSession(code){return publicSession_(session_(code));}
function startRun(code,name,cls){name=text_(name,80,true);cls=text_(cls,40,true);if(name.length<2)throw Error('Isi nama penuh.');const s=session_(code);if(String(s[3]).toLowerCase()!=='all classes'&&String(s[3]).toLowerCase()!==cls.toLowerCase())throw Error('Nama kelas tidak sama dengan sesi cikgu.');
 if(attempts_(s[0],name,cls)>=Number(s[5]))throw Error('Had cubaan sesi telah dicapai.');const id=Utilities.getUuid();return {id,session:publicSession_(s),token:sign_({id,sid:s[0],code:String(code),name,cls,exp:Date.now()+6*3600000},'RUN_SECRET')};}
function attempts_(id,name,cls){return rows_('Results').filter(r=>r[2]===id&&String(r[4]).toLowerCase()===name.toLowerCase()&&String(r[5]).toLowerCase()===cls.toLowerCase()).length;}
function submitResult(payload){
 if(!payload||JSON.stringify(payload).length>70000)throw Error('Rekod tidak sah / terlalu panjang.');const run=verify_(payload.token,'RUN_SECRET');if(payload.submissionId!==run.id)throw Error('ID rekod tidak sah.');
 const lock=LockService.getScriptLock();lock.waitLock(20000);try{
 const existing=rows_('Results');if(existing.some(r=>r[0]===run.id))return {ok:true,duplicate:true};
 const s=session_(run.code);if(s[0]!==run.sid)throw Error('Sesi berbeza.');if(attempts_(run.sid,run.name,run.cls)>=Number(s[5]))throw Error('Had cubaan sesi telah dicapai.');
 const qs=JSON.parse(s[7]);if(!Array.isArray(payload.details)||payload.details.length!==qs.length)throw Error('Lengkapkan semua soalan.');
 const seen=new Set();const details=payload.details.map(d=>{
  const q=qs.find(q=>q.bankId===d.missionId);if(!q||seen.has(q.bankId))throw Error('Soalan tidak sepadan dengan sesi.');seen.add(q.bankId);
  const response=text_(d.response,250,true);let correct=false,expected='';
  expected=q.correct;correct=response===expected;
  if(!correct)throw Error('Jawapan akhir tidak sepadan. Lengkapkan misi semula.');
  if(!Array.isArray(d.answers)||!d.answers.length||d.answers.length>501||d.answers.some(a=>!q.choices.includes(a))||d.answers[d.answers.length-1]!==expected||d.answers.slice(0,-1).includes(expected))throw Error('Rekod cubaan jawapan tidak sah.');
  const errors=d.answers.length-1,hints=int_(d.hintsUsed,0,100),seconds=int_(d.elapsedSeconds,0,21600);
  const drafts=[];
  return {missionId:q.bankId,title:q.title,subject:q.subject,topic:q.topic,standard:q.standard,evidence:q.evidence,instruction:q.instruction,response,expected,correct,errors,hintsUsed:hints,points:Math.max(3,10-errors*2-hints),seconds,drafts,answers:d.answers.slice(-20),explanation:q.explanation};
 });
 const first=details.filter(d=>d.errors===0).length,hints=details.reduce((a,d)=>a+d.hintsUsed,0),score=Math.round(details.reduce((a,d)=>a+d.points,0)/(qs.length*10)*100);
 const elapsed=int_(payload.elapsedSeconds,0,21600),shots=int_(payload.shots,0,99999),hits=int_(payload.correctShots,0,shots);const detailJSON=JSON.stringify(details);if(detailJSON.length>48000)throw Error('Evidens terlalu panjang.');
 db_().getSheetByName('Results').appendRow([run.id,new Date().toISOString(),run.sid,run.code,cell_(run.name),cell_(run.cls),score,first,qs.length,hints,elapsed,shots,hits,detailJSON,'','']);return {ok:true,score};
 }finally{lock.releaseLock();}}
function setSessionStatus(token,id,status){admin_(token);if(!['OPEN','CLOSED'].includes(status))throw Error('Status tidak sah.');const r=rows_('Sessions'),i=r.findIndex(r=>r[0]===id);if(i<0)throw Error('Sesi tidak ditemui.');db_().getSheetByName('Sessions').getRange(i+2,5).setValue(status);return {dashboard:dashboard_()};}
function resultRows_(){return rows_('Results').map(r=>({submissionId:r[0],timestamp:r[1],sessionId:r[2],code:String(r[3]),name:r[4],className:r[5],score:Number(r[6]),firstCorrect:Number(r[7]),questionCount:Number(r[8]),hintsUsed:Number(r[9]),seconds:Number(r[10]),shots:Number(r[11]),correctShots:Number(r[12]),note:r[14],followUp:r[15]})).reverse();}
function dashboard_(){const results=resultRows_();return {appName:APP.NAME,schoolName:getSetting_('SCHOOL_NAME'),gameUrl:ScriptApp.getService().getUrl()||'',studentCount:new Set(results.map(r=>r.name.toLowerCase()+'|'+r.className.toLowerCase())).size,totalResults:results.length,average:results.length?Math.round(results.reduce((a,r)=>a+r.score,0)/results.length):0,recentResults:results.slice(0,200),sessions:rows_('Sessions').reverse().map(r=>({id:r[0],code:String(r[1]),title:r[2],className:r[3],status:r[4],attemptsAllowed:r[5],subject:[...new Set(JSON.parse(r[7]).map(q=>q.subject||'Versi lama'))].join(', '),questionCount:JSON.parse(r[7]).length,resultCount:results.filter(x=>x.sessionId===r[0]).length}))};}
function getDashboard(token){admin_(token);return dashboard_();}
function exportResults(token){admin_(token);return resultRows_();}
function getSubmissionDetail(token,id){admin_(token);const row=rows_('Results').find(r=>r[0]===id);if(!row)throw Error('Rekod tidak ditemui.');return {submissionId:id,name:row[4],className:row[5],timestamp:row[1],details:JSON.parse(row[13]),note:row[14],followUp:row[15]};}
function saveNote(token,id,note,followUp){admin_(token);note=text_(note,1500,false);followUp=text_(followUp,1500,false);const lock=LockService.getScriptLock();lock.waitLock(10000);try{const rows=rows_('Results'),i=rows.findIndex(r=>r[0]===id);if(i<0)throw Error('Rekod tidak ditemui.');db_().getSheetByName('Results').getRange(i+2,15,1,2).setValues([[cell_(note),cell_(followUp)]]);return {ok:true};}finally{lock.releaseLock();}}

function seedQuestions_(){return [{"bankId":"Q-demo-1","type":"choice","enabled":true,"subject":"Sains","topic":"Pengetahuan Asas Sains","title":"Pengetahuan Asas Sains","instruction":"Antara berikut, yang manakah benda hidup?","choices":["Batu","Kucing","Kerusi","Pensel"],"correct":"Kucing","hint":"Benda hidup memerlukan air dan makanan.","explanation":"Kucing ialah benda hidup yang bernafas, membesar dan memerlukan makanan.","standard":"","evidence":"Menjawab soalan berkaitan Pengetahuan Asas Sains."},{"bankId":"Q-demo-2","type":"choice","enabled":true,"subject":"Sains","topic":"Pengetahuan Asas Sains","title":"Pengetahuan Asas Sains","instruction":"Bahagian tumbuhan manakah menyerap air daripada tanah?","choices":["Daun","Bunga","Akar","Buah"],"correct":"Akar","hint":"Bahagian ini biasanya berada di dalam tanah.","explanation":"Akar menyerap air daripada tanah.","standard":"","evidence":"Menjawab soalan berkaitan Pengetahuan Asas Sains."},{"bankId":"Q-demo-3","type":"choice","enabled":true,"subject":"Sains","topic":"Pengetahuan Asas Sains","title":"Pengetahuan Asas Sains","instruction":"Organ manakah digunakan untuk mendengar?","choices":["Mata","Telinga","Hidung","Lidah"],"correct":"Telinga","hint":"Fikirkan organ deria yang mengesan bunyi.","explanation":"Telinga ialah organ pendengaran.","standard":"","evidence":"Menjawab soalan berkaitan Pengetahuan Asas Sains."},{"bankId":"Q-demo-4","type":"choice","enabled":true,"subject":"Sains","topic":"Pengetahuan Asas Sains","title":"Pengetahuan Asas Sains","instruction":"Apakah yang terbentuk apabila cahaya dihalang oleh objek legap?","choices":["Bayang-bayang","Pelangi","Hujan","Angin"],"correct":"Bayang-bayang","hint":"Lihat kawasan gelap di belakang objek.","explanation":"Objek legap menghalang cahaya lalu menghasilkan bayang-bayang.","standard":"","evidence":"Menjawab soalan berkaitan Pengetahuan Asas Sains."},{"bankId":"Q-demo-5","type":"choice","enabled":true,"subject":"Sains","topic":"Pengetahuan Asas Sains","title":"Pengetahuan Asas Sains","instruction":"Apakah perubahan yang berlaku apabila ais mencair?","choices":["Pepejal menjadi cecair","Cecair menjadi pepejal","Gas menjadi pepejal","Pepejal menjadi gas"],"correct":"Pepejal menjadi cecair","hint":"Ais ialah air dalam keadaan pepejal.","explanation":"Pencairan menukarkan ais yang pepejal kepada air yang cecair.","standard":"","evidence":"Menjawab soalan berkaitan Pengetahuan Asas Sains."},{"bankId":"Q-demo-6","type":"choice","enabled":true,"subject":"RBT","topic":"Asas Pengaturcaraan","title":"Asas Pengaturcaraan","instruction":"Apakah maksud algoritma?","choices":["Urutan langkah menyelesaikan masalah","Nama sebuah komputer","Warna pada skrin","Sejenis bateri"],"correct":"Urutan langkah menyelesaikan masalah","hint":"Fikirkan langkah yang disusun mengikut urutan.","explanation":"Algoritma ialah urutan langkah untuk menyelesaikan masalah atau melaksanakan tugas.","standard":"","evidence":"Menjawab soalan berkaitan Asas Pengaturcaraan."},{"bankId":"Q-demo-7","type":"choice","enabled":true,"subject":"RBT","topic":"Asas Pengaturcaraan","title":"Asas Pengaturcaraan","instruction":"Simbol bujur dalam carta alir biasanya menunjukkan apa?","choices":["Mula atau tamat","Keputusan","Proses","Arah aliran"],"correct":"Mula atau tamat","hint":"Simbol ini berada pada permulaan atau penghujung carta alir.","explanation":"Simbol bujur digunakan untuk menunjukkan mula atau tamat.","standard":"","evidence":"Menjawab soalan berkaitan Asas Pengaturcaraan."},{"bankId":"Q-demo-8","type":"choice","enabled":true,"subject":"RBT","topic":"Asas Pengaturcaraan","title":"Asas Pengaturcaraan","instruction":"Simbol berlian dalam carta alir digunakan untuk apa?","choices":["Membuat keputusan","Memulakan proses","Menamatkan program","Menyambungkan wayar"],"correct":"Membuat keputusan","hint":"Laluan boleh bercabang kepada Ya atau Tidak.","explanation":"Simbol berlian mewakili keputusan, misalnya pilihan Ya atau Tidak.","standard":"","evidence":"Menjawab soalan berkaitan Asas Pengaturcaraan."},{"bankId":"Q-demo-9","type":"choice","enabled":true,"subject":"RBT","topic":"Asas Pengaturcaraan","title":"Asas Pengaturcaraan","instruction":"Yang manakah contoh peranti input?","choices":["Papan kekunci","Pembesar suara","Monitor","Pencetak"],"correct":"Papan kekunci","hint":"Peranti input memasukkan maklumat ke komputer.","explanation":"Papan kekunci digunakan untuk memasukkan teks dan arahan.","standard":"","evidence":"Menjawab soalan berkaitan Asas Pengaturcaraan."},{"bankId":"Q-demo-10","type":"choice","enabled":true,"subject":"RBT","topic":"Asas Pengaturcaraan","title":"Asas Pengaturcaraan","instruction":"Apakah kegunaan arahan ulangan?","choices":["Melaksanakan arahan berulang kali","Memadam semua fail","Menukar warna komputer","Mematikan bekalan elektrik"],"correct":"Melaksanakan arahan berulang kali","hint":"Arahan yang sama dilakukan beberapa kali.","explanation":"Ulangan membolehkan satu atau beberapa arahan dilaksanakan berulang kali.","standard":"","evidence":"Menjawab soalan berkaitan Asas Pengaturcaraan."},{"bankId":"Q-demo-11","type":"choice","enabled":true,"subject":"Pendidikan Islam","topic":"Pengetahuan Asas","title":"Pengetahuan Asas","instruction":"Berapakah bilangan solat fardu dalam sehari?","choices":["Tiga","Empat","Lima","Enam"],"correct":"Lima","hint":"Subuh, Zuhur, Asar, Maghrib dan Isyak.","explanation":"Terdapat lima solat fardu dalam sehari.","standard":"","evidence":"Menjawab soalan berkaitan Pengetahuan Asas."},{"bankId":"Q-demo-12","type":"choice","enabled":true,"subject":"Pendidikan Islam","topic":"Pengetahuan Asas","title":"Pengetahuan Asas","instruction":"Apakah kitab suci umat Islam?","choices":["Al-Quran","Kamus","Atlas","Ensiklopedia"],"correct":"Al-Quran","hint":"Kitab ini diturunkan kepada Nabi Muhammad SAW.","explanation":"Al-Quran ialah kitab suci umat Islam.","standard":"","evidence":"Menjawab soalan berkaitan Pengetahuan Asas."},{"bankId":"Q-demo-13","type":"choice","enabled":true,"subject":"Pendidikan Islam","topic":"Pengetahuan Asas","title":"Pengetahuan Asas","instruction":"Apakah kiblat umat Islam ketika solat?","choices":["Kaabah","Bukit Uhud","Masjid Quba","Gua Hira"],"correct":"Kaabah","hint":"Bangunan ini terletak di Masjidilharam.","explanation":"Umat Islam menghadap arah Kaabah ketika solat.","standard":"","evidence":"Menjawab soalan berkaitan Pengetahuan Asas."},{"bankId":"Q-demo-14","type":"choice","enabled":true,"subject":"Pendidikan Islam","topic":"Pengetahuan Asas","title":"Pengetahuan Asas","instruction":"Pada bulan apakah umat Islam diwajibkan berpuasa?","choices":["Syawal","Ramadan","Muharam","Safar"],"correct":"Ramadan","hint":"Bulan ini datang sebelum Syawal.","explanation":"Puasa diwajibkan pada bulan Ramadan bagi umat Islam yang memenuhi syarat.","standard":"","evidence":"Menjawab soalan berkaitan Pengetahuan Asas."},{"bankId":"Q-demo-15","type":"choice","enabled":true,"subject":"Pendidikan Islam","topic":"Pengetahuan Asas","title":"Pengetahuan Asas","instruction":"Apakah ucapan yang baik sebelum mula makan?","choices":["Bismillah","Selamat malam","Selamat tinggal","Maafkan saya"],"correct":"Bismillah","hint":"Mulakan dengan nama Allah.","explanation":"Membaca Bismillah sebelum makan ialah adab yang baik.","standard":"","evidence":"Menjawab soalan berkaitan Pengetahuan Asas."}];}
