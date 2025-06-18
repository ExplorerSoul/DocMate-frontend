import React from 'react';
import { Shield, Mail, Phone, MapPin, FileText, Lock, Github, Linkedin, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-gray-900 dark:bg-black text-white relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Shield className="h-8 w-8 text-cyan-400 animate-pulse" />
                <div className="absolute inset-0 h-8 w-8 text-cyan-300 animate-ping opacity-20">
                  <Shield className="h-8 w-8" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                EduChain
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Revolutionizing academic file management through decentralized technology, 
              ensuring security, transparency, and accessibility for educational institutions.
            </p>
            <div className="flex space-x-4">
              <button className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-110">
                <Linkedin className="h-5 w-5 text-white" />
              </button>
              <button className="w-10 h-10 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg flex items-center justify-center hover:from-gray-800 hover:to-gray-900 transition-all duration-300 transform hover:scale-110">
                <Github className="h-5 w-5 text-white" />
              </button>
              <button className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 transform hover:scale-110">
                <Twitter className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 group">
                <Mail className="h-5 w-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                <span className="text-gray-300 group-hover:text-white transition-colors">support@educhain.edu</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <Phone className="h-5 w-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                <span className="text-gray-300 group-hover:text-white transition-colors">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <MapPin className="h-5 w-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                <span className="text-gray-300 group-hover:text-white transition-colors">Engineering College Campus</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <div className="space-y-2">
              {['Features', 'How It Works', 'Our Team', 'Login Portal', 'Documentation', 'Support'].map((link) => (
                <button
                  key={link}
                  className="block text-gray-300 hover:text-cyan-400 transition-colors duration-300 text-left"
                >
                  {link}
                </button>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Legal & Policies</h3>
            <div className="space-y-2">
              {[
                { icon: FileText, text: 'Privacy Policy' },
                { icon: FileText, text: 'Terms of Service' },
                { icon: Lock, text: 'Security Policy' },
                { icon: FileText, text: 'Cookie Policy' }
              ].map((item) => (
                <button
                  key={item.text}
                  className="flex items-center space-x-2 text-gray-300 hover:text-cyan-400 transition-colors duration-300 group"
                >
                  <item.icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>{item.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 EduChain. All rights reserved. Built with ❤️ by ECE Students.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span>All Systems Operational</span>
              </span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span>Secure Connection</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;