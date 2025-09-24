import Header from '@/components/Header/Header'
import './HomePage.css'
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
    const navigate = useNavigate();
    return (
        <div id="home-page" 
            className='w-full min-h-screen flex flex-col items-center text-white lg:px-12 px-4'>
            <Header/>
            <main className='w-full flex-1 flex items-center justify-center'>
                 <button
                    onClick={() => navigate("/live-area")}
                    className="px-6 py-3 bg-blue-600 rounded-lg shadow-md hover:bg-blue-500 transition"
                    >
                    Ver Live Area Chart
        </button>
            </main>
        </div>
    )
}