"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Correct import for App Router
import { auth } from '../firebase'; // Ensure this path is correct
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const Login = () => {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');

    const googleProvider = new GoogleAuthProvider();

    const toggleForms = () => {
        setIsLogin(!isLogin);
        setError(''); // Clear error message when toggling forms
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous error messages

        try {
            if (isLogin) {
                // Login
                await signInWithEmailAndPassword(auth, email, password);
                alert('Login successful!');
                router.push('/chatbot'); // Redirect to the chatbot page
            } else {
                // Signup
                await createUserWithEmailAndPassword(auth, email, password);
                alert('Signup successful! You can now log in.');
                toggleForms(); // Switch to login form
            }
        } catch (error) {
            setError(error.message); // Display error message
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            // The signed-in user info.
            const user = result.user;
            alert('Google login successful!');
            router.push('/chatbot'); // Redirect to the chatbot page
        } catch (error) {
            setError(error.message); // Display error message
        }
    };

    return (
        <div className="container">
            <video autoPlay loop muted className="background-video">
            <source src="/blue.mp4" type="video/mp4" />
            Your browser does not support the video tag.
            </video>
            <div className="form-container">
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit} style={{ display: isLogin ? 'block' : 'none' }}>
                    <h2>Login</h2>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Login</button>
                    <p>
                        Don't have an account? <a href="#" onClick={toggleForms}>Sign Up</a>
                    </p>
                </form>

                <form onSubmit={handleSubmit} style={{ display: isLogin ? 'none' : 'block' }}>
                    <h2>Sign Up</h2>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Sign Up</button>
                    <p>
                        Already have an account? <a href="#" onClick={toggleForms}>Login</a>
                    </p>
                </form>

                <button onClick={handleGoogleSignIn} className="google-signin-button">
                    Sign in with Google
                </button>
            </div>

            <style jsx>{`
                .container {
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    overflow: hidden;
                }
                .background-video {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    min-width: 100%;
                    min-height: 100%;
                    width: auto;
                    height: auto;
                    z-index: -1;
                    transform: translate(-50%, -50%);
                    object-fit: cover;
                }
                .form-container {
                    background: rgbargb(21,14,9, 1); /* Semi-transparent background */
                    border-radius: 10px;
                   // box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                    padding: 30px;
                    width: 350px;
                    z-index: 1; /* Ensure form is above the video */
                }
                h2 {
                    text-align: center;
                    color: white;
                }
                input {
                    margin: 10px 0;
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    width: 100%;
                }
                button {
                    background: #2575fc;
                    color: white;
                    border: none;
                    padding: 10px;
                    border-radius: 5px;
                    cursor: pointer;
                    width: 100%;
                }
                button:hover {
                    background: #6a11cb;
                }
                .google-signin-button {
                    background: #db4437; /* Google red */
                    color: white;
                    border: none;
                    padding: 10px;
                    border-radius: 5px;
                    cursor: pointer;
                    width: 100%;
                    margin-top: 10px;
                }
                .google-signin-button:hover {
                    background: #c1351d; /* Darker red on hover */
                }
                p {
                    text-align: center;
                }
                a {
                    color: #2575fc;
                    text-decoration: none;
                }
                .error-message {
                    color: red;
                    text-align: center;
                    margin-bottom: 10px;
                }
            `}</style>
        </div>
    );
};

export default Login;
