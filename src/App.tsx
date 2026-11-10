import {useEffect, useRef, useState} from 'react';
import {ArrowUpRight, ArrowUp, ArrowDown, MapPin, Phone, Instagram, Menu, X, Plus, ChevronLeft, ChevronRight, Pause, Play} from 'lucide-react';
import {copy, menu, venuePhotos, type Lang} from './content';

const WOLT = 'https://wolt.com/en/grc/athens/restaurant/222-espresso-bar';
const MAP = 'https://www.google.com/maps/dir/?api=1&destination=222+Espresso+Bar+Papagou+140+Zografou+Athens';
const INSTAGRAM = 'https://www.instagram.com/222espressobar/';
const sections = ['our-place', 'menu', 'atmosphere', 'visit'];
// A continuous visit: booths and windows, then terrace, street and entrance.
const SCENE_ORDER = [0,3,4,1,6,5,2];
function sceneAtOffset(current:number,offset:number){return SCENE_ORDER[(SCENE_ORDER.indexOf(current)+offset+SCENE_ORDER.length)%SCENE_ORDER.length];}

function Sun({className = ''}: {className?: string}) {
  return <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden="true"><circle cx="50" cy="50" r="17" stroke="currentColor" strokeWidth="1.5"/>{Array.from({length:16},(_,i)=><path key={i} d="M50 8V24" stroke="currentColor" strokeWidth="1.5" transform={`rotate(${i*22.5} 50 50)`}/>)}<path d="M42 51c5 7 11 7 16 0" stroke="currentColor" strokeWidth="1.5"/><circle cx="44" cy="44" r="1.5" fill="currentColor"/><circle cx="56" cy="44" r="1.5" fill="currentColor"/></svg>;
}
function Logo({footer = false}: {footer?: boolean}) {return <a href="#top" className={`logo ${footer ? 'logo-footer' : ''}`} aria-label="222 Espresso Bar"><span>222</span><small>ESPRESSO BAR</small></a>;}
function VenueTreatmentSwitch({cinematic,onChange,label,cinematicLabel,originalLabel}:{cinematic:boolean;onChange:(value:boolean)=>void;label:string;cinematicLabel:string;originalLabel:string}){
  return <div className="venue-treatment-switch" role="group" aria-label={label}><button type="button" aria-pressed={cinematic} onClick={()=>onChange(true)}>{cinematicLabel}</button><button type="button" aria-pressed={!cinematic} onClick={()=>onChange(false)}>{originalLabel}</button></div>;
}
function VenueBackdrops({active,previous,source,describe,className=''}:{active:number;previous:number|null;source:(index:number)=>string;describe:(index:number)=>string;className?:string}){
  return <>{venuePhotos.map((photo,index)=><img key={photo.image} className={`ambient-background venue-backdrop ${className} ${index===active?'is-current':index===previous?'is-previous':''}`} src={source(index)} alt={index===active?describe(index):''} aria-hidden={index!==active} width="1600" height="1200" loading="lazy" decoding="async"/>)}</>;
}
function PlaybackButton({playing,onToggle,pauseLabel,playLabel}:{playing:boolean;onToggle:()=>void;pauseLabel:string;playLabel:string}){
  return <button type="button" className="scene-playback" onClick={onToggle} aria-label={playing?pauseLabel:playLabel} data-playing={playing}>{playing?<Pause size={15}/>:<Play size={15}/>}<span>{playing?pauseLabel:playLabel}</span></button>;
}

