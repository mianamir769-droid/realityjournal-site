// Ported from Elora theme: src/views/partials/header-2.html
//
// This is the in-flow header (`position-relative`), used by the theme on
// every page that isn't the homepage. Header1 is `position-absolute` so it
// can overlay the homepage's hero background - using it on an interior page
// makes the navbar float on top of the first section instead of sitting
// above it (breadcrumb colliding with the nav links).
//
// The source partial opens with @@include("topbar.html"), which is skipped
// here: that topbar's only content is a hardcoded date ("Friday, 16 October
// 2025") plus two demo links, and a static export would freeze whatever
// date it was built on. Better no topbar than a wrong one.
//
// Like header-1, the source partial renders popup-search.html and
// sidebar.html immediately after </header>, so those come along too.
import MainMenu from "./MainMenu";
import SiteLogo from "@/components/SiteLogo";
import PopupSearch from "./PopupSearch";
import Sidebar from "./Sidebar";

export default function Header2() {
  return (
    <>
      {/* Navbar */}
      <header>
        <div className="position-relative">
          <nav className="navbar">
            <div className="container d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-5">
                <a className="navbar-brand" href="/">
                  <SiteLogo />
                </a>
                <div className="navbar-collapse d-none d-lg-block" id="navbarNav">
                  <MainMenu />
                </div>
              </div>
              <div className="group-btn-right d-flex align-items-center">
                <div className="dark-light-mode">
                  <label htmlFor="switch" className="toggle dark-light-switcher">
                    <input type="checkbox" className="input" id="switch" />
                    <div className="icon icon--moon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                        <path
                          fillRule="evenodd"
                          d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <div className="icon icon--sun">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                        <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"></path>
                      </svg>
                    </div>
                  </label>
                </div>
                <div data-bs-toggle="modal" data-bs-target="#popupSearch" className="search-btn fs-7 d-none d-md-flex">
                  <svg className="dark-mode-invert" xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                    <path
                      d="M14.0189 16.1775L18.0174 20.1767C18.2358 20.3833 18.5258 20.5 18.8274 20.5C19.4708 20.4992 20 19.9692 20 19.3258C20 19.025 19.8842 18.735 19.6775 18.5167L15.6782 14.5192C18.2883 11.0958 18.0299 6.18164 14.9048 3.0558L14.899 3.04997L14.6673 2.8183C14.6349 2.78432 14.5985 2.75438 14.5589 2.72913C11.1338 -0.347541 5.85108 -0.240041 2.55511 3.0558C-0.851702 6.46331 -0.851702 11.9966 2.55511 15.4025C5.6819 18.5292 10.5971 18.7883 14.0189 16.1775ZM13.2147 4.74497C15.6732 7.20581 15.6732 11.2533 13.2147 13.7142C10.7538 16.1717 6.70695 16.1717 4.24601 13.7142C1.78674 11.2533 1.78674 7.20581 4.24601 4.74497C6.70695 2.28663 10.7538 2.28663 13.2147 4.74497Z"
                      fill="#0D0D0D"
                    />
                  </svg>
                </div>
                <a href="/#subscribe" className="btn btn-dark btn-sm button-effect-1 d-none d-md-block">
                  Subscribe
                </a>
                <a href="#" className="navbar-toggler d-lg-none d-block">
                  <svg className="dark-mode-invert" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
                    <path
                      d="M6.5 5.19999C6.5 4.48205 7.08206 3.89999 7.8 3.89999H24.7C25.4179 3.89999 26 4.48205 26 5.19999C26 5.91794 25.4179 6.49999 24.7 6.49999H7.8C7.08206 6.49999 6.5 5.91789 6.5 5.19999ZM24.7 11.7H1.3C0.582055 11.7 0 12.2821 0 13C0 13.7179 0.582055 14.3 1.3 14.3H24.7C25.4179 14.3 26 13.7179 26 13C26 12.2821 25.4179 11.7 24.7 11.7ZM24.7 19.5H13C12.2821 19.5 11.7 20.082 11.7 20.8C11.7 21.5179 12.2821 22.1 13 22.1H24.7C25.4179 22.1 26 21.5179 26 20.8C26 20.082 25.4179 19.5 24.7 19.5Z"
                      fill="#0E0E0F"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </nav>
        </div>
      </header>
      <PopupSearch />
      <Sidebar />
    </>
  );
}
