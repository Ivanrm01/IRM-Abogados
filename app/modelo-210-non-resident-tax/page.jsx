import Link from 'next/link'
import styles from './nonresident.module.css'
import TrackedLink from '@/components/TrackedLink'
import { JsonLdFaq } from '@/components/JsonLd'
import EnquiryForm from './EnquiryForm'

export const metadata = {
  title: 'Modelo 210 — Spanish Tax for Non-Resident Property Owners',
  description:
    'Spanish tax lawyers for non-resident owners. Modelo 210 for rental income, imputed income on a property you do not rent out, and capital gains and the 3% retention when you sell. Fixed fees, handled in English.',
  keywords:
    'Modelo 210, non resident tax Spain, Spanish property tax non resident, IRNR, imputed income Spain, 3% retention Spain property sale, rental income tax Spain non resident',
  alternates: { canonical: '/en/modelo-210-non-resident-tax' },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'IRM Abogados',
    url: '/en/modelo-210-non-resident-tax',
    title: 'Modelo 210: Spanish tax for non-resident property owners',
    description:
      'Rental income, imputed income and property sales. Spanish tax lawyers acting for owners resident in the UK, the EU, the US and beyond.',
    images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'IRM Abogados' }],
  },
}

const cases = [
  {
    tag: 'Income type 01 / 03',
    title: 'You rent the property out',
    desc:
      'Rent from a Spanish property is taxed in Spain, whether the tenant is long-term, seasonal or a holiday booking. The tax agency already receives the data: booking platforms report through the DAC7 rules and the Land Registry, the cadastre and Spanish banks all feed the same file.',
    items: [
      'One return per property, per year, per owner',
      'EU, Iceland, Norway and Liechtenstein residents: 19% on the net rent',
      'Everyone else: 24% on the gross rent, no expenses',
      'Empty weeks are not free — they generate imputed income for that part of the year',
    ],
    note:
      'From the 2026 tax year the return is filed between 1 and 20 April of the following year, and expenses must be itemised in a new annex.',
  },
  {
    tag: 'Income type 02 / 03',
    title: 'You keep it for your own use',
    desc:
      'This is the obligation owners are most often unaware of. If the property is not rented out, Spanish law still treats it as producing income for you — a notional amount calculated on the cadastral value shown on your IBI receipt. Nothing has to happen for the tax to arise: owning the property is enough.',
    items: [
      'Taxable base: 1.1% or 2% of the cadastral value, depending on when that value was last revised',
      'Tax rate: 19% or 24%, depending on where you are resident',
      'Each co-owner files their own return for their share',
      'A garage or storeroom with its own cadastral reference is a separate return',
    ],
    note:
      'A typical bill is modest. The problem is that it repeats every year, and unfiled years accumulate with surcharges and interest.',
  },
  {
    tag: 'Income type 03 / 03',
    title: 'You sell the property',
    desc:
      'The buyer is legally required to hold back 3% of the price and pay it to the tax agency on your account using form 211. You then declare the actual gain or loss. The 3% is a payment on account, not the tax itself — quite often it is more than the tax due, and the difference has to be claimed back.',
    items: [
      '19% on the gain, whichever country you live in',
      'Buyer files form 211 within one month of completion',
      'Seller files form 210 in the three months that follow',
      'A loss still has to be declared if you want the 3% refunded',
    ],
    note:
      'The property itself answers for the tax. An unresolved sale can come back to the buyer, which is why conveyancing lawyers ask.',
  },
]

const checks = [
  {
    t: 'Expenses when you live outside the EU',
    d:
      'The tax agency applies the letter of the law: non-EEA residents pay 24% on gross rent with nothing deducted. That treatment has been successfully challenged before the Audiencia Nacional on free movement of capital grounds — a freedom that, unlike the others, also protects residents of third countries. For US, Canadian and Swiss landlords in particular, it is worth costing out.',
    cite: 'Art. 63 TFEU',
  },
  {
    t: 'The residential letting reduction',
    d:
      'Resident landlords reduce the net rent of a long-term home let by 50%, and by more in certain cases. Non-residents are expressly denied it. The European Commission has taken issue with that difference in treatment, and refund claims can be filed to keep open years alive while the point is resolved.',
    cite: 'Art. 24.6 TRLIRNR',
  },
  {
    t: 'Recovering the 3% after a sale',
    d:
      'Where the gain is small, where costs were high, or where the property is sold at a loss, the 3% withheld exceeds the tax due. The excess is refundable, but only if it is claimed within the deadline and the acquisition value is properly documented.',
    cite: 'Form 211 / 210',
  },
  {
    t: 'The gain is not simply the price difference',
    d:
      'Transfer tax or VAT paid on purchase, notary, land registry and agency fees, and capital improvements all increase the acquisition value. Repairs do not. Where the property was bought before 1995, a transitional relief may still reduce part of the gain.',
    cite: 'DT 9ª LIRPF',
  },
  {
    t: 'Reinvestment relief for EU and EEA sellers',
    d:
      'If the property you are selling has been your main home and you reinvest in a new main home — in Spain or in your own country — the gain may be exempt in whole or in part. It applies to residents of the EU, Iceland, Norway and Liechtenstein, and it is claimed on the same return.',
    cite: 'DA 7ª TRLIRNR',
  },
  {
    t: 'The municipal tax on the sale',
    d:
      'Plusvalía municipal is a separate tax charged by the town hall. Where the seller is non-resident, the law makes the buyer liable for paying it, which is why buyers hold the money back. Since the 2021 reform there are two ways of calculating it, and no tax is due where there was no real increase in value.',
    cite: 'Art. 106.2 TRLRHL',
  },
]

