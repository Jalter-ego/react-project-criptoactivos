import Header from '@/components/Header/Header'
import './HomePage.css'
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/useContext';
import { useState } from 'react';
import Login from '../login';

export default function HomePage() {
    const navigate = useNavigate();
    const { user } = useUser();
    const [showLogin, setShowLogin] = useState(false);


    const handleNavigation = () => {
        if (user) {
            navigate("/user/portafolio-config")
        }
        else {
            setShowLogin(true)
        }
    }
    return (
        <div id="home-page"
            className='w-full min-h-screen flex flex-col items-center text-white lg:px-12 px-4'>
            <Header />
            <main className='w-full flex-1 flex items-center justify-center'>
                <section className='flex flex-col items-center justify-center'>
                    <h1></h1>
                    <h2 className='text-3xl pb-8'>
                        Las mejores operaciones requieren primero investigación, y después determinación.
                    </h2>
                    <button
                        onClick={handleNavigation}
                        className="bg-white text-black px-6 py-3 rounded-xl shadow-md transition
                        h-18 w-74 text-xl font-medium cursor-pointer hover:bg-white/80 duration-300"
                    >
                        Empieze de forma gratuita
                    </button>
                    <p className='pt-4 text-md'>
                        Sin tener que pagar nada nunca, sin tarjeta de crédito
                    </p>
                </section>
            </main>
            {showLogin && !user && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                    <div className="relative w-full h-full flex items-center justify-center">
                        <button
                            onClick={() => setShowLogin(false)}
                            className="absolute top-4 right-4 text-foreground text-2xl font-bold"
                        >
                            ✕
                        </button>
                        <Login />
                    </div>
                </div>
            )}
        </div>
    )
}