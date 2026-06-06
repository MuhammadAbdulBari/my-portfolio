import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";

const IMG_HERO   = "./image1.png";
const IMG_POSTER = "./image2.jpeg";
const IMG_FACE   = "./image2.jpeg";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Oswald:wght@300;400;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
  :root{
    --r:#cc0000;--rh:#ff3333;--rd:#8b0000;--rdp:#2a0000;
    --bk:#050305;--dk:#0a0206;--dk2:#120308;
    --wh:#f0e6e6;--mt:#6e4444;
    --fd:'Bebas Neue',sans-serif;
    --fh:'Oswald',sans-serif;
    --fb:'Crimson Text',serif;
    --pad-x: clamp(1.2rem, 5vw, 5rem);
    --ease:cubic-bezier(.23,1,.32,1);
    --spring:cubic-bezier(.175,.885,.32,1.275);
  }
  html{scroll-behavior:smooth;}
  body{background:var(--bk);color:var(--wh);font-family:var(--fb);overflow-x:hidden;cursor:none!important;}
  *{cursor:none!important;}
  ::selection{background:var(--r);color:#fff;}
  ::-webkit-scrollbar{width:3px;}
  ::-webkit-scrollbar-track{background:var(--bk);}
  ::-webkit-scrollbar-thumb{background:var(--r);}

  @media(hover:none){
    .cur-ring,.cur-dot{display:none;}
    *{cursor:auto!important;}
    body{cursor:auto!important;}
  }

  /* ─── CURSOR ─── */
  .cur-ring{
    position:fixed;top:-17px;left:-17px;width:34px;height:34px;
    border:1.5px solid rgba(204,0,0,.65);border-radius:50%;
    pointer-events:none;z-index:99999;
    will-change:transform;
    transition:width .22s var(--ease),height .22s var(--ease),border-color .22s,background .22s;
    mix-blend-mode:difference;
  }
  .cur-ring.h{width:58px;height:58px;border-color:var(--rh);border-width:2px;background:rgba(204,0,0,.06);top:-29px;left:-29px;}
  .cur-ring.click{opacity:.7;}
  .cur-dot{position:fixed;top:-3px;left:-3px;width:6px;height:6px;background:var(--rh);border-radius:50%;pointer-events:none;z-index:100000;will-change:transform;transition:width .12s,height .12s,background .12s;}
  .cur-dot.h{width:10px;height:10px;background:#fff;top:-5px;left:-5px;}

  /* ─── GRAIN ─── */
  body::before{
    content:'';position:fixed;inset:0;z-index:9998;pointer-events:none;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    opacity:.025;mix-blend-mode:overlay;
  }

  .vignette{position:fixed;inset:0;pointer-events:none;z-index:500;background:radial-gradient(ellipse at center,transparent 60%,rgba(90,0,0,.22) 100%);}

  /* ─── NAV ─── */
  .nav{position:fixed;top:0;left:0;right:0;z-index:1000;padding:1.3rem var(--pad-x);display:flex;justify-content:space-between;align-items:center;transition:all .4s var(--ease);}
  .nav.sc{background:rgba(5,3,5,.96);backdrop-filter:blur(16px);border-bottom:1px solid rgba(204,0,0,.15);padding:.8rem var(--pad-x);}
  .nav-logo{font-family:var(--fd);font-size:1.9rem;letter-spacing:.22em;color:var(--r);text-shadow:0 0 28px rgba(204,0,0,.5);}
  .nav-logo span{color:var(--wh);}
  .nav-links{display:flex;gap:2.2rem;list-style:none;}
  .nav-links a{font-family:var(--fh);font-size:.68rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--mt);text-decoration:none;transition:color .3s;position:relative;}
  .nav-links a::after{content:'';position:absolute;bottom:-4px;left:0;width:0;height:1px;background:var(--r);transition:width .3s var(--ease);}
  .nav-links a:hover{color:var(--r);}
  .nav-links a:hover::after{width:100%;}

  .nav-hamburger{display:none;flex-direction:column;gap:5px;background:transparent;border:none;padding:4px;z-index:1001;}
  .nav-hamburger span{display:block;width:24px;height:2px;background:var(--r);transition:all .3s var(--ease);}
  .nav-hamburger.open span:nth-child(1){transform:rotate(45deg) translate(5px,5px);}
  .nav-hamburger.open span:nth-child(2){opacity:0;}
  .nav-hamburger.open span:nth-child(3){transform:rotate(-45deg) translate(5px,-5px);}

  .nav-mobile-menu{display:none;position:fixed;inset:0;background:rgba(5,3,5,.98);z-index:999;flex-direction:column;align-items:center;justify-content:center;gap:2.5rem;opacity:0;transition:opacity .3s;}
  .nav-mobile-menu.open{opacity:1;}
  .nav-mobile-menu a{font-family:var(--fd);font-size:clamp(2.5rem,8vw,3.5rem);letter-spacing:.12em;color:var(--wh);text-decoration:none;transition:color .3s;}
  .nav-mobile-menu a:hover{color:var(--r);}

  .btn-r{font-family:var(--fh);font-size:.65rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;padding:.75rem 1.8rem;background:var(--r);color:#fff;border:none;clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);transition:all .3s;position:relative;overflow:hidden;}
  .btn-r::after{content:'';position:absolute;inset:0;background:rgba(255,255,255,.12);transform:translateX(-110%) skewX(-15deg);transition:transform .45s var(--ease);}
  .btn-r:hover::after{transform:translateX(110%) skewX(-15deg);}
  .btn-r:hover{background:var(--rh);transform:translateY(-2px);box-shadow:0 8px 32px rgba(204,0,0,.45);}
  .btn-g{font-family:var(--fh);font-size:.65rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;padding:.75rem 1.8rem;background:transparent;color:var(--r);border:1px solid rgba(204,0,0,.35);clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);transition:all .3s;position:relative;overflow:hidden;}
  .btn-g::after{content:'';position:absolute;inset:0;background:rgba(204,0,0,.08);transform:translateX(-110%) skewX(-15deg);transition:transform .45s var(--ease);}
  .btn-g:hover::after{transform:translateX(110%) skewX(-15deg);}
  .btn-g:hover{background:rgba(204,0,0,.1);border-color:var(--r);transform:translateY(-2px);}

  /* ─── HERO ─── */
  .hero{position:relative;min-height:100svh;display:flex;align-items:center;padding:0 var(--pad-x);overflow:hidden;}
  .hero-bg{position:absolute;inset:0;background:radial-gradient(ellipse at 65% 50%,rgba(120,0,0,.18) 0%,transparent 55%),linear-gradient(135deg,var(--bk) 0%,var(--dk) 100%);}

  .hero-grid{position:absolute;inset:0;pointer-events:none;
    background-image:linear-gradient(rgba(204,0,0,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(204,0,0,.04) 1px,transparent 1px);
    background-size:72px 72px;
    animation:grid-drift 28s linear infinite;
  }
  @keyframes grid-drift{to{background-position:72px 72px;}}

  .rain-c{position:absolute;inset:0;opacity:.4;pointer-events:none;}

  .hero-img-stack{position:absolute;right:0;top:0;bottom:0;width:50%;overflow:hidden;}
  .img-top{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center top;filter:brightness(.7) contrast(1.1) saturate(.55);transition:opacity .5s;z-index:2;}
  .img-bot{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center top;filter:brightness(.6) contrast(1.2) grayscale(.25);transition:opacity .5s;z-index:3;opacity:0;}
  .hero-img-stack:hover .img-bot{opacity:1;}
  .hero-img-stack:hover .img-top{opacity:.15;}
  .hero-img-fade{position:absolute;inset:0;background:linear-gradient(to right,var(--bk) 0%,rgba(5,3,5,.55) 38%,transparent 62%),linear-gradient(to top,var(--bk) 0%,transparent 28%);z-index:4;pointer-events:none;}

  .hero-slash{position:absolute;bottom:18%;left:0;right:25%;height:1px;background:linear-gradient(to right,var(--r),transparent);z-index:5;transform:scaleX(0);transform-origin:left;animation:slash-in .9s var(--ease) 1.3s forwards;}
  @keyframes slash-in{to{transform:scaleX(1);}}

  .hover-hint{position:absolute;bottom:2rem;right:1.5rem;font-family:var(--fh);font-size:.6rem;letter-spacing:.28em;text-transform:uppercase;color:rgba(204,0,0,.45);z-index:5;pointer-events:none;transition:color .3s;}
  .hero-img-stack:hover .hover-hint{color:var(--r);}

  .hero-txt{position:relative;z-index:10;max-width:580px;padding-top:5rem;padding-bottom:5rem;}
  .hero-eye{font-family:var(--fh);font-size:clamp(.56rem,.9vw,.66rem);font-weight:600;letter-spacing:.42em;text-transform:uppercase;color:var(--r);margin-bottom:1rem;opacity:0;animation:ru 1s var(--ease) .2s forwards;}
  .hero-h1{font-family:var(--fd);font-size:clamp(3.2rem,9.5vw,9rem);line-height:.9;letter-spacing:.03em;color:var(--wh);opacity:0;animation:ru 1s var(--ease) .4s forwards;}
  .hero-h1 em{color:var(--r);text-shadow:0 0 40px rgba(204,0,0,.7),0 0 90px rgba(204,0,0,.25);font-style:normal;display:block;}
  .hero-rule{width:48px;height:2px;background:var(--r);margin:1.6rem 0;opacity:0;transform:scaleX(0);transform-origin:left;animation:rl .8s var(--ease) .7s forwards;}
  .hero-sub{font-style:italic;font-size:clamp(.9rem,1.6vw,1rem);line-height:1.8;color:rgba(240,230,230,.52);opacity:0;animation:ru 1s var(--ease) .8s forwards;}
  .hero-btns{display:flex;flex-wrap:wrap;gap:.9rem;margin-top:2.2rem;opacity:0;animation:ru 1s var(--ease) 1s forwards;}

  .hero-h1 em{animation:name-pulse 4s ease-in-out infinite;}
  @keyframes name-pulse{0%,100%{text-shadow:0 0 40px rgba(204,0,0,.7),0 0 90px rgba(204,0,0,.25);}50%{text-shadow:0 0 60px rgba(204,0,0,1),0 0 120px rgba(204,0,0,.5),0 0 200px rgba(204,0,0,.15);}}

  @keyframes ru{from{opacity:0;transform:translateY(26px);}to{opacity:1;transform:translateY(0);}}
  @keyframes rl{to{opacity:1;transform:scaleX(1);}}

  .scroll-cue{position:absolute;bottom:2.2rem;left:var(--pad-x);display:flex;flex-direction:column;align-items:flex-start;gap:.5rem;opacity:0;animation:ru 1s var(--ease) 1.3s forwards;}
  .scroll-cue span{font-family:var(--fh);font-size:.58rem;letter-spacing:.32em;text-transform:uppercase;color:var(--mt);}
  .s-bar{width:1px;height:42px;background:linear-gradient(to bottom,var(--r),transparent);animation:sp 2s ease-in-out infinite;}
  @keyframes sp{0%{transform:scaleY(0);transform-origin:top;opacity:0;}50%{transform:scaleY(1);opacity:1;}100%{transform:scaleY(0);transform-origin:bottom;opacity:0;}}

  /* ─── MARQUEE ─── */
  .marquee-wrap{overflow:hidden;border-top:1px solid rgba(204,0,0,.1);border-bottom:1px solid rgba(204,0,0,.1);padding:.75rem 0;background:var(--dk);}
  .marquee-track{display:flex;white-space:nowrap;animation:marquee 20s linear infinite;}
  .marquee-wrap:hover .marquee-track{animation-play-state:paused;}
  @keyframes marquee{to{transform:translateX(-50%);}}
  .mq-item{font-family:var(--fh);font-size:.65rem;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:rgba(240,230,230,.18);padding:0 2rem;transition:color .3s;}
  .mq-item:hover{color:var(--r);}
  .mq-sep{color:rgba(204,0,0,.4);padding:0 .5rem;}

  /* ─── SECTIONS ─── */
  .sec{padding:clamp(4rem,8vw,8rem) var(--pad-x);max-width:1400px;margin:0 auto;}
  .sl{font-family:var(--fh);font-size:.64rem;font-weight:600;letter-spacing:.4em;text-transform:uppercase;color:var(--r);margin-bottom:.8rem;}
  .sh{font-family:var(--fd);font-size:clamp(2.2rem,5.5vw,5rem);line-height:1;color:var(--wh);letter-spacing:.03em;}
  .sr{width:38px;height:2px;background:var(--r);margin:1.4rem 0 2.2rem;}
  .sb{font-size:clamp(.9rem,1.5vw,1rem);line-height:1.88;color:rgba(240,230,230,.55);font-style:italic;}

  /* ─── ABOUT ─── */
  .about-grid{display:grid;grid-template-columns:1fr 1fr;gap:5.5rem;align-items:start;}
  .about-img-wrap{position:relative;}
  .about-frame{position:relative;overflow:hidden;aspect-ratio:4/5;}
  .about-frame::after{content:'';position:absolute;top:12px;right:-12px;bottom:-12px;left:12px;border:1px solid rgba(204,0,0,.22);z-index:0;pointer-events:none;transition:transform .5s var(--ease);}
  .about-frame:hover::after{transform:translate(6px,-6px);}
  .about-frame img{width:100%;height:100%;object-fit:cover;filter:grayscale(35%) brightness(.8) contrast(1.1);position:relative;z-index:1;transition:filter .5s,transform .6s var(--ease);}
  .about-frame:hover img{filter:grayscale(0%) brightness(.9) contrast(1.1);transform:scale(1.03);}
  .about-frame::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(204,0,0,.08) 0%,transparent 55%);z-index:2;pointer-events:none;}
  .about-badge{position:absolute;bottom:-1.8rem;left:-1.8rem;background:var(--bk);border-left:2px solid var(--r);padding:1.1rem 1.4rem;z-index:10;box-shadow:0 18px 55px rgba(0,0,0,.85);transition:transform .4s var(--ease);}
  .about-frame:hover ~ .about-badge,.about-badge:hover{transform:translateY(-4px);}
  .about-badge p{font-style:italic;font-size:.88rem;color:var(--wh);line-height:1.55;}
  .about-badge cite{display:block;margin-top:.4rem;font-family:var(--fh);font-size:.6rem;letter-spacing:.18em;color:var(--r);font-style:normal;}

  .skills-list{margin-top:2.5rem;display:flex;flex-direction:column;gap:1.1rem;}
  .skill-row{}
  .skill-head{display:flex;justify-content:space-between;margin-bottom:.4rem;}
  .skill-name{font-family:var(--fh);font-size:.72rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--wh);}
  .skill-pct{font-family:var(--fh);font-size:.68rem;color:var(--r);}
  .skill-track{height:3px;background:rgba(204,0,0,.12);position:relative;overflow:hidden;}
  .skill-fill{height:100%;background:linear-gradient(to right,var(--rd),var(--r));transform:scaleX(0);transform-origin:left;transition:transform 1.2s var(--ease);}
  .skill-fill.anim{transform:scaleX(1);}
  .skill-fill::after{content:'';position:absolute;right:-3px;top:50%;width:7px;height:7px;border-radius:50%;background:var(--r);transform:translateY(-50%);box-shadow:0 0 8px rgba(204,0,0,.9),0 0 16px rgba(204,0,0,.5);opacity:0;transition:opacity .2s .9s;}
  .skill-fill.anim::after{opacity:1;}

  /* ─── PROJECTS ─── */
  .proj-filter{display:flex;gap:.8rem;margin:2.5rem 0;flex-wrap:wrap;}
  .pf-btn{font-family:var(--fh);font-size:.63rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;padding:.55rem 1.2rem;background:transparent;color:var(--mt);border:1px solid rgba(204,0,0,.18);transition:all .3s;min-height:44px;position:relative;overflow:hidden;}
  .pf-btn::before{content:'';position:absolute;inset:0;background:var(--r);transform:scaleX(0);transform-origin:left;transition:transform .35s var(--ease);z-index:0;}
  .pf-btn span{position:relative;z-index:1;}
  .pf-btn.active,.pf-btn:hover{color:#fff;border-color:var(--r);}
  .pf-btn.active::before,.pf-btn:hover::before{transform:scaleX(1);}

  .proj-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.4rem;margin-top:1rem;}
  .p-card{position:relative;background:rgba(10,2,6,.72);border:1px solid rgba(255,255,255,.04);overflow:hidden;backdrop-filter:blur(8px);transition:transform .4s var(--ease),border-color .4s,box-shadow .4s;}
  .p-card:hover{transform:translateY(-10px);border-color:rgba(204,0,0,.28);box-shadow:0 28px 70px rgba(120,0,0,.28),inset 0 1px 0 rgba(255,255,255,.05);}

  .p-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(to right,var(--r),transparent);transform:scaleX(0);transform-origin:left;transition:transform .5s var(--ease);z-index:1;}
  .p-card:hover::before{transform:scaleX(1);}

  .p-card-glow{position:absolute;top:-70px;right:-70px;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(204,0,0,.13) 0%,transparent 70%);opacity:0;transition:opacity .4s;pointer-events:none;}
  .p-card:hover .p-card-glow{opacity:1;}
  .p-icon{width:52px;height:52px;background:rgba(204,0,0,.1);border:1px solid rgba(204,0,0,.2);display:flex;align-items:center;justify-content:center;margin:2rem 2rem 1.2rem;clip-path:polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%);transition:background .3s,transform .4s var(--spring);}
  .p-card:hover .p-icon{background:rgba(204,0,0,.18);transform:rotate(-6deg) scale(1.08);}
  .p-icon span{font-family:var(--fd);font-size:1.4rem;color:var(--r);}
  .p-body{padding:0 2rem 2rem;}
  .p-name{font-family:var(--fd);font-size:1.55rem;letter-spacing:.04em;color:var(--wh);margin-bottom:.25rem;}
  .p-desc{font-size:.88rem;line-height:1.7;color:var(--mt);font-style:italic;margin-bottom:1.2rem;}
  .p-tags{display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:1.4rem;}
  .p-tag{font-family:var(--fh);font-size:.57rem;letter-spacing:.14em;text-transform:uppercase;padding:.2rem .6rem;background:rgba(204,0,0,.08);color:var(--r);border:1px solid rgba(204,0,0,.2);transition:background .3s,color .3s;}
  .p-card:hover .p-tag{background:rgba(204,0,0,.15);}
  .p-links{display:flex;gap:.7rem;}
  .p-link{font-family:var(--fh);font-size:.6rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;padding:.5rem 1rem;text-decoration:none;transition:all .3s;min-height:40px;display:inline-flex;align-items:center;position:relative;overflow:hidden;}
  .p-link.live{background:var(--r);color:#fff;clip-path:polygon(5px 0%,100% 0%,calc(100% - 5px) 100%,0% 100%);}
  .p-link.live::after{content:'';position:absolute;inset:0;background:rgba(255,255,255,.12);transform:translateX(-110%) skewX(-15deg);transition:transform .4s var(--ease);}
  .p-link.live:hover::after{transform:translateX(110%) skewX(-15deg);}
  .p-link.live:hover{background:var(--rh);}
  .p-link.code{color:var(--r);border:1px solid rgba(204,0,0,.3);clip-path:polygon(5px 0%,100% 0%,calc(100% - 5px) 100%,0% 100%);}
  .p-link.code:hover{background:rgba(204,0,0,.1);}

  /* ─── CONTACT ─── */
  .contact-grid{display:grid;grid-template-columns:1fr 1.4fr;gap:5rem;margin-top:3.5rem;}
  .c-info-list{display:flex;flex-direction:column;gap:1.8rem;margin-top:1.5rem;}
  .c-info-item{display:flex;align-items:flex-start;gap:1rem;transition:transform .35s var(--ease);}
  .c-info-item:hover{transform:translateX(6px);}
  .c-ico{width:42px;height:42px;min-width:42px;background:rgba(204,0,0,.08);border:1px solid rgba(204,0,0,.2);display:flex;align-items:center;justify-content:center;flex-shrink:0;clip-path:polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%);transition:background .3s,border-color .3s;}
  .c-info-item:hover .c-ico{background:rgba(204,0,0,.18);border-color:rgba(204,0,0,.5);}
  .c-ico svg{width:18px;height:18px;stroke:var(--r);fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;}
  .c-il{font-family:var(--fh);font-size:.62rem;letter-spacing:.18em;text-transform:uppercase;color:var(--mt);margin-bottom:.25rem;}
  .c-iv{font-size:.95rem;color:var(--wh);word-break:break-all;}
  .c-iv a{color:var(--wh);text-decoration:none;transition:color .3s;}
  .c-iv a:hover{color:var(--r);}
  .socials{display:flex;gap:.8rem;margin-top:2.5rem;flex-wrap:wrap;}
  .soc-btn{width:44px;height:44px;border:1px solid rgba(204,0,0,.2);display:flex;align-items:center;justify-content:center;transition:all .3s var(--ease);clip-path:polygon(5px 0%,100% 0%,calc(100% - 5px) 100%,0% 100%);position:relative;overflow:hidden;}
  .soc-btn::before{content:'';position:absolute;inset:0;background:var(--r);transform:scaleY(0);transform-origin:bottom;transition:transform .3s var(--ease);}
  .soc-btn:hover::before{transform:scaleY(1);}
  .soc-btn:hover{border-color:var(--r);}
  .soc-btn svg{width:16px;height:16px;stroke:var(--r);fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;transition:stroke .3s;position:relative;z-index:1;}
  .soc-btn:hover svg{stroke:#fff;}

  .c-form{display:flex;flex-direction:column;gap:1.1rem;}
  .c-input{background:rgba(10,2,6,.6);border:1px solid rgba(204,0,0,.15);color:var(--wh);font-family:var(--fb);font-size:.95rem;padding:.9rem 1.1rem;outline:none;transition:border-color .3s,box-shadow .3s,background .3s;width:100%;}
  .c-input::placeholder{color:var(--mt);}
  .c-input:focus{border-color:rgba(204,0,0,.55);background:rgba(18,3,8,.8);box-shadow:0 0 0 2px rgba(204,0,0,.08),inset 0 1px 0 rgba(255,255,255,.03);}
  textarea.c-input{resize:vertical;min-height:130px;}
  .c-send{align-self:flex-start;font-family:var(--fh);font-size:.68rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;padding:.9rem 2.2rem;background:var(--r);color:#fff;border:none;clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);transition:all .3s;min-height:44px;position:relative;overflow:hidden;}
  .c-send::after{content:'';position:absolute;inset:0;background:rgba(255,255,255,.12);transform:translateX(-110%) skewX(-15deg);transition:transform .45s var(--ease);}
  .c-send:hover::after{transform:translateX(110%) skewX(-15deg);}
  .c-send:hover{background:var(--rh);transform:translateY(-2px);box-shadow:0 8px 30px rgba(204,0,0,.4);}

  /* ─── FOOTER ─── */
  .footer{border-top:1px solid rgba(204,0,0,.1);padding:2.8rem var(--pad-x);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;}
  .ft-l{display:flex;flex-direction:column;gap:.3rem;}
  .ft-name{font-family:var(--fd);font-size:1.5rem;letter-spacing:.2em;color:var(--r);}
  .ft-role{font-family:var(--fh);font-size:.62rem;letter-spacing:.18em;color:var(--mt);text-transform:uppercase;}
  .ft-copy{font-family:var(--fh);font-size:.6rem;letter-spacing:.14em;color:var(--mt);text-transform:uppercase;}

  /* ─── FADE IN ─── */
  .fi{opacity:0;transform:translateY(26px);transition:opacity .8s var(--ease),transform .8s var(--ease);}
  .fi.in{opacity:1;transform:translateY(0);}

  /* ─── FLOATING PARTICLES ─── */
  .particles{position:absolute;inset:0;pointer-events:none;overflow:hidden;}
  .particle{position:absolute;border-radius:50%;background:rgba(204,0,0,.6);animation:float-up linear infinite;}
  @keyframes float-up{0%{transform:translateY(0) scale(1);opacity:0;}10%{opacity:1;}90%{opacity:.4;}100%{transform:translateY(-100vh) scale(.3);opacity:0;}}

  /* ─── RESPONSIVE ─── */
  @media(max-width:1100px){
    .about-grid{gap:3.5rem;}
    .proj-grid{grid-template-columns:repeat(2,1fr);}
    .contact-grid{grid-template-columns:1fr 1.2fr;gap:3rem;}
  }
  @media(max-width:860px){
    .nav-links{display:none;}
    .nav-hamburger{display:flex;}
    .nav-mobile-menu{display:flex;}
    .nav .btn-r{display:none;}
    .nav-mobile-menu{gap:0;padding:0;justify-content:flex-start;padding-top:5.5rem;}
    .nav-mobile-menu a{font-family:var(--fd);font-size:clamp(2.8rem,9vw,4rem);letter-spacing:.1em;color:rgba(240,230,230,.18);border-bottom:1px solid rgba(204,0,0,.08);width:100%;padding:1.1rem var(--pad-x);transition:color .3s,padding-left .3s;}
    .nav-mobile-menu a:hover{color:var(--r);padding-left:calc(var(--pad-x) + .8rem);}
    .nav-mobile-menu .m-cta{font-family:var(--fh)!important;font-size:.75rem!important;letter-spacing:.22em!important;color:#fff!important;background:var(--r);border-bottom:none!important;margin-top:2.5rem;align-self:flex-start;clip-path:polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%);margin-left:var(--pad-x);padding:1rem 2rem!important;}
    .nav-mobile-menu .m-social{display:flex;gap:1rem;padding:1.8rem var(--pad-x) 0;margin-top:auto;}
    .nav-mobile-menu .m-social a{font-family:var(--fh)!important;font-size:.58rem!important;letter-spacing:.22em!important;color:var(--mt)!important;border:none!important;width:auto;padding:0!important;text-transform:uppercase;}
    .hero{min-height:100svh;padding-top:0;padding-bottom:6rem;align-items:center;}
    .hero-img-stack{width:100%;opacity:.22;z-index:1;}
    .hero-txt{z-index:10;padding-top:5rem;padding-bottom:0;}
    .scroll-cue{display:none;}
    .about-grid{grid-template-columns:1fr;gap:3rem;}
    .about-img-wrap{max-width:380px;margin:0 auto;}
    .about-badge{left:-0.8rem;bottom:-1rem;right:0.8rem;}
    .contact-grid{grid-template-columns:1fr;gap:2.5rem;}
    .footer{flex-direction:column;align-items:center;text-align:center;gap:.6rem;padding:2rem var(--pad-x) 6rem;}
  }
  @media(max-width:600px){
    .hero{padding-bottom:5rem;}
    .hero-txt{padding-top:5.5rem;}
    .hero-h1{font-size:clamp(3.4rem,14vw,5rem);line-height:.88;}
    .hero-eye{font-size:.6rem;letter-spacing:.28em;}
    .hero-sub{font-size:.95rem;max-width:85%;}
    .hero-btns{flex-direction:row;gap:.7rem;flex-wrap:wrap;}
    .hero-btns a{flex:1;text-align:center;min-width:130px;}
    .hero-btns button{flex:1;min-width:130px;}
    .mob-nav{display:flex;}
    .about-grid{gap:2rem;}
    .about-img-wrap{max-width:100%;}
    .about-frame{aspect-ratio:3/2;border-radius:12px;overflow:hidden;}
    .about-frame::after{display:none;}
    .about-badge{position:static;margin-top:1rem;left:0;bottom:0;border-radius:0 8px 8px 0;}
    .proj-filter{flex-wrap:nowrap;overflow-x:auto;padding-bottom:.5rem;-webkit-overflow-scrolling:touch;scrollbar-width:none;margin-bottom:1.5rem;}
    .proj-filter::-webkit-scrollbar{display:none;}
    .pf-btn{flex-shrink:0;border-radius:100px;font-size:.6rem;padding:.5rem 1.1rem;min-height:38px;clip-path:none;}
    .proj-grid{grid-template-columns:1fr;gap:1rem;}
    .p-card{display:grid;grid-template-columns:auto 1fr;border-radius:12px;overflow:hidden;}
    .p-icon{margin:0;width:60px;min-height:100%;border-radius:0;clip-path:none;align-self:stretch;align-items:center;justify-content:center;border:none;border-right:1px solid rgba(204,0,0,.15);background:rgba(204,0,0,.08);}
    .p-body{padding:1.1rem 1.2rem 1.1rem;}
    .p-name{font-size:1.2rem;}
    .p-desc{font-size:.83rem;line-height:1.6;margin-bottom:.8rem;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
    .p-tags{margin-bottom:.8rem;gap:.3rem;}
    .p-tag{font-size:.52rem;padding:.15rem .5rem;}
    .p-links{gap:.5rem;}
    .p-link{font-size:.58rem;padding:.4rem .85rem;min-height:36px;}
    .contact-grid{margin-top:1.5rem;gap:2rem;}
    .c-info-list{gap:1.2rem;}
    .c-info-item{gap:.8rem;}
    .c-ico{width:38px;height:38px;min-width:38px;}
    .c-iv{font-size:.88rem;}
    .c-input{font-size:.92rem;padding:.8rem 1rem;border-radius:8px;border-color:rgba(204,0,0,.2);}
    .c-send{width:100%;text-align:center;justify-content:center;border-radius:8px;clip-path:none;font-size:.72rem;padding:1rem;}
    .socials{gap:.65rem;margin-top:2rem;}
    .soc-btn{width:42px;height:42px;border-radius:10px;clip-path:none;}
    .sh{font-size:clamp(2.4rem,11vw,3.5rem);}
    .sec{padding:clamp(3rem,7vw,5rem) var(--pad-x);}
    .footer{padding-bottom:6rem;}
    .ft-name{font-size:1.3rem;}
  }
  @media(max-width:380px){
    .nav-logo{font-size:1.55rem;}
    .hero-h1{font-size:clamp(3rem,15vw,4rem);}
    .hero-btns a,.hero-btns button{font-size:.6rem;padding:.7rem 1.2rem;}
    .p-card{grid-template-columns:50px 1fr;}
    .p-icon{width:50px;}
    .p-name{font-size:1.1rem;}
  }
  .mob-nav{display:none;position:fixed;bottom:1.2rem;left:50%;transform:translateX(-50%);z-index:900;background:rgba(10,2,6,.92);backdrop-filter:blur(20px);border:1px solid rgba(204,0,0,.2);border-radius:100px;padding:.55rem .8rem;gap:.25rem;align-items:center;box-shadow:0 8px 40px rgba(0,0,0,.6),0 0 0 1px rgba(204,0,0,.08);}
  .mob-nav a{font-family:var(--fh);font-size:.55rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--mt);text-decoration:none;padding:.45rem .9rem;border-radius:100px;transition:all .25s;}
  .mob-nav a.active,.mob-nav a:hover{background:var(--r);color:#fff;}
`;

const skills = [
  ["HTML/CSS",95],["JavaScript",90],["React.js",85],["Node.js",80],
  ["Flutter",75],["Laravel",70],["ASP.NET",65],["MongoDB",85],
];

const projects = [
  { id:1, name:"Orrento Rental App", desc:"Comprehensive rental application with secure payment integration and real-time tracking.", tags:["Flutter","SQL","ASP.NET"], cat:"mobile", letter:"O" },
  { id:2, name:"Eventure", desc:"Platform for creating, managing and promoting events with ticket sales and attendee management.", tags:["ASP.NET MVC","SQL"], cat:"web", letter:"E" },
  { id:3, name:"Ondule Clothing", desc:"E-commerce platform for a modern clothing brand with product customization and AR try-on features.", tags:["Shopify"], cat:"branding", letter:"O" },
  { id:4, name:"DecorVista", desc:"Home decor e-commerce with interior design consultation and augmented reality preview.", tags:["ASP.NET MVC","SQL"], cat:"web", letter:"D" },
  { id:5, name:"SadarCables", desc:"E-commerce store for cables and accessories with inventory management and order tracking.", tags:["PHP","MySQL","Bootstrap"], cat:"web", letter:"S" },
  { id:6, name:"Ondulextractor", desc:"Google Maps lead fetcher — automated data extraction tool for business development.", tags:["React.js","Node.js"], cat:"web", letter:"O" },
];

const filters = [["all","All Projects"],["web","Web Apps"],["mobile","Mobile Apps"],["branding","Branding"]];

const marqueeWords = ["Software Engineer","Web Development","Mobile Apps","React.js","Node.js","Flutter","ASP.NET","MongoDB","UI Design","Full-Stack","Karachi, PK"];

/* ── Rain FX ── */
function RainFX() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if(!c) return;
    const ctx = c.getContext("2d");
    const resize = () => { c.width=window.innerWidth; c.height=window.innerHeight; };
    resize(); window.addEventListener("resize",resize);
    const drops = Array.from({length:150},()=>({
      x:Math.random()*window.innerWidth,y:Math.random()*window.innerHeight,
      len:Math.random()*16+6,spd:Math.random()*4+2,op:Math.random()*.28+.07,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0,0,c.width,c.height);
      drops.forEach(d=>{
        ctx.beginPath(); ctx.strokeStyle=`rgba(255,100,100,${d.op})`; ctx.lineWidth=.5;
        ctx.moveTo(d.x,d.y); ctx.lineTo(d.x+d.len*.11,d.y+d.len); ctx.stroke();
        d.y+=d.spd; d.x+=d.spd*.11;
        if(d.y>c.height){d.y=-d.len;d.x=Math.random()*c.width;}
      });
      raf=requestAnimationFrame(draw);
    };
    draw();
    return ()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={ref} className="rain-c"/>;
}

/* ── Floating particles ── */
function Particles() {
  const particles = Array.from({length:14},(_,i)=>({
    id:i,
    left:`${Math.random()*95}%`,
    size:`${Math.random()*3+1}px`,
    duration:`${Math.random()*18+12}s`,
    delay:`${Math.random()*14}s`,
    opacity: Math.random()*.5+.2,
  }));
  return (
    <div className="particles">
      {particles.map(p=>(
        <div key={p.id} className="particle" style={{
          left:p.left,bottom:"-10px",
          width:p.size,height:p.size,
          animationDuration:p.duration,
          animationDelay:p.delay,
          opacity:p.opacity,
        }}/>
      ))}
    </div>
  );
}

/* ── Skill bars ── */
function SkillBars() {
  const ref = useRef(null);
  const [anim, setAnim] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e])=>{ if(e.isIntersecting){setAnim(true);obs.disconnect();} },{threshold:.2});
    if(ref.current) obs.observe(ref.current);
    return ()=>obs.disconnect();
  },[]);
  return (
    <div className="skills-list" ref={ref}>
      {skills.map(([name,pct],i)=>(
        <div className="skill-row" key={name}>
          <div className="skill-head">
            <span className="skill-name">{name}</span>
            <span className="skill-pct">{pct}%</span>
          </div>
          <div className="skill-track">
            <div
              className={`skill-fill${anim?" anim":""}`}
              style={{width:`${pct}%`,transitionDelay:anim?`${i*.09}s`:"0s"}}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Fade-in observer ── */
function useFadeIn() {
  useEffect(()=>{
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");obs.unobserve(e.target);}});
    },{threshold:.08});
    document.querySelectorAll(".fi").forEach(el=>obs.observe(el));
    return ()=>obs.disconnect();
  },[]);
}

/* ── Marquee ── */
function Marquee() {
  const items = [];
  for(let r=0;r<4;r++){
    marqueeWords.forEach((w,i)=>{
      items.push(<span key={`${r}-${i}`} className="mq-item">{w}</span>);
      items.push(<span key={`sep-${r}-${i}`} className="mq-sep">✦</span>);
    });
  }
  return (
    <div className="marquee-wrap">
      <div className="marquee-track">{items}</div>
    </div>
  );
}

/* ══ MAIN ══ */
export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false);
  const [filter, setFilter]     = useState("all");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const posRef  = useRef({x:0,y:0});
  const ringRef = useRef(null);
  const dotRef  = useRef(null);
  const [form, setForm] = useState({name:"",email:"",msg:""});
  const [sent, setSent] = useState(false);
  useFadeIn();

  useEffect(()=>{
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return ()=>{ document.body.style.overflow = ""; };
  },[menuOpen]);

  useEffect(()=>{
    const s=()=>{
      setScrolled(window.scrollY>80);
      const sections=["contact","projects","about","hero"];
      for(const id of sections){
        const el=document.getElementById(id)||document.querySelector(".hero");
        if(el&&window.scrollY>=el.offsetTop-160){setActiveSection(id);break;}
      }
    };
    window.addEventListener("scroll",s);
    return ()=>window.removeEventListener("scroll",s);
  },[]);

  // ── Cursor: fully DOM-driven, zero React re-renders ──
  useEffect(()=>{
    const ring = ringRef.current;
    const dot  = dotRef.current;
    if(!ring || !dot) return;

    let rx=0, ry=0, tx=0, ty=0, raf;

    const mv = e => {
      tx = e.clientX;
      ty = e.clientY;
      // dot follows instantly — no lag
      dot.style.transform = `translate(${tx}px,${ty}px)`;
    };

    const mc = () => {
      ring.classList.add("click");
      setTimeout(()=>ring.classList.remove("click"), 180);
    };

    const loop = () => {
      rx += (tx - rx) * 0.12;
      ry += (ty - ry) * 0.12;
      ring.style.transform = `translate(${rx}px,${ry}px)`;
      raf = requestAnimationFrame(loop);
    };
    loop();

    window.addEventListener("mousemove", mv, {passive:true});
    window.addEventListener("click", mc);
    return ()=>{
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", mv);
      window.removeEventListener("click", mc);
    };
  },[]);

  // ── Hover: toggle classes directly on the DOM elements ──
  useEffect(()=>{
    const on = () => {
      ringRef.current?.classList.add("h");
      dotRef.current?.classList.add("h");
    };
    const off = () => {
      ringRef.current?.classList.remove("h");
      dotRef.current?.classList.remove("h");
    };
    const els = document.querySelectorAll("a,button,.p-card,.about-frame,.hero-img-stack,.soc-btn");
    els.forEach(el=>{el.addEventListener("mouseenter",on);el.addEventListener("mouseleave",off);});
    return ()=>els.forEach(el=>{el.removeEventListener("mouseenter",on);el.removeEventListener("mouseleave",off);});
  },[]);

  const filtered = filter==="all" ? projects : projects.filter(p=>p.cat===filter);

  const send = () => {
    if(!form.name || !form.email || !form.msg) return;
    setSent("sending");
    emailjs.send(
      "service_sq6ca6l","template_ktk37n5",
      { from_name:form.name, from_email:form.email, message:form.msg },
      "rytm5JPPKzhe9gIA-"
    ).then(()=>{
      setSent("ok"); setForm({name:"",email:"",msg:""});
      setTimeout(()=>setSent(false),4000);
    }).catch(()=>{
      setSent("err"); setTimeout(()=>setSent(false),4000);
    });
  };

  const closeMenu=(href)=>{setMenuOpen(false);if(href)setTimeout(()=>{const el=document.querySelector(href);el&&el.scrollIntoView({behavior:"smooth"});},300);};

  return (
    <>
      <style>{CSS}</style>

      {/* Cursor */}
      <div className="cur-ring" ref={ringRef}/>
      <div className="cur-dot"  ref={dotRef}/>
      <div className="vignette"/>

      {/* Mobile menu */}
      <div className={`nav-mobile-menu${menuOpen?" open":""}`} aria-hidden={!menuOpen}>
        {[["About","#about"],["Projects","#projects"],["Contact","#contact"]].map(([l,h])=>(
          <a key={l} href={h} onClick={e=>{e.preventDefault();closeMenu(h);}}>{l}</a>
        ))}
        <a href="#projects" className="m-cta" onClick={e=>{e.preventDefault();closeMenu("#projects");}}>VIEW PORTFOLIO</a>
        <div className="m-social">
          <a href="#">GitHub</a><a href="#">LinkedIn</a><a href="#">Twitter</a>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="mob-nav" aria-label="Quick navigation">
        {[["About","#about"],["Work","#projects"],["Contact","#contact"]].map(([l,h])=>(
          <a key={l} href={h} className={activeSection===h.slice(1)?"active":""}
             onClick={e=>{e.preventDefault();const el=document.querySelector(h);el&&el.scrollIntoView({behavior:"smooth"});}}>
            {l}
          </a>
        ))}
      </nav>

      {/* NAV */}
      <nav className={`nav${scrolled?" sc":""}`}>
        <div className="nav-logo">MAB<span>.</span></div>
        <ul className="nav-links">
          {[["About","#about"],["Projects","#projects"],["Contact","#contact"]].map(([l,h])=>(
            <li key={l}><a href={h}>{l}</a></li>
          ))}
        </ul>
        <a href="#projects" className="btn-r" style={{textDecoration:"none",display:"inline-block"}}
           onClick={()=>setMenuOpen(false)}>VIEW PORTFOLIO</a>
        <button className={`nav-hamburger${menuOpen?" open":""}`} onClick={()=>setMenuOpen(o=>!o)}
                aria-label={menuOpen?"Close menu":"Open menu"} aria-expanded={menuOpen}>
          <span/><span/><span/>
        </button>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg"/>
        <div className="hero-grid"/>
        <RainFX/>
        <Particles/>

        <div className="hero-img-stack">
          <img src={IMG_HERO} alt="hero visual" className="img-top"/>
          <img src={IMG_FACE} alt="Abdul Bari"  className="img-bot"/>
          <div className="hero-img-fade"/>
          <div className="hero-slash"/>
          <span className="hover-hint">◈ HOVER TO REVEAL</span>
        </div>

        <div className="hero-txt">
          <p className="hero-eye">Software Engineer &amp; Developer — Karachi, Pakistan</p>
          <h1 className="hero-h1">
            MUHAMMAD<br/>ABDUL<br/><em>BARI</em>
          </h1>
          <div className="hero-rule"/>
          <p className="hero-sub">
            17-year-old Software Engineering student crafting digital excellence
            with timeless elegance — INTP, problem-solver, builder.
          </p>
          <div className="hero-btns">
            <a href="#projects" className="btn-r" style={{textDecoration:"none"}}>VIEW WORK</a>
            <button className="btn-g">DOWNLOAD CV</button>
          </div>
        </div>
        <div className="scroll-cue"><span>Scroll</span><div className="s-bar"/></div>
      </section>

      {/* ── MARQUEE ── */}
      <Marquee/>

      {/* ── ABOUT ── */}
      <section id="about" className="sec">
        <div className="about-grid">
          <div className="about-img-wrap fi">
            <div className="about-frame">
              <img src={IMG_FACE} alt="Muhammad Abdul Bari"/>
            </div>
            <div className="about-badge">
              <p>"Crafting digital excellence with timeless elegance"</p>
              <cite>— Muhammad Abdul Bari</cite>
            </div>
          </div>
          <div className="fi" style={{transitionDelay:".18s"}}>
            <p className="sl">About Me</p>
            <h2 className="sh">THE<br/>DEVELOPER</h2>
            <div className="sr"/>
            <p className="sb">
              I'm a 17-year-old Software Engineering student with a passion for creating
              innovative digital solutions. As an INTP personality type, I thrive on solving
              complex problems and building systems that make a difference.
            </p>
            <p className="sb" style={{marginTop:"1rem"}}>
              My journey in development started at a young age, and I've since mastered
              various technologies across web and mobile development. I specialize in
              responsive, user-friendly applications with clean, efficient code.
            </p>
            <SkillBars/>
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" className="sec" style={{paddingTop:"4rem"}}>
        <p className="sl fi">Selected Work</p>
        <h2 className="sh fi">MY<br/>PROJECTS</h2>
        <div className="sr"/>
        <p className="sb fi">A collection of my finest work, showcasing innovation and excellence in digital craftsmanship.</p>
        <div className="proj-filter fi">
          {filters.map(([k,l])=>(
            <button key={k} className={`pf-btn${filter===k?" active":""}`} onClick={()=>setFilter(k)}>
              <span>{l}</span>
            </button>
          ))}
        </div>
        <div className="proj-grid">
          {filtered.map((p,i)=>(
            <div className="p-card fi" key={p.id} style={{transitionDelay:`${i*.07}s`}}>
              <div className="p-card-glow"/>
              <div className="p-icon"><span>{p.letter}</span></div>
              <div className="p-body">
                <div className="p-name">{p.name}</div>
                <p className="p-desc">{p.desc}</p>
                <div className="p-tags">{p.tags.map(t=><span key={t} className="p-tag">{t}</span>)}</div>
                <div className="p-links">
                  <a href="#" className="p-link live">Live Demo</a>
                  <a href="#" className="p-link code">Code</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="sec" style={{paddingTop:"4rem"}}>
        <p className="sl fi">Get In Touch</p>
        <h2 className="sh fi">LET'S<br/>CONNECT</h2>
        <div className="sr"/>
        <p className="sb fi">Have a project in mind? I'm always open to new connections and ideas.</p>
        <div className="contact-grid">
          <div className="fi" style={{transitionDelay:".1s"}}>
            <div className="c-info-list">
              <div className="c-info-item">
                <div className="c-ico">
                  <svg viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                <div><div className="c-il">Email</div><div className="c-iv"><a href="mailto:nizamabdulbari13@gmail.com">nizamabdulbari13@gmail.com</a></div></div>
              </div>
              <div className="c-info-item">
                <div className="c-ico">
                  <svg viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </div>
                <div><div className="c-il">Location</div><div className="c-iv">Karachi, Pakistan</div></div>
              </div>
              <div className="c-info-item">
                <div className="c-ico">
                  <svg viewBox="0 0 24 24"><path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                <div><div className="c-il">Portfolio</div><div className="c-iv"><a href="" target="_blank" rel="noreferrer">Coming soon</a></div></div>
              </div>
            </div>
            <div className="socials">
              <a href="#" className="soc-btn" aria-label="GitHub">
                <svg viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>
              </a>
              <a href="#" className="soc-btn" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="#" className="soc-btn" aria-label="Twitter / X">
                <svg viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
              </a>
            </div>
          </div>
          <div className="fi" style={{transitionDelay:".2s"}}>
            <div className="c-form">
              <input className="c-input" placeholder="Your Name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>
              <input className="c-input" placeholder="Email Address" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/>
              <textarea className="c-input" placeholder="Your Message" value={form.msg} onChange={e=>setForm(f=>({...f,msg:e.target.value}))}/>
              <button className="c-send" onClick={send}>
                {sent==="sending"?"SENDING…":sent==="ok"?"MESSAGE SENT ✓":sent==="err"?"FAILED — RETRY":"SEND MESSAGE"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="ft-l">
          <div className="ft-name">MUHAMMAD ABDUL BARI</div>
          <div className="ft-role">Software Engineer &amp; Developer</div>
        </div>
        <div className="ft-copy">© 2026 Muhammad Abdul Bari. All rights reserved.</div>
      </footer>
    </>
  );
}