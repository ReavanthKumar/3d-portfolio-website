import { socialImgs } from "../constants";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="flex flex-col justify-center">
          <p>Terms & Conditions</p>
        </div>
        <div className="socials">
          {socialImgs.map((socialImg, index) => (
            <a
              key = {index}
              className="icon"
              href={socialImg.url} // Use the URL from your object
              target="_blank"         // Opens the link in a new tab
              rel="noopener noreferrer" // Security best practice for external links
            >
              <img
                src={socialImg.imgPath}
                alt={`${socialImg.name} social icon`} // More descriptive alt text
              />
            </a>
        ))}
      </div>
        <div className="flex flex-col justify-center">
          <p className="text-center md:text-end">
            © {new Date().getFullYear()} Reavanth. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;