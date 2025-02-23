export default function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center px-8 md:px-16">
      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            Empowering Your{" "}
            <span className="text-[#2ecc71]">Energy Transition</span>
          </h1>

          <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
            Connect with Trusted Solar Installers and Make a Sustainable Choice
            Today!
          </p>
          {/*           
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-3 bg-[#2ecc71] text-white rounded-lg font-medium hover:bg-[#27ae60] transition-colors">
              Get Started
            </button>
            <button className="px-8 py-3 border-2 border-[#2ecc71] text-[#2ecc71] rounded-lg font-medium hover:bg-[#2ecc71] hover:text-white transition-colors">
              Learn More
            </button>
          </div> */}

          {/* Enhanced Calculator Section */}
          <div className="relative pt-12 pb-6 px-8 bg-white shadow-xl rounded-xl border-2 border-[#2ecc71]/20 hover:border-[#2ecc71]/40 transition-all group">
            <div className="absolute -top-6 left-8">
              <div className="flex items-center gap-3 bg-[#2ecc71] px-6 py-3 rounded-full shadow-lg shadow-[#2ecc71]/20">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-white font-semibold">Calculator</span>
              </div>
            </div>

            <button className="w-full flex items-center justify-between px-4 py-3 text-lg font-semibold text-[#2ecc71] hover:bg-[#2ecc71]/5 rounded-lg transition-all">
              <span>Solar Need Calculator</span>
              <svg
                className="w-6 h-6 transform group-hover:translate-x-2 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>

            <p className="text-gray-600 mt-2 pl-4">
              Find the perfect solar solution for your needs
            </p>
          </div>
        </div>

        <div className="relative">
          <img
            src="./solar_energy_director.jpeg"
            alt="Solar Energy"
            className="rounded-2xl object-cover w-full h-[500px] shadow-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl" />
        </div>
      </div>
    </section>
  );
}
