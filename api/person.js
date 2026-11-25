const {readFile,writeFile}=require('../lib/github');
module.exports=async(req,res)=>{
 try{
  if(req.method==='GET'){
   const id=Number(req.query.id);const {data}=await readFile();const p=data.participants.find(x=>x.id===id);
   if(!p)return res.status(404).json({error:'Peserta tidak ditemukan.'});
   return res.status(200).json({person:{id:p.id,name:p.name,gender:p.gender,phone:p.phone}});
  }
  if(req.method==='POST'){
   const {id,key,phone}=req.body||{};const normalized=String(phone||'').trim();
   if(!Number.isInteger(Number(id))||!key||! /^[0-9+\\-\\s()]{8,20}$/.test(normalized))return res.status(400).json({error:'Data nomor tidak valid.'});
   const {sha,data}=await readFile();const p=data.participants.find(x=>x.id===Number(id));
   if(!p||p.key!==key)return res.status(403).json({error:'Link pengisian tidak valid.'});
   p.phone=normalized;await writeFile(sha,data);
   return res.status(200).json({success:true});
  }
  return res.status(405).json({error:'Method tidak diizinkan'});
 }catch(e){return res.status(500).json({error:e.message})}
};