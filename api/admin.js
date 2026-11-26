const {readFile,writeFile}=require('../lib/github');
const {signedKtp}=require('../lib/supabase');
function authorized(req){return !!process.env.ADMIN_PASSWORD&&req.headers['x-admin-password']===process.env.ADMIN_PASSWORD;}
module.exports=async(req,res)=>{
 if(!authorized(req))return res.status(401).json({error:'Password admin salah.'});
 try{
  if(req.method==='GET'){
   const {data}=await readFile();const origin=`https://${req.headers.host}`;
   const rows=data.participants.map(p=>({id:p.id,name:p.name,gender:p.gender,phone:p.phone||'',address:p.address||'',entrepreneurship_class:p.entrepreneurship_class||'',ready_to_work:p.ready_to_work||'',has_ktp:!!p.ktp_path,link:`${origin}/?id=${p.id}&key=${encodeURIComponent(p.key)}`}));
   res.setHeader('Cache-Control','no-store');return res.status(200).json({participants:rows});
  }
  if(req.method==='POST'){
   const {sha,data}=await readFile();const body=req.body||{};
   if(body.action==='save'){
    const p=data.participants.find(x=>x.id===Number(body.id));if(!p)return res.status(404).json({error:'Peserta tidak ditemukan.'});
    for(const k of ['name','gender','phone','address','entrepreneurship_class','ready_to_work']){
     if(body[k]!==undefined)p[k]=String(body[k]).trim();
    }
   }else if(body.action==='add'){
    const id=Math.max(0,...data.participants.map(p=>p.id))+1;
    data.participants.push({id,name:String(body.name||'Peserta Baru').trim(),gender:body.gender==='L'?'L':'P',phone:'',address:'',entrepreneurship_class:'',ready_to_work:'',ktp_path:'',key:require('crypto').randomBytes(24).toString('base64url')});
   }else if(body.action==='bulk'){
    if(!Array.isArray(body.rows)||body.rows.length>500)return res.status(400).json({error:'Format impor tidak valid atau terlalu banyak.'});
    for(const row of body.rows){
     let p=data.participants.find(x=>x.id===Number(row.id));
     if(!p){const id=Math.max(0,...data.participants.map(x=>x.id))+1;p={id,key:require('crypto').randomBytes(24).toString('base64url'),ktp_path:''};data.participants.push(p);}
     p.name=String(row.name||p.name||'').trim();p.gender=row.gender==='L'?'L':'P';
     for(const k of ['phone','address','entrepreneurship_class','ready_to_work'])if(row[k]!==undefined)p[k]=String(row[k]).trim();
    }
   }else return res.status(400).json({error:'Aksi tidak dikenal.'});
   await writeFile(sha,data);return res.status(200).json({success:true});
  }
  if(req.method==='PUT'){
   const id=Number(req.query.id);const {data}=await readFile();const p=data.participants.find(x=>x.id===id);
   if(!p||!p.ktp_path)return res.status(404).json({error:'Berkas KTP belum tersedia.'});
   const url=await signedKtp(p.ktp_path);return res.status(200).json({url});
  }
  return res.status(405).json({error:'Method tidak diizinkan'});
 }catch(e){return res.status(500).json({error:e.message})}
};