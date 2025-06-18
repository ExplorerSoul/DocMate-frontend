import React from 'react';
import { Linkedin, Github, User } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const TeamSection: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation();

  const developers = [
    {
      name: 'Amit',
      role: '3rd Year ECE Student',
      specialty: 'Full Stack Developer',
      image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      name: 'Kuldeep',
      role: '3rd Year ECE Student',
      specialty: 'Blockchain Developer',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Gaurav',
      role: '3rd Year ECE Student',
      specialty: 'Frontend Developer',
      image: 'https://images.pexels.com/photos/2269872/pexels-photo-2269872.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      name: 'Biraj',
      role: '3rd Year ECE Student',
      specialty: 'Backend Developer',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <section id="team" className="py-20 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Meet the Developers
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Passionate ECE students dedicated to revolutionizing academic file management through innovation
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {developers.map((developer, index) => (
            <div
              key={index}
              className={`group bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden border border-gray-200 dark:border-gray-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={developer.image}
                  alt={developer.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${developer.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                
                <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                  <div className="flex justify-center space-x-4">
                    <button className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors transform hover:scale-110">
                      <Linkedin className="h-5 w-5 text-blue-600" />
                    </button>
                    <button className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors transform hover:scale-110">
                      <Github className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {developer.name}
                </h3>
                <p className="text-cyan-600 dark:text-cyan-400 font-medium mb-1">
                  {developer.role}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {developer.specialty}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className={`mt-16 text-center transition-all duration-1000 delay-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-flex items-center space-x-2 bg-cyan-50 dark:bg-cyan-900/30 px-6 py-3 rounded-full border border-cyan-200 dark:border-cyan-800">
            <User className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
            <span className="text-cyan-800 dark:text-cyan-300 font-medium">Electronics and Communication Engineering</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;