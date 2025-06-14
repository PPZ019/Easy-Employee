import { useState } from "react";
import { toast } from "react-toastify";
import HeaderSection from "../../components/HeaderSection";
import { addUser } from "../../http";
import Modal from '../../components/modal/Modal';
import { FaExclamationCircle } from "react-icons/fa";

const AddUser = () => {
  const [imagePreview, setImagePreview] = useState('/assets/icons/user.png');
  const initialState = {
    name: '', email: '', mobile: '', password: '',
    type: 'Employee', address: '', profile: '', adminPassword: ''
  };
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  const inputEvent = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    const { name, email, mobile, password, address, profile, type, adminPassword } = formData;

    if (!name) newErrors.name = "Name is required";
    if (!email) newErrors.email = "Email is required";
    if (!mobile) newErrors.mobile = "Mobile number is required";
    if (!password) newErrors.password = "Password is required";
    if (!address) newErrors.address = "Address is required";
    if (!profile) newErrors.profile = "Profile image is required";
    if (type === "Admin" && !adminPassword) newErrors.adminPassword = "Admin password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please correct the highlighted errors.");
      return;
    }

    if (formData.type === "Admin" && !showModal) {
      setShowModal(true);
      return;
    }

    const fd = new FormData();
    Object.keys(formData).forEach(key => fd.append(key, formData[key]));

    try {
      const { success, message } = await addUser(fd);
      if (success) {
        toast.success(message);
        setFormData(initialState);
        setImagePreview('/assets/icons/user.png');
        setErrors({});
        setShowModal(false);
      } else {
        toast.error(message || "Something went wrong");
      }
    } catch (err) {
      toast.error(err.message || "Server error occurred");
    }
  };

  const captureImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, profile: file }));
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const modalAction = () => setShowModal(false);

  return (
    <>
      {showModal && (
        <Modal close={modalAction} title="Add Admin" width="35%">
          <div className="p-5 bg-white text-black rounded space-y-4">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex justify-center">
                <img className='rounded w-28 h-28 object-cover' src={imagePreview} alt="Preview" />
              </div>
              <div className="flex-1 text-sm">
                <p><strong>Name:</strong> {formData.name}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>User Type:</strong> {formData.type}</p>
              </div>
            </div>

            <div>
              <label className="font-semibold text-sm mb-1 block">Enter Admin Password</label>
              <input
                type="password"
                name="adminPassword"
                value={formData.adminPassword}
                onChange={inputEvent}
                className={`pl-3 py-2 w-full rounded border text-black ${errors.adminPassword ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Admin password"
              />
              {errors.adminPassword && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <FaExclamationCircle /> {errors.adminPassword}
                </p>
              )}
            </div>

            <div className="text-center">
              <button type='submit' form='addUserForm' className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800">
                Add {formData.type}
              </button>
            </div>
          </div>
        </Modal>
      )}

      <div className="p-6 bg-white text-black">
        <HeaderSection title='Add User' />
        <form onSubmit={onSubmit} id='addUserForm' className="rounded shadow-md p-6 bg-white space-y-6">
          <div className="flex justify-center">
            <input type="file" id='profile' name='profile' className="hidden" onChange={captureImage} accept="image/*" />
            <label htmlFor='profile' className="cursor-pointer">
              <img className='rounded-full w-28 h-28 object-cover border-2 border-blue-900' src={imagePreview} alt="User" />
            </label>
          </div>
          {errors.profile && <p className="text-red-600 text-center text-sm"><FaExclamationCircle className="inline mr-1" /> {errors.profile}</p>}

          <div className="grid md:grid-cols-2 gap-4">
            {['name', 'email', 'mobile', 'password', 'address'].map((field) => (
              <div key={field} className={field === 'address' ? 'md:col-span-2' : ''}>
                <label className="font-semibold text-sm block mb-1 capitalize">Enter {field}</label>
                <input
                  name={field}
                  type={field === 'email' ? 'email' : field === 'password' ? 'password' : field === 'mobile' ? 'number' : 'text'}
                  value={formData[field]}
                  onChange={inputEvent}
                  className={`w-full px-3 py-2 rounded border text-black ${errors[field] ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors[field] && <p className="text-red-600 text-sm mt-1 flex items-center gap-1"><FaExclamationCircle /> {errors[field]}</p>}
              </div>
            ))}
          </div>

          <div className="md:w-1/3">
            <label className="font-semibold text-sm block mb-1">User Type</label>
            <select name='type' onChange={inputEvent} value={formData.type} className="w-full border border-gray-300 rounded px-3 py-2 text-black">
              <option>Employee</option>
              <option>Leader</option>
              <option>Admin</option>
            </select>
          </div>

          <div className="text-center">
            <button type="submit" className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded text-lg">
              Add {formData.type}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddUser;
