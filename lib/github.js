const OWNER=process.env.GITHUB_OWNER, REPO=process.env.GITHUB_REPO;
const BRANCH=process.env.GITHUB_BRANCH||'main', TOKEN=process.env.GITHUB_TOKEN;
const PATH='data/participants.json';
function config(){
 if(!OWNER||!REPO||!TOKEN) throw Error('Konfigurasi GitHub belum lengkap di Environment Variables Vercel.');
}
async function readFile(){
 config();
 const url=`https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}?ref=${BRANCH}`;
 const r=await fetch(url,{headers:{Authorization:`Bearer ${TOKEN}`,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'}});
 if(!r.ok) throw Error('Gagal membaca JSON dari GitHub.');
 const x=await r.json();
 const bytes=Uint8Array.from(atob(x.content.replace(/\n/g,'')),c=>c.charCodeAt(0));
 return {sha:x.sha,data:JSON.parse(new TextDecoder().decode(bytes))};
}
async function writeFile(sha,data){
 const content=btoa(unescape(encodeURIComponent(JSON.stringify(data,null,2))));
 const r=await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`,{
  method:'PUT',headers:{Authorization:`Bearer ${TOKEN}`,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json'},
  body:JSON.stringify({message:'Perbarui data peserta kewirausahaan',content,sha,branch:BRANCH})
 });
 if(!r.ok){const e=await r.json().catch(()=>({}));throw Error(e.message||'Gagal menyimpan JSON ke GitHub. Muat ulang lalu coba lagi.');}
}
module.exports={readFile,writeFile};