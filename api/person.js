const {readFile,writeFile}=require('../lib/github');
const {uploadKtp}=require('../lib/supabase');
module.exports=async(req,res)=>{
 try{
  if(req.method==='GET'){
   const id=Number(req.query.id), key=String(req.query.key||'');
   const {data}=await readFile();const p=data.participants.find(x=>x.id===id&&x.key===key);
   if(!p)return res.status(403).json({error:'Link pribadi tidak valid.'});
   return res.status(200).json({person:{id:p.id,name:p.name,gender:p.gender,phone:p.phone,address:p.address,entrepreneurship_class:p.entrepreneurship_class,ready_to_work:p.ready_to_work,has_ktp:!!p.ktp_path}});
  }
  if(req.method==='POST'){
   const {id,key,phone,address,ktpName,ktpType,ktpBase64}=req.body||{};
   const {sha,data}=await readFile();const p=data.participants.find(x=>x.id===Number(id)&&x.key===key);
   if(!p)return res.status(403).json({error:'Link pribadi tidak valid.'});
   if(phone!==undefined)p.phone=String(phone).trim();
   if(address!==undefined)p.address=String(address).trim();
   if(ktpBase64){
    if(!['image/jpeg','image/png','application/pdf'].includes(ktpType))return res.status(400).json({error:'KTP harus JPG, PNG, atau PDF.'});
    const raw=Buffer.from(String(ktpBase64).split(',').pop(),'base64');
    if(raw.length>5*1024*1024)return res.status(400).json({error:'Ukuran KTP maksimal 5 MB.'});
    const ext=ktpType==='image/jpeg'?'jpg':ktpType==='image/png'?'png':'pdf';
    const path=`peserta-${p.id}-${Date.now()}.${ext}`;
    await uploadKtp(path,raw,ktpType);p.ktp_path=path;
   }
   await writeFile(sha,data);
   return res.status(200).json({success:true,has_ktp:!!p.ktp_path});
  }
  return res.status(405).json({error:'Method tidak diizinkan'});
 }catch(e){return res.status(500).json({error:e.message})}
};