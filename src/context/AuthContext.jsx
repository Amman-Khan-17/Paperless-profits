import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    const fetchRole = async (userId) => {
        if (!userId) {
            setRole(null);
            return;
        }
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('role, status')
                .eq('id', userId)
                .single();

            if (!error && data) {
                // Check for Inactive Status
                if (data.status === 'Inactive') {
                    await supabase.auth.signOut();
                    setUser(null);
                    setRole(null);
                    toast.error("⚠️ ACCESS DENIED: Your account is inactive. Please contact the business owner.", 10000);
                    return;
                }
                setRole(data.role);
            }
        } catch (err) {
            console.error("Error fetching role:", err);
        }
    };

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data, error }) => {
            if (error) {
                console.error("Error checking session:", error);
            }
            const sessionUser = data?.session?.user ?? null;
            setUser(sessionUser);
            if (sessionUser) {
                fetchRole(sessionUser.id).then(() => setLoading(false));
            } else {
                setLoading(false);
            }
        }).catch(err => {
            console.error("Unexpected error checking session:", err);
            setLoading(false);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                const sessionUser = session?.user ?? null;
                setUser(sessionUser);
                if (sessionUser) {
                    fetchRole(sessionUser.id);
                } else {
                    setRole(null);
                }
                setLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };

    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isOwner: role?.toLowerCase() === 'owner',
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
