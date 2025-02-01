export default function Footer() {
    return (
        <div>
            <footer className="bg-dark text-white py-5">
  <div className="container">
    <div className="row">
     
      <div className="col-md-4 mb-3">
        <h5 className="fw-bold text-primary">Collaborative Notes</h5>
        <p>
          The ultimate app for collaborative note-taking. Share, edit, and manage notes in real-time with ease.
        </p>
      </div>

      <div className="col-md-4 mb-3">
        <h5 className="fw-bold text-primary">Quick Links</h5>
        <ul className="list-unstyled">
          <li><a href="#" className="text-white text-decoration-none">Home</a></li>
          <li><a href="#" className="text-white text-decoration-none">Features</a></li>
          <li><a href="#" className="text-white text-decoration-none">Pricing</a></li>
          <li><a href="#" className="text-white text-decoration-none">Contact Us</a></li>
        </ul>
      </div>

     
      <div className="col-md-4 mb-3">
        <h5 className="fw-bold text-primary">Follow Us</h5>
        <div className="d-flex">
          <a href="#" className="text-white me-3"><i className="bi bi-facebook fs-4"></i></a>
          <a href="#" className="text-white me-3"><i className="bi bi-twitter fs-4"></i></a>
          <a href="#" className="text-white me-3"><i className="bi bi-instagram fs-4"></i></a>
          <a href="#" className="text-white me-3"><i className="bi bi-linkedin fs-4"></i></a>
        </div>
      </div>
    </div>

    <div className="text-center mt-4 border-top pt-3">
      <p className="mb-0">&copy; 2025 Collaborative Notes. All Rights Reserved.</p>
    </div>
  </div>
</footer>

        </div>
    );
}