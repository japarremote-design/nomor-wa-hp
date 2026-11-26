function config(){
 const url=process.env.SUPABASE_URL, key=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url||!key) throw Error('Konfigurasi Supabase belum lengkap di Environment Variables Vercel.');
 return {url:url.replace(/\/$/,''),key};
}
async function uploadKtp(path,bytes,contentType){
 const {url,key}=config();
 const r=await fetch(`${url}/storage/v1/object/ktp-private/${path}`,{
  method:'POST',headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':contentType,'x-upsert':'true'},
  body:bytes
 });
 if(!r.ok){const t=await r.text();throw Error('Upload KTP gagal: '+t.slice(0,250));}
 return path;
}
async function signedKtp(path){
 const {url,key}=config();
 const r=await fetch(`${url}/storage/v1/object/sign/ktp-private/${path}`,{
  method:'POST',headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json'},
  body:JSON.stringify({expiresIn:60})
 });
 if(!r.ok)throw Error('Tidak dapat membuat tautan KTP.');
 const d=await r.json();return d.signedURL.startsWith('http')?d.signedURL:url+d.signedURL;
}
module.exports={uploadKtp,signedKtp};