const steps = [
  {
    n: '01',
    t: 'We look at the facts',
    d:
      'Deeds, IBI receipt, purchase and sale costs, tenancy agreements, and what has been filed in Spain so far. Usually one email exchange.',
  },
  {
    n: '02',
    t: 'You get the numbers and the fee',
    d:
      'What is owed, for which years, what can be reclaimed, and a fixed fee for the work. You decide before anything is filed.',
  },
  {
    n: '03',
    t: 'We file, claim or defend',
    d:
      'Returns, refund claims, late filings, or a reply to the tax agency. We act under a power of attorney, so you do not need to travel.',
  },
  {
    n: '04',
    t: 'We keep you compliant',
    d:
      'A reminder each year before the deadline, the return prepared, and the payment arranged by direct debit from a Spanish or foreign account.',
  },
]

const faqs = [
  {
    q: 'The property is empty. Do I really have to file anything?',
    a:
      'Yes. Spanish law attributes a notional income to a non-resident owner of a property that is not rented out and is not their main home. The amount is 1.1% or 2% of the cadastral value on the IBI receipt, taxed at 19% or 24%. There is one return per owner and per property each year.',
  },
  {
    q: 'The flat is in joint names. Is one return enough?',
    a:
      'No. Each owner is a separate taxpayer and files their own return for their percentage of ownership. A couple who own a flat between them file two returns each year, not one.',
  },
  {
    q: 'I am British. What changed after Brexit?',
    a:
      'UK residents are now taxed at 24% instead of 19%, and the tax agency does not allow them to deduct letting expenses. The 19% rate on gains from selling a property is unchanged, as is the buyer’s obligation to withhold 3%. Whether the denial of expenses can be challenged depends on the amounts at stake, and we will tell you honestly when it is not worth it.',
  },
  {
    q: 'I have owned the property for years and never filed. What happens now?',
    a:
      'The tax agency can go back four years. Filing voluntarily, before they write to you, means a surcharge of 1% plus 1% for each further month of delay, rising to 15% plus interest once a year has passed — and no penalty. If they contact you first, the surcharge is replaced by a penalty that starts at 50% of the tax. Coming forward voluntarily is almost always the cheaper route.',
  },
  {
    q: 'I sold at a loss. Can I forget about it?',
    a:
      'No, and it is worth filing: the 3% the buyer withheld belongs to you. A loss is declared on the same form 210 and the refund is claimed within the deadline. Miss it and the 3% stays with the tax agency.',
  },
  {
    q: 'Will I be taxed twice on the same income?',
    a:
      'Spain taxes income from Spanish property at source, and your country of residence generally taxes your worldwide income and then gives relief for the Spanish tax under the double tax treaty. We provide the certificates and evidence of payment your own accountant will need.',
  },
  {
    q: 'Is there anything else I owe as a non-resident owner?',
    a:
      'Possibly. Wealth tax applies to non-residents on Spanish assets above the exempt threshold, and there is a separate national tax on larger fortunes. Then there is the annual IBI to the town hall, community fees, and a tourist licence if you let short-term. We check all of it once, at the start.',
  },
  {
    q: 'Do I need a NIE, and do I have to come to Spain?',
    a:
      'You need a NIE to file. If you already bought a property you will have one. You do not need to travel: we act under a power of attorney, which can be signed before a notary in your own country with an apostille, or at a Spanish consulate.',
  },
]

