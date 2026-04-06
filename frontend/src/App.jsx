import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart3, Users, Home, FileText, ClipboardCheck, AlertCircle, 
  UserPlus, Building2, Calendar, TrendingDown, DollarSign, FileWarning, Search, UserCircle
} from 'lucide-react';

// Components
import Layout from './components/Layout';
import ReportView from './components/ReportView';
import StudentModal from './components/StudentModal';
import EditRowModal from './components/EditRowModal';

const App = () => {
  const [activeReport, setActiveReport] = useState('hall-managers');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    banner_number: '', first_name: '', last_name: '', email: '', 
    dob: '', gender: 'M', category: 'Undergraduate', major: '', minor: '',
    phone: '', nationality: '', address: '', special_needs: '', status: 'waiting', course_number: ''
  });
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  
  // Row Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editStatus, setEditStatus] = useState({ type: '', text: '' });

  const reports = [
    { id: 'hall-managers', label: 'Hall Managers', icon: Building2, endpoint: '/api/reports/hall-managers', title: 'Residence Hall Managers & Contacts', category: 'Property & Safety' },
    { id: 'student-leases', label: 'Student Leases', icon: FileText, endpoint: '/api/reports/student-leases', title: 'Student Lease Agreements', category: 'Student Management' },
    { id: 'summer-leases', label: 'Summer Leases', icon: Calendar, endpoint: '/api/reports/summer-leases', title: 'Leases overlapping Summer Semester', category: 'Student Management' },
    { id: 'waiting-list', label: 'Waiting List', icon: UserPlus, endpoint: '/api/reports/waiting-list', title: 'Students on Waiting List', category: 'Student Management' },
    { id: 'unsatisfactory-inspections', label: 'Failed Inspections', icon: AlertCircle, endpoint: '/api/reports/unsatisfactory-inspections', title: 'Unsatisfactory Property Inspections', category: 'Property & Safety' },
    { id: 'student-categories', label: 'Student Tally', icon: BarChart3, endpoint: '/api/reports/student-categories', title: 'Student Counts by category', category: 'Analytics' },
    { id: 'missing-next-of-kin', label: 'Missing Kin Info', icon: Users, endpoint: '/api/reports/missing-next-of-kin', title: 'Students without Next-of-Kin details', category: 'Student Management' },
    { id: 'rent-stats', label: 'Rent Statistics', icon: TrendingDown, endpoint: '/api/reports/rent-stats', title: 'Market Rent overview (Halls)', category: 'Analytics' },
    { id: 'hall-places', label: 'Hall Capacity', icon: Home, endpoint: '/api/reports/hall-places', title: 'Available places per Residence Hall', category: 'Property & Safety' },
    { id: 'senior-staff', label: 'Senior Staff', icon: Users, endpoint: '/api/reports/senior-staff', title: 'Residence Staff over 60 years old', category: 'Analytics' },
    { id: 'total-rent', label: 'Total Rent Paid', icon: DollarSign, endpoint: (p) => `/api/reports/total-rent/${p}`, requiresParam: true, paramLabel: 'Banner Number', paramType: 'text', title: 'Total Rent by Student', category: 'Advanced Queries' },
    { id: 'unpaid-invoices', label: 'Unpaid Invoices', icon: FileWarning, endpoint: (p) => `/api/reports/unpaid-invoices?date=${p}`, requiresParam: true, paramLabel: 'Cutoff Date', paramType: 'date', title: 'Unpaid Invoices by Date', category: 'Advanced Queries' },
    { id: 'hall-students', label: 'Students in Hall', icon: Home, endpoint: (p) => `/api/reports/hall-students/${p}`, requiresParam: true, paramLabel: 'Hall Name', paramType: 'text', title: 'Students by Residence Hall', category: 'Advanced Queries' },
    { id: 'flat-students', label: 'Students in Flat', icon: Users, endpoint: (p) => `/api/reports/flat-students/${p}`, requiresParam: true, paramLabel: 'Flat Number', paramType: 'text', title: 'Students by Student Flat', category: 'Advanced Queries' },
    { id: 'student-adviser', label: 'Student Adviser', icon: UserCircle, endpoint: (p) => `/api/reports/student-adviser/${p}`, requiresParam: true, paramLabel: 'Banner Number', paramType: 'text', title: 'Adviser Contact Details', category: 'Advanced Queries' },
    { id: 'free-rooms', label: 'Available Rooms', icon: Home, endpoint: (p) => `/api/reports/free-rooms/${p}`, requiresParam: true, paramLabel: 'Hall Name', paramType: 'text', title: 'Available Rooms in Hall', category: 'Advanced Queries' },
    { id: 'free-flats', label: 'Available Flats', icon: Building2, endpoint: '/api/reports/free-flats', title: 'Available Rooms in Student Flats', category: 'Advanced Queries' }
  ];

  const fetchReportData = async (reportId, paramValue) => {
    const report = reports.find(r => r.id === reportId);
    if (report.requiresParam && !paramValue) {
       setData([]); // Clear data until searched
       return;
    }
    setLoading(true);
    try {
      const url = report.requiresParam ? report.endpoint(paramValue) : report.endpoint;
      const res = await axios.get(url);
      setData(Array.isArray(res.data) ? res.data : [res.data]);
    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData(activeReport);
  }, [activeReport]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg({ type: '', text: '' });
    try {
      await axios.post('/api/students', formData);
      setStatusMsg({ type: 'success', text: 'Student added successfully!' });
      setTimeout(() => {
        setIsModalOpen(false);
        setFormData({ banner_number: '', first_name: '', last_name: '', email: '', dob: '', gender: 'M', category: 'Undergraduate', major: '', minor: '', phone: '', nationality: '', address: '', special_needs: '', status: 'waiting', course_number: '' });
        setStatusMsg({ type: '', text: '' });
        fetchReportData(activeReport);
      }, 2000);
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.response?.data?.error || 'Failed to add student' });
    }
  };

  const getIdKey = () => {
    switch (activeReport) {
      case 'hall-managers': return 'staff_number';
      case 'student-leases': return 'lease_number';
      case 'summer-leases': return 'lease_number';
      case 'waiting-list': return 'banner_number';
      case 'unsatisfactory-inspections': return 'inspection_id';
      case 'missing-next-of-kin': return 'banner_number';
      case 'senior-staff': return 'staff_number';
      default: return null;
    }
  };

  const handleEditClick = (row) => {
    setEditData(row);
    setEditStatus({ type: '', text: '' });
    setEditModalOpen(true);
  };

  const handleUpdate = async (updatedRow) => {
    setEditStatus({ type: '', text: '' });
    const idKey = getIdKey();
    if (!idKey) return;

    try {
      await axios.put(`/api/reports/${activeReport}/${updatedRow[idKey]}`, updatedRow);
      setEditStatus({ type: 'success', text: 'Record updated successfully!' });
      setTimeout(() => {
        setEditModalOpen(false);
        fetchReportData(activeReport);
      }, 1500);
    } catch (err) {
      setEditStatus({ type: 'error', text: err.response?.data?.error || 'Failed to update record' });
    }
  };

  const getColumns = () => {
    switch (activeReport) {
      case 'hall-managers':
        return [
          { header: 'Hall Name', key: 'hall_name' },
          { header: 'Manager', key: 'manager', render: (_, row) => `${row.first_name} ${row.last_name}` },
          { header: 'Telephone', key: 'telephone' }
        ];
      case 'student-leases':
        return [
          { header: 'Banner #', key: 'banner_number' },
          { header: 'Student', key: 'name', render: (_, row) => `${row.first_name} ${row.last_name}` },
          { header: 'Lease #', key: 'lease_number' },
          { header: 'Start Date', key: 'enter_date' },
          { header: 'End Date', key: 'leave_date' },
          { header: 'Semesters', key: 'duration_semesters' }
        ];
      case 'student-categories':
        return [
          { header: 'Category', key: 'category' },
          { header: 'Count', key: 'student_count' }
        ];
      case 'waiting-list':
        return [
          { header: 'Banner #', key: 'banner_number' },
          { header: 'Name', key: 'name', render: (_, row) => `${row.first_name} ${row.last_name}` },
          { header: 'Category', key: 'category' },
          { header: 'Major', key: 'major' },
          { header: 'Email', key: 'email' }
        ];
      case 'rent-stats':
        return [
          { header: 'Metric', key: 'metric' },
          { header: 'Value', key: 'value', render: (val) => `₹${parseFloat(val).toFixed(2)}` }
        ];
      case 'hall-places':
        return [
          { header: 'Hall Name', key: 'hall_name' },
          { header: 'Total Places', key: 'total_places' }
        ];
      case 'senior-staff':
        return [
          { header: 'Staff #', key: 'staff_number' },
          { header: 'Name', key: 'name', render: (_, row) => `${row.first_name} ${row.last_name}` },
          { header: 'Age', key: 'age' },
          { header: 'Location', key: 'location' }
        ];
      case 'missing-next-of-kin':
        return [
          { header: 'Banner #', key: 'banner_number' },
          { header: 'Name', key: 'name', render: (_, row) => `${row.first_name} ${row.last_name}` }
        ];
      case 'total-rent':
        return [
          { header: 'Student', key: 'name', render: (_, row) => `${row.first_name || ''} ${row.last_name || ''}` },
          { header: 'Total Rent Paid', key: 'total_rent_paid', render: (val) => val ? `₹${parseFloat(val).toFixed(2)}` : '₹0.00' }
        ];
      case 'unpaid-invoices':
        return [
          { header: 'Invoice #', key: 'invoice_number' },
          { header: 'Student', key: 'name', render: (_, row) => `${row.first_name} ${row.last_name}` },
          { header: 'Payment Due', key: 'payment_due', render: (val) => `₹${parseFloat(val).toFixed(2)}` },
          { header: 'Due Date', key: 'due_date' }
        ];
      case 'hall-students':
      case 'flat-students':
        return [
          { header: 'Banner #', key: 'banner_number' },
          { header: 'Student', key: 'name', render: (_, row) => `${row.first_name} ${row.last_name}` },
          { header: 'Room #', key: 'room_number' },
          { header: 'Place #', key: 'place_number' }
        ];
      case 'student-adviser':
        return [
          { header: 'Student', key: 'student_first', render: (_, row) => `${row.student_first || ''} ${row.student_last || ''}` },
          { header: 'Adviser', key: 'adviser_first', render: (_, row) => `${row.adviser_first || ''} ${row.adviser_last || ''}` },
          { header: 'Telephone', key: 'telephone' }
        ];
      case 'free-rooms':
        return [
          { header: 'Room #', key: 'room_number' },
          { header: 'Place #', key: 'place_number' },
          { header: 'Monthly Rent', key: 'monthly_rent', render: (val) => `₹${parseFloat(val).toFixed(2)}` }
        ];
      case 'free-flats':
        return [
          { header: 'Flat / Apt', key: 'flat_number' },
          { header: 'Room #', key: 'room_number' },
          { header: 'Place #', key: 'place_number' },
          { header: 'Monthly Rent', key: 'monthly_rent', render: (val) => `₹${parseFloat(val).toFixed(2)}` }
        ];
      default:
        if (data.length > 0) {
          return Object.keys(data[0]).map(key => ({ header: key.replace(/_/g, ' ').toUpperCase(), key }));
        }
        return [];
    }
  };

  const processedData = activeReport === 'rent-stats' && data.length > 0 && !Array.isArray(data[0]) 
    ? [
        { metric: 'Minimum Rent', value: data[0].min_rent },
        { metric: 'Maximum Rent', value: data[0].max_rent },
        { metric: 'Average Rent', value: data[0].avg_rent }
      ] 
    : data;

  return (
    <Layout 
      reports={reports} 
      activeReport={activeReport} 
      setActiveReport={setActiveReport}
    >
      <ReportView 
        activeReport={activeReport}
        reports={reports}
        data={processedData}
        loading={loading}
        getColumns={getColumns}
        onAddStudent={() => setIsModalOpen(true)}
        idKey={getIdKey()}
        onEditClick={handleEditClick}
        onSearch={(paramValue) => fetchReportData(activeReport, paramValue)}
      />

      <StudentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        statusMsg={statusMsg}
      />

      <EditRowModal 
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        currentData={editData}
        handleUpdate={handleUpdate}
        statusMsg={editStatus}
      />
    </Layout>
  );
};

export default App;
