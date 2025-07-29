import { Linkedin, Github, User } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import '../css/TeamSection.css';
import amit from '../assets/amit.jpg'; // ✅ adjust path as needed
import kuldeep from '../assets/kuldeep.jpeg'; // ✅ adjust path as needed
import biraj from '../assets/biraj.jpeg'; // ✅ adjust path as needed
import gaurav from '../assets/gaurav.jpeg'; // ✅ adjust path as needed


const TeamSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  const developers = [
    {
      name: 'Amit Ranjan Das',
      role: '4th Year ECE Student',
      specialty: 'Full Stack Developer',
      image: amit, // ✅ Use imported image
      gradient: 'bg-gradient-to-br from-cyan-500 to-blue-500'
    },
    {
      name: 'Kuldeep Das',
      role: '4th Year ECE Student',
      specialty: 'Blockchain Developer',
      image: kuldeep,
      gradient: 'bg-gradient-to-br from-purple-500 to-pink-500'
    },
    {
      name: 'Gaurav Patgiri',
      role: '4th Year ECE Student',
      specialty: 'Frontend Developer',
      image: gaurav,
      gradient: 'bg-gradient-to-br from-emerald-500 to-teal-500'
    },
    {
      name: 'Biraj Das',
      role: '4th Year ECE Student',
      specialty: 'Backend Developer',
      image: biraj,
      gradient: 'bg-gradient-to-br from-orange-500 to-red-500'
    }
  ];


  return (
    <section id="team" className="team-section">
      <div className="team-container">
        <div 
          ref={ref} 
          className={`team-header ${isVisible ? 'animate-in' : 'animate-out'}`}
        >
          <h2 className="team-title">
            Meet the Developers
          </h2>
          <p className="team-subtitle">
            Passionate ECE students dedicated to revolutionizing academic file management through innovation
          </p>
        </div>

        <div className="team-grid">
          {developers.map((developer, index) => (
            <div
              key={index}
              className={`team-card ${isVisible ? 'animate-in' : 'animate-out'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="card-image-container">
                <img
                  src={developer.image}
                  alt={developer.name}
                  className="card-image"
                />
                <div className={`card-gradient-overlay ${developer.gradient}`}></div>
                
                <div className="card-social">
                  <div className="flex justify-center space-x-4">
                    <button className="social-button">
                      <Linkedin className="h-5 w-5 text-blue-600" />
                    </button>
                    <button className="social-button">
                      <Github className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="card-content">
                <h3 className="card-name">
                  {developer.name}
                </h3>
                <p className="card-role">
                  {developer.role}
                </p>
                <p className="card-specialty">
                  {developer.specialty}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className={`team-footer ${isVisible ? 'animate-in' : 'animate-out'}`}>
          <div className="dept-badge">
            <User className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
            <span className="dept-text">Electronics and Communication Engineering</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;