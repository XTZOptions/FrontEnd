import Head from 'next/head'
import Link from 'next/link';


export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Tezos Options Platform</title>
       
        
        <link rel="stylesheet" type="text/css" href="/landing/css/style.css" />
        <link rel="stylesheet" type="text/css" href="/landing/css/responsive.css" />
        <link rel="stylesheet" type="text/css" href="/landing/css/color-one.css" />

        <script src="/landing/vendor/jquery.2.2.3.min.js"></script>
	
		    <script src="/landing/vendor/popper.js/popper.min.js"></script>
		
		    <script src="/landing/vendor/bootstrap/js/bootstrap.min.js"></script>

			  <script src="/landing/vendor/jquery-easing/jquery.easing.min.js"></script>
		
		    <script src="/landing/vendor/language-switcher/jquery.polyglot.language.switcher.js"></script>
	
	  	  <script src="/landing/vendor/jquery.appear.js"></script>
		    <script src="/landing/vendor/jquery.countTo.js"></script>
		    <script src="/landing/vendor/fancybox/dist/jquery.fancybox.min.js"></script>
		    <script src="/landing/vendor/owl-carousel/owl.carousel.min.js"></script>
		    <script src="/landing/vendor/aos-next/dist/aos.js"></script>

		    <script src="/landing/js/theme.js"></script>
      </Head>
      <div className="main-page-wrapper">
  
  <div id="loader-wrapper">
    <div id="loader" />
  </div>
  <div className="html-top-content">
    <div className="theme-top-section">
      <header className="theme-main-menu">
        <div className="container">
          <div className="menu-wrapper clearfix">
            <div className="logo">
              <a href="index.html">
                <img src="images/logo/logo.png" alt="Logo" />
              </a>
            </div>
          
            <nav className="navbar navbar-expand-lg" id="mega-menu-holder">
              <div className="container">
                <button
                  className="navbar-toggler"
                  type="button"
                  data-toggle="collapse"
                  data-target="#navbarResponsive"
                  aria-controls="navbarResponsive"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <i className="fa fa-bars" aria-hidden="true" />
                </button>
                <div className="collapse navbar-collapse" id="navbarResponsive">
                  <ul className="navbar-nav">
                    <li className="nav-item">
                      <a
                        className="nav-link js-scroll-trigger"
                        href="#features"
                      >
                        Feature
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link js-scroll-trigger"
                        href="#services"
                      >
                        Services
                      </a>
                    </li>
                   
                  </ul>
                </div>
              </div>
            </nav>
          </div>{" "}
         
        </div>{" "}
        
      </header>{" "}
     
      <div id="theme-banner" className="theme-banner-one">
        
        <img src="images/icon/1.png"  className="icon-shape-one" />
        <img src="images/icon/2.png"  className="icon-shape-two" />
        <img src="images/icon/3.png"  className="icon-shape-three" />
        <div className="round-shape-one" />
        <div className="round-shape-two">
          <img src="images/icon/4.png"  />
        </div>
        <div className="round-shape-three" />
        <div className="container">
          <div className="main-text-wrapper">
            <h1>
              Populer Crypto <br />
              Revolution is begin <br />
              from here.
            </h1>
            <p>A revolutionary digital coin system for future money.</p>
            <ul className="button-group clearfix">
              <li>
                <div className="btn-group">
                  <Link href="/dashboard/">
                  <a href="#" className="download-button">
                    Visit DashBoard
                  </a>
                  </Link>
                        
                </div>
              </li>
            </ul>
          </div>
        </div>
       
      </div>{" "}
      
    </div>{" "}
    
    <div className="our-features-one" id="features">
      <div className="container">
        <div className="theme-title">
          <h2>
            The Largest &amp; Best <span>Digital Currency</span> <br />
            for Your Future money
          </h2>
        </div>
        <div className="row">
          <div className="col-md-4 col-xs-12">
            <div className="single-feature">
              <div className="icon-box">
                <img src="images/icon/5.png"  className="primary-icon" />
              </div>
              <h3>cryto Is Untraceable</h3>
              <p>
                Sending and receiving addresses as well as transacted amounts.
              </p>
            </div>{" "}
            {/* /.single-feature */}
          </div>{" "}
          {/* /.col- */}
          <div className="col-md-4 col-xs-12">
            <div className="single-feature border-fix">
              <div className="icon-box">
                <img src="images/icon/6.png"  className="primary-icon" />
              </div>
              <h3>Autonomy self-rule.</h3>
              <p>
                cryto has striven to solve blockchain governance, transparency
                brings{" "}
              </p>
            </div>{" "}
            {/* /.single-feature */}
          </div>{" "}
          {/* /.col- */}
          <div className="col-md-4 col-xs-12">
            <div className="single-feature">
              <div className="icon-box">
                <img src="images/icon/7.png"  className="primary-icon" />
              </div>
              <h3>Transparency &amp; Stability</h3>
              <p>
                In crypto, transparency brings trust &amp; old strong
                transparency
              </p>
            </div>{" "}
            {/* /.single-feature */}
          </div>{" "}
          {/* /.col- */}
        </div>{" "}
        {/* /.row */}
      </div>{" "}
      {/* /.container */}
    </div>{" "}
    {/* /.our-features */}
    <div className="our-feature-two" id="services">
      <div className="container">
        <div className="row single-block">
          <div className="col-lg-6">
            <div className="text">
              <div className="number">01</div>
              <h2 className="title">
                <span>Decentralized</span> Minning Our core focus.
              </h2>
              <p>
                Mining should be fair &amp; easy! We do not allow ASICs on our
                network. The development team is wholy commited to with keeping
                it that way.
              </p>
              <a href="#" className="learn-more">
                Learn More <i className="flaticon-right-thin" />
              </a>
            </div>{" "}
            {/* /.text */}
          </div>{" "}
          {/* /.col- */}
          <div className="col-lg-6 img-box">
            <div>
              <img src="images/shape/1.png"  />
            </div>
          </div>
        </div>{" "}
        {/* /.row */}
        <div className="row single-block">
          <div className="col-lg-6 order-lg-last">
            <div className="text">
              <div className="number">02</div>
              <h2 className="title">
                <span>Popular</span> Wallet Integration.
              </h2>
              <p>
                Mining should be fair &amp; easy! We do not allow ASICs on our
                network. The development team is wholy commited to with keeping
                it that way.
              </p>
              <a href="#" className="learn-more">
                Learn More <i className="flaticon-right-thin" />
              </a>
            </div>
          
          </div>
          
          <div className="col-lg-6 order-lg-first img-box">
            <div>
              <img src="images/shape/1.1.png"  />
            </div>
          </div>
        </div>
        
        <div className="row single-block">
          <div className="col-lg-6">
            <div className="text">
              <div className="number">03</div>
              <h2 className="title">
                <span>Upholding</span> Confidentialit &amp; Strong Security.
              </h2>
              <p>
                Mining should be fair &amp; easy! We do not allow ASICs on our
                network. The development team is wholy commited to with keeping
                it that way.
              </p>
              <a href="#" className="learn-more">
                Learn More <i className="flaticon-right-thin" />
              </a>
            </div>{" "}
            {/* /.text */}
          </div>{" "}
          {/* /.col- */}
          <div className="col-lg-6 img-box">
            <div>
              <img src="images/shape/2.png"  />
            </div>
          </div>
        </div>{" "}
        {/* /.row */}
      </div>{" "}
      {/* /.container */}
    </div>{" "}
    {/* /.our-feature-two */}
    <div className="theme-counter">
      <div className="container">
        <div className="bg-image">
          <div className="row theme-title">
            <div className="col-lg-6 order-lg-last">
              <h2>
                <span>Fastest</span> Growing Global Netwark.
              </h2>
            </div>
            <div className="col-lg-6 order-lg-first">
              <p>
                We’r the fastest growing digital money that with strong
                community &amp; security. Check our info with some number.
              </p>
            </div>
          </div>
          <div className="counter-wrapper">
            <div className="row">
              <div className="col-sm-4">
                <h2 className="number">
                  <span
                    className="timer"
                    data-from={0}
                    data-to={120}
                    data-speed={1200}
                    data-refresh-interval={5}
                  >
                    0
                  </span>
                  K
                </h2>
                <p>Global Customer</p>
              </div>
              <div className="col-sm-4">
                <h2 className="number">
                  <span
                    className="timer"
                    data-from={0}
                    data-to={36}
                    data-speed={1200}
                    data-refresh-interval={5}
                  >
                    0
                  </span>
                  Y
                </h2>
                <p>Years Expereince</p>
              </div>
              <div className="col-sm-4">
                <h2 className="number">
                  <span
                    className="timer"
                    data-from={0}
                    data-to={7}
                    data-speed={1200}
                    data-refresh-interval={5}
                  >
                    0
                  </span>
                  B
                </h2>
                <p>Current Stock</p>
              </div>
            </div>
          </div>
        </div>   
      </div>
    </div>
  </div>
  
  <button className="scroll-top tran3s color-one-bg">
    <i className="fa fa-long-arrow-up" aria-hidden="true" />
  </button>

</div>;

      

    </div>
  )
}
