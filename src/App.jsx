import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle,
  ChevronDown,
  Clock,
  Copy,
  Download,
  Heart,
  MapPin,
  Music,
  Phone,
  Sparkles,
  X,
} from 'lucide-react';

const TARGET_DATE = new Date('2026-10-10T11:00:00+05:30');

const INVITATION_FILE = '/invitation.pdf';
const MUSIC_SRC = '';

const PHONE_NUMBER = '+919847400241';
const DISPLAY_PHONE = '+91 98474 00241';

const CEREMONY_MAP =
  "https://maps.google.com/?q=St.+Mary's+Forane+Church,+Kanjoor";

const RECEPTION_MAP =
  'https://maps.google.com/?q=O.L.D.+Church+Parish+Hall,+Kaippattoor';

const events = [
  {
    label: 'Betrothal Ceremony',
    time: '11:00 AM',
    venue: "St. Mary's Forane Church",
    place: 'Kanjoor, Kerala',
    map: CEREMONY_MAP,
    note: 'The sacred ceremony where the families gather in prayer and blessing.',
  },
  {
    label: 'Reception',
    time: '12:30 PM onwards',
    venue: 'O.L.D. Church Parish Hall',
    place: 'Kaippattoor, Kerala',
    map: RECEPTION_MAP,
    note: 'A warm family gathering with lunch, fellowship, and shared joy.',
  },
];

