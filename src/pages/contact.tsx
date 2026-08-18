import ContactForm from '../components/contact/ContactForm';
import ContactSidebar from '../components/contact/ContactSidebar';
import ContactHeader from '../components/contact/ContactHeader';

export default function Contact() {
  return (
    <div className="flex flex-col items-center animate-fade-in w-full pb-10">
      <ContactHeader />
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 px-2">
        <ContactForm />
        <ContactSidebar />
      </div>
    </div>
  );
}