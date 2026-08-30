// Ported from Elora theme: src/views/partials/preloader.html
export default function Preloader() {
  return (
    <>
      {/*Preloader*/}
      <div id="preloader">
        <div id="loader" className="loader">
          <div className="loader-container">
            {/* <div className="loader-icon"><img src="/assets/imgs/template/logo/logo.svg" alt="Preloader" /></div> */}
            <div className="loader-inner">
              <div className="loader-2"></div>
            </div>
          </div>
        </div>
      </div>
      {/*Preloader-end */}
    </>
  );
}