export default function NonResidentTaxPage() {
  return (
    <div lang="en">
      <JsonLdFaq faqs={faqs} />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroLine}></div>
        <div>
          <div className={styles.eyebrow}>Spanish tax lawyers · Madrid & Castellón</div>
          <h1 className={styles.heroTitle}>
            A property in Spain<br />comes with a<br /><em>Spanish tax return</em>
          </h1>
          <p className={styles.heroDesc}>
            If you are not tax resident in Spain, form 210 applies to you — whether you let the
            property, keep it for your own use, or sell it. We prepare and file it, and we look
            for what most owners leave behind: <strong>expenses that were never deducted, and
            refunds that were never claimed.</strong>
          </p>
          <div className={styles.heroBtns}>
            <Link href="#enquiry" className="btn-gold">Get a fixed-fee quote</Link>
            <TrackedLink ubicacion="landing_en_hero" href="tel:+34614149465" className="btn-ghost">
              +34 614 149 465
            </TrackedLink>
          </div>
          <div className={styles.heroAlert}>
            <span className={styles.alertDot}></span>
            Filing dates changed in June 2026. Rental income for 2026 is now declared between
            1 and 20 April 2027, not in January.
          </div>
        </div>
        <div className={styles.heroCards}>
          <div className={styles.heroCard}>
            <div className={styles.heroCardLabel}>Rented out</div>
            <div className={styles.heroCardTitle}>19% of the net rent, or 24% of the gross</div>
            <div className={styles.heroCardDesc}>
              Expenses are deductible for owners resident in the EU, Iceland, Norway and
              Liechtenstein. Elsewhere, tax is charged on the full rent.
            </div>
          </div>
          <div className={styles.heroCard}>
            <div className={styles.heroCardLabel}>Not rented out</div>
            <div className={styles.heroCardTitle}>Tax on income you never received</div>
            <div className={styles.heroCardDesc}>
              An empty property still produces a taxable amount, calculated on 1.1% or 2% of its
              cadastral value. It is due every year you own it.
            </div>
          </div>
          <div className={styles.heroCard}>
            <div className={styles.heroCardLabel}>Sold</div>
            <div className={styles.heroCardTitle}>19% on the gain, 3% held back at completion</div>
            <div className={styles.heroCardDesc}>
              The buyer withholds 3% of the price for the tax agency. If your tax is lower than
              that, the difference has to be reclaimed.
            </div>
          </div>
        </div>
      </section>

      {/* LOS TRES SUPUESTOS */}
      <section className={styles.cases}>
        <div className={styles.eyebrowDark}>What form 210 covers</div>
        <h2 className={styles.sectionTitle}>Three situations,<br />one <em>tax return</em></h2>
        <p className={styles.sectionDesc}>
          Non-resident income tax works differently from the Spanish resident system: there is no
          single annual declaration of everything you earn. Each type of income has its own form,
          its own rate and its own deadline. For a property owner, three of them matter.
        </p>
        <div className={styles.casesGrid}>
          {cases.map(c => (
            <div key={c.tag} className={styles.caseCard}>
              <div className={styles.caseTag}>{c.tag}</div>
              <h3 className={styles.caseTitle}>{c.title}</h3>
              <p className={styles.caseDesc}>{c.desc}</p>
              <ul className={styles.caseList}>
                {c.items.map(i => (
                  <li key={i}><span className={styles.listDash}>—</span>{i}</li>
                ))}
              </ul>
              <div className={styles.caseNote}>{c.note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TIPOS */}
      <section className={styles.rates}>
        <div className={styles.eyebrowDark}>Where you live changes the bill</div>
        <h2 className={styles.sectionTitle}>Two rates, and a<br />difference that <em>compounds</em></h2>
        <p className={styles.sectionDesc}>
          On rental income the gap between the two regimes is much wider than the four points
          between 19% and 24% suggest, because one of them allows expenses and the other does not.
          On a €12,000 annual rent with €4,000 of costs, the difference is roughly €1,500 a year.
        </p>
        <div className={styles.ratesGrid}>
          <div className={styles.rateCard}>
            <div className={styles.rateWho}>Resident in the EU, Iceland, Norway or Liechtenstein</div>
            <div className={styles.rateFigure}>19<span>%</span></div>
            <div className={styles.rateBase}>on the net amount, after expenses</div>
            <ul className={styles.rateList}>
              <li><span className={styles.listDash}>—</span>Mortgage interest, IBI, community fees and insurance</li>
              <li><span className={styles.listDash}>—</span>Repairs, maintenance, utilities and agency commission</li>
              <li><span className={styles.listDash}>—</span>Depreciation of the building and its contents</li>
              <li><span className={styles.listDash}>—</span>Costs count only for the days the property was actually let</li>
            </ul>
          </div>
          <div className={styles.rateCardAlt}>
            <div className={styles.rateWho}>Resident anywhere else — UK, US, Switzerland, Canada, Australia</div>
            <div className={styles.rateFigure}>24<span>%</span></div>
            <div className={styles.rateBase}>on the gross rent, with no deductions</div>
            <ul className={styles.rateList}>
              <li><span className={styles.listDash}>—</span>Same rate on imputed income for a property you keep for yourself</li>
              <li><span className={styles.listDash}>—</span>Gains on a sale are still taxed at 19%, as for everyone else</li>
              <li><span className={styles.listDash}>—</span>The denial of expenses has been challenged successfully in court</li>
              <li><span className={styles.listDash}>—</span>Worth reviewing where the rent is high or the costs are heavy</li>
            </ul>
          </div>
        </div>
        <p className={styles.rateFootnote}>
        </p>
      </section>

      {/* CALENDARIO */}
      <section className={styles.calendar}>
        <div className={styles.eyebrow}>Deadlines</div>
        <h2 className={styles.sectionTitleLight}>The dates moved<br />in <em>June 2026</em></h2>
        <p className={styles.sectionDescLight}>
          Order HAC/623/2026 pushed back the filing window for both rental income and imputed
          income, and redesigned the form itself. The change catches owners who have been filing
          in January for years.
        </p>
        <div className={styles.calGrid}>
          <div className={styles.calRow}>
            <div className={styles.calDate}>1 Jan – 31 Dec 2026</div>
            <div className={styles.calWhat}>
              <strong>Imputed income for 2025.</strong> The old window still applies to this year:
              you have the whole of 2026 to file, or until 23 December if you pay by direct debit.
            </div>
          </div>
          <div className={styles.calRow}>
            <div className={styles.calDate}>1 – 20 April 2027</div>
            <div className={styles.calWhat}>
              <strong>Rental income for 2026.</strong> One annual return per property, filed in
              April rather than January. Direct debit closes on 15 April.
            </div>
          </div>
          <div className={styles.calRow}>
            <div className={styles.calDate}>1 Apr – 31 Dec 2027</div>
            <div className={styles.calWhat}>
              <strong>Imputed income for 2026.</strong> The window now opens in April instead of
              January, and from 2027 the form requires the number of days and your ownership share.
            </div>
          </div>
          <div className={styles.calRow}>
            <div className={styles.calDate}>Four months from completion</div>
            <div className={styles.calWhat}>
              <strong>Sale of the property.</strong> The buyer has one month to pay the 3% on
              form 211; you then have three months to declare the gain or loss and claim any refund.
            </div>
          </div>
        </div>
      </section>

      {/* QUÉ REVISAMOS */}
      <section className={styles.checks}>
        <div className={styles.eyebrowDark}>Why a lawyer and not a filing app</div>
        <h2 className={styles.sectionTitle}>Filing the form is easy.<br />Paying the <em>right amount</em> is not</h2>
        <p className={styles.sectionDesc}>
          An online service reproduces what the tax agency’s own calculator would say. That is
          fine when the position is clear. It is not fine when the amount at stake is large, when
          returns are years overdue, or when the rule being applied to you is itself open to
          challenge. These are the points we check on every file.
        </p>
        <div className={styles.checksGrid}>
          {checks.map(c => (
            <div key={c.t} className={styles.checkCard}>
              <h3 className={styles.checkTitle}>{c.t}</h3>
              <p className={styles.checkDesc}>{c.d}</p>
              <span className={styles.checkCite}>{c.cite}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FUERA DE PLAZO */}
      <section className={styles.late}>
        <div>
          <div className={styles.eyebrowDark}>Years overdue, or a letter from the AEAT</div>
          <h2 className={styles.sectionTitle}>Coming forward costs<br />less than <em>being found</em></h2>
          <p className={styles.sectionDesc}>
            Most owners who have never filed did not decide not to. Nobody told them at the
            notary’s office, or the person who told them described the rental return and not the
            imputed income one. The tax agency has four years to look back, and it now has the
            data to do so: the cadastre, the Land Registry, Spanish bank accounts, utility
            contracts and the reports that booking platforms file under the DAC7 rules.
          </p>
          <p className={styles.sectionDesc}>
            The gap between voluntary disclosure and being caught is the whole point. File first
            and the cost is a surcharge with no penalty. Wait for the letter and the surcharge is
            replaced by a fine that starts at half the tax.
          </p>
          <Link href="#enquiry" className="btn-gold" style={{ display: 'inline-block', marginTop: '16px' }}>
            Ask us to review your years
          </Link>
        </div>
        <div className={styles.alertBox}>
          <div className={styles.alertBoxTitle}>If you file late, before they contact you</div>
          <div className={styles.alertBoxItem}>
            <strong>1%</strong>
            <span>Surcharge if you file within the first month after the deadline</span>
          </div>
          <div className={styles.alertBoxItem}>
            <strong>+1%</strong>
            <span>For each further complete month of delay, up to twelve months</span>
          </div>
          <div className={styles.alertBoxItem}>
            <strong>15%</strong>
            <span>Once more than a year has passed, plus late payment interest</span>
          </div>
          <div className={styles.alertBoxItem}>
            <strong>−25%</strong>
            <span>The surcharge itself is reduced by a quarter if you pay on time and do not appeal</span>
          </div>
          <div className={styles.alertBoxNote}>
            No penalty applies to a voluntary late filing. If the tax agency writes to you first,
            that protection is gone and the fine starts at 50% of the tax due.
          </div>
        </div>
      </section>

      {/* PROCESO */}
      <section className={styles.process}>
        <div className={styles.eyebrowDark}>How we work</div>
        <h2 className={styles.sectionTitle}>Four steps, and<br />no trip to <em>Spain</em></h2>
        <div className={styles.stepsGrid}>
          {steps.map(s => (
            <div key={s.n} className={styles.stepCard}>
              <div className={styles.stepNum}>{s.n}</div>
              <h3 className={styles.stepTitle}>{s.t}</h3>
              <p className={styles.stepDesc}>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faqSection}>
        <div className={styles.eyebrowDark}>Questions owners ask us</div>
        <h2 className={styles.sectionTitle}>Before you <em>get in touch</em></h2>
        <div className={styles.faqGrid}>
          {faqs.map((f, i) => (
            <details key={i} className={styles.faqItem}>
              <summary className={styles.faqQ}>{f.q}<span className={styles.faqIcon}>+</span></summary>
              <div className={styles.faqA}>{f.a}</div>
            </details>
          ))}
        </div>
      </section>

      {/* FORMULARIO */}
      <section className={styles.enquiry} id="enquiry">
        <div className={styles.enquiryIntro}>
          <div className={styles.eyebrow}>Talk to a Spanish tax lawyer</div>
          <h2 className={styles.sectionTitleLight}>Send us the<br />basics</h2>
          <p>
            We are a Spanish tax law firm with offices in Madrid and Castellón, acting for owners
            resident across Europe and beyond. You deal with the lawyer handling your file, in
            English, from the first email.
          </p>
          <div className={styles.promises}>
            {[
              'First reply within one working day',
              'Fixed fee agreed before any work starts',
              'We act under a power of attorney — no travel needed',
              'Tax litigation and dealings with the AEAT are what we do daily',
            ].map(p => (
              <div key={p} className={styles.promise}><div className={styles.dot}></div>{p}</div>
            ))}
          </div>
          <div className={styles.directLinks}>
            <TrackedLink ubicacion="landing_en_form" href="tel:+34614149465" className={styles.directLink}>
              Call <strong>+34 614 149 465</strong>
            </TrackedLink>
            <TrackedLink ubicacion="landing_en_form" href="https://wa.me/34614149465" className={styles.directLink} target="_blank" rel="noopener noreferrer">
              WhatsApp <strong>+34 614 149 465</strong>
            </TrackedLink>
            <TrackedLink ubicacion="landing_en_form" href="mailto:correo@irmabogados.es" className={styles.directLink}>
              Email <strong>correo@irmabogados.es</strong>
            </TrackedLink>
          </div>
        </div>
        <EnquiryForm />
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.ctaLeft}>
          <h2 className={styles.ctaTitle}>Not sure how many years<br />you owe?</h2>
          <p className={styles.ctaDesc}>
            Send us the deeds and the last IBI receipt. We will tell you what is outstanding, what
            it will cost to put right, and whether anything can be reclaimed — before you commit
            to anything.
          </p>
        </div>
        <div className={styles.ctaBtns}>
          <Link href="#enquiry" className="btn-navy">Request a review</Link>
          <TrackedLink ubicacion="landing_en_cta" href="tel:+34614149465" className="btn-outline-navy">
            +34 614 149 465
          </TrackedLink>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className={styles.disclaimer}>
        <p>
          This page is general information about Spanish non-resident income tax, current at
          August 2026, and is not tax or legal advice for a particular case. Rates, thresholds and
          filing deadlines change, and the treatment of a specific property depends on its facts.
          IRM Abogados is a Spanish law firm with offices in Madrid and Castellón de la Plana.
        </p>
      </section>
    </div>
  )
}
