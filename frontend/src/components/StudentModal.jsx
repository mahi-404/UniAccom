import React from 'react';
import { X, CheckCircle2, AlertCircle, UserPlus } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
             <div className="stat-icon" style={{ padding: '0.5rem' }}>
                <UserPlus size={20} />
             </div>
             <h3 className="font-bold text-foreground" style={{ fontSize: '1.25rem' }}>{title}</h3>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={20} />
          </button>
        </div>
        <div className="modal-body custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

const StudentModal = ({ isOpen, onClose, formData, handleInputChange, handleSubmit, statusMsg }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register New Student">
      <form onSubmit={handleSubmit}>
        <section className="form-group">
          <p className="form-section-title">Personal Information</p>
          <div className="form-grid">
            <div>
              <label className="form-label">Banner Number *</label>
              <input required name="banner_number" value={formData.banner_number} onChange={handleInputChange} className="glass-input" placeholder="e.g. B00123456" />
            </div>
            <div>
              <label className="form-label">Category *</label>
              <select name="category" value={formData.category} onChange={handleInputChange} className="glass-select">
                <option>Undergraduate</option>
                <option>Postgraduate</option>
              </select>
            </div>
            <div>
              <label className="form-label">First Name *</label>
              <input required name="first_name" value={formData.first_name} onChange={handleInputChange} className="glass-input" />
            </div>
            <div>
              <label className="form-label">Last Name *</label>
              <input required name="last_name" value={formData.last_name} onChange={handleInputChange} className="glass-input" />
            </div>
            <div>
              <label className="form-label">Date of Birth *</label>
              <input required type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="glass-input" style={{ colorScheme: 'dark' }} />
            </div>
            <div>
              <label className="form-label">Gender *</label>
              <select name="gender" value={formData.gender} onChange={handleInputChange} className="glass-select">
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="form-label">Nationality</label>
              <input name="nationality" value={formData.nationality} onChange={handleInputChange} className="glass-input" placeholder="e.g. British" />
            </div>
            <div>
              <label className="form-label">Special Needs</label>
              <input name="special_needs" value={formData.special_needs} onChange={handleInputChange} className="glass-input" placeholder="e.g. Ground floor required" />
            </div>
          </div>
        </section>

        <section className="form-group" style={{ marginTop: '2rem' }}>
          <p className="form-section-title">Contact Details</p>
          <div className="form-grid">
            <div>
              <label className="form-label">Email Address *</label>
              <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="glass-input" placeholder="e.g. student@uni.edu" />
            </div>
            <div>
              <label className="form-label">Phone Number</label>
              <input name="phone" value={formData.phone} onChange={handleInputChange} className="glass-input" placeholder="e.g. +44 7700 900000" />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Home Address</label>
              <input name="address" value={formData.address} onChange={handleInputChange} className="glass-input" placeholder="e.g. 123 University Road, London" />
            </div>
          </div>
        </section>

        <section className="form-group" style={{ marginTop: '2rem' }}>
          <p className="form-section-title">Academic & Housing Information</p>
          <div className="form-grid">
            <div>
              <label className="form-label">Major Program</label>
              <input name="major" value={formData.major} onChange={handleInputChange} className="glass-input" placeholder="e.g. Computer Science" />
            </div>
            <div>
              <label className="form-label">Minor Program</label>
              <input name="minor" value={formData.minor} onChange={handleInputChange} className="glass-input" placeholder="e.g. Mathematics" />
            </div>
            <div>
              <label className="form-label">Course Number</label>
              <input name="course_number" value={formData.course_number} onChange={handleInputChange} className="glass-input" placeholder="e.g. C101" />
            </div>
            <div>
              <label className="form-label">Housing Status *</label>
              <select name="status" value={formData.status} onChange={handleInputChange} className="glass-select">
                <option value="waiting">Waiting List</option>
                <option value="placed">Placed in Room</option>
              </select>
            </div>
          </div>
        </section>

        {statusMsg.text && (
          <div className={`alert-box animate-fade ${statusMsg.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: '1.5rem', marginTop: '1.5rem' }}>
            {statusMsg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid hsla(var(--glass-border), 0.3)' }}>
          <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
          <button type="submit" className="btn-primary">
            Proceed Registration
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default StudentModal;
