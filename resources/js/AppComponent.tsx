import React, { useState, useEffect } from 'react';
import { Login } from './pages/Login';
import { Dashboard as AdminDashboard } from './pages/admin/Dashboard';
import { Dashboard as UserDashboard } from './pages/user/Dashboard';
import { Kriteria } from './pages/admin/Kriteria';
import { Kalkulasi } from './pages/user/Kalkulasi';
import { History } from './pages/user/History';

type Page = 'login' | 'dashboard' | 'kriteria' | 'kalkulasi' | 'history';

function AppComponent() {
    const [currentPage, setCurrentPage] = useState<Page>('login');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState<string>('');

    console.log('AppComponent rendered, page:', currentPage, 'role:', userRole);

    // Check if user is already logged in
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setIsLoggedIn(true);
            setUserRole(user.role);
            setCurrentPage('dashboard');
        }
    }, []);

    // Handle hash navigation
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.slice(1);
            if (hash === 'kriteria' && userRole === 'admin') {
                setCurrentPage('kriteria');
            } else if (hash === 'kalkulasi' && userRole === 'user') {
                setCurrentPage('kalkulasi');
            } else if (hash === 'history' && userRole === 'user') {
                setCurrentPage('history');
            } else if (hash === '' || hash === 'dashboard') {
                setCurrentPage('dashboard');
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        handleHashChange();

        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [userRole]);

    // Listen for logout event
    useEffect(() => {
        const handleLogoutEvent = () => {
            setIsLoggedIn(false);
            setUserRole('');
            setCurrentPage('login');
            window.location.hash = '';
        };

        window.addEventListener('logout', handleLogoutEvent);
        return () => window.removeEventListener('logout', handleLogoutEvent);
    }, []);

    const handleLogin = (username: string, password: string) => {
        console.log('Login attempt:', username);

        // Simulasi login - nanti akan diganti dengan API call
        if (username === 'admin' && password === 'admin123') {
            const user = { username: 'admin', role: 'admin' };
            localStorage.setItem('user', JSON.stringify(user));
            setIsLoggedIn(true);
            setUserRole('admin');
            setCurrentPage('dashboard');
        } else if (username === 'user' && password === 'user123') {
            const user = { username: 'user', role: 'user' };
            localStorage.setItem('user', JSON.stringify(user));
            setIsLoggedIn(true);
            setUserRole('user');
            setCurrentPage('dashboard');
        } else {
            alert('Invalid username or password');
        }
    };

    // Render based on current page
    if (isLoggedIn) {
        if (currentPage === 'kriteria' && userRole === 'admin') {
            return <Kriteria />;
        }

        if (currentPage === 'kalkulasi' && userRole === 'user') {
            return <Kalkulasi />;
        }

        if (currentPage === 'history' && userRole === 'user') {
            return <History />;
        }

        if (currentPage === 'dashboard') {
            if (userRole === 'admin') {
                return <AdminDashboard />;
            } else {
                return <UserDashboard />;
            }
        }
    }

    return <Login onLogin={handleLogin} />;
}

export default AppComponent;
