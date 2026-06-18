import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Volume2,
  VolumeX,
  MapPin,
  Clock,
  Phone,
  Sparkles,
  ChevronDown,
  Send,
  CheckCircle,
  Copy,
  Heart,
  ArrowUpRight,
  Download,
  X,
} from 'lucide-react';

// Betrothal Ceremony — Saturday, October 10, 2026, 11:00 AM IST
const TARGET_DATE = new Date('2026-10-10T11:00:00+05:30');

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // RSVP
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState('attending');
  const [rsvpGuests, setRsvpGuests] = useState('1');
  const [rsvpNote, setRsvpNote] = useState('');
  const [isRsvpSubmitting, setIsRsvpSubmitting] = useState(false);

  // Blessings
  const [blessingName, setBlessingName] = useState('');
  const [blessingMessage, setBlessingMessage] = useState('');
  const [blessingsList, setBlessingsList] = useState([
    { name: 'Saji & Sheela', text: 'May God shower you both with boundless grace and love on this beautiful journey.', date: 'Just now' },
    { name: 'Anto & Mini', text: 'Welcoming our dear Cera into our family with all our love.', date: '5 minutes ago' },
    { name: 'Fr. Francis SJ', text: 'Prayers and blessings for a holy and joyful union in Christ.', date: '1 hour ago' },
  ]);

  const [showCopied, setShowCopied] = useState(false);
  const [toast, setToast] = useState({ show: false, title: '', message: '' });

  const audioRef = useRef(null);
  const toastTimer = useRef(null);

  // ---- Countdown ----
  useEffect(() => {
    const tick = () => {
      const diff = +TARGET_DATE - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // ---- Nav scroll state ----
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ---- Scroll-reveal ----
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('reveal-in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // ---- Audio (respects browser autoplay policy) ----
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = 0.35;
  }, []);

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    if (isPlaying) {
      a.pause();
      setIsPlaying(false);
    } else {
      a.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false)); // blocked by policy — fail quietly
    }
  };

  const showToast = useCallback((title, message) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ show: true, title, message });
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 4200);
  }, []);

  const handleRsvpSubmit = () => {
    if (!rsvpName.trim() || isRsvpSubmitting) return;
    setIsRsvpSubmitting(true);
    setTimeout(() => {
      setIsRsvpSubmitting(false);
      const name = rsvpName.trim();
      showToast(
        rsvpStatus === 'attending' ? 'Reservation confirmed' : 'Response received',
        rsvpStatus === 'attending'
          ? `Thank you, ${name}. We can't wait to celebrate with you.`
          : `Thank you, ${name}. You'll be dearly missed — and held in our prayers.`
      );
      setRsvpName('');
      setRsvpNote('');
    }, 1600);
  };

  const handleBlessingSubmit = () => {
    if (!blessingName.trim() || !blessingMessage.trim()) return;
    setBlessingsList((list) => [
      { name: blessingName.trim(), text: blessingMessage.trim(), date: 'Just now' },
      ...list,
    ]);
    showToast('Blessing posted', 'Your wishes now live on Cera & Tony\u2019s board.');
    setBlessingName('');
    setBlessingMessage('');
  };

  const copyPhoneNumber = async () => {
    const number = '+919847400241';
    try {
      await navigator.clipboard.writeText(number);
    } catch {
      const el = document.createElement('textarea');
      el.value = number;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      try { document.execCommand('copy'); } catch { /* ignore */ }
      document.body.removeChild(el);
    }
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const ceremonies = [
    {
      idx: 'I',
      tag: 'Morning Service',
      title: 'Betrothal Ceremony',
      time: '11:00 AM',
      venue: "St. Mary's Forane Church",
      place: 'Kanjoor, Kerala',
      note: 'A historic holy site where two families gather in prayer, and promises are first spoken aloud.',
      map: "https://maps.google.com/?q=St.+Mary's+Forane+Church,+Kanjoor",
    },
    {
      idx: 'II',
      tag: 'Afternoon Celebration',
      title: 'The Wedding Feast',
      time: '12:30 PM',
      venue: 'O.L.D. Church Parish Hall',
      place: 'Kaippattoor, Kerala',
      note: 'A grand banquet of food, family and quiet music — companionship celebrated long into the day.',
      map: 'https://maps.google.com/?q=O.L.D.+Church+Parish+Hall,+Kaippattoor',
    },
  ];

  return (
    <div className="page">
      <audio ref={audioRef} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" loop preload="auto" />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Great+Vibes&family=Montserrat:wght@300;400;500&display=swap');

        :root{
          --cream:#FCFBF9; --cream2:#FAF6F0; --ink:#2A2725; --body:#544E4B;
          --muted:#9C9189; --gold:#C5A880; --gold-d:#AD8A5C; --gold-soft:#E2D2B6;
          --line:rgba(197,168,128,.30);
        }
        *{box-sizing:border-box;}
        .page{background:var(--cream);color:var(--body);font-family:'Montserrat',sans-serif;
          overflow-x:hidden;position:relative;-webkit-font-smoothing:antialiased;}
        ::selection{background:var(--gold);color:#fff;}

        .f-cinzel{font-family:'Cinzel',serif;}
        .f-vibes{font-family:'Great Vibes',cursive;}
        .f-cormorant{font-family:'Cormorant Garamond',serif;}
        .f-mont{font-family:'Montserrat',sans-serif;}

        .ink{color:var(--ink);} .body{color:var(--body);} .gold{color:var(--gold);} .muted{color:var(--muted);}
        .gold-bg{background:var(--gold);} .cream2-bg{background:var(--cream2);} .white-bg{background:#fff;}
        .border-line{border-color:var(--line)!important;}

        .tr1{letter-spacing:.15em;} .tr2{letter-spacing:.25em;} .tr3{letter-spacing:.35em;} .tr4{letter-spacing:.45em;}
        .fs-9{font-size:.5625rem;} .fs-10{font-size:.625rem;} .fs-11{font-size:.6875rem;} .fs-12{font-size:.75rem;}

        .shadow-soft{box-shadow:0 34px 70px -46px rgba(42,39,37,.40);}
        .shadow-softer{box-shadow:0 18px 44px -34px rgba(42,39,37,.32);}
        .divider{height:1px;background:linear-gradient(to right,transparent,var(--gold),transparent);}
        .hairline{height:1px;background:var(--gold-soft);}

        /* ---- Nav ---- */
        .nav{position:fixed;top:0;left:0;width:100%;z-index:40;display:flex;align-items:center;
          justify-content:space-between;padding:1.6rem 2rem;transition:all .7s cubic-bezier(.16,1,.3,1);}
        .nav.scrolled{background:rgba(252,251,249,.82);backdrop-filter:blur(12px);
          border-bottom:1px solid var(--line);padding:1rem 2rem;}
        .nav-link{position:relative;font-size:.7rem;letter-spacing:.24em;text-transform:uppercase;
          color:var(--body);transition:color .5s ease;cursor:pointer;}
        .nav-link::after{content:'';position:absolute;left:0;bottom:-6px;height:1px;width:0;
          background:var(--gold);transition:width .5s cubic-bezier(.16,1,.3,1);}
        .nav-link:hover{color:var(--gold-d);} .nav-link:hover::after{width:100%;}
        .monogram{font-family:'Cinzel',serif;font-weight:500;letter-spacing:.3em;color:var(--ink);}

        /* ---- Buttons ---- */
        .btn{font-family:'Cinzel',serif;text-transform:uppercase;cursor:pointer;
          transition:all .6s cubic-bezier(.16,1,.3,1);border:none;display:inline-flex;
          align-items:center;justify-content:center;gap:.6rem;}
        .btn-gold{background:var(--gold);color:#fff;letter-spacing:.22em;font-size:.7rem;padding:.7rem 1.7rem;}
        .btn-gold:hover{background:var(--gold-d);transform:translateY(-2px);
          box-shadow:0 22px 40px -26px rgba(173,138,92,.8);}
        .btn-gold:disabled{opacity:.65;cursor:default;transform:none;box-shadow:none;}
        .btn-block{width:100%;padding:1.15rem;letter-spacing:.28em;font-size:.72rem;}
        .btn-ghost{background:transparent;border:1px solid var(--line);color:var(--gold-d);
          letter-spacing:.2em;font-size:.68rem;padding:1rem 1.4rem;}
        .btn-ghost:hover{background:var(--cream2);border-color:var(--gold);transform:translateY(-2px);}

        /* ---- Music control ---- */
        .music-fab{position:fixed;right:1.75rem;bottom:1.75rem;z-index:50;width:3.4rem;height:3.4rem;
          border-radius:9999px;background:rgba(255,255,255,.9);backdrop-filter:blur(10px);
          border:1px solid var(--line);display:flex;align-items:center;justify-content:center;
          color:var(--gold-d);cursor:pointer;box-shadow:0 22px 44px -30px rgba(42,39,37,.55);
          transition:all .55s cubic-bezier(.16,1,.3,1);}
        .music-fab:hover{transform:scale(1.08) translateY(-2px);background:#fff;}
        .fab-tip{position:absolute;right:4rem;white-space:nowrap;background:var(--ink);color:var(--gold-soft);
          font-family:'Montserrat',sans-serif;font-size:.6rem;letter-spacing:.18em;text-transform:uppercase;
          padding:.45rem .8rem;border-radius:2px;opacity:0;transform:translateX(6px);
          transition:all .4s ease;pointer-events:none;}
        .music-fab:hover .fab-tip{opacity:1;transform:translateX(0);}

        /* ---- Reveal & motion ---- */
        .reveal{opacity:0;transform:translateY(30px);transition:opacity 1.1s ease,transform 1.1s cubic-bezier(.16,1,.3,1);}
        .reveal.reveal-in{opacity:1;transform:none;}
        @keyframes floaty{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        .floaty{animation:floaty 10s ease-in-out infinite;}
        @keyframes spin-slow{to{transform:rotate(360deg)}}
        .spin-slow{animation:spin-slow 22s linear infinite;}
        @keyframes nudge{0%,100%{transform:translateY(0);opacity:.45}50%{transform:translateY(9px);opacity:1}}
        .nudge{animation:nudge 2.6s ease-in-out infinite;}

        /* ---- Hero ---- */
        .hero{position:relative;min-height:100vh;display:flex;flex-direction:column;
          align-items:center;justify-content:center;text-align:center;padding:8rem 1.5rem 6rem;}
        .hero-texture{position:absolute;inset:0;pointer-events:none;opacity:.5;
          background-image:radial-gradient(rgba(197,168,128,.16) 1px,transparent 1px);
          background-size:30px 30px;mask-image:radial-gradient(circle at 50% 42%,#000,transparent 72%);
          -webkit-mask-image:radial-gradient(circle at 50% 42%,#000,transparent 72%);}
        .name-display{font-family:'Cinzel',serif;color:var(--ink);font-weight:500;line-height:.95;
          letter-spacing:.12em;}
        .vert{writing-mode:vertical-rl;text-orientation:mixed;}

        /* ---- Section primitives ---- */
        .eyebrow{font-family:'Cinzel',serif;font-size:.66rem;letter-spacing:.34em;
          text-transform:uppercase;color:var(--gold-d);}
        .s-title{font-family:'Cinzel',serif;color:var(--ink);letter-spacing:.14em;font-weight:500;}
        .rule{width:54px;height:1px;background:var(--gold);margin:1.4rem auto 0;}

        /* ---- Couple ---- */
        .person{background:var(--cream2);border:1px solid var(--line);padding:2.6rem 2rem;
          transition:transform .8s cubic-bezier(.16,1,.3,1),box-shadow .8s;height:100%;}
        .person:hover{transform:translateY(-6px);box-shadow:0 40px 70px -50px rgba(42,39,37,.4);}
        .ancestry{background:rgba(255,255,255,.7);border:1px solid var(--line);}

        /* ---- Ceremonies (split narrative) ---- */
        .chapter{position:relative;background:#fff;border:1px solid var(--line);padding:3rem 2.4rem;
          transition:transform .8s cubic-bezier(.16,1,.3,1),box-shadow .8s;height:100%;}
        .chapter:hover{transform:translateY(-6px);box-shadow:0 40px 80px -54px rgba(42,39,37,.45);}
        .chapter-num{font-family:'Cinzel',serif;font-size:4.5rem;line-height:1;color:var(--gold-soft);}
        .map-link{display:inline-flex;align-items:center;gap:.55rem;font-family:'Montserrat',sans-serif;
          font-size:.66rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold-d);
          padding-bottom:4px;border-bottom:1px solid var(--line);transition:all .5s ease;}
        .map-link:hover{color:var(--ink);border-color:var(--gold);}

        /* ---- Forms: floating fields ---- */
        .lux-field{position:relative;padding-top:1.15rem;margin-top:.4rem;}
        .lux-field input,.lux-field textarea{width:100%;background:transparent;border:none;
          border-bottom:1px solid var(--line);padding:.5rem 0;font-family:'Montserrat',sans-serif;
          font-size:.9rem;letter-spacing:.03em;color:var(--ink);outline:none;resize:none;}
        .lux-field label{position:absolute;left:0;top:1.55rem;font-family:'Montserrat',sans-serif;
          font-size:.7rem;letter-spacing:.22em;text-transform:uppercase;color:var(--muted);
          pointer-events:none;transition:all .45s cubic-bezier(.2,.8,.2,1);}
        .lux-field input:focus ~ label,.lux-field input:not(:placeholder-shown) ~ label,
        .lux-field textarea:focus ~ label,.lux-field textarea:not(:placeholder-shown) ~ label{
          top:0;font-size:.6rem;letter-spacing:.3em;color:var(--gold-d);}
        .lux-underline{position:absolute;left:0;bottom:0;height:1px;width:0;background:var(--gold);
          transition:width .55s cubic-bezier(.16,1,.3,1);}
        .lux-field input:focus ~ .lux-underline,.lux-field textarea:focus ~ .lux-underline{width:100%;}

        .field-label{font-family:'Montserrat',sans-serif;font-size:.6rem;letter-spacing:.3em;
          text-transform:uppercase;color:var(--gold-d);}
        .lux-select{width:100%;background:transparent;border:none;border-bottom:1px solid var(--line);
          padding:.5rem 0;font-family:'Montserrat',sans-serif;font-size:.9rem;color:var(--ink);
          outline:none;cursor:pointer;}

        .radio-tile{border:1px solid var(--line);background:#fff;padding:1.1rem;text-align:center;
          cursor:pointer;transition:all .55s cubic-bezier(.16,1,.3,1);
          font-family:'Montserrat',sans-serif;font-size:.68rem;letter-spacing:.2em;
          text-transform:uppercase;color:var(--muted);}
        .radio-tile:hover{border-color:var(--gold-soft);}
        .radio-tile.active{border-color:var(--gold);background:var(--cream2);color:var(--ink);}

        /* ---- Guestbook ---- */
        .blessing-scroll{max-height:520px;overflow-y:auto;padding-right:.4rem;}
        .blessing-scroll::-webkit-scrollbar{width:5px;}
        .blessing-scroll::-webkit-scrollbar-thumb{background:var(--gold-soft);border-radius:9999px;}
        .blessing-card{position:relative;overflow:hidden;background:var(--cream2);
          border:1px solid var(--line);padding:1.3rem 1.4rem;}

        .family-chip{background:var(--cream2);border:1px solid var(--line);padding:1.2rem .8rem;
          transition:transform .6s ease,box-shadow .6s;}
        .family-chip:hover{transform:translateY(-4px);box-shadow:0 24px 44px -36px rgba(42,39,37,.4);}
        .contact-pill{display:inline-flex;align-items:center;gap:1rem;background:var(--cream2);
          border:1px solid var(--line);padding:1rem 1.6rem;border-radius:9999px;}

        /* ---- Toast ---- */
        .toast{position:fixed;left:50%;bottom:2.4rem;z-index:60;display:flex;gap:.9rem;
          align-items:flex-start;min-width:300px;max-width:380px;background:#fff;
          border:1px solid var(--line);border-top:2px solid var(--gold);padding:1.1rem 1.3rem;
          box-shadow:0 34px 64px -32px rgba(42,39,37,.45);opacity:0;
          transform:translateX(-50%) translateY(170%);
          transition:transform .8s cubic-bezier(.16,1,.3,1),opacity .8s;}
        .toast.show{opacity:1;transform:translateX(-50%) translateY(0);}

        @media (prefers-reduced-motion: reduce){
          *{animation:none!important;transition-duration:.01ms!important;}
          .reveal{opacity:1;transform:none;}
        }
      `}</style>

      {/* ---- Music control ---- */}
      <button className="music-fab" onClick={togglePlay} aria-label="Toggle background music">
        <span className="fab-tip">{isPlaying ? 'Pause music' : 'Play music'}</span>
        {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" style={{ color: 'var(--muted)' }} />}
      </button>

      {/* ---- Nav ---- */}
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="monogram text-base md:text-lg">C <span className="fs-10">&amp;</span> T</div>
        <div className="hidden md:flex items-center" style={{ gap: '2.4rem' }}>
          <span className="nav-link" onClick={() => scrollToId('couple')}>The Couple</span>
          <span className="nav-link" onClick={() => scrollToId('ceremonies')}>Ceremonies</span>
          <a className="nav-link" href="/invitation.pdf" download>Invitation</a>
          <span className="nav-link" onClick={() => scrollToId('rsvp')}>RSVP</span>
          <span className="nav-link" onClick={() => scrollToId('blessings')}>Wishes</span>
        </div>
        <button className="btn btn-gold" onClick={() => scrollToId('rsvp')}>RSVP</button>
      </nav>

      {/* ---- Hero ---- */}
      <section className="hero">
        <div className="hero-texture" />
        <svg className="floaty" viewBox="0 0 100 100" fill="var(--gold)"
          style={{ position: 'absolute', top: '12%', left: '6%', width: '120px', opacity: 0.14, mixBlendMode: 'multiply' }}>
          <path d="M10,90 Q30,60 50,70 T90,20 Q70,40 50,30 T10,90 Z" />
        </svg>
        <svg className="floaty" viewBox="0 0 100 100" fill="var(--gold)"
          style={{ position: 'absolute', bottom: '12%', right: '6%', width: '120px', opacity: 0.14, mixBlendMode: 'multiply', animationDelay: '3s' }}>
          <path d="M10,90 Q30,60 50,70 T90,20 Q70,40 50,30 T10,90 Z" transform="rotate(180,50,50)" />
        </svg>

        <div className="relative z-10 reveal" style={{ maxWidth: '880px', width: '100%' }}>
          <p className="eyebrow" style={{ marginBottom: '1.2rem' }}>Betrothal Invitation</p>
          <p className="f-cormorant ink" style={{ fontStyle: 'italic', fontSize: 'clamp(1rem,2.6vw,1.35rem)', letterSpacing: '.02em', maxWidth: '520px', margin: '0 auto 2.4rem' }}>
            “The Lord has done great things for us, and we are filled with joy.”
            <span className="block muted f-mont fs-10 tr2" style={{ marginTop: '.8rem' }}>PSALM 126:3</span>
          </p>

          <div className="flex items-center justify-center" style={{ gap: '1.2rem', marginBottom: '2.4rem' }}>
            <div style={{ height: '1px', width: '70px', background: 'linear-gradient(to right,transparent,var(--gold))' }} />
            <Sparkles className="w-4 h-4 spin-slow" style={{ color: 'var(--gold)' }} />
            <div style={{ height: '1px', width: '70px', background: 'linear-gradient(to left,transparent,var(--gold))' }} />
          </div>

          <h1 className="name-display" style={{ fontSize: 'clamp(3.4rem,13vw,8.5rem)' }}>CERA</h1>
          <div className="f-vibes gold" style={{ fontSize: 'clamp(2.4rem,7vw,4.5rem)', lineHeight: 1, margin: '.3rem 0' }}>and</div>
          <h1 className="name-display" style={{ fontSize: 'clamp(3.4rem,13vw,8.5rem)' }}>TONY</h1>

          <div className="mx-auto" style={{ maxWidth: '380px', padding: '1.6rem 0', margin: '2.6rem auto 0', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
            <p className="f-cinzel ink tr2" style={{ fontSize: 'clamp(.78rem,2vw,1rem)' }}>SATURDAY · OCTOBER 10 · 2026</p>
          </div>

          <p className="f-cormorant" style={{ fontSize: 'clamp(.95rem,2.3vw,1.2rem)', maxWidth: '480px', margin: '2rem auto 0', color: 'var(--body)' }}>
            With joyful hearts, Sheela &amp; Saji Francis invite you to share in this celebration of love and grace.
          </p>

          <a href="/invitation.pdf" download className="btn btn-ghost" style={{ marginTop: '2.4rem' }}>
            <Download className="w-4 h-4" /> Download Invitation
          </a>
        </div>

        <button onClick={() => scrollToId('countdown')} className="nudge" aria-label="Scroll down"
          style={{ position: 'absolute', bottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.6rem', background: 'none', border: 'none', cursor: 'pointer' }}>
          <span className="vert f-mont fs-9 tr3 muted">SCROLL</span>
          <ChevronDown className="w-5 h-5" style={{ color: 'var(--gold)' }} />
        </button>
      </section>

      {/* ---- Countdown ---- */}
      <section id="countdown" className="cream2-bg" style={{ padding: '7rem 1.5rem', borderTop: '1px solid var(--line)' }}>
        <div className="reveal" style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'center' }}>
          <p className="eyebrow" style={{ marginBottom: '3rem' }}>Counting Down to Forever</p>
          <div className="grid grid-cols-4" style={{ gap: '1rem' }}>
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="white-bg shadow-softer" style={{ border: '1px solid var(--line)', padding: '1.6rem .5rem' }}>
                <span className="f-cinzel ink" style={{ display: 'block', fontSize: 'clamp(1.8rem,6vw,3.2rem)', fontWeight: 500 }}>
                  {String(value).padStart(2, '0')}
                </span>
                <span className="f-mont fs-10 tr2 muted" style={{ display: 'block', textTransform: 'uppercase', marginTop: '.4rem' }}>{unit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- The Couple ---- */}
      <section id="couple" style={{ padding: '8rem 1.5rem' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <p className="eyebrow">Two Families, One Joy</p>
            <h2 className="s-title" style={{ fontSize: 'clamp(1.8rem,5vw,2.8rem)', marginTop: '1rem' }}>The Happy Couple</h2>
            <div className="rule" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '2.5rem' }}>
            {/* Cera */}
            <div className="person reveal">
              <div style={{ textAlign: 'center' }}>
                <span className="f-vibes gold" style={{ fontSize: '2rem', display: 'block' }}>Our Beloved Daughter</span>
                <h3 className="f-cinzel ink tr2" style={{ fontSize: '2rem', margin: '.4rem 0' }}>CERA</h3>
                <span className="f-mont fs-11 tr2 muted" style={{ textTransform: 'uppercase' }}>D/o Sheela &amp; Saji Francis</span>
                <div style={{ width: '40px', height: '1px', background: 'var(--gold-soft)', margin: '1.4rem auto' }} />
              </div>
              <p className="f-cormorant" style={{ fontStyle: 'italic', textAlign: 'center', fontSize: '1.05rem', color: 'var(--body)', lineHeight: 1.6 }}>
                Generations of family heritage and grace, gathered into the joy of our bride-to-be.
              </p>
              <div className="ancestry fs-11" style={{ marginTop: '1.6rem', padding: '1.2rem', textAlign: 'center', lineHeight: 1.7 }}>
                <span className="f-cinzel gold fs-10 tr2" style={{ display: 'block', textTransform: 'uppercase', marginBottom: '.6rem' }}>Granddaughter of</span>
                <p>The late Brijit &amp; P.K. Francis<br /><span className="muted f-cormorant" style={{ fontStyle: 'italic' }}>Paracka House, Kanjoor</span></p>
                <p className="gold" style={{ margin: '.5rem 0' }}>&amp;</p>
                <p>The late Ally &amp; T.A. Mathan<br /><span className="muted f-cormorant" style={{ fontStyle: 'italic' }}>Thekkekkara House, Irinjalakuda</span></p>
              </div>
            </div>

            {/* Tony */}
            <div className="person reveal" style={{ transitionDelay: '.12s' }}>
              <div style={{ textAlign: 'center' }}>
                <span className="f-vibes gold" style={{ fontSize: '2rem', display: 'block' }}>Our Beloved Son</span>
                <h3 className="f-cinzel ink tr2" style={{ fontSize: '2rem', margin: '.4rem 0' }}>TONY</h3>
                <span className="f-mont fs-11 tr2 muted" style={{ textTransform: 'uppercase' }}>S/o Mini &amp; Anto Antony</span>
                <div style={{ width: '40px', height: '1px', background: 'var(--gold-soft)', margin: '1.4rem auto' }} />
              </div>
              <p className="f-cormorant" style={{ fontStyle: 'italic', textAlign: 'center', fontSize: '1.05rem', color: 'var(--body)', lineHeight: 1.6 }}>
                Raised among strong pillars of heritage, holding the true value of family and love.
              </p>
              <div className="ancestry fs-11" style={{ marginTop: '1.6rem', padding: '1.2rem', textAlign: 'center', lineHeight: 1.7 }}>
                <span className="f-cinzel gold fs-10 tr2" style={{ display: 'block', textTransform: 'uppercase', marginBottom: '.6rem' }}>Grandson of</span>
                <p>The late Chinnamma &amp; C.M. Antony<br /><span className="muted f-cormorant" style={{ fontStyle: 'italic' }}>Chackenkulam House, Pala</span></p>
                <p className="gold" style={{ margin: '.5rem 0' }}>&amp;</p>
                <p>The late Chinnamma &amp; T.J. Joseph<br /><span className="muted f-cormorant" style={{ fontStyle: 'italic' }}>Thekkumthottam House, Ponkunnam</span></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Ceremonies (split narrative) ---- */}
      <section id="ceremonies" className="cream2-bg" style={{ padding: '8rem 1.5rem', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <p className="eyebrow">Sacred Ceremonies</p>
            <h2 className="s-title" style={{ fontSize: 'clamp(1.8rem,5vw,2.8rem)', marginTop: '1rem' }}>The Order of the Day</h2>
            <div className="rule" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '2.5rem' }}>
            {ceremonies.map((c, i) => (
              <div key={c.idx} className="chapter reveal" style={{ transitionDelay: `${i * 0.12}s` }}>
                <div className="flex items-start justify-between" style={{ marginBottom: '1.6rem' }}>
                  <span className="chapter-num">{c.idx}</span>
                  <div className="flex items-center gold" style={{ gap: '.5rem' }}>
                    <Clock className="w-4 h-4" />
                    <span className="f-cinzel" style={{ fontSize: '1.1rem', fontWeight: 500, letterSpacing: '.08em' }}>{c.time}</span>
                  </div>
                </div>

                <span className="f-mont fs-10 tr2 gold" style={{ textTransform: 'uppercase' }}>{c.tag}</span>
                <h3 className="f-cinzel ink" style={{ fontSize: '1.65rem', letterSpacing: '.06em', margin: '.5rem 0 1.4rem' }}>{c.title}</h3>

                <div className="hairline" style={{ width: '46px', marginBottom: '1.4rem' }} />

                <p className="f-cinzel ink" style={{ fontSize: '1.1rem', fontWeight: 500 }}>{c.venue}</p>
                <p className="f-mont fs-11 tr1 muted" style={{ textTransform: 'uppercase', margin: '.4rem 0 1rem' }}>{c.place}</p>
                <p className="f-cormorant" style={{ fontSize: '1.05rem', color: 'var(--body)', lineHeight: 1.65, marginBottom: '1.8rem' }}>{c.note}</p>

                <a href={c.map} target="_blank" rel="noopener noreferrer" className="map-link">
                  <MapPin className="w-4 h-4" />
                  <span>View directions</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- RSVP ----
      <section id="rsvp" style={{ padding: '8rem 1.5rem' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p className="eyebrow">Be Part of Our Day</p>
            <h2 className="s-title" style={{ fontSize: 'clamp(1.8rem,5vw,2.8rem)', marginTop: '1rem' }}>Confirm Your Attendance</h2>
            <p className="f-cormorant" style={{ fontStyle: 'italic', fontSize: '1.05rem', marginTop: '1rem', color: 'var(--body)' }}>
              Kindly respond before the 1st of October, 2026.
            </p>
            <div className="rule" />
          </div>

          <div className="white-bg shadow-soft reveal" style={{ border: '1px solid var(--line)', padding: 'clamp(1.8rem,5vw,3rem)' }}>
            <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '1.8rem' }}>
              <div className="lux-field">
                <input id="rsvp-name" type="text" placeholder=" " value={rsvpName} onChange={(e) => setRsvpName(e.target.value)} />
                <span className="lux-underline" />
                <label htmlFor="rsvp-name">Your full name</label>
              </div>
              <div style={{ paddingTop: '1.15rem', marginTop: '.4rem' }}>
                <label className="field-label" htmlFor="rsvp-guests" style={{ display: 'block', marginBottom: '.6rem' }}>Number of guests</label>
                <select id="rsvp-guests" className="lux-select" value={rsvpGuests} onChange={(e) => setRsvpGuests(e.target.value)}>
                  <option value="1">1 · Individual</option>
                  <option value="2">2 · Couple</option>
                  <option value="3">3 · Family of three</option>
                  <option value="4">4 · Family of four</option>
                  <option value="5">5+ · Large family</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: '2.2rem' }}>
              <label className="field-label" style={{ display: 'block', marginBottom: '.9rem' }}>Will you join us?</label>
              <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                <div className={`radio-tile ${rsvpStatus === 'attending' ? 'active' : ''}`} onClick={() => setRsvpStatus('attending')}>
                  Joyfully attending
                </div>
                <div className={`radio-tile ${rsvpStatus === 'declined' ? 'active' : ''}`} onClick={() => setRsvpStatus('declined')}>
                  Regretfully decline
                </div>
              </div>
            </div>

            <div className="lux-field" style={{ marginTop: '1.4rem' }}>
              <textarea id="rsvp-note" rows="3" placeholder=" " value={rsvpNote} onChange={(e) => setRsvpNote(e.target.value)} />
              <span className="lux-underline" />
              <label htmlFor="rsvp-note">A note or dietary preference (optional)</label>
            </div>

            <button className="btn btn-gold btn-block" style={{ marginTop: '2.4rem' }} onClick={handleRsvpSubmit} disabled={isRsvpSubmitting}>
              {isRsvpSubmitting ? (
                <><CheckCircle className="w-4 h-4" /> Confirming your place…</>
              ) : (
                <><Send className="w-4 h-4" /> Send RSVP</>
              )}
            </button>
          </div>
        </div>
      </section>
      */}

      {/* ---- Blessings ---- */}
      <section id="blessings" className="cream2-bg" style={{ padding: '8rem 1.5rem', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '3.5rem', alignItems: 'start' }}>
            {/* Form */}
            <div className="reveal">
              <p className="eyebrow">For them to treasure</p>
              <h2 className="s-title" style={{ fontSize: 'clamp(1.7rem,5vw,2.6rem)', marginTop: '1rem' }}>To the beautiful couple</h2>
              <div className="hairline" style={{ width: '54px', margin: '1.4rem 0' }} />
              <p className="f-cormorant" style={{ fontSize: '1.1rem', lineHeight: 1.65, color: 'var(--body)', marginBottom: '2rem' }}>
                Near or far, leave a heartfelt wish below.
              </p>

              <div className="white-bg shadow-softer" style={{ border: '1px solid var(--line)', padding: '1.8rem' }}>
                <div className="lux-field">
                  <input id="bless-name" type="text" placeholder=" " value={blessingName} onChange={(e) => setBlessingName(e.target.value)} />
                  <span className="lux-underline" />
                  <label htmlFor="bless-name">Your name</label>
                </div>
                <div className="lux-field" style={{ marginTop: '1rem' }}>
                  <textarea id="bless-msg" rows="4" placeholder=" " value={blessingMessage} onChange={(e) => setBlessingMessage(e.target.value)} />
                  <span className="lux-underline" />
                  <label htmlFor="bless-msg">Your blessing or message</label>
                </div>
                <button className="btn btn-gold btn-block" style={{ marginTop: '1.8rem' }} onClick={handleBlessingSubmit}>
                  <Sparkles className="w-4 h-4" /> Post blessing
                </button>
              </div>
            </div>

            {/* List */}
            <div className="reveal" style={{ transitionDelay: '.12s' }}>
              <div className="white-bg shadow-soft" style={{ border: '1px solid var(--line)', padding: '1.6rem' }}>
                <div className="flex items-center justify-between" style={{ borderBottom: '1px solid var(--line)', paddingBottom: '1rem', marginBottom: '1.2rem' }}>
                  <span className="f-cinzel fs-11 tr2 muted" style={{ textTransform: 'uppercase' }}>Recent blessings</span>
                  <span className="f-mont fs-9 tr1 gold cream2-bg" style={{ padding: '.35rem .7rem', textTransform: 'uppercase' }}>
                    {blessingsList.length} wishes
                  </span>
                </div>
                <div className="blessing-scroll" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {blessingsList.map((b, i) => (
                    <div key={i} className="blessing-card">
                      <Heart className="w-12 h-12" style={{ position: 'absolute', right: '.8rem', top: '.8rem', color: 'rgba(197,168,128,.10)' }} />
                      <div className="flex items-center justify-between" style={{ marginBottom: '.5rem' }}>
                        <span className="f-cinzel gold fs-12" style={{ fontWeight: 500 }}>{b.name}</span>
                        <span className="f-mont fs-9 muted">{b.date}</span>
                      </div>
                      <p className="f-cormorant" style={{ fontStyle: 'italic', fontSize: '1.02rem', color: 'var(--body)', lineHeight: 1.6 }}>“{b.text}”</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Family & Contact ---- */}
      <section style={{ padding: '8rem 1.5rem' }}>
        <div className="reveal" style={{ maxWidth: '880px', margin: '0 auto', textAlign: 'center' }}>
          <p className="eyebrow" style={{ marginBottom: '.8rem' }}>With Blessings &amp; Prayers</p>
          <Sparkles className="w-5 h-5 spin-slow" style={{ color: 'var(--gold)', margin: '0 auto 2.5rem' }} />

          <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: '1.2rem', maxWidth: '640px', margin: '0 auto' }}>
            {[
              { n: 'Fr. Francis SJ', r: 'Priest & Guardian' },
              { n: 'Mathews & Merin', r: 'Sponsoring Couple' },
              { n: 'Bastin & Riya', r: 'Sponsoring Couple' },
              { n: 'Austin', r: 'Brother of the Bride' },
            ].map((p) => (
              <div key={p.n} className="family-chip">
                <span className="f-cinzel gold fs-12" style={{ display: 'block', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '.3rem' }}>{p.n}</span>
                <span className="f-mont fs-9 tr1 muted">{p.r}</span>
              </div>
            ))}
          </div>

          <p className="f-cormorant" style={{ fontStyle: 'italic', fontSize: '1.05rem', color: 'var(--body)', margin: '3rem 0 1.4rem' }}>
            For any family inquiries, please reach us directly.
          </p>

          <div className="contact-pill">
            <span className="flex items-center gold" style={{ gap: '.5rem' }}>
              <Phone className="w-4 h-4" />
              <span className="f-cinzel" style={{ fontWeight: 500, letterSpacing: '.06em' }}>+91 98474 00241</span>
            </span>
            <button onClick={copyPhoneNumber} className="flex items-center" style={{ gap: '.35rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gold-d)' }}>
              <Copy className="w-3.5 h-3.5" />
              <span className="f-mont fs-9 tr1" style={{ textTransform: 'uppercase' }}>{showCopied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ---- Travel & Stay ---- */}
      <section className="cream2-bg" style={{ padding: '6rem 1.5rem', borderTop: '1px solid var(--line)' }}>
        <div className="reveal" style={{ maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}>
          <p className="eyebrow" style={{ marginBottom: '1rem' }}>For Our Guests Travelling</p>
          <h2 className="s-title" style={{ fontSize: 'clamp(1.5rem,4vw,2rem)' }}>Travel &amp; Stay</h2>
          <div className="rule" />
          <p className="f-cormorant" style={{ fontStyle: 'italic', fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--body)', margin: '1.6rem 0' }}>
            For those journeying from afar, comfortable stays are available near both venues in Kanjoor and Kaippattoor. Do reach out and we'll gladly help arrange accommodation.
          </p>
          <button onClick={copyPhoneNumber} className="map-link" style={{ background: 'none', border: 'none', borderBottom: '1px solid var(--line)', padding: '0 0 4px', cursor: 'pointer' }}>
            <Phone className="w-4 h-4" />
            <span>{showCopied ? 'Copied' : '+91 98474 00241'}</span>
          </button>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="cream2-bg" style={{ padding: '4rem 1.5rem', borderTop: '1px solid var(--line)', textAlign: 'center' }}>
        <div style={{ maxWidth: '880px', margin: '0 auto' }}>
          <p className="f-vibes gold" style={{ fontSize: '2.4rem' }}>Cera &amp; Tony</p>
          <div className="divider" style={{ width: '120px', margin: '1.2rem auto' }} />
          <div className="flex justify-center flex-wrap" style={{ gap: '1.4rem', marginBottom: '1.6rem' }}>
            <span className="nav-link" onClick={() => scrollToId('couple')}>The Couple</span>
            <span className="nav-link" onClick={() => scrollToId('ceremonies')}>Ceremonies</span>
            <span className="nav-link" onClick={() => scrollToId('rsvp')}>RSVP</span>
          </div>
          <p className="f-mont fs-9 tr2 muted" style={{ textTransform: 'uppercase' }}>© 2026 Cera &amp; Tony · A Digital Heirloom</p>
        </div>
      </footer>

      {/* ---- Toast ---- */}
      <div className={`toast ${toast.show ? 'show' : ''}`} role="status" aria-live="polite">
        <CheckCircle className="w-5 h-5" style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '2px' }} />
        <div style={{ flex: 1 }}>
          <p className="f-cinzel ink fs-12 tr1" style={{ textTransform: 'uppercase', fontWeight: 500, marginBottom: '.25rem' }}>{toast.title}</p>
          <p className="f-cormorant" style={{ fontSize: '.98rem', color: 'var(--body)', lineHeight: 1.5 }}>{toast.message}</p>
        </div>
        <button onClick={() => setToast((t) => ({ ...t, show: false }))} aria-label="Dismiss"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', flexShrink: 0 }}>
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}