import React, { useEffect, useRef, useState } from "react";
import { Link, Head } from '@inertiajs/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

// import '../../css/bootstrap5.3.0.min.css';
import '../../css/bootstrap-icons.min.css';
import '../../css/style.css';

// Images (place your images in resources/img)
import logo from '../../img/logo.jpg';
import heroImage from '../../img/PersonalLoansforLife1St.jpg';
import about1 from '../../img/about1.jpg';
import about2 from '../../img/about2.jpg';
import loan1 from '../../img/Ourloansolution1.jpg';
import loan2 from '../../img/Ourloansolution2.jpg';
import loan3 from '../../img/Ourloansolution3.jpg';
import loan4 from '../../img/Ourloansolution4.jpg';
import loan5 from '../../img/Ourloansolution5.jpg';
import footerBg from '../../img/png image.jpg';



export default function Home({ auth, laravelVersion, phpVersion }) {
  const formRef = useRef(null);
  const [formState, setFormState] = useState({
    amount: "",
    tenure: "",
    repaymentPlan: "",
    name: "",
    phone: "",
    email: "",
    service: "",
  });
  const [respMsg, setRespMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  // scroll listener for scroll-to-top button
  useEffect(() => {
    function onScroll() {
      const scrolled = window.scrollY > 200;
      setShowScroll(scrolled);
    }
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Loan calculation logic (shared by submit & "Check Your Loan Now")
  function calculateRepayment(amountVal, tenureDaysVal) {
    const amount = Number(amountVal);
    const tenureDays = Number(tenureDaysVal);
    if (!amount || !tenureDays) return "";

    const lockedEMIValues = {
      200: { minDays: 5, lockedEMI: 44.7 },
      250: { minDays: 5, lockedEMI: 55.88 },
      300: { minDays: 5, lockedEMI: 67.05 },
      350: { minDays: 8, lockedEMI: 51.98 },
      400: { minDays: 8, lockedEMI: 59.4 },
      450: { minDays: 8, lockedEMI: 66.83 },
      500: { minDays: 8, lockedEMI: 74.25 },
      550: { minDays: 26, lockedEMI: 34.08 },
      600: { minDays: 26, lockedEMI: 37.18 },
      650: { minDays: 26, lockedEMI: 40.28 },
      700: { minDays: 26, lockedEMI: 43.37 },
      750: { minDays: 26, lockedEMI: 46.47 },
      800: { minDays: 26, lockedEMI: 49.57 },
      850: { minDays: 26, lockedEMI: 52.67 },
      900: { minDays: 26, lockedEMI: 55.77 },
      950: { minDays: 26, lockedEMI: 58.86 }
    };

    if (lockedEMIValues[amount] && tenureDays >= lockedEMIValues[amount].minDays) {
      return lockedEMIValues[amount].lockedEMI.toFixed(2);
    }

    function roundTwo(num) {
       return Math.round(num * 100 + 0.0000001) / 100;
    }
    const interestRate = 2.35;
 
    const emi = ((amount * (interestRate / 100) * tenureDays) + amount) / tenureDays;
    const result = roundTwo(emi);
 
    return result.toFixed(2);
  }

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));

    // update repaymentPlan live when amount/tenure change
    if (name === 'amount' || name === 'tenure') {
      const amountVal = name === 'amount' ? value : formState.amount;
      const tenureVal = name === 'tenure' ? value : formState.tenure;
      const calc = calculateRepayment(amountVal, tenureVal);
      setFormState(prev => ({ ...prev, repaymentPlan: calc }));
    }
  };

  // handle form submit (keeps original behavior: prevent reload and calculate)
  const handleSubmit = (e) => {
    e.preventDefault();
    const formEl = formRef.current;
    if (!formEl.checkValidity()) {
      formEl.reportValidity();
      return;
    }

    const repayment = calculateRepayment(formState.amount, formState.tenure);
    setFormState(prev => ({ ...prev, repaymentPlan: repayment }));
    //(do not auto-send here — "Check Your Loan Now" handles sending in original)
  };

  // handle Check Your Loan Now (calculates and sends AJAX POST via fetch)
  const handleCheckLoan = async (e) => {
    e.preventDefault();
    const formEl = formRef.current;
    if (!formEl.checkValidity()) {
      formEl.reportValidity();
      return;
    }

    const repayment = calculateRepayment(formState.amount, formState.tenure);
    setFormState(prev => ({ ...prev, repaymentPlan: repayment }));

    // Prepare FormData from the form element (keeps compatibility with your send_loan_mail.php)
    const fd = new FormData(formEl);

    // helper to read cookie value
    const getCookie = (name) => {
      const match = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
      return match ? decodeURIComponent(match.pop()) : null;
    };

    // Try to obtain CSRF token (from meta tag or Laravel's XSRF-TOKEN cookie)
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || getCookie('XSRF-TOKEN');

    // Append token to FormData for compatibility and also send header if available
    // if (csrfToken) {
    //   fd.append('_token', csrfToken);
    // }

    try {
        setSending(true);
        // POST to new API endpoint (include credentials so cookies are sent)
        const res = await fetch('/api/send-loan-mail', {
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        },
        body: fd
    });

      let respBody;
      try {
        respBody = await res.json();
      } catch (parseErr) {
        respBody = await res.text();
      }
      console.log('/api/send-loan-mail/ response:', respBody);

      if (!res.ok) {
        const errMsg = (respBody && (respBody.message || respBody)) || 'Error sending inquiry. Please try again.';
        setRespMsg(errMsg);
      } else {
        const successMsg = (respBody && (respBody.message || respBody)) || 'Your loan inquiry has been sent successfully!';
        setRespMsg(successMsg);
      }
      setTimeout(() => setRespMsg(''), 3000);
    } catch (err) {
      console.error('API error:', err);
      setRespMsg('Error sending inquiry. Please try again.');
      setTimeout(() => setRespMsg(''), 3000);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-vh-100" data-bs-spy="scroll" data-bs-target=".navbar" data-bs-offset="70">

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg fixed-top">
        <div className="container">
          <a className="navbar-brand" href="./"><img src={logo} alt="Agro Advance Aben" style={{height: '100px'}}/></a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"><span
            className="navbar-toggler-icon"></span></button>
          <div className="navbar-collapse justify-content-center" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item"><a className="nav-link active" href="#home">Home</a></li>
              <li className="nav-item"><a className="nav-link" href="#about">About</a></li>
              <li className="nav-item"><a className="nav-link" href="#why">Why Us</a></li>
              <li className="nav-item"><a className="nav-link" href="#testimonials">Reviews</a></li>
              <li className="nav-item"><a className="nav-link" href="#contact">Contact</a></li>
            </ul>
          </div>
          <div className="d-flex align-items-center">
            <button className="btn btn-call">Download Brochure</button>
            {/* <button className="btn btn-login">Login</button> */}
            {auth.user ? (
                <Link
                    href={route('dashboard')}
                    // className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                >                    
                    <button className="btn btn-login">Dashboard</button>
                </Link>
            ) : (
                <>
                    <Link
                        href={route('login')}
                        // className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                    >
                        <button className="btn btn-login">Log in</button>
                    </Link>

                    <Link
                        href={route('register')}
                        // className="ms-4 font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                    >
                        <button className="btn btn-login">Register</button>
                    </Link>
                </>
            )}
          </div>
        </div>
      </nav>

      {/* Home Section */}
      <section id="home" className="py-5" style={{paddingTop: '100px'}}>
        <div className="container">
          <div className="home-wrapper d-flex flex-wrap align-items-start">
            <div className="home-left me-4" style={{flex: '1 1 420px'}}>
              <h1 className="mt-2">Personal Loans for Life’s <br/> Everyday Needs.</h1>
              <p>
                Enjoy flexible, transparent, and quick loan options that help you manage expenses,<br/>
                handle emergencies or make your plans a reality.
                <br/><br/><b>Achieve Your Financial Goal</b><br/>
              </p>
              <a href="#contact" className="btn text-light" style={{backgroundColor: 'lightred', color: 'white'}}>Apply for Loan</a>
            </div>

            <div className="home-right loan-box" >
            <h4 className="loan-heading">How much do you need</h4>

              <form id="loanForm" ref={formRef} onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="amount" className="form-label">Amount <span style={{color:'red'}}>*</span></label>
                    <input type="number" id="amount" name="amount" value={formState.amount} onChange={handleChange}
                      className="form-control" placeholder="Enter Amount" required />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="tenure" className="form-label">Tenure (Days) <span style={{color:'red'}}>*</span></label>
                    <input type="number" id="tenure" name="tenure" value={formState.tenure} onChange={handleChange}
                      className="form-control" placeholder="Enter Tenure (Days)" required />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="repaymentPlan" className="form-label">Repayment Plan</label>
                  <input type="text" id="repaymentPlan" name="repaymentPlan" className="form-control"
                    placeholder="Repayment Amount" readOnly value={formState.repaymentPlan} />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="name" className="form-label">Name <span style={{color:'red'}}>*</span></label>
                    <input type="text" id="name" name="name" value={formState.name} onChange={handleChange}
                      className="form-control" placeholder="Enter Your Name" required />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="phone" className="form-label">Phone <span style={{color:'red'}}>*</span></label>
                    <input type="tel" id="phone" name="phone" value={formState.phone} onChange={handleChange}
                      className="form-control" placeholder="Phone Number" required pattern="[0-9]{8}" maxLength={8} title="Please enter 8 digits" />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email <span style={{color:'red'}}>*</span></label>
                    <input type="email" id="email" name="email" value={formState.email} onChange={handleChange}
                      className="form-control" placeholder="Enter Email Address" required />
                  </div>
                </div>

                <button type="button" id="checkLoan" className="btn btn-success btn-check-loan" onClick={handleCheckLoan} disabled={sending}>
                  {sending ? 'Sending...' : 'Check Your Loan Now!'}
                </button>

                <div className="resp mt-2">{respMsg}</div>
              </form>

            </div>
          </div>
        </div>

        {/* Quick Loan Bar */}
        <div className="quick-loan-section mt-5 d-flex align-items-center">
          <div className="quick-image me-3">
            <img src={heroImage} alt="Agro hero footer" style={{maxWidth: '390px'}}/>
          </div>
          <div className="quick-items d-flex gap-3">
            {/* <div className="quick-item"><i className="bi bi-stopwatch"></i><span>Quick Loans.<br/>Easy Approvals.</span></div>
            <div className="quick-item"><i className="bi bi-hand-thumbs-up"></i><span>Fast Cash.<br/>Zero Hassle.</span></div>
            <div className="quick-item"><i className="bi bi-cash-stack"></i><span>Apply Today.<br/>Approved Tomorrow.</span></div> */}
<div className="quick-items d-flex gap-5">

  <div className="quick-item d-flex align-items-center gap-3">
    {/* <!-- Stopwatch Icon --> */}
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F1E600" stroke-width="2">
      <circle cx="12" cy="13" r="9"></circle>
      <line x1="12" y1="13" x2="12" y2="8"></line>
      <line x1="12" y1="13" x2="16" y2="13"></line>
      <rect x="10" y="4" width="4" height="2" fill="#F1E600"></rect>
    </svg>
    <span>Quick Loans.<br/>Easy Approvals.</span>
  </div>

  <div className="quick-item d-flex align-items-center gap-3">
    {/* <!-- Thumbs Up Icon --> */}
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#F1E600" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M7 10v12H3V10h4z"></path>
      <path d="M7 10l4-7 1 7h7a2 2 0 0 1 2 2l-1 7a2 2 0 0 1-2 2H7"></path>
    </svg>
    <span>Fast Cash.<br/>Zero Hassle.</span>
  </div>

  <div className="quick-item d-flex align-items-center gap-3">
    {/* <!-- Money Icon --> */}
    <svg width="40" height="32" viewBox="0 0 24 24" fill="none" stroke="#F1E600" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
      <circle cx="12" cy="12" r="3"></circle>
      <line x1="2" y1="12" x2="5" y2="12"></line>
      <line x1="19" y1="12" x2="22" y2="12"></line>
    </svg>
    <span>Apply Today.<br/>Approved Tomorrow.</span>
  </div>

</div>
     
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-5 bg-white">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-md-6 about-text-shift">
              <b> <small className="text-uppercase" style={{color:'#585858'}}>About Our Company</small></b>
              <h2 className="fw-bold mb-4" style={{color:'green'}}>Empowering Lives Through<br/> Smart Finance</h2>
              <p className="text-muted mb-3">Agro Advance Aben Limited is a trusted Papua New Guinea–based consumer finance <br/>company,
                dedicated to helping individuals meet personal and family financial needs.
              </p>
              <p className="text-muted mb-4">From school fees to medical expenses, we provide quick, reliable, and flexible loan<br/> solutions
                that make access to finance simple and stress-free for everyone.
              </p>
              <a href="#contact" className="btn px-4 py-2 text-light" style={{backgroundColor:'#d71920', color:'#fff', border:'none', borderRadius:6, textDecoration:'none'}}>Apply for Loan</a>
            </div>

            <div className="col-md-6 text-center position-relative">
              <div className="about-images">
                <img src={about1} alt="Agro about 1" className="img-fluid main-img" style={{maxWidth: '530px'}}/>
                <img src={about2} alt="Agro about 2" className="img-fluid overlay-img shadow-lg" style={{width:'45%', height:326}}/>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Loan Solutions Section */}
      <section className="loan-services spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title noBgSection">
                <h2>Our Loan Solutions</h2>
                <p>Flexible financing options designed to meet your every need.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid">
          <div className="loan__services__list d-flex flex-wrap">
            <div className="loan__services__item" style={{backgroundImage:`url(${loan1})`, backgroundSize:'cover', backgroundPosition:'center'}}>
              <div className="loan__services__item__text">
                <h4> Personal Loan</h4>
                <p>Secure,quick financing for government employees covering immediate personal needs,emergencies,or family commitments.</p>
                <a href="#">Find Out More</a>
              </div>
            </div>

            <div className="loan__services__item" style={{backgroundImage:`url(${loan2})`, backgroundSize:'cover', backgroundPosition:'center'}}>
              <div className="loan__services__item__text">
                <h4> Business Loan</h4>
                <p>Capital to support entrepreneurial ventures or side businesses, leveraging the stability of a government salary for reliable repayment.</p>
                <a href="#">Find Out More</a>
              </div>
            </div>

            <div className="loan__services__item" style={{backgroundImage:`url(${loan3})`, backgroundSize:'cover', backgroundPosition:'center'}}>
              <div className="loan__services__item__text">
                <h4>Education Loan</h4>
                <br/>
                <p>Dedicated funding to ensure dependents of government employees access high-quality education without financial strain.</p>
                <a href="#">Find Out More</a>
              </div>
            </div>

            <div className="loan__services__item" style={{backgroundImage:`url(${loan4})`, backgroundSize:'cover', backgroundPosition:'center'}}>
              <div className="loan__services__item__text">
                <h4> Commercial Loan</h4>
                <br/>
                <p>High-value lending secured by the employee's stable income, typically used for significant asset purchases or investment projects.</p>
                <a href="#">Find Out More</a>
              </div>
            </div>

            <div className="loan__services__item" style={{backgroundImage:`url(${loan5})`, backgroundSize:'cover', backgroundPosition:'center'}}>
              <div className="loan__services__item__text">
                <h4> Health Loan</h4>
                <br/>
                <p>Essential financial support for unexpected or planned medical expenses and treatments for the employee or their family.</p>
                <a href="#">Find Out More</a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why" className="py-5 bg-white">
        <div className="container text-center">
          <h2 className="fw-bold mb-2" style={{color:'#008037'}}>Why Choose Us</h2>
          <p className="text-muted mb-5">Trusted financial support that puts your needs first.</p>

          <div className="row g-4">
            {[{
              icon: 'bi-lightning-charge-fill',
              title: 'Quick Approvals',
              text: 'Get your loan approved in the shortest possible time with our simplified process.'
            },{
              icon: 'bi-shield-lock-fill',
              title: 'Easy Access',
              text: 'Enjoy hassle-free access to funds whenever you need them most.'
            },{
              icon: 'bi-check2-circle',
              title: 'Flexible Terms',
              text: 'Choose repayment plans that fit your lifestyle and financial capacity.'
            },{
              icon: 'bi-cash-stack',
              title: 'Transparent Process',
              text: 'No hidden fees or surprises — just clear, honest communication.'
            },{
              icon: 'bi-person-check-fill',
              title: 'Customer Focused',
              text: 'We prioritize your goals and provide solutions that truly make a difference.'
            },{
              icon: 'bi-calendar-check-fill',
              title: 'Local Expertise',
              text: 'Proudly PNG-based, we understand your community and financial needs better.'
            }].map((c, i) => (
              <div className="col-md-4" key={i}>
                <div className="why-card p-4 shadow-sm bg-light rounded h-100">
                  <div className="icon-circle mx-auto mb-3">
                    <span className={`bi ${c.icon} fs-4 text-white`}></span>
                  </div>
                  <h5 className="fw-semibold">{c.title}</h5>
                  <p className="text-muted">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials (uses Bootstrap Carousel) */}
      <section id="testimonials" className="testimonial py-5" style={{backgroundColor:'#1E2A5A'}}>
        <div className="container">
          <h2 className="text-center fw-bold mb-2" style={{color:'rgba(80, 196, 34, 1)'}}>What Customers Are Saying</h2>
          <p className="text-center mb-4" style={{color:'white'}}>Hear from people across Papua New Guinea who’ve trusted Agro Advance Aben Limited for their financial needs.</p>

          <div id="testimonialCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="4000">
            <div className="carousel-inner">
              <div className="carousel-item active">
                <div className="row justify-content-center g-4">
                  <div className="col-md-4">
                    <div className="testimonial-card p-4 bg-white rounded shadow-sm text-center h-100">
                      <h6 className="fw-bold mb-1">Mary K</h6>
                      <p className="text-muted small">As a school teacher, I often face delays with pay. Agro Advance Aben helped me cover school fees on time, so grateful</p>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="testimonial-card p-4 bg-white rounded shadow-sm text-center h-100">
                      <h6 className="fw-bold mb-1">Lucy M</h6>
                      <p className="text-muted small">Getting a loan was simple and fast. The staff understood my situation and made the process stress-free.</p>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="testimonial-card p-4 bg-white rounded shadow-sm text-center h-100">
                      <h6 className="fw-bold mb-1">Maria A</h6>
                      <p className="text-muted small">I was able to manage family medical costs easily with their quick approval. Really appreciate their support.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="carousel-item">
                <div className="row justify-content-center g-4">
                  <div className="col-md-4">
                    <div className="testimonial-card p-4 bg-white rounded shadow-sm text-center h-100">
                      <h6 className="fw-bold mb-1">Joseph P</h6>
                      <p className="text-muted small">Very professional team. They explained everything clearly and made repayment terms easy for my salary schedule.</p>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="testimonial-card p-4 bg-white rounded shadow-sm text-center h-100">
                      <h6 className="fw-bold mb-1">Ruth N</h6>
                      <p className="text-muted small">I’ve taken two loans already — both approved quickly and with no hidden costs. Truly a partner for government employees.</p>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="testimonial-card p-4 bg-white rounded shadow-sm text-center h-100">
                      <h6 className="fw-bold mb-1">Peter L</h6>
                      <p className="text-muted small">Finally, a finance company that understands teachers’ needs. Friendly service and reliable when it matters most.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button className="carousel-control-prev" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>

            <button className="carousel-control-next" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>

          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-5" style={{backgroundColor:'#002b10', backgroundSize:'cover', color:'#fff'}}>
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-md-5">
              <h3 className="fw-bold mb-3" style={{color: '#fff'}}>Request A Call Back</h3>
              <p className="mb-4 text-light small">Our team is ready to assist you. Share your details, and we’ll reach out to discuss the best loan solution for your needs.</p>
              <a href="#home" className="btn btn-outline-light px-4 py-2 rounded">Contact Us</a>
            </div>

            <div className="col-md-7">
              <form className="row g-3" onSubmit={(e)=>e.preventDefault()}>
                <div className="col-md-6">
                  <input type="text" className="form-control" placeholder="Name" required />
                </div>
                <div className="col-md-6">
                  <input type="email" className="form-control" placeholder="Email" required />
                </div>
                <div className="col-md-6">
                  <input type="tel" className="form-control" placeholder="Phone" required />
                </div>
                <div className="col-md-6">
                  <select className="form-select" required>
                    <option value="">Choose Our Services</option>
                    <option value="1">Personal Loan</option>
                    <option value="2">Business Loan</option>
                    <option value="3">Education Loan</option>
                    <option value="4">Health Loan</option>
                  </select>
                </div>
                <div className="col-12 text-start">
                  <button className="btn" type="submit" style={{backgroundColor:'#d71920', color:'#fff', border:'none'}}>Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
<footer
  className="text-white pt-5"
  style={{
    backgroundImage: `url(${footerBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
  }}
>
  <div className="footer-overlay">

      
    <div className="container pb-4 border-bottom" >
      <div className="row justify-content-between align-items-start g-4">
        <div className="col-md-3">
          <h6 className="text-uppercase mb-3" style={{color:'#69F0AE'}}>Papua New Guinea</h6>
          <p className="small mb-4" style={{color:'#E8F5E9'}}>📍 Avara Annex, Level 7, Brampton St., 
          <br/>
          Port Moresby, Papua New Guinea</p>
        </div>

        <div className="col-md-4 text-md-center">
          <p className="text-uppercase small mb-1" style={{color:'#E8F5E9'}}>Contact Us Now!</p>
          <h4 className="fw-bold" style={{color:'#4CAF50'}}>+675 7211 5122</h4>
        </div>

        <div className="col-md-3 text-md-end">
          <h5 className="fw-bold mb-2" style={{color:'#69F0AE'}}>Agro Advance Aben Limited</h5>
          <p className="small mb-0" style={{color:'#E8F5E9'}}>Finance with Purpose. Supporting farmers and small businesses with affordable loans.</p>
        </div>
      </div>
    </div>

    <div className="container py-4">
      <div className="row g-4">
        <div className="col-md-3">
          <h6 className="fw-bold mb-3" style={{color:'#69F0AE'}}>Services</h6>
          <ul className="list-unstyled small" style={{color:'#E8F5E9'}}>
            <li>Personal Loans</li>
            <li>Business Loans</li>
            <li>Education Loans</li>
            <li>Health Loans</li>
             <li>Commercial Loans</li>

          </ul>
        </div>

        <div className="col-md-3">
          <h6 className="fw-bold mb-3" style={{color:'#69F0AE'}}>Province</h6>
          <ul className="list-unstyled small" style={{color:'#E8F5E9'}}>
            <li>Enga</li>
            <li>Madang</li>
            <li>Morobe</li>
            <li>East New Britain</li>
            <li>National Capital District</li>
          </ul>
        </div>

        <div className="col-md-3">
          <h6 className="fw-bold mb-3" style={{color:'#69F0AE'}}>Open Hours</h6>
          <p className="small mb-1" style={{color:'#E8F5E9'}}>Monday–Friday: 09:00 am – 4:00 pm</p>
        
        </div>

        <div className="col-md-3">
          <h6 className="fw-bold mb-3" style={{color:'#69F0AE'}}>Legal</h6>
          <ul className="list-unstyled small" style={{color:'#E8F5E9'}}>
            <li><a href="#" style={{color:'#E8F5E9', textDecoration:'none'}}>Terms of Use</a></li>
            <li><a href="#" style={{color:'#E8F5E9', textDecoration:'none'}}>Privacy Policy</a></li>
          </ul>

          <div className="social-icons d-flex gap-3 mt-3">
            <a href="#" className="glow-round"><i className="bi bi-facebook"></i></a>
            <a href="#" className="glow-round"><i className="bi bi-instagram"></i></a>
           
            <a href="#" className="glow-round"><i className="bi bi-linkedin"></i></a>
          </div>
        </div>
      </div>

      <div className="text-center mt-4 pt-3 border-top small" style={{borderColor:'#1E5631', color:'#E8F5E9'}}>
        © 2025 Agro Advance Aben. All rights reserved.
      </div>

    </div>
  </div>
</footer>


      {/* Scroll to top button */}
      <button id="scrollToTopBtn" title="Go to top" style={{display: showScroll ? 'block' : 'none', position:'fixed', right:20, bottom:20, zIndex:1000}} onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>↑</button>

    </div>
  );
}