export default function App() {
  const [lang,setLang] = useState<Lang>('en');
  const [mobileOpen,setMobileOpen] = useState(false);
  const [tab,setTab] = useState(0);
  const [galleryIndex,setGalleryIndex] = useState<number|null>(null);
  const [cinematicVenue,setCinematicVenue] = useState(true);
  const [{current:activeScene,previous:previousScene},setSceneState] = useState<{current:number;previous:number|null}>({current:0,previous:null});
  const [autoplay,setAutoplay] = useState(false);
  const [scenesVisible,setScenesVisible] = useState(false);
  const [pageVisible,setPageVisible] = useState(true);
  const [sceneFocused,setSceneFocused] = useState(false);
  const [controlsHovered,setControlsHovered] = useState(false);
  const spaceScene = useRef<HTMLElement>(null);
  const sceneRefs = useRef<(HTMLButtonElement|null)[]>([]);
  const dialog = useRef<HTMLDialogElement>(null);
  const campaignArt = useRef<HTMLImageElement>(null);
  const tabRefs = useRef<(HTMLButtonElement|null)[]>([]);
  const t = copy[lang]; const li = lang === 'en' ? 0 : 1;
  const venueSwitchProps={cinematic:cinematicVenue,onChange:setCinematicVenue,label:t.venueToggleLabel,cinematicLabel:t.venueCinematic,originalLabel:t.venueOriginal};
  const playbackProps={playing:autoplay,onToggle:togglePlayback,pauseLabel:t.pausePhotos,playLabel:t.playPhotos};
  function venueSrc(index:number){const image=venuePhotos[index].image;return cinematicVenue?`/images/venue-styled/${image.replace(/\.jpg$/,'.webp')}`:`/images/${image}`;}
  function venueAlt(index:number){return `${venuePhotos[index].alt[li]}${cinematicVenue?` — ${t.venueEditedAlt}`:''}`;}
  useEffect(()=>{try{if(localStorage.getItem('222-language')==='el')setLang('el');}catch{/* Storage may be disabled. */}},[]);
  useEffect(()=>{document.documentElement.lang=lang;},[lang]);
  useEffect(()=>{const preference=window.matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setAutoplay(!preference.matches);update();preference.addEventListener('change',update);return()=>preference.removeEventListener('change',update);},[]);
  useEffect(()=>{const update=()=>setPageVisible(document.visibilityState!=='hidden');update();document.addEventListener('visibilitychange',update);return()=>document.removeEventListener('visibilitychange',update);},[]);
  useEffect(()=>{
    if(!('IntersectionObserver' in window)){setScenesVisible(true);return;}
    const visible=new Map<Element,boolean>();let cancelled=false;
    const observer=new IntersectionObserver(entries=>{if(cancelled)return;for(const entry of entries)visible.set(entry.target,entry.isIntersecting&&entry.intersectionRatio>=.18);setScenesVisible([...visible.values()].some(Boolean));},{threshold:[0,.18]});
    for(const element of [spaceScene.current])if(element)observer.observe(element);
    return()=>{cancelled=true;observer.disconnect();};
  },[]);
  useEffect(()=>{
    if(!autoplay||!scenesVisible||!pageVisible||sceneFocused||controlsHovered||galleryIndex!==null||mobileOpen)return;
    const timer=window.setInterval(()=>setSceneState(({current})=>({current:sceneAtOffset(current,1),previous:current})),7000);
    return()=>window.clearInterval(timer);
  },[autoplay,scenesVisible,pageVisible,sceneFocused,controlsHovered,galleryIndex,mobileOpen]);
  useEffect(()=>{const desktop=window.matchMedia('(min-width: 851px)');const closeOnDesktop=()=>{if(desktop.matches)setMobileOpen(false);};desktop.addEventListener('change',closeOnDesktop);return ()=>desktop.removeEventListener('change',closeOnDesktop);},[]);
  useEffect(()=>{document.body.style.overflow = mobileOpen || galleryIndex !== null ? 'hidden' : '';return ()=>{document.body.style.overflow='';};},[mobileOpen,galleryIndex]);
  useEffect(()=>{if(galleryIndex!==null&&!dialog.current?.open)dialog.current?.showModal();},[galleryIndex]);
  useEffect(()=>{const close=(e:KeyboardEvent)=>{if(e.key==='Escape')setMobileOpen(false);};window.addEventListener('keydown',close);return ()=>window.removeEventListener('keydown',close);},[]);
  function changeScene(index:number){const next=(index+venuePhotos.length)%venuePhotos.length;setAutoplay(false);setSceneState(old=>old.current===next?old:{current:next,previous:old.current});}
  function togglePlayback(){const next=!autoplay;setAutoplay(next);if(next){setSceneFocused(false);setControlsHovered(false);}}
  function selectSceneFromKeyboard(e:React.KeyboardEvent<HTMLButtonElement>,index:number){let position=SCENE_ORDER.indexOf(index);if(e.key==='ArrowRight')position=(position+1)%SCENE_ORDER.length;else if(e.key==='ArrowLeft')position=(position+SCENE_ORDER.length-1)%SCENE_ORDER.length;else if(e.key==='Home')position=0;else if(e.key==='End')position=SCENE_ORDER.length-1;else return;e.preventDefault();changeScene(SCENE_ORDER[position]);sceneRefs.current[position]?.focus();}
  function blurScene(e:React.FocusEvent<HTMLElement>){if(!e.currentTarget.contains(e.relatedTarget as Node|null))setSceneFocused(false);}
  function moveGallery(step:number){setGalleryIndex(i=>i===null?SCENE_ORDER[0]:sceneAtOffset(i,step));}
  function changeLanguage(next:Lang){setLang(next);try{localStorage.setItem('222-language',next);}catch{/* Storage may be disabled. */}}
  function moveCampaign(e:React.PointerEvent<HTMLElement>){if(e.pointerType!=='mouse'||window.matchMedia('(prefers-reduced-motion: reduce)').matches||window.innerWidth<851)return;const box=e.currentTarget.getBoundingClientRect();if(campaignArt.current)campaignArt.current.style.transform=`translate3d(${((e.clientX-box.left)/box.width-.5)*-12}px,${((e.clientY-box.top)/box.height-.5)*-8}px,0) scale(1.025)`;}
  function selectTabFromKeyboard(e:React.KeyboardEvent<HTMLButtonElement>,i:number){let next=i;if(e.key==='ArrowRight')next=(i+1)%4;else if(e.key==='ArrowLeft')next=(i+3)%4;else if(e.key==='Home')next=0;else if(e.key==='End')next=3;else return;e.preventDefault();setTab(next);tabRefs.current[next]?.focus();}
  return <>
    <a href="#main" className="skip-link">{t.skip}</a>
    <div className="brand-bar"><span>{t.announcement}</span><a href={WOLT} target="_blank" rel="noopener noreferrer">{t.order}<ArrowUpRight size={12}/></a></div>
    <header className="header" id="top">
      <div className="header-inner">
        <Logo />
        <nav className="desktop-nav" aria-label={lang==='en'?'Main navigation':'Κύρια πλοήγηση'}>{t.nav.map((label,i)=><a key={sections[i]} href={`#${sections[i]}`}>{label}</a>)}</nav>
        <div className="header-actions"><div className="language-switch" aria-label="Language / Γλώσσα">{(['en','el'] as Lang[]).map(l=><button key={l} aria-pressed={lang===l} onClick={()=>changeLanguage(l)}>{l==='el'?'ΕΛ':'EN'}</button>)}</div><a className="button button-small header-directions" href={MAP} target="_blank" rel="noopener noreferrer">{t.directions}<ArrowUpRight size={17}/></a><button className="mobile-toggle icon-button" aria-label={mobileOpen?t.closeMenu:t.openMenu} aria-expanded={mobileOpen} aria-controls="mobile-nav" onClick={()=>setMobileOpen(!mobileOpen)}>{mobileOpen?<X/>:<Menu/>}</button></div>
      </div>
      {mobileOpen&&<nav id="mobile-nav" className="mobile-nav" aria-label={lang==='en'?'Mobile navigation':'Πλοήγηση κινητού'}>{t.nav.map((label,i)=><a key={sections[i]} href={`#${sections[i]}`} onClick={()=>setMobileOpen(false)}><small>0{i+1}</small>{label}<ArrowUpRight/></a>)}<a href={MAP} target="_blank" rel="noopener noreferrer" onClick={()=>setMobileOpen(false)}>{t.directions}<MapPin/></a><a href={WOLT} target="_blank" rel="noopener noreferrer" onClick={()=>setMobileOpen(false)}>{t.order}<ArrowUpRight/></a></nav>}
    </header>
    <main id="main">
      <section className="campaign-hero" aria-labelledby="hero-title" onPointerMove={moveCampaign} onPointerLeave={()=>{if(campaignArt.current)campaignArt.current.style.transform='translate3d(0,0,0) scale(1.02)';}}>
        <img ref={campaignArt} className="campaign-art" src="/images/campaign-hero.webp" alt={t.heroArtAlt} width="1672" height="941" fetchPriority="high"/>
        <div className="campaign-shade"/>
        <div className="section-wrap campaign-content"><p className="eyebrow"><span className="small-star">✳</span>{t.eyebrow}</p><h1 id="hero-title"><span>{t.hero1}</span><span>{t.hero2}</span><em>{t.hero3}</em></h1><p className="campaign-description">{t.heroBody}</p><div className="campaign-actions"><a className="button" href="#menu">{t.explore}<ArrowUpRight size={20}/></a><a className="campaign-visit" href="#visit">{t.directions}<ArrowUpRight size={18}/></a></div></div>
        <div className="campaign-stamp"><Sun/><span>{t.badge1}<br/>{t.badge2}</span></div>
        <div className="section-wrap campaign-bottom"><a href="#visit"><MapPin size={12}/>{t.heroFoot}</a><span>{t.campaignLabel}</span><a href="#our-place">{t.heroScroll}<ArrowDown size={15}/></a></div>
      </section>
      <div className="ticker" aria-label={t.ticker.join(' · ')}><div className="ticker-track" aria-hidden="true">{[0,1].map(n=><div className="ticker-group" key={n}>{t.ticker.map(s=><span key={s}>{s}<span className="ticker-star">✳</span></span>)}</div>)}</div></div>
      <section className="ambient-scene ambient-story" id="our-place" aria-labelledby="story-title">
        <img className="ambient-background story-scene-image" src={venueSrc(4)} alt={venueAlt(4)} width="1600" height="752" loading="lazy"/>
        <div className="ambient-shade"/>
        <div className="section-wrap ambient-story-content">
          <p className="eyebrow">{t.storyEyebrow}</p>
          <h2 id="story-title">{t.storyTitle}</h2>
          <p className="ambient-lead">{t.storyBody}</p>
          <p className="ambient-script">{t.storyNote}</p>
          <div className="ambient-actions"><a className="button" href="#atmosphere">{t.storyCta}<ArrowUpRight size={19}/></a><button className="ambient-link story-gallery-open" onClick={()=>setGalleryIndex(4)}>{t.photoHint}<Plus size={19}/></button></div>
        </div>
        <ol className="section-wrap ambient-reasons">{t.reasons.map((reason,i)=><li key={i}><span className="reason-index">0{i+1}</span><h3>{reason.title}</h3><p>{reason.body}</p></li>)}</ol>
        <div className="section-wrap ambient-scene-foot"><span>222 / {t.location}</span><span>{t.storyPhotoCaption}</span></div>
      </section>
      <section className="ambient-scene ambient-coffee" aria-labelledby="interlude-title">
        <img className="ambient-background" src="/images/campaign-detail.webp" alt={t.interludeAlt} width="1254" height="1254" loading="lazy"/>
        <div className="ambient-shade"/>
        <div className="section-wrap ambient-coffee-content"><p className="eyebrow">{t.interludeEyebrow}</p><h2 id="interlude-title">{t.interludeTitle.split('\n').map((line,i)=><span key={i}>{line}</span>)}</h2><p className="ambient-lead">{t.interludeBody}</p><a className="button" href="#menu" onClick={()=>setTab(0)}>{t.interludeCta}<ArrowUpRight size={20}/></a><small>{t.campaignLabel}</small></div>
      </section>
      <section className="ambient-scene ambient-menu" id="menu" aria-labelledby="menu-title"><img className="ambient-background" src={venueSrc(3)} alt={venueAlt(3)} width="1448" height="1086" loading="lazy"/><div className="ambient-menu-shade"/><div className="section-wrap ambient-menu-content">
        <div className="section-heading"><div><p className="eyebrow">{t.menuEyebrow}</p><h2 id="menu-title">{t.menuTitle.split('\n').map((s,i)=><span key={i}>{s}</span>)}</h2></div><p>{t.menuIntro}</p></div>
        <div className="menu-tabs" role="tablist" aria-label={lang==='en'?'Menu categories':'Κατηγορίες μενού'}>{t.tabs.map((label,i)=><button key={i} ref={el=>{tabRefs.current[i]=el;}} role="tab" id={`menu-tab-${i}`} aria-controls="menu-panel" aria-selected={tab===i} tabIndex={tab===i?0:-1} onClick={()=>setTab(i)} onKeyDown={e=>selectTabFromKeyboard(e,i)}><span className="tab-number">0{i+1}</span>{label}<ArrowUpRight size={18}/></button>)}</div>
        <p className="menu-price-basis">{t.menuPriceBasis}</p>
        <div id="menu-panel" className={`menu-card-grid ${menu[tab].items.length===3?'menu-three':''}`} role="tabpanel" aria-labelledby={`menu-tab-${tab}`} tabIndex={0}>{menu[tab].items.map(item=><article className="menu-card" key={item.image}><div className="menu-card-image"><img src={`/images/menu/${item.image}`} alt={`${item.name[li]} — 222 Espresso Bar`} width="1200" height="675" loading="lazy"/></div><div className="menu-card-scrim"/><div className="menu-card-copy"><div className="menu-card-heading"><h3>{item.name[li]}</h3><data className="menu-card-price" value={item.price.toFixed(2)}>{new Intl.NumberFormat(lang==='el'?'el-GR':'en-IE',{style:'currency',currency:'EUR'}).format(item.price)}</data></div><p>{item.detail[li]}</p></div></article>)}</div>
        <div className="menu-bottom"><p>{t.menuNote}</p><a className="text-link" href={WOLT} target="_blank" rel="noopener noreferrer">{t.fullMenu}<ArrowUpRight size={20}/></a></div>
      </div></section>
      <section ref={spaceScene} className="ambient-scene ambient-space" id="atmosphere" aria-labelledby="space-title" aria-roledescription={t.sceneRole} onFocusCapture={()=>setSceneFocused(true)} onBlurCapture={blurScene}>
        <VenueBackdrops active={activeScene} previous={previousScene} source={venueSrc} describe={venueAlt} className="space-scene-image"/>
        <div className="ambient-shade"/>
        <div className="section-wrap ambient-space-top"><p className="eyebrow">{t.spaceEyebrow}</p><VenueTreatmentSwitch {...venueSwitchProps}/></div>
        <div className="section-wrap ambient-space-content"><p className="ambient-location" aria-live={autoplay?'off':'polite'}>{venuePhotos[activeScene].caption[li]}</p><h2 id="space-title">{t.spaceTitle.split('\n').map((line,i)=><span key={i}>{line}</span>)}</h2><p className="ambient-lead">{t.spaceBody}</p><button className="ambient-link space-gallery-open" onClick={()=>setGalleryIndex(activeScene)}>{t.photoHint}<Plus size={20}/></button></div>
        <div className="section-wrap ambient-space-bottom">
          <div className="space-scene-controls" onPointerEnter={()=>setControlsHovered(true)} onPointerLeave={()=>setControlsHovered(false)}><button className="icon-button" onClick={()=>changeScene(sceneAtOffset(activeScene,-1))} aria-label={t.galleryPrev}><ChevronLeft/></button><span>{String(SCENE_ORDER.indexOf(activeScene)+1).padStart(2,'0')} / {String(venuePhotos.length).padStart(2,'0')}</span><button className="icon-button" onClick={()=>changeScene(sceneAtOffset(activeScene,1))} aria-label={t.galleryNext}><ChevronRight/></button><PlaybackButton {...playbackProps}/></div>
          <div className="space-scene-selectors" onPointerEnter={()=>setControlsHovered(true)} onPointerLeave={()=>setControlsHovered(false)} role="group" aria-label={t.sceneNavLabel}>{SCENE_ORDER.map((index,position)=>{const photo=venuePhotos[index];return <button key={photo.image} ref={node=>{sceneRefs.current[position]=node;}} aria-label={`${position+1}. ${photo.caption[li]}`} aria-pressed={activeScene===index} onClick={()=>changeScene(index)} onKeyDown={e=>selectSceneFromKeyboard(e,index)}><span>{String(position+1).padStart(2,'0')}</span><span>{photo.caption[li]}</span></button>;})}</div>
          <p className="ambient-treatment-note">{t.venueTreatmentNote}</p>
        </div>
      </section>
      <section className="ambient-scene ambient-visit" id="visit" aria-labelledby="visit-title">
        <img className="ambient-background" src={venueSrc(2)} alt={venueAlt(2)} width="1448" height="1086" loading="lazy"/>
        <div className="ambient-shade"/>
        <div className="section-wrap ambient-visit-content"><div className="ambient-visit-copy"><p className="eyebrow">{t.visitEyebrow}</p><h2 id="visit-title">{t.visitTitle.split('\n').map((line,i)=><span key={i}>{line}</span>)}</h2><p className="ambient-lead">{t.visitBody}</p><div className="contact-details"><div><MapPin size={20}/><div><span className="eyebrow">{t.addressLabel}</span><address>{t.address1}<br/>{t.address2}</address></div></div><div><Phone size={19}/><div><span className="eyebrow">{t.callLabel}</span><a href="tel:+302107799931">+30 210 779 9931</a></div></div></div><div className="visit-actions"><a href={MAP} target="_blank" rel="noopener noreferrer" className="button">{t.directions}<ArrowUpRight size={19}/></a><a className="ambient-link" href="tel:+302107799931">{t.call}<Phone size={16}/></a></div><p className="hours-note">{t.hoursNote}</p></div><div className="ambient-map"><iframe title={t.mapTitle} src="https://maps.google.com/maps?q=222%20Espresso%20Bar%20Papagou%20140%20Zografou&t=&z=16&ie=UTF8&iwloc=&output=embed" width="600" height="570" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen/><a className="map-card" href={MAP} target="_blank" rel="noopener noreferrer"><div className="map-mark">222</div><div><strong>222 Espresso Bar</strong><span>{t.address1} · {t.address2.split(',')[0]}</span></div><ArrowUpRight size={23}/></a></div></div>
      </section>
    </main>
    <footer className="footer"><div className="section-wrap"><div className="footer-top"><h2>{t.footerBig}</h2><a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="footer-social"><span>{t.follow}<strong>@222espressobar</strong></span><span className="round-link"><Instagram size={22}/></span></a></div><div className="footer-main"><Logo footer/><div><p>{t.footerLine}</p><div className="footer-links"><a href={WOLT} target="_blank" rel="noopener noreferrer">Wolt<ArrowUpRight size={13}/></a><a href={MAP} target="_blank" rel="noopener noreferrer">Google Maps<ArrowUpRight size={13}/></a><a href="tel:+302107799931">210 779 9931<ArrowUpRight size={13}/></a></div></div><a className="back-top" href="#top">{t.backTop}<ArrowUp size={17}/></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} 222 Espresso Bar</span><span>{t.photoCredit}</span><span>MADE FOR THE EVERYDAY.</span></div></div></footer>
    <dialog ref={dialog} className="gallery-dialog" onClose={()=>setGalleryIndex(null)} onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close();}} onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();moveGallery(1);}if(e.key==='ArrowLeft'){e.preventDefault();moveGallery(-1);}}} aria-labelledby="gallery-title"><div className="gallery-top"><p id="gallery-title">222 / {t.galleryTitle}</p><VenueTreatmentSwitch {...venueSwitchProps}/><button className="icon-button gallery-close" onClick={()=>dialog.current?.close()} aria-label={t.galleryClose} autoFocus><X size={25}/></button></div><div className="gallery-image"><img src={venueSrc(galleryIndex??0)} alt={venueAlt(galleryIndex??0)}/></div><p className="gallery-caption">{venuePhotos[galleryIndex??0].caption[li]}</p><div className="gallery-controls"><button className="icon-button" onClick={()=>moveGallery(-1)} aria-label={t.galleryPrev}><ChevronLeft/></button><span>{String(SCENE_ORDER.indexOf(galleryIndex??0)+1).padStart(2,'0')} / {String(venuePhotos.length).padStart(2,'0')}</span><button className="icon-button" onClick={()=>moveGallery(1)} aria-label={t.galleryNext}><ChevronRight/></button></div></dialog>
  </>;
}
