import { useContext } from "react";
import { Link } from "react-router-dom";
import ShowContext from "../context/ShowContext";

const Footer = () => {
    const { user } = useContext(ShowContext);
    const userHome = () => {
        if (user?.role === "user") return "/ngolist";
        if (user?.role === "ngo") return "/ngohome";
        if (user?.role === "admin") return "/admin/dashboard";
        return "/";
    };

    return (
        <footer className="bg-[#0b1a2b] text-white">
            <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8">

                {/* Brand */}
                <div>
                    <h1 className="text-2xl font-bold text-yellow-400">herAlly</h1>
                    <p className="mt-4 text-gray-400 text-sm">
                        Empowering Women,
                        Protecting Identities,<br /> Building Trust
                    </p>
                </div>

                {/* Navigation Links */}
                <div>
                    <h2 className="font-semibold mb-4">Quick Links</h2>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li><a href={userHome()} className="hover:text-white">Home</a></li>
                        <li><a href="/about" className="hover:text-white">About Us</a></li>
                        <li><a href="/services" className="hover:text-white">Services</a></li>
                        <li><a href="/contact" className="hover:text-white">Contact</a></li>

                        {user && (
                            <li><a href="/profile" className="hover:text-white">Profile</a></li>
                        )}

                        {user && user?.role !== "admin" && (
                            <li>
                                <a
                                    href={user?.role === "user" ? "/reports" : "/ngo/reports"}
                                    className="hover:text-white"
                                >
                                    Reports
                                </a>
                            </li>
                        )}
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h2 className="font-semibold mb-4">Contact</h2>
                    <p className="text-gray-400 text-sm">dev.shivam.ssy@gmail.com</p>

                    <div className="flex space-x-4 mt-4">

                        <a
                            href="https://github.com/Shivam-ssy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-yellow-400"
                        >
                            GitHub
                        </a>

                        <a
                            href="https://linkedin.com/in/dev-shivam-ssy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-yellow-400"
                        >
                            LinkedIn
                        </a>



                    </div>
                </div>

            </div>

            {/* Bottom */}
            <div className="border-t border-gray-700 text-center py-4 text-gray-500 text-sm">
                © {new Date().getFullYear()} herAlly. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;