const blessingsInitial = [
  {
    name: 'Saji & Sheela',
    text: 'May God shower you both with boundless grace and love on this beautiful journey.',
    date: 'Just now',
  },
  {
    name: 'Anto & Mini',
    text: 'Welcoming our dear Cera into our family with all our love.',
    date: '5 minutes ago',
  },
  {
    name: 'Fr. Francis SJ',
    text: 'Prayers and blessings for a holy and joyful union in Christ.',
    date: '1 hour ago',
  },
];

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [blessingName, setBlessingName] = useState('');
  const [blessingMessage, setBlessingMessage] = useState('');
  const [blessingsList, setBlessingsList] = useState(blessingsInitial);

  const [showCopied, setShowCopied] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    title: '',
    message: '',
  });

  const audioRef = useRef(null);
  const toastTimer = useRef(null);

  const showToast = useCallback((title, message) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);

    setToast({ show: true, title, message });

    toastTimer.current = setTimeout(() => {
      setToast((current) => ({ ...current, show: false }));
    }, 3600);
  }, []);

  useEffect(() => {
    const updateCountdown = () => {
      const diff = TARGET_DATE.getTime() - Date.now();

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

    updateCountdown();
    const intervalId = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const revealItems = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add('reveal-in');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = 0.32;
  }, []);

  const scrollToId = (id) => {
    const section = document.getElementById(id);
    if (!section) return;

    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const toggleMusic = () => {
    if (!MUSIC_SRC || !audioRef.current) {
      showToast('Music not added', 'Add a local audio file and set MUSIC_SRC to enable background music.');
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        setIsPlaying(false);
        showToast('Music blocked', 'Tap again after the page is active, or check the audio file path.');
      });
  };

  const copyPhoneNumber = async () => {
    try {
      await navigator.clipboard.writeText(PHONE_NUMBER);
    } catch {
      const input = document.createElement('textarea');
      input.value = PHONE_NUMBER;
      input.setAttribute('readonly', '');
      input.style.position = 'fixed';
      input.style.opacity = '0';

      document.body.appendChild(input);
      input.select();

      try {
        document.execCommand('copy');
      } catch {
        // Ignore older browser copy failure.
      }

      document.body.removeChild(input);
    }

    setShowCopied(true);
    showToast('Phone copied', `${DISPLAY_PHONE} copied to clipboard.`);

    window.setTimeout(() => setShowCopied(false), 1800);
  };

  const handleBlessingSubmit = () => {
    const name = blessingName.trim();
    const message = blessingMessage.trim();

    if (!name || !message) {
      showToast('Missing details', 'Please add your name and blessing before posting.');
      return;
    }

    setBlessingsList((current) => [
      {
        name,
        text: message,
        date: 'Just now',
      },
      ...current,
    ]);

    setBlessingName('');
    setBlessingMessage('');

    showToast('Blessing added', 'Your message is visible on this page for this visit.');
  };

  return (
    <div className="page">
      {MUSIC_SRC ? <audio ref={audioRef} src={MUSIC_SRC} loop preload="none" /> : null}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Montserrat:wght@300;400;500;600&display=swap');

        :root {
          --cream: #fcfaf6;
          --cream-soft: #f7f0e6;
          --paper: #fffdf9;
          --ink: #2c2926;
          --body: #5d554d;
          --muted: #95887b;
          --gold: #b8955e;
          --gold-soft: rgba(184, 149, 94, 0.22);
          --gold-line: rgba(184, 149, 94, 0.28);
          --shadow: 0 24px 60px -46px rgba(44, 41, 38, 0.55);
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
        }

        .page {
          min-height: 100vh;
          overflow-x: hidden;
          background:
            radial-gradient(circle at top, rgba(255,255,255,0.96), rgba(252,250,246,0.94) 42%, rgba(247,240,230,0.55)),
            var(--cream);
          color: var(--body);
          font-family: 'Montserrat', system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }

        ::selection {
          background: var(--gold);
          color: #fff;
        }

        a {
          color: inherit;
        }

        .font-display {
          font-family: 'Cinzel', Georgia, serif;
        }

        .font-serif {
          font-family: 'Cormorant Garamond', Georgia, serif;
        }

        .ink {
          color: var(--ink);
        }

        .muted {
          color: var(--muted);
        }

        .gold {
          color: var(--gold);
        }

        .section {
          padding: clamp(4rem, 9vw, 7rem) 1.25rem;
        }

        .container {
          width: min(100%, 1040px);
          margin: 0 auto;
        }

        .container-narrow {
          width: min(100%, 760px);
          margin: 0 auto;
        }

        .eyebrow {
          margin: 0;
          color: var(--gold);
          font-family: 'Cinzel', Georgia, serif;
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.28em;
          text-transform: uppercase;
        }

        .section-title {
          margin: 0.85rem 0 0;
          color: var(--ink);
          font-family: 'Cinzel', Georgia, serif;
          font-size: clamp(1.75rem, 5vw, 2.75rem);
          font-weight: 500;
          letter-spacing: 0.08em;
          line-height: 1.18;
        }

        .section-copy {
          margin: 1rem auto 0;
          max-width: 620px;
          color: var(--body);
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.15rem;
          line-height: 1.65;
        }

        .rule {
          width: 54px;
          height: 1px;
          margin: 1.2rem auto 0;
          background: var(--gold);
        }

        .card {
          background: rgba(255, 253, 249, 0.84);
          border: 1px solid var(--gold-line);
          box-shadow: var(--shadow);
        }

        .soft-card {
          background: rgba(255, 253, 249, 0.72);
          border: 1px solid var(--gold-line);
        }

        .nav {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 40;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 1rem 1.1rem;
          transition: background 0.35s ease, border-color 0.35s ease, padding 0.35s ease;
        }

        .nav.scrolled {
          padding: 0.72rem 1.1rem;
          background: rgba(252, 250, 246, 0.9);
          border-bottom: 1px solid var(--gold-line);
          backdrop-filter: blur(14px);
        }

        .brand {
          color: var(--ink);
          font-family: 'Cinzel', Georgia, serif;
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.24em;
          white-space: nowrap;
        }

        .nav-links {
          display: none;
          align-items: center;
          gap: 1.7rem;
        }

        .nav-link {
          appearance: none;
          padding: 0;
          background: transparent;
          border: 0;
          color: var(--body);
          cursor: pointer;
          font-family: 'Montserrat', system-ui, sans-serif;
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          transition: color 0.25s ease;
        }

        .nav-link:hover {
          color: var(--gold);
        }

        .button {
          min-height: 46px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.55rem;
          padding: 0.82rem 1.15rem;
          border: 1px solid transparent;
          border-radius: 999px;
          cursor: pointer;
          font-family: 'Montserrat', system-ui, sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          line-height: 1;
          text-decoration: none;
          text-transform: uppercase;
          transition: transform 0.25s ease, background 0.25s ease, border-color 0.25s ease, color 0.25s ease;
        }

        .button:hover {
          transform: translateY(-1px);
        }

        .button-primary {
          background: var(--ink);
          color: #fff;
        }

        .button-primary:hover {
          background: #171513;
        }

        .button-secondary {
          background: rgba(255,255,255,0.62);
          border-color: var(--gold-line);
          color: var(--ink);
        }

        .button-secondary:hover {
          border-color: var(--gold);
          color: var(--gold);
        }

        .button-quiet {
          min-height: 42px;
          padding: 0.72rem 1rem;
          background: rgba(255,255,255,0.56);
          border-color: var(--gold-line);
          color: var(--ink);
          font-size: 0.66rem;
        }

        .music-button {
          position: fixed;
          right: 1rem;
          bottom: 1rem;
          z-index: 45;
          width: 48px;
          height: 48px;
          padding: 0;
          border-radius: 999px;
          background: rgba(255,253,249,0.9);
          border: 1px solid var(--gold-line);
          color: var(--gold);
          box-shadow: var(--shadow);
        }

        .music-button[aria-disabled='true'] {
          color: var(--muted);
          cursor: help;
        }

        .hero {
          position: relative;
          min-height: auto;
          padding: 6.2rem 1.25rem 3.2rem;
          text-align: center;
        }

        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(184,149,94,0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(184,149,94,0.055) 1px, transparent 1px);
          background-size: 34px 34px;
          mask-image: radial-gradient(circle at 50% 34%, #000, transparent 72%);
          -webkit-mask-image: radial-gradient(circle at 50% 34%, #000, transparent 72%);
        }

        .hero-inner {
          position: relative;
          z-index: 1;
          width: min(100%, 780px);
          margin: 0 auto;
        }

        .verse {
          margin: 0 auto 1.15rem;
          max-width: 560px;
          color: var(--body);
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(1rem, 3.4vw, 1.28rem);
          font-style: italic;
          line-height: 1.45;
        }

        .verse-ref {
          display: block;
          margin-top: 0.45rem;
          color: var(--muted);
          font-family: 'Montserrat', system-ui, sans-serif;
          font-size: 0.58rem;
          font-style: normal;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .names {
          margin: 1.1rem 0 0;
          color: var(--ink);
          font-family: 'Cinzel', Georgia, serif;
          font-size: clamp(3.15rem, 16vw, 7.8rem);
          font-weight: 500;
          letter-spacing: 0.08em;
          line-height: 0.94;
        }

        .ampersand {
          display: block;
          margin: 0.35rem 0;
          color: var(--gold);
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(1.65rem, 7vw, 3rem);
          font-style: italic;
          letter-spacing: 0.02em;
          line-height: 1;
        }

        .hero-summary {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.7rem;
          margin: 1.65rem auto 0;
          max-width: 620px;
        }

        .summary-item {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          min-height: 44px;
          padding: 0.7rem 0.9rem;
          background: rgba(255,255,255,0.58);
          border: 1px solid var(--gold-line);
          color: var(--ink);
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.04em;
        }

        .hero-actions {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.8rem;
          margin: 1.35rem auto 0;
          max-width: 440px;
        }

        .invited-by {
          margin: 1.45rem auto 0;
          max-width: 560px;
          color: var(--body);
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.08rem;
          line-height: 1.55;
        }

        .scroll-cue {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          margin-top: 1.6rem;
          padding: 0.25rem 0;
          background: none;
          border: 0;
          color: var(--muted);
          cursor: pointer;
          font-size: 0.62rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .countdown {
          padding: 2.6rem 1.25rem;
          background: rgba(247, 240, 230, 0.72);
          border-top: 1px solid var(--gold-line);
          border-bottom: 1px solid var(--gold-line);
        }

        .countdown-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.55rem;
          margin-top: 1.45rem;
        }

        .countdown-box {
          padding: 1rem 0.35rem;
          background: var(--paper);
          border: 1px solid var(--gold-line);
          text-align: center;
        }

        .countdown-number {
          display: block;
          color: var(--ink);
          font-family: 'Cinzel', Georgia, serif;
          font-size: clamp(1.55rem, 7vw, 2.6rem);
          font-weight: 500;
          line-height: 1;
        }

        .countdown-label {
          display: block;
          margin-top: 0.45rem;
          color: var(--muted);
          font-size: 0.56rem;
          font-weight: 500;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .family-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          margin-top: 2rem;
        }

        .family-card {
          padding: clamp(1.4rem, 5vw, 2rem);
          text-align: center;
        }

        .family-role {
          display: block;
          color: var(--gold);
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.2rem;
          font-style: italic;
        }

        .family-name {
          margin: 0.35rem 0 0;
          color: var(--ink);
          font-family: 'Cinzel', Georgia, serif;
          font-size: 1.65rem;
          font-weight: 500;
          letter-spacing: 0.12em;
        }

        .family-line {
          margin: 0.65rem 0 0;
          color: var(--muted);
          font-size: 0.68rem;
          letter-spacing: 0.14em;
          line-height: 1.7;
          text-transform: uppercase;
        }

        .ancestry {
          margin-top: 1.15rem;
          padding-top: 1.15rem;
          border-top: 1px solid var(--gold-line);
          color: var(--body);
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1rem;
          line-height: 1.5;
        }

        .events-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          margin-top: 2rem;
        }

        .event-card {
          padding: clamp(1.35rem, 5vw, 2rem);
        }

        .event-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
        }

        .event-label {
          margin: 0;
          color: var(--ink);
          font-family: 'Cinzel', Georgia, serif;
          font-size: 1.28rem;
          font-weight: 500;
          letter-spacing: 0.06em;
        }

        .event-time {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--gold);
          font-family: 'Cinzel', Georgia, serif;
          font-size: 0.95rem;
          white-space: nowrap;
        }

        .venue {
          margin: 1.1rem 0 0;
          color: var(--ink);
          font-weight: 600;
          line-height: 1.45;
        }

        .place {
          margin: 0.25rem 0 0;
          color: var(--muted);
          font-size: 0.72rem;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .event-note {
          margin: 0.8rem 0 1.1rem;
          color: var(--body);
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.06rem;
          line-height: 1.55;
        }

        .text-link {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          color: var(--gold);
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-decoration: none;
          text-transform: uppercase;
        }

        .directions-panel {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          margin-top: 2rem;
        }

        .contact-box {
          padding: clamp(1.35rem, 5vw, 1.9rem);
          text-align: center;
        }

        .phone-row {
          display: inline-flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 0.85rem;
          margin-top: 1rem;
        }

        .copy-button {
          min-height: 36px;
          padding: 0.55rem 0.8rem;
          background: transparent;
          border: 1px solid var(--gold-line);
          border-radius: 999px;
          color: var(--gold);
          cursor: pointer;
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .blessings-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          margin-top: 2rem;
        }

        .form-card,
        .blessings-card {
          padding: clamp(1.35rem, 5vw, 1.9rem);
        }

        .field {
          display: block;
          margin-bottom: 1rem;
        }

        .field span {
          display: block;
          margin-bottom: 0.45rem;
          color: var(--gold);
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .field input,
        .field textarea {
          width: 100%;
          padding: 0.85rem 0;
          background: transparent;
          border: 0;
          border-bottom: 1px solid var(--gold-line);
          border-radius: 0;
          color: var(--ink);
          font: inherit;
          font-size: 0.95rem;
          outline: none;
          resize: vertical;
        }

        .field input:focus,
        .field textarea:focus {
          border-bottom-color: var(--gold);
        }

        .guestbook-note {
          margin: 0 0 1rem;
          color: var(--muted);
          font-size: 0.72rem;
          line-height: 1.6;
        }

        .blessings-list {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          max-height: 460px;
          overflow-y: auto;
          padding-right: 0.15rem;
        }

        .blessing {
          position: relative;
          padding: 1rem;
          background: rgba(247,240,230,0.54);
          border: 1px solid var(--gold-line);
        }

        .blessing-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.7rem;
          margin-bottom: 0.45rem;
        }

        .blessing-name {
          color: var(--gold);
          font-family: 'Cinzel', Georgia, serif;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.08em;
        }

        .blessing-date {
          color: var(--muted);
          font-size: 0.62rem;
        }

        .blessing-text {
          margin: 0;
          color: var(--body);
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.04rem;
          font-style: italic;
          line-height: 1.55;
        }

        .support-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          margin-top: 1.7rem;
        }

        .support-chip {
          padding: 1rem 0.7rem;
          background: rgba(255,253,249,0.68);
          border: 1px solid var(--gold-line);
          text-align: center;
        }

        .support-chip strong {
          display: block;
          color: var(--ink);
          font-family: 'Cinzel', Georgia, serif;
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          line-height: 1.45;
          text-transform: uppercase;
        }

        .support-chip span {
          display: block;
          margin-top: 0.35rem;
          color: var(--muted);
          font-size: 0.58rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .footer {
          padding: 3rem 1.25rem 4.4rem;
          background: rgba(247,240,230,0.78);
          border-top: 1px solid var(--gold-line);
          text-align: center;
        }

        .footer-name {
          margin: 0;
          color: var(--ink);
          font-family: 'Cinzel', Georgia, serif;
          font-size: 1.55rem;
          font-weight: 500;
          letter-spacing: 0.16em;
        }

        .footer-links {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1rem;
          margin: 1.25rem 0;
        }

        .copyright {
          margin: 0;
          color: var(--muted);
          font-size: 0.58rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .toast {
          position: fixed;
          left: 50%;
          bottom: 1rem;
          z-index: 60;
          width: min(calc(100% - 2rem), 390px);
          display: flex;
          align-items: flex-start;
          gap: 0.8rem;
          padding: 1rem;
          background: var(--paper);
          border: 1px solid var(--gold-line);
          border-top: 2px solid var(--gold);
          box-shadow: var(--shadow);
          opacity: 0;
          pointer-events: none;
          transform: translateX(-50%) translateY(130%);
          transition: opacity 0.35s ease, transform 0.35s ease;
        }

        .toast.show {
          opacity: 1;
          pointer-events: auto;
          transform: translateX(-50%) translateY(0);
        }

        .toast-title {
          margin: 0;
          color: var(--ink);
          font-family: 'Cinzel', Georgia, serif;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .toast-message {
          margin: 0.25rem 0 0;
          color: var(--body);
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1rem;
          line-height: 1.4;
        }

        .toast-close {
          margin-left: auto;
          padding: 0;
          background: transparent;
          border: 0;
          color: var(--muted);
          cursor: pointer;
        }

        .reveal {
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }

        .reveal.reveal-in {
          opacity: 1;
          transform: none;
        }

        @media (min-width: 640px) {
          .hero {
            min-height: 92vh;
            display: flex;
            align-items: center;
            padding: 7rem 1.5rem 4.2rem;
          }

          .hero-summary {
            grid-template-columns: repeat(2, 1fr);
          }

          .hero-actions {
            grid-template-columns: 1fr 1fr;
          }

          .support-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (min-width: 768px) {
          .nav {
            padding: 1.25rem 2rem;
          }

          .nav.scrolled {
            padding: 0.85rem 2rem;
          }

          .nav-links {
            display: flex;
          }

          .family-grid,
          .events-grid,
          .directions-panel,
          .blessings-layout {
            grid-template-columns: repeat(2, 1fr);
          }

          .countdown-grid {
            gap: 1rem;
          }

          .countdown-box {
            padding: 1.35rem 0.6rem;
          }
        }

        @media (max-width: 380px) {
          .button {
            width: 100%;
          }

          .names {
            font-size: 2.82rem;
          }

          .summary-item {
            font-size: 0.72rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }

          .reveal {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>

      <button
        className="button music-button"
        type="button"
        onClick={toggleMusic}
        aria-label={MUSIC_SRC ? 'Toggle background music' : 'Background music not added'}
        aria-disabled={!MUSIC_SRC}
        title={MUSIC_SRC ? 'Toggle music' : 'Add a local audio file to enable music'}
      >
        <Music size={18} />
      </button>

      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <button className="brand" type="button" onClick={() => scrollToId('hero')}>
          C &amp; T
        </button>

        <div className="nav-links" aria-label="Page navigation">
          <button className="nav-link" type="button" onClick={() => scrollToId('couple')}>
            Families
          </button>
          <button className="nav-link" type="button" onClick={() => scrollToId('ceremony')}>
            Ceremony
          </button>
          <button className="nav-link" type="button" onClick={() => scrollToId('directions')}>
            Directions
          </button>
          <button className="nav-link" type="button" onClick={() => scrollToId('blessings')}>
            Wishes
          </button>
        </div>

        <a className="button button-quiet" href={INVITATION_FILE} download>
          <Download size={15} />
          Invitation
        </a>
      </nav>

      <main>
        <section id="hero" className="hero">
          <div className="hero-inner reveal">
            <p className="eyebrow">Betrothal Invitation</p>

            <p className="verse">
              “The Lord has done great things for us, and we are filled with joy.”
              <span className="verse-ref">Psalm 126:3</span>
            </p>

            <h1 className="names">
              Cera
              <span className="ampersand">&amp;</span>
              Tony
            </h1>

            <div className="hero-summary" aria-label="Event summary">
              <div className="summary-item">
                <CalendarDays size={17} />
                Saturday, October 10, 2026
              </div>
              <div className="summary-item">
                <Clock size={17} />
                11:00 AM Ceremony
              </div>
              <div className="summary-item">
                <MapPin size={17} />
                St. Mary&apos;s Forane Church
              </div>
              <div className="summary-item">
                <Sparkles size={17} />
                Kanjoor, Kerala
              </div>
            </div>

            <div className="hero-actions">
              <a className="button button-primary" href={INVITATION_FILE} download>
                <Download size={17} />
                Download Invitation
              </a>

              <a
                className="button button-secondary"
                href={CEREMONY_MAP}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin size={17} />
                View Directions
              </a>
            </div>

            <p className="invited-by">
              With joyful hearts, Sheela &amp; Saji Francis invite you to share in this
              celebration of love, prayer, and family.
            </p>

            <button className="scroll-cue" type="button" onClick={() => scrollToId('countdown')}>
              Scroll
              <ChevronDown size={15} />
            </button>
          </div>
        </section>

        <section id="countdown" className="countdown">
          <div className="container-narrow reveal" style={{ textAlign: 'center' }}>
            <p className="eyebrow">Counting down</p>

            <div className="countdown-grid">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div className="countdown-box" key={unit}>
                  <span className="countdown-number">{String(value).padStart(2, '0')}</span>
                  <span className="countdown-label">{unit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="couple" className="section">
          <div className="container">
            <div className="reveal" style={{ textAlign: 'center' }}>
              <p className="eyebrow">The couple and families</p>
              <h2 className="section-title">Two Families, One Joy</h2>
              <div className="rule" />
            </div>

            <div className="family-grid">
              <article className="family-card card reveal">
                <span className="family-role">Bride-to-be</span>
                <h3 className="family-name">Cera</h3>
                <p className="family-line">D/o Sheela &amp; Saji Francis</p>

                <div className="ancestry">
                  <strong className="gold">Granddaughter of</strong>
                  <br />
                  The late Brijit Francis and the late P.K. Francis
                  <br />
                  <span className="muted">Paracka House, Kanjoor</span>
                  <br />
                  <br />
                  The late Ally Mathan and the late T.A. Mathan
                  <br />
                  <span className="muted">Thekkekkara House, Irinjalakuda</span>
                </div>
              </article>

              <article className="family-card card reveal">
                <span className="family-role">Groom-to-be</span>
                <h3 className="family-name">Tony</h3>
                <p className="family-line">S/o Mini Anto &amp; Anto Antony</p>

                <div className="ancestry">
                  <strong className="gold">Family House</strong>
                  <br />
                  Chakkankulam House
                  <br />
                  <span className="muted">Pala, Kerala</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="ceremony" className="section" style={{ background: 'rgba(247, 240, 230, 0.62)' }}>
          <div className="container">
            <div className="reveal" style={{ textAlign: 'center' }}>
              <p className="eyebrow">Ceremony details</p>
              <h2 className="section-title">Order of the Day</h2>
              <p className="section-copy">
                The day begins with the betrothal ceremony at church, followed by the
                reception and lunch with family and guests.
              </p>
              <div className="rule" />
            </div>

            <div className="events-grid">
              {events.map((event) => (
                <article className="event-card card reveal" key={event.label}>
                  <div className="event-top">
                    <h3 className="event-label">{event.label}</h3>
                    <span className="event-time">
                      <Clock size={15} />
                      {event.time}
                    </span>
                  </div>

                  <p className="venue">{event.venue}</p>
                  <p className="place">{event.place}</p>
                  <p className="event-note">{event.note}</p>

                  <a
                    className="text-link"
                    href={event.map}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View directions
                    <ArrowUpRight size={14} />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="directions" className="section">
          <div className="container">
            <div className="reveal" style={{ textAlign: 'center' }}>
              <p className="eyebrow">Directions and contact</p>
              <h2 className="section-title">Guest Information</h2>
              <p className="section-copy">
                Save the invitation, open the map links directly from your phone, or call
                the family for any guidance.
              </p>
              <div className="rule" />
            </div>

            <div className="directions-panel">
              <div className="contact-box card reveal">
                <MapPin className="gold" size={22} />
                <h3 className="event-label" style={{ marginTop: '0.8rem' }}>
                  Venue directions
                </h3>
                <p className="event-note">
                  Open the exact Google Maps location before you start your journey.
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem' }}>
                  <a
                    className="button button-secondary"
                    href={CEREMONY_MAP}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Church
                  </a>
                  <a
                    className="button button-secondary"
                    href={RECEPTION_MAP}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Reception
                  </a>
                </div>
              </div>

              <div className="contact-box card reveal">
                <Phone className="gold" size={22} />
                <h3 className="event-label" style={{ marginTop: '0.8rem' }}>
                  Contact
                </h3>
                <p className="event-note">
                  For family inquiries, travel coordination, or assistance, please reach
                  us directly.
                </p>

                <div className="phone-row">
                  <strong className="font-display ink">{DISPLAY_PHONE}</strong>
                  <button className="copy-button" type="button" onClick={copyPhoneNumber}>
                    <Copy size={13} />
                    {showCopied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="blessings" className="section" style={{ background: 'rgba(247, 240, 230, 0.62)' }}>
          <div className="container">
            <div className="reveal" style={{ textAlign: 'center' }}>
              <p className="eyebrow">Blessings and wishes</p>
              <h2 className="section-title">Leave a Blessing</h2>
              <p className="section-copy">
                This is a temporary on-page guestbook. Messages are kept only in this
                browser session and are not saved to a backend.
              </p>
              <div className="rule" />
            </div>

            <div className="blessings-layout">
              <div className="form-card card reveal">
                <label className="field" htmlFor="blessing-name">
                  <span>Your name</span>
                  <input
                    id="blessing-name"
                    type="text"
                    value={blessingName}
                    onChange={(event) => setBlessingName(event.target.value)}
                    autoComplete="name"
                  />
                </label>

                <label className="field" htmlFor="blessing-message">
                  <span>Your blessing</span>
                  <textarea
                    id="blessing-message"
                    rows="4"
                    value={blessingMessage}
                    onChange={(event) => setBlessingMessage(event.target.value)}
                  />
                </label>

                <button className="button button-primary" type="button" onClick={handleBlessingSubmit}>
                  <Heart size={16} />
                  Post Blessing
                </button>
              </div>

              <div className="blessings-card card reveal">
                <p className="guestbook-note">
                  Recent wishes shown below are frontend-only and reset when the page reloads.
                </p>

                <div className="blessings-list">
                  {blessingsList.map((blessing, index) => (
                    <article className="blessing" key={`${blessing.name}-${index}`}>
                      <div className="blessing-head">
                        <span className="blessing-name">{blessing.name}</span>
                        <span className="blessing-date">{blessing.date}</span>
                      </div>
                      <p className="blessing-text">“{blessing.text}”</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="support" className="section">
          <div className="container-narrow reveal" style={{ textAlign: 'center' }}>
            <p className="eyebrow">With blessings and prayers</p>
            <h2 className="section-title">Sharing the Happiness</h2>
            <div className="rule" />

            <div className="support-grid">
              {[
                ['Fr. Francis SJ', 'Blessings'],
                ['Mathews & Merin', 'Family'],
                ['Bastin & Riya', 'Family'],
                ['Austin', 'Family'],
              ].map(([name, role]) => (
                <div className="support-chip" key={name}>
                  <strong>{name}</strong>
                  <span>{role}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p className="footer-name">Cera &amp; Tony</p>

        <div className="footer-links">
          <button className="nav-link" type="button" onClick={() => scrollToId('hero')}>
            Home
          </button>
          <button className="nav-link" type="button" onClick={() => scrollToId('ceremony')}>
            Ceremony
          </button>
          <button className="nav-link" type="button" onClick={() => scrollToId('directions')}>
            Directions
          </button>
          <a className="nav-link" href={INVITATION_FILE} download style={{ textDecoration: 'none' }}>
            Download
          </a>
        </div>

        <p className="copyright">© 2026 Cera &amp; Tony · Betrothal Invitation</p>
      </footer>

      <div className={`toast ${toast.show ? 'show' : ''}`} role="status" aria-live="polite">
        <CheckCircle className="gold" size={19} style={{ flexShrink: 0, marginTop: 2 }} />

        <div>
          <p className="toast-title">{toast.title}</p>
          <p className="toast-message">{toast.message}</p>
        </div>

        <button
          className="toast-close"
          type="button"
          aria-label="Dismiss notification"
          onClick={() => setToast((current) => ({ ...current, show: false }))}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
