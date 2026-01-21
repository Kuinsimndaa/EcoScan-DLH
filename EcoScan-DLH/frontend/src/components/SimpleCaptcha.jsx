import React, { useState, useEffect } from 'react';
import { RotateCcw, ShieldCheck } from 'lucide-react';

const SimpleCaptcha = ({ onVerify }) => {
    const [captchaCode, setCaptchaCode] = useState('');
    const [userInput, setUserInput] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const generateCaptcha = () => {
        // Generate 6 karakter kombinasi angka dan huruf (huruf besar saja untuk mudah dibaca)
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        setCaptchaCode(code);
        setUserInput('');
        setIsVerified(false);
        setErrorMessage('');
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    const handleVerify = () => {
        if (userInput.toUpperCase() === captchaCode) {
            setIsVerified(true);
            setErrorMessage('');
            onVerify(true);
        } else {
            setErrorMessage('Kode CAPTCHA salah, silahkan coba lagi');
            setUserInput('');
            setIsVerified(false);
            onVerify(false);
        }
    };

    const handleRefresh = () => {
        generateCaptcha();
        onVerify(false);
    };

    return (
        <div className="w-full space-y-4">
            {/* CAPTCHA Display Box */}
            <div className="flex items-center gap-4">
                <div className="flex-1 bg-slate-100 border-2 border-slate-300 rounded-2xl px-6 py-5 font-mono font-black text-2xl text-slate-700 tracking-[0.2em] text-center select-none" 
                    style={{
                        letterSpacing: '8px',
                        fontFamily: 'monospace',
                        fontSize: '24px'
                    }}>
                    {captchaCode}
                </div>
                <button 
                    type="button"
                    onClick={handleRefresh}
                    className="p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all"
                    title="Refresh CAPTCHA"
                >
                    <RotateCcw size={20} />
                </button>
            </div>

            {/* Input Field */}
            <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-5 mb-2 block tracking-widest">Masukkan Kode CAPTCHA</label>
                <div className="flex gap-2 items-center">
                    <input 
                        type="text" 
                        className="flex-1 p-5 bg-slate-50 rounded-2xl outline-none font-bold text-slate-700 border-2 border-transparent focus:border-green-500 focus:bg-white transition-all shadow-sm uppercase"
                        value={userInput}
                        onChange={(e) => {
                            setUserInput(e.target.value.toUpperCase());
                            setErrorMessage('');
                        }}
                        placeholder="Masukkan 6 karakter"
                        maxLength="6"
                        required
                    />
                    <button 
                        type="button"
                        onClick={handleVerify}
                        className="px-6 py-5 bg-green-600 text-white rounded-2xl font-black uppercase text-xs hover:bg-green-700 transition-all"
                    >
                        <ShieldCheck size={20} />
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
                <div className="px-5 py-3 bg-red-50 border-2 border-red-200 rounded-xl">
                    <p className="text-xs font-bold text-red-700">{errorMessage}</p>
                </div>
            )}

            {/* Success Message */}
            {isVerified && (
                <div className="px-5 py-3 bg-green-50 border-2 border-green-200 rounded-xl">
                    <p className="text-xs font-bold text-green-700">✓ CAPTCHA Terverifikasi</p>
                </div>
            )}
        </div>
    );
};

export default SimpleCaptcha;
