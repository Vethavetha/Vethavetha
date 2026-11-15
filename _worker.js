// AKV LINK - single file Worker (website + backend)
// Required binding: LINKS (Cloudflare KV namespace)
// Optional secret: ADMIN_TOKEN (Worker secret) for /api/admin/stats
const HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="AKV LINK - Free and easy URL shortener in Tamil and English.">
<title>AKV LINK — Short Links. Easy Sharing.</title>
<link rel="icon" href="logo-mark.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Baloo+Thambi+2:wght@500;700;800&display=swap" rel="stylesheet">
<style>
:root{--sun:#FFD23F;--ink:#1E1B4B;--pink:#FF5C8A;--teal:#12C2A9;--blue:#4361EE;--white:#fff;--font:"Baloo Thambi 2","Noto Sans Tamil","Latha",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;min-height:100vh;background:var(--sun);color:var(--ink);font:500 18px/1.45 var(--font);overflow-x:hidden;position:relative}
a,button,input{font-family:inherit}
:focus-visible{outline:4px solid var(--blue);outline-offset:3px}
.shape{position:absolute;z-index:0;pointer-events:none}
.s1{width:130px;height:130px;border-radius:50%;background:var(--pink);top:90px;left:-40px}
.s2{width:90px;height:90px;background:var(--teal);border-radius:24px;transform:rotate(18deg);top:210px;right:-24px}
.s3{width:150px;height:150px;border-radius:50%;border:14px solid var(--blue);bottom:70px;right:6%;}
.s4{width:70px;height:70px;background:var(--white);border-radius:50% 50% 50% 0;transform:rotate(-20deg);bottom:140px;left:7%}
header,main,footer{position:relative;z-index:1}
header{max-width:900px;margin:auto;padding:22px 20px;display:flex;justify-content:space-between;align-items:center;gap:12px}
.logo{display:flex;align-items:center;gap:10px;font-weight:800;font-size:28px;letter-spacing:.5px}
.logo-mark{width:48px;height:48px;flex:none}
.lang{display:flex;background:var(--white);border:3px solid var(--ink);border-radius:999px;padding:3px;box-shadow:3px 3px 0 var(--ink)}
.lang button{border:0;background:transparent;color:var(--ink);font-weight:700;font-size:16px;padding:4px 16px;border-radius:999px;cursor:pointer}
.lang button.active{background:var(--ink);color:var(--white)}
main{max-width:760px;margin:10px auto 40px;padding:0 18px}
h1{font-size:clamp(40px,9vw,68px);line-height:1;margin:18px 0 10px;font-weight:800;text-align:center;letter-spacing:-.5px}
.sub{text-align:center;margin:0 auto 26px;font-size:clamp(18px,3.4vw,22px);font-weight:700}
.squeeze{display:flex;align-items:center;justify-content:center;gap:12px;margin:0 auto 28px;max-width:100%}
.long{flex:1 1 auto;min-width:0;background:var(--white);border:3px solid var(--ink);border-radius:999px;padding:8px 18px;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:clip;opacity:.9;-webkit-mask-image:linear-gradient(90deg,#000 70%,transparent);mask-image:linear-gradient(90deg,#000 70%,transparent);transform-origin:right center;animation:squeeze 1.1s .3s cubic-bezier(.7,0,.3,1) both}
.arrow{font-size:28px;font-weight:800;flex:none}
.short{flex:none;background:var(--pink);border:3px solid var(--ink);border-radius:999px;padding:8px 20px;font-weight:800;font-size:19px;box-shadow:4px 4px 0 var(--ink);transform:rotate(-3deg)}
@keyframes squeeze{from{transform:scaleX(1.25)}to{transform:scaleX(1)}}
.card{background:var(--white);border:4px solid var(--ink);border-radius:28px;padding:30px;box-shadow:10px 10px 0 var(--ink)}
label{display:block;font-weight:800;font-size:20px;margin:0 0 10px}
.field{display:flex;gap:12px;flex-wrap:wrap}
input{flex:1 1 260px;min-width:0;padding:15px 18px;border:3px solid var(--ink);border-radius:16px;font-size:18px;font-weight:500;background:#F3F1FF;color:var(--ink)}
input::placeholder{color:#6C688F}
input:focus{outline:4px solid var(--blue);outline-offset:2px;background:var(--white)}
button{cursor:pointer}
.go{flex:1 1 200px;border:3px solid var(--ink);border-radius:16px;padding:14px 22px;background:var(--pink);color:var(--ink);font-weight:800;font-size:20px;box-shadow:4px 4px 0 var(--ink);transition:transform .12s,box-shadow .12s}
.go:hover{transform:translate(-2px,-2px);box-shadow:6px 6px 0 var(--ink)}
.go:active{transform:translate(4px,4px);box-shadow:0 0 0 var(--ink)}
.go:disabled{opacity:.6;cursor:wait;transform:none}
.message{min-height:26px;margin-top:14px;font-weight:700;color:#B3123B;text-align:center}
.message.ok{color:var(--ink)}
.result{display:none;margin-top:14px;background:var(--teal);border:3px solid var(--ink);border-radius:20px;padding:18px;transform:rotate(-1deg)}
.result.show{display:block;animation:pop .35s cubic-bezier(.3,1.6,.5,1)}
@keyframes pop{from{transform:scale(.9) rotate(-1deg);opacity:0}to{transform:scale(1) rotate(-1deg);opacity:1}}
.result-label{font-weight:800}
.result a{display:block;margin:6px 0 12px;font-size:clamp(20px,5vw,28px);font-weight:800;color:var(--ink);overflow-wrap:anywhere}
.copy{border:3px solid var(--ink);background:var(--white);color:var(--ink);border-radius:14px;padding:9px 18px;font-weight:800;font-size:17px;box-shadow:3px 3px 0 var(--ink)}
.copy:active{transform:translate(3px,3px);box-shadow:none}
.fine{font-size:14px;margin:22px 0 0;text-align:center;font-weight:500;color:#4A466F}
footer{text-align:center;font-weight:700;font-size:15px;padding:10px 0 30px}
@media(max-width:520px){
 body{font-size:17px}
 .card{padding:22px 16px;box-shadow:6px 6px 0 var(--ink)}
 .logo{font-size:24px}
 .squeeze{gap:8px}.short{font-size:16px;padding:6px 14px}.long{font-size:13px}
 .s3{display:none}
}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
</style>
</head>
<body>
<div class="shape s1" aria-hidden="true"></div>
<div class="shape s2" aria-hidden="true"></div>
<div class="shape s3" aria-hidden="true"></div>
<div class="shape s4" aria-hidden="true"></div>
<header>
  <div class="logo"><svg class="logo-mark" viewBox="0 0 120 120" aria-hidden="true"><rect x="4" y="4" width="112" height="112" rx="34" fill="#1E1B4B" transform="rotate(-6 60 60)"/><g transform="rotate(-38 60 60)" fill="none" stroke-width="10" stroke-linecap="round"><rect x="18" y="44" width="50" height="32" rx="16" stroke="#FFD23F"/><rect x="52" y="44" width="50" height="32" rx="16" stroke="#FF5C8A"/><path d="M52 52 a16 16 0 0 1 0 16" stroke="#FFD23F"/></g><circle cx="94" cy="26" r="6" fill="#12C2A9"/></svg>AKV LINK</div>
  <div class="lang" role="group" aria-label="Language">
    <button id="en" class="active" type="button">English</button>
    <button id="ta" type="button">தமிழ்</button>
  </div>
</header>
<main>
  <h1 id="title">Make your links shorter</h1>
  <p class="sub" id="subtitle">Short links. Easy sharing.</p>
  <div class="squeeze" aria-hidden="true">
    <div class="long">https://example.com/products/summer-sale/2026/category/shoes?ref=newsletter&amp;utm=abc123</div>
    <div class="arrow">→</div>
    <div class="short">akv.link/x7k2p9</div>
  </div>
  <section class="card">
    <form id="form">
      <label for="longUrl" id="urlLabel">Paste your long URL</label>
      <div class="field">
        <input id="longUrl" type="url" placeholder="https://example.com/your-long-link" required autocomplete="url">
        <button class="go" id="submit" type="submit">Shorten URL</button>
      </div>
    </form>
    <div class="message" id="message" role="status" aria-live="polite"></div>
    <div class="result" id="result">
      <div class="result-label" id="resultLabel">Your short link</div>
      <a id="shortUrl" href="#" target="_blank" rel="noopener"></a>
      <button class="copy" id="copy" type="button">Copy link</button>
    </div>
    <p class="fine" id="fine">Use only links you have permission to share. Do not shorten phishing, malware, spam or illegal content.</p>
  </section>
</main>
<footer>© <span id="year"></span> AKV LINK</footer>
<script>
const $=id=>document.getElementById(id);
let lang='en', current='';
const words={
 en:{title:'Make your links shorter',subtitle:'Short links. Easy sharing.',label:'Paste your long URL',placeholder:'https://example.com/your-long-link',button:'Shorten URL',result:'Your short link',copy:'Copy link',copied:'Copied!',working:'Creating your short link…',error:'Could not create the link. Please check the URL and try again.',fine:'Use only links you have permission to share. Do not shorten phishing, malware, spam or illegal content.'},
 ta:{title:'உங்கள் Link-ஐ சுருக்குங்கள்',subtitle:'சுருக்கமான Link. எளிதான பகிர்வு.',label:'உங்கள் நீளமான URL-ஐ இங்கே ஒட்டவும்',placeholder:'https://example.com/your-long-link',button:'Short Link உருவாக்கு',result:'உங்கள் Short Link',copy:'Link நகலெடு',copied:'நகலெடுக்கப்பட்டது!',working:'உங்கள் Short Link உருவாக்கப்படுகிறது…',error:'Link உருவாக்க முடியவில்லை. URL சரிபார்த்து மீண்டும் முயற்சிக்கவும்.',fine:'பகிர அனுமதி உள்ள Link-களை மட்டும் பயன்படுத்தவும். மோசடி, தீங்கு விளைவிக்கும் அல்லது சட்டவிரோத Link-களை பயன்படுத்த வேண்டாம்.'}
};
function setLang(next){
 lang=next;const w=words[lang];
 document.documentElement.lang=lang;
 $('title').textContent=w.title;$('subtitle').textContent=w.subtitle;$('urlLabel').textContent=w.label;
 $('longUrl').placeholder=w.placeholder;$('submit').textContent=w.button;$('resultLabel').textContent=w.result;
 $('copy').textContent=w.copy;$('fine').textContent=w.fine;
 $('en').classList.toggle('active',lang==='en');$('ta').classList.toggle('active',lang==='ta');
}
$('en').onclick=()=>setLang('en');$('ta').onclick=()=>setLang('ta');
$('year').textContent=new Date().getFullYear();
$('form').addEventListener('submit',async e=>{
 e.preventDefault();
 const url=$('longUrl').value.trim();
 $('message').className='message ok';$('message').textContent=words[lang].working;
 $('result').classList.remove('show');$('submit').disabled=true;
 try{
  const r=await fetch('/api/shorten',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url})});
  const data=await r.json();
  if(!r.ok)throw new Error(data.error||'Request failed');
  current=data.shortUrl;$('shortUrl').href=current;$('shortUrl').textContent=current;
  $('result').classList.add('show');$('message').textContent='';
 }catch(err){
  $('message').className='message';$('message').textContent=words[lang].error;
 }finally{$('submit').disabled=false;}
});
$('copy').onclick=async()=>{
 try{await navigator.clipboard.writeText(current);$('copy').textContent=words[lang].copied;setTimeout(()=>$('copy').textContent=words[lang].copy,1600);}
 catch(e){$('message').className='message';$('message').textContent='Copy unavailable. Please copy the link manually.';}
};
</script>
</body>
</html>
`;
const LOGO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="240" height="240" role="img" aria-label="AKV LINK logo"><rect x="4" y="4" width="112" height="112" rx="34" fill="#1E1B4B" transform="rotate(-6 60 60)"/><g transform="rotate(-38 60 60)" fill="none" stroke-width="10" stroke-linecap="round"><rect x="18" y="44" width="50" height="32" rx="16" stroke="#FFD23F"/><rect x="52" y="44" width="50" height="32" rx="16" stroke="#FF5C8A"/><path d="M52 52 a16 16 0 0 1 0 16" stroke="#FFD23F"/></g><circle cx="94" cy="26" r="6" fill="#12C2A9"/></svg>`;
const JSON_HEADERS = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };

function json(data, status=200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}
function validHttpUrl(value) {
  try {
    const u = new URL(value);
    return (u.protocol === "https:" || u.protocol === "http:") && u.hostname.includes(".");
  } catch { return false; }
}
function randomCode() {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => "0123456789abcdefghijklmnopqrstuvwxyz"[b % 36]).join("");
}
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/shorten" && request.method === "POST") {
      let body;
      try { body = await request.json(); } catch { return json({error:"Invalid JSON"},400); }
      const target = String(body.url || "").trim();
      if (!validHttpUrl(target)) return json({error:"Enter a valid http or https URL"},400);
      if (target.length > 2048) return json({error:"URL is too long"},400);
      let code;
      for (let i=0; i<5; i++) {
        code = randomCode();
        if (!await env.LINKS.get(code)) break;
      }
      const record = { url: target, createdAt: new Date().toISOString(), clicks: 0 };
      await env.LINKS.put(code, JSON.stringify(record));
      return json({ shortUrl: `${url.origin}/${code}` });
    }
    if (url.pathname === "/api/admin/stats" && request.method === "GET") {
      if (!env.ADMIN_TOKEN || request.headers.get("authorization") !== `Bearer ${env.ADMIN_TOKEN}`) return json({error:"Unauthorized"},401);
      return json({message:"For full analytics, add a KV list endpoint and protect it with ADMIN_TOKEN. Individual link click counts are stored in KV."});
    }
    if (url.pathname.startsWith("/api/")) return json({error:"Not found"},404);
    const code = url.pathname.slice(1);
    if (!code) return new Response(HTML, { headers: { "content-type": "text/html; charset=utf-8" } });
    if (code === "logo-mark.svg") return new Response(LOGO, { headers: { "content-type": "image/svg+xml" } });
    if (!/^[a-z0-9]{6}$/.test(code)) return new Response("Short link not found", {status:404});
    const raw = await env.LINKS.get(code);
    if (!raw) return new Response("Short link not found", {status:404});
    const record = JSON.parse(raw);
    record.clicks = (record.clicks || 0) + 1;
    await env.LINKS.put(code, JSON.stringify(record));
    return Response.redirect(record.url, 302);
  }
};
