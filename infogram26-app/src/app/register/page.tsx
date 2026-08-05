'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { db, storage } from '@/lib/firebase/config';
import { collection, addDoc, getDocs, serverTimestamp, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import PublicLayout from '@/components/layout/PublicLayout';

const personalInfoSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  college: z.string().min(1, 'College is required'),
  department: z.string().min(1, 'Department is required'),
  year: z.enum(['1st', '2nd', '3rd', '4th']),
  registerNumber: z.string().min(1, 'Register Number is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'),
  gender: z.enum(['Male', 'Female', 'Other']),
});

type PersonalInfoForm = z.infer<typeof personalInfoSchema>;

const demoEvents = Array.from({ length: 12 }).map((_, i) => ({
  id: `demo-${i + 1}`,
  name: `Event ${i + 1}`,
  fee: 150 + i * 50,
  time: `10:00 AM - 12:00 PM`,
}));

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [idPreview, setIdPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid },
    trigger,
  } = useForm<PersonalInfoForm>({
    resolver: zodResolver(personalInfoSchema),
    mode: 'onChange',
  });

  const formData = watch();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsSnapshot = await getDocs(collection(db, 'events'));
        if (eventsSnapshot.empty) {
          setEvents(demoEvents);
        } else {
          setEvents(eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
      } catch (err) {
        console.error('Failed to fetch events', err);
        setEvents(demoEvents);
      }
    };
    fetchEvents();
  }, []);

  const handleNext = async () => {
    if (step === 1) {
      const isStepValid = await trigger();
      if (isStepValid) setStep(2);
    } else if (step === 2) {
      if (idFile) setStep(3);
    } else if (step === 3) {
      if (selectedEvents.length > 0) setStep(4);
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    if (file.type.startsWith('image/') || file.type === 'application/pdf') {
      setIdFile(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setIdPreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setIdPreview(null);
      }
    }
  };

  const toggleEvent = (eventId: string) => {
    setSelectedEvents(prev =>
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const getTotalFee = () => {
    return selectedEvents.reduce((total, id) => {
      const event = events.find(e => e.id === id);
      return total + (event?.fee || 0);
    }, 0);
  };

  const generateApplicantId = () => {
    return `APP${Math.floor(100000 + Math.random() * 900000)}`;
  };

  const onSubmit = async () => {
    if (!idFile || selectedEvents.length === 0) return;
    setIsSubmitting(true);
    try {
      setUploadProgress(25);
      const storageRef = ref(storage, `college-ids/${Date.now()}-${idFile.name}`);
      await uploadBytes(storageRef, idFile);
      setUploadProgress(75);
      const idUrl = await getDownloadURL(storageRef);

      const applicantId = generateApplicantId();
      
      const registrationData = {
        applicantId,
        personalInfo: formData,
        idCardUrl: idUrl,
        events: selectedEvents,
        totalFee: getTotalFee(),
        status: 'pending_payment',
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'registrations'), registrationData);
      setUploadProgress(100);
      router.push(`/payment?regId=${docRef.id}`);
    } catch (error) {
      console.error('Registration failed:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <div className="container-xl py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 gradient-text">Register for INFOGRAM'26</h1>
          
          <div className="flex justify-between items-center mb-12 relative">
            <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -z-10 rounded step-connector">
              <motion.div 
                className="h-full bg-blue-500 rounded"
                initial={{ width: '0%' }}
                animate={{ width: `${((step - 1) / 3) * 100}%` }}
              />
            </div>
            {[1, 2, 3, 4].map(i => (
              <div 
                key={i}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-colors duration-300 ${
                  step >= i ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                {i}
              </div>
            ))}
          </div>

          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-card p-8 rounded-2xl shadow-xl"
          >
            {step === 1 && (
              <form className="space-y-6">
                <h2 className="text-2xl font-semibold mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label block mb-2">Full Name</label>
                    <input {...register('fullName')} className="form-input w-full p-3 rounded-lg border border-gray-300" />
                    {errors.fullName && <p className="form-error text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
                  </div>
                  <div>
                    <label className="form-label block mb-2">Email</label>
                    <input {...register('email')} type="email" className="form-input w-full p-3 rounded-lg border border-gray-300" />
                    {errors.email && <p className="form-error text-red-500 text-sm mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="form-label block mb-2">Phone</label>
                    <input {...register('phone')} className="form-input w-full p-3 rounded-lg border border-gray-300" />
                    {errors.phone && <p className="form-error text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label className="form-label block mb-2">College</label>
                    <input {...register('college')} className="form-input w-full p-3 rounded-lg border border-gray-300" />
                    {errors.college && <p className="form-error text-red-500 text-sm mt-1">{errors.college.message}</p>}
                  </div>
                  <div>
                    <label className="form-label block mb-2">Department</label>
                    <input {...register('department')} className="form-input w-full p-3 rounded-lg border border-gray-300" />
                    {errors.department && <p className="form-error text-red-500 text-sm mt-1">{errors.department.message}</p>}
                  </div>
                  <div>
                    <label className="form-label block mb-2">Register Number</label>
                    <input {...register('registerNumber')} className="form-input w-full p-3 rounded-lg border border-gray-300" />
                    {errors.registerNumber && <p className="form-error text-red-500 text-sm mt-1">{errors.registerNumber.message}</p>}
                  </div>
                  <div>
                    <label className="form-label block mb-2">Year</label>
                    <select {...register('year')} className="form-input w-full p-3 rounded-lg border border-gray-300">
                      <option value="">Select Year</option>
                      <option value="1st">1st Year</option>
                      <option value="2nd">2nd Year</option>
                      <option value="3rd">3rd Year</option>
                      <option value="4th">4th Year</option>
                    </select>
                    {errors.year && <p className="form-error text-red-500 text-sm mt-1">{errors.year.message}</p>}
                  </div>
                  <div>
                    <label className="form-label block mb-2">Gender</label>
                    <div className="flex gap-4 p-3">
                      {['Male', 'Female', 'Other'].map(g => (
                        <label key={g} className="flex items-center gap-2">
                          <input type="radio" value={g} {...register('gender')} /> {g}
                        </label>
                      ))}
                    </div>
                    {errors.gender && <p className="form-error text-red-500 text-sm mt-1">{errors.gender.message}</p>}
                  </div>
                </div>
              </form>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">College ID Upload</h2>
                <div 
                  className="border-2 border-dashed border-gray-400 rounded-xl p-12 text-center hover:bg-gray-50 transition-colors"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                >
                  <input
                    type="file"
                    id="id-upload"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={(e) => e.target.files?.[0] && handleFileSelection(e.target.files[0])}
                  />
                  <label htmlFor="id-upload" className="cursor-pointer flex flex-col items-center">
                    <div className="text-4xl mb-4">📄</div>
                    <p className="text-lg mb-2">Drag and drop your College ID here</p>
                    <p className="text-gray-500 mb-4">or click to browse (Images or PDF)</p>
                    <div className="btn-primary px-6 py-2 rounded-lg bg-blue-600 text-white font-medium">Select File</div>
                  </label>
                </div>
                {idPreview && (
                  <div className="mt-6">
                    <p className="font-medium mb-2">Preview:</p>
                    <img src={idPreview} alt="ID Preview" className="max-h-64 mx-auto rounded-lg shadow-md" />
                  </div>
                )}
                {idFile && !idPreview && (
                  <div className="mt-6 p-4 bg-gray-100 rounded-lg flex items-center gap-3">
                    <span className="text-2xl">📄</span>
                    <span className="font-medium">{idFile.name}</span>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Select Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto p-2">
                  {events.map(event => (
                    <div 
                      key={event.id}
                      onClick={() => toggleEvent(event.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedEvents.includes(event.id) 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg">{event.name}</h3>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedEvents.includes(event.id) ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                        }`}>
                          {selectedEvents.includes(event.id) && <span className="text-white text-sm">✓</span>}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-1">Time: {event.time}</p>
                      <p className="font-semibold text-blue-600">₹{event.fee}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                  <span className="font-semibold text-lg">Total Fee:</span>
                  <span className="font-bold text-2xl text-blue-600">₹{getTotalFee()}</span>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Review & Submit</h2>
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="font-bold text-lg mb-4 border-b pb-2">Personal Details</h3>
                    <div className="grid grid-cols-2 gap-y-3">
                      <div><span className="text-gray-500">Name:</span> <span className="font-medium">{formData.fullName}</span></div>
                      <div><span className="text-gray-500">Email:</span> <span className="font-medium">{formData.email}</span></div>
                      <div><span className="text-gray-500">College:</span> <span className="font-medium">{formData.college}</span></div>
                      <div><span className="text-gray-500">Reg No:</span> <span className="font-medium">{formData.registerNumber}</span></div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="font-bold text-lg mb-4 border-b pb-2">Selected Events</h3>
                    <ul className="space-y-2">
                      {selectedEvents.map(id => {
                        const event = events.find(e => e.id === id);
                        return (
                          <li key={id} className="flex justify-between">
                            <span>{event?.name}</span>
                            <span className="font-medium">₹{event?.fee}</span>
                          </li>
                        );
                      })}
                      <li className="flex justify-between pt-4 border-t mt-4 font-bold text-lg">
                        <span>Total Amount Due</span>
                        <span className="text-blue-600">₹{getTotalFee()}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              {step > 1 ? (
                <button onClick={handlePrev} className="btn-glass px-6 py-2 rounded-lg border border-gray-300 font-medium hover:bg-gray-50" disabled={isSubmitting}>
                  Previous
                </button>
              ) : <div></div>}
              
              {step < 4 ? (
                <button 
                  onClick={handleNext} 
                  className="btn-primary px-8 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
                  disabled={(step === 2 && !idFile) || (step === 3 && selectedEvents.length === 0)}
                >
                  Next
                </button>
              ) : (
                <button 
                  onClick={onSubmit} 
                  className="btn-primary px-8 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-70 flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing... {uploadProgress > 0 && `${uploadProgress}%`}
                    </>
                  ) : (
                    'Proceed to Payment'
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </PublicLayout>
  );
}
