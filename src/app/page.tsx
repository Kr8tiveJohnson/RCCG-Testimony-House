import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Clock3,
  Heart,
  MapPin,
  Play,
} from "lucide-react";
import { Reveal } from "../components/reveal";
import { ministries, serviceInformation } from "../data/site-content";

const stories = [
  "Faith for every season",
  "A place to find your people",
  "Hope for a new beginning",
  "Growing together in Jesus",
];

export default function HomePage() {
  return (
    <div className="home-page">
      <section className="home-hero" aria-labelledby="hero-title">
        <div className="home-hero__image" role="img" aria-label="Testimony House members welcoming visitors outside the church" />
        <div className="home-hero__shade" />
        <div className="home-hero__content page-width">
          <p className="home-hero__eyebrow"><Image src="/images/logo/TESTIMONY%20LOGO.png" alt="" width={28} height={28} /> A COMMUNITY OF FAITH & FAMILY</p>
          <h1 id="hero-title"><span>WELCOME TO</span><span className="home-hero__title-accent">TESTIMONY HOUSE</span></h1>
          <p className="home-hero__description">Experience God’s love in a welcoming church family where faith grows, hope is renewed, and every story matters.</p>
          <div className="home-hero__actions">
            <Link className="pill-button pill-button--purple" href="/livestream">Watch live <span><Play size={15} fill="currentColor" /></span></Link>
            <Link className="pill-button pill-button--white" href="/sermons">Previous sermons <span><ArrowUpRight size={18} /></span></Link>
            <Link className="pill-button pill-button--glass" href="/register">Membership form <span><ArrowUpRight size={18} /></span></Link>
          </div>
        </div>
        <Link className="home-hero__scroll" href="#welcome" aria-label="Scroll to discover"><span>SCROLL TO DISCOVER</span><ArrowDown size={17} /></Link>
        <div className="home-hero__side-note">ONE FAMILY · MANY STORIES</div>
      </section>

      <div className="ticker" aria-label="Faith, hope, and a place to belong">
        <div className="ticker__track">
          {[...stories, ...stories].map((story, index) => (
            <span key={`${story}-${index}`}>{story}<Image src="/images/logo/TESTIMONY%20LOGO.png" alt="" width={28} height={28} /></span>
          ))}
        </div>
      </div>

      <section className="welcome-section section-pad page-width" id="welcome">
        <Reveal className="welcome-section__visual">
          <div className="welcome-art">
            <div className="welcome-art__caption"><span>TESTIMONY HOUSE</span><strong>A place to call home.</strong></div>
          </div>
          <div className="welcome-section__badge"> <span>COME AS<br />YOU ARE</span></div>
        </Reveal>
        <Reveal className="welcome-section__copy">
          <p className="section-kicker">WELCOME TO TESTIMONY HOUSE</p>
          <h2>There’s a place for <em>your story.</em></h2>
          <p>We are a church family learning to follow Jesus, care for one another, and make room for every generation to grow. If you’re exploring faith or looking for a place to belong, we’d love to welcome you.</p>
          <ul className="welcome-points">
            <li><span>01</span> Grow deeper in faith</li>
            <li><span>02</span> Find a community to call home</li>
            <li><span>03</span> Serve with purpose</li>
          </ul>
          <Link className="text-arrow" href="/about">Discover our church <ArrowRight size={17} /></Link>
        </Reveal>
      </section>

      <section className="worship-section">
        <div className="worship-section__inner page-width">
          <Reveal className="worship-section__heading">
            <p className="section-kicker">YOUR SUNDAY STARTS HERE</p>
            <h2>Worship <em>with us.</em></h2>
          </Reveal>
          <Reveal className="worship-card">
            <div className="worship-card__visual" aria-hidden="true">
              <div className="worship-card__sun" />
              <div className="worship-card__building"><span /><i /><b /></div>
              <div className="worship-card__tree"><i /><b /></div>
              <span className="worship-card__image-caption">A PLACE TO GATHER</span>
            </div>
            <div className="worship-card__details">
              <span className="worship-card__eyebrow"><span /> YOU’RE INVITED</span>
              <h3>Join us this Sunday</h3>
              <div className="worship-card__time">
                <Clock3 size={16} />
                <div className="worship-card__time-list">
                  {serviceInformation.schedule.map((item) => (
                    <div key={item.label} className="worship-card__time-item">
                      <strong>{item.label}</strong>
                      <time>{item.time}</time>
                    </div>
                  ))}
                </div>
              </div>
              <p className="worship-card__place"><MapPin size={16} /> <span>{serviceInformation.address}</span></p>
              <Link href="/contact" className="worship-card__details-link" aria-label="Get service and location details">
                Get service details
                <ArrowRight size={18} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="ministries-section section-pad">
        <div className="page-width">
          <Reveal className="section-intro">
            <p className="section-kicker">GROWING SIDE BY SIDE</p>
            <h2>Find your <em>people.</em></h2>
            <p>From little ones to grown-ups, there’s room for every age and every season of life.</p>
          </Reveal>
          <div className="ministry-tiles">
            {ministries.map((ministry, index) => {
              const Icon = ministry.icon;
              const artStyle = ministry.image ? ({ ["--tile-image" as string]: `url(${ministry.image})` } as const) : undefined;

              return (
                <Reveal key={ministry.name} className={`ministry-tile ministry-tile--${index + 1}`}>
                  <Link href={`/ministries/${ministry.slug}`} className="ministry-tile__link">
                    <div className="ministry-tile__art" style={artStyle}><span>{String(index + 1).padStart(2, "0")}</span><Icon size={27} strokeWidth={1.5} /></div>
                    <div className="ministry-tile__bottom"><div><h3>{ministry.name}</h3><p>{ministry.description}</p></div><ArrowUpRight size={19} /></div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
          <div className="ministries-section__more"><Link className="pill-button pill-button--outline" href="/ministries">Explore ministries <span><ArrowRight size={16} /></span></Link></div>
        </div>
      </section>

      <section className="message-section">
        <div className="message-section__inner page-width">
          <Reveal className="message-section__copy">
            <p className="section-kicker">A WORD FOR YOUR WEEK</p>
            <h2>Make space for <em>the message.</em></h2>
            <p>Find encouragement, revisit a recent message, and grow in the Word wherever you are.</p>
            <Link className="pill-button pill-button--purple" href="/sermons">Browse sermons <span><ArrowUpRight size={17} /></span></Link>
          </Reveal>
          <Reveal className="sermon-card">
            <div className="sermon-card__art"><div className="sermon-card__rays" /><div className="sermon-card__cross"><span /></div><span className="sermon-card__scripture">PSALM 66:16</span><button type="button" aria-label="Sermon player coming soon"><Play size={22} fill="currentColor" /></button></div>
            <div className="sermon-card__details"><span><BookOpen size={15} /> LATEST MESSAGE</span><strong>Sermon details coming soon</strong><small>Messages from Testimony House</small></div>
          </Reveal>
        </div>
      </section>

      <section className="testimony-section section-pad page-width">
        <Reveal className="testimony-section__heading">
          <p className="section-kicker">GOD IS STILL WRITING</p>
          <h2>Every life has a <em>testimony.</em></h2>
          <p>Stories of faith remind us that hope is alive and no one walks alone.</p>
        </Reveal>
        <Reveal className="testimony-feature">
          <span className="testimony-feature__quote">“</span>
          <div><span className="testimony-feature__label">A CHURCH FAMILY</span><blockquote>There is room for new beginnings, for questions, and for every story God is still unfolding.</blockquote><span className="testimony-feature__attribution">SHARE YOUR STORY WITH US</span></div>
          <Link href="/testimonies" className="round-arrow" aria-label="Read testimonies"><ArrowRight size={19} /></Link>
        </Reveal>
        <div className="testimony-section__actions"><Link className="text-arrow" href="/testimonies">Read testimonies <ArrowRight size={17} /></Link><Link className="text-arrow" href="/prayer-request">Request prayer <Heart size={16} /></Link></div>
      </section>

      <section className="gather-section">
        <div className="gather-section__inner page-width">
          <Reveal className="gather-section__content">
            <p className="section-kicker section-kicker--light">YOUR NEXT CHAPTER CAN START HERE</p>
            <h2>Come be a part<br />of <em>the family.</em></h2>
            <p>We can’t wait to meet you. Take a first step, meet our church family, and find the place God is preparing for you.</p>
            <div className="gather-section__actions"><Link className="pill-button pill-button--white" href="/register">Be a member <span><ArrowUpRight size={17} /></span></Link><Link href="/events" className="gather-section__secondary">See what’s happening <ArrowRight size={15} /></Link></div>
          </Reveal>
          <div className="gather-section__emblem" aria-hidden="true"><Image src="/images/logo/TESTIMONY%20LOGO.png" alt="" width={210} height={210} /><span>FAITH · FAMILY · PURPOSE</span></div>
          <span className="gather-section__spark gather-section__spark--one">✳</span><span className="gather-section__spark gather-section__spark--two">✳</span>
        </div>
      </section>

      <section className="events-section section-pad page-width">
        <Reveal className="events-section__top">
          <div><p className="section-kicker">LIFE TOGETHER</p><h2>Good things are <em>gathering.</em></h2></div>
          <Link className="text-arrow" href="/events">See all events <ArrowRight size={17} /></Link>
        </Reveal>
        <Reveal className="event-row">
          <div className="event-row__date"><CalendarDays size={24} /><span>COMING<br />SOON</span></div>
          <div className="event-row__copy"><span>TESTIMONY HOUSE</span><h3>There’s always room at the table.</h3><p>Our upcoming gatherings will be shared here. Check back soon for the next opportunity to connect.</p></div>
          <Link className="round-arrow" href="/events" aria-label="Explore upcoming events"><ArrowRight size={19} /></Link>
        </Reveal>
      </section>

      <div className="closing-ribbon"><div className="closing-ribbon__track">{[...stories, ...stories].map((story, index) => <span key={`closing-${index}`}>{story}<Image src="/images/logo/TESTIMONY%20LOGO.png" alt="" width={28} height={28} /></span>)}</div></div>
      <Link className="floating-give" href="/give"><span><ArrowUpRight size={16} /></span> Online giving</Link>
    </div>
  );
}
