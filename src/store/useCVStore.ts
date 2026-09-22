import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CVFormData } from '../types/cv';

interface CVState {
  formData: CVFormData;
  currentStep: number;
  updateFormData: (data: Partial<CVFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  resetForm: () => void;
  savedCvId: string | null;
  setSavedCvId: (id: string | null) => void;
  loadCVForEdit: (id: string, formData: CVFormData) => void;
}

const initialFormData: CVFormData = {
  // Adım 1
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  city: '',
  district: '',
  photo: '',
  birthDate: '',
  
  // Yasal
  driverLicense: [],
  srcDocument: [],
  militaryStatus: '',
  
  // Adım 2
  sectorId: '',
  jobTitleName: '',
  summary: '',
  availability: '',

  // Adım 3 (Disiplin)
  disciplineShifts: false,
  discipline5S: false,
  disciplineISG: false,
  disciplineHeavy: false,

  // Adım 4
  selectedSkills: [],
  customSkills: [],

  // Adım 5 & 6
  experiences: [],
  educations: [],
  references: [],

  // Ekstra / Sektörel
  height: '',
  weight: '',
  securityCardType: '',

  commutePreference: '',
  smoking: '',
  shiftPreference: '', 
  travelRestriction: ''
};

export const useCVStore = create<CVState>()(
  persist(
    (set) => ({
      formData: initialFormData,
      currentStep: 1,

      updateFormData: (data) => set((state) => ({
        formData: { ...state.formData, ...data }
      })),

      nextStep: () => set((state) => ({
        currentStep: Math.min(state.currentStep + 1, 6) // Max 6 steps (including preview)
      })),

      prevStep: () => set((state) => ({
        currentStep: Math.max(state.currentStep - 1, 1)
      })),

      setStep: (step) => set({ currentStep: step }),

      resetForm: () => set({ 
        formData: JSON.parse(JSON.stringify(initialFormData)), 
        currentStep: 1, 
        savedCvId: null 
      }),
      
      savedCvId: null,
      setSavedCvId: (id) => set({ savedCvId: id }),

      loadCVForEdit: (id, formData) => set({
        savedCvId: id,
        formData: JSON.parse(JSON.stringify(formData)),
        currentStep: 1
      })
    }),
    {
      name: 'cv-storage',
      partialize: (state) => ({
        ...state,
        formData: {
          ...state.formData,
          photo: '', // Don't persist base64 to avoid hitting localStorage quota
        }
      })
    }
  )
);

