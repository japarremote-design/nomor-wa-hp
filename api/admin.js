const {readFile}=require('../lib/github');
module.exports=async(req,res)=>{
 if(req.method!=='GET')return res.status(405).json({error:'Method tidak diizinkan'});
 if(!process.env.ADMIN_PASSWORD||req.headers['x-admin-password']!==process.env.ADMIN_PASSWORD)return res.status(401).json({error:'Password admin salah.'});
 try{const {data}=await readFile();const origin=`https://${req.headers.host}`;
 const participants=data.participants.map(p=>({id:p.id,name:p.name,gender:p.gender,phone:p.phone,link:`${origin}/?id=${p.id}&key=${encodeURIComponent(p.key)}`}));
 res.setHeader('Cache-Control','no-store');return res.status(200).json({participants});
 }catch(e){return res.status(500).json({error:e.message})}
};