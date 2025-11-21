
import Expert1 from "../assets/Expert1.png";
import lock from "../assets/lock.png";

const Expert = () => {
  return (
    <section className="py-20 bg-white -mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-middle items-center flex-col mb-12">
           <span className="relative inline-flex items-center gap-2 bg-[#DFB13B1A] text-[#B8860B] px-6 py-2 rounded-full text-sm shadow-lg">
                <img src={lock} alt="Lock" className="w-3 h-3" />
                Teams
              </span>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <img
            src={Expert1}
            alt="Nadia Deleux"
            className="rounded-lg  w-full"
          />
          <div>
            <h2 className="text-4xl font-serif text-gray-900 mb-6">
              Meet our expert of wellness professionals
            </h2>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Nadia Deleux
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Therapist (currently named as Liveness: Hair, IT open or organized
              in the pharmaceutical industry). All our team aims are includes
              therapies, naturals, perfectly who care about wellness and to
              wellness industry world within wellness industry.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Expert